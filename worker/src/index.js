import { PAGE } from './page.js';
import { ICON_SVG, FAVICON_SVG, MANIFEST, PNGS } from './assets.js';

// One blaze colour per person, assigned on join. No orange in here: orange is
// reserved for the on-pace marker on every bar.
const COLORS = ['#2F8F72','#D2478F','#4478B8','#9A5490','#7E9B32','#C0503E','#1F94A0','#C09A20'];
const MAX_MILES = 80;
const MAX_NAME = 24;
const MAX_NOTE = 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/' || path === '/index.html') {
        return new Response(PAGE, {
          headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' },
        });
      }
      if (path === '/api/state' && request.method === 'GET') {
        return json(await readState(env));
      }
      if (path === '/api/entries' && request.method === 'POST') {
        return await addEntry(request, env);
      }
      if (path === '/api/entries/delete' && request.method === 'POST') {
        return await deleteEntry(request, env);
      }
      if (path === '/api/export.csv' && request.method === 'GET') {
        return await exportCsv(env);
      }
      if (path === '/icon.svg' || path === '/favicon.svg') {
        return asset(path === '/icon.svg' ? ICON_SVG : FAVICON_SVG, 'image/svg+xml');
      }
      if (path === '/site.webmanifest') {
        return asset(MANIFEST, 'application/manifest+json');
      }
      if (PNGS[path.slice(1)]) {
        return asset(png(path.slice(1)), 'image/png');
      }
      if (path === '/favicon.ico') {
        // no .ico in the set; modern browsers take the SVG
        return asset(FAVICON_SVG, 'image/svg+xml');
      }
      if (path === '/healthz') {
        return new Response('ok', { headers: { 'content-type': 'text/plain' } });
      }
      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: 'Something broke on our end. Try again in a moment.' }, 500);
    }
  },
};

/* ---------- config ---------- */

function config(env) {
  const start = env.START || '2026-09-01';
  const end = env.END || '2026-09-30';
  const unit = env.UNIT || 'mi';
  return {
    goal: Number(env.GOAL || 100),
    start,
    end,
    days: daysBetween(start, end),
    unit,
    unitLong: unit === 'km' ? 'kilometres' : 'miles',
    maxMiles: MAX_MILES,
    locked: Boolean(env.PASSPHRASE),
  };
}

function daysBetween(start, end) {
  const a = Date.parse(start + 'T00:00:00Z');
  const b = Date.parse(end + 'T00:00:00Z');
  if (isNaN(a) || isNaN(b) || b < a) return 30;
  return Math.round((b - a) / 86400000) + 1;
}

/* ---------- reads ---------- */

async function readState(env) {
  const [people, entries] = await Promise.all([
    env.DB.prepare('SELECT name, color FROM people ORDER BY created ASC').all(),
    env.DB.prepare('SELECT id, who, date, miles, note, ts FROM entries ORDER BY date DESC, ts DESC').all(),
  ]);
  return {
    config: config(env),
    people: people.results || [],
    entries: entries.results || [],
  };
}

/* ---------- writes ---------- */

async function addEntry(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: 'Malformed request.' }, 400);

  const denied = authorize(body, env);
  if (denied) return denied;

  const cfg = config(env);

  const who = String(body.who || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  if (!who) return json({ error: 'Add a name first.' }, 400);

  const miles = Number(body.miles);
  if (!isFinite(miles) || miles <= 0) return json({ error: 'Enter a number of miles above zero.' }, 400);
  if (miles > MAX_MILES) return json({ error: `That is over ${MAX_MILES} ${cfg.unit} — split it into separate entries.` }, 400);

  const date = String(body.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < cfg.start || date > cfg.end) {
    return json({ error: `Pick a date between ${cfg.start} and ${cfg.end}.` }, 400);
  }

  const note = String(body.note || '').trim().slice(0, MAX_NOTE);
  const now = Date.now();

  // First time we see a name, it joins and picks up the next blaze color.
  const existing = await env.DB.prepare('SELECT name FROM people WHERE name = ?1').bind(who).first();
  const name = existing ? existing.name : who;
  if (!existing) {
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM people').first();
    await env.DB.prepare('INSERT OR IGNORE INTO people (name, color, created) VALUES (?1, ?2, ?3)')
      .bind(name, COLORS[(count?.n || 0) % COLORS.length], now)
      .run();
  }

  const id = now.toString(36) + Math.random().toString(36).slice(2, 8);
  await env.DB.prepare('INSERT INTO entries (id, who, date, miles, note, ts) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
    .bind(id, name, date, Math.round(miles * 100) / 100, note, now)
    .run();

  return json({ ok: true, id });
}

async function deleteEntry(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: 'Malformed request.' }, 400);

  const denied = authorize(body, env);
  if (denied) return denied;

  const id = String(body.id || '');
  if (!id) return json({ error: 'Which entry?' }, 400);

  await env.DB.prepare('DELETE FROM entries WHERE id = ?1').bind(id).run();
  // Drop anyone left with no entries so the board does not carry ghosts.
  await env.DB.prepare('DELETE FROM people WHERE name NOT IN (SELECT who FROM entries)').run();

  return json({ ok: true });
}

/* ---------- helpers ---------- */

function authorize(body, env) {
  const need = env.PASSPHRASE;
  if (!need) return null;
  const got = String(body.key || '');
  if (!constantTimeEqual(got, need)) {
    return json({ error: 'Wrong group password.' }, 401);
  }
  return null;
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : null;
  } catch (e) {
    return null;
  }
}

/** Brand art and the manifest: same bytes for everyone, cached hard. */
function asset(body, type) {
  return new Response(body, {
    headers: {
      'content-type': type,
      'cache-control': 'public, max-age=604800',
    },
  });
}

// base64 -> bytes, decoded once per isolate rather than per request
const pngCache = new Map();
function png(name) {
  let bytes = pngCache.get(name);
  if (!bytes) {
    const bin = atob(PNGS[name]);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    pngCache.set(name, bytes);
  }
  return bytes;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function exportCsv(env) {
  const rows = await env.DB.prepare('SELECT date, who, miles, note FROM entries ORDER BY date ASC, ts ASC').all();
  const csv = ['date,who,miles,note']
    .concat((rows.results || []).map((r) => [r.date, csvCell(r.who), r.miles, csvCell(r.note)].join(',')))
    .join('\n');
  return new Response(csv + '\n', {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="miles.csv"',
    },
  });
}

function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
