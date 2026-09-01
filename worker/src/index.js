import { PAGE } from './page.js';
import { ICON_SVG, FAVICON_SVG, MANIFEST, PNGS } from './assets.js';

// One blaze colour per person, assigned on join. No orange in here: orange is
// reserved for the on-pace marker on every bar.
const COLORS = ['#2F8F72','#D2478F','#4478B8','#9A5490','#7E9B32','#C0503E','#1F94A0','#C09A20'];
const MAX_MILES = 80;
const MAX_NAME = 24;
const MAX_NOTE = 60;
const MAX_MSG = 500;
// Photos arrive already downscaled by the browser (longest edge 1280, JPEG).
// This is the backstop for anything that skips the page and posts directly.
const MAX_IMAGE_BYTES = 1_000_000;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const CHAT_PAGE = 200;
// A browser-generated id, base36, used only to group entries by device.
const DEVICE_RE = /^[a-z0-9]{1,16}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      const res = await handle(request, env, url);
      // On everything: no MIME sniffing (chat photos are bytes a person chose),
      // no framing, and no Referer -- the link is the only thing gating writes,
      // so it must not ride along to anywhere else.
      res.headers.set('x-content-type-options', 'nosniff');
      res.headers.set('x-frame-options', 'DENY');
      res.headers.set('referrer-policy', 'no-referrer');
      return res;
    } catch (err) {
      return json({ error: 'Something broke on our end. Try again in a moment.' }, 500);
    }
  },
};

async function handle(request, env, url) {
  const path = url.pathname;

  if (path === '/' || path === '/index.html') {
    return new Response(pageFor(url.origin), {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-cache',
        // The page is one inline style block and one inline script, so both
        // need 'unsafe-inline'; hashing them would mean a build step, and
        // there is deliberately no build step. What this still buys: no
        // script from anywhere else, no eval, no plugins, no framing.
        'content-security-policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src https://fonts.gstatic.com",
          // blob: too -- the composer reads a picked photo through URL.createObjectURL
          // before the canvas downscales it, and data: is the downscaled result.
          "img-src 'self' data: blob:",
          "connect-src 'self'",
          "manifest-src 'self'",
          "form-action 'self'",
          "base-uri 'none'",
          "object-src 'none'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    });
  }
  if (path === '/robots.txt') {
    // Anyone with the link can read the board, and it carries real names,
    // notes and photos. The link is the door; search results are not.
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
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
  // With SOCIAL off the chat is not just hidden, it is not reachable.
  if (path === '/api/chat' || path === '/api/chat/delete' || path.startsWith('/img/')) {
    if (!config(env).social) return json({ error: 'Not found' }, 404);
  }
  if (path === '/api/chat' && request.method === 'GET') {
    return json(await readChat(env));
  }
  if (path === '/api/chat' && request.method === 'POST') {
    return await addMessage(request, env);
  }
  if (path === '/api/chat/delete' && request.method === 'POST') {
    return await deleteMessage(request, env);
  }
  if (path.startsWith('/img/') && request.method === 'GET') {
    return await serveImage(path.slice(5), env);
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
}

/* The page ships __ORIGIN__ placeholders in its canonical and og: tags so a
   self-hosted copy previews itself rather than septembermiles.com. Built once
   per hostname -- there are only ever a couple. */
const pageCache = new Map();
function pageFor(origin) {
  let html = pageCache.get(origin);
  if (!html) {
    if (pageCache.size > 8) pageCache.clear();
    html = PAGE.split('__ORIGIN__').join(origin);
    pageCache.set(origin, html);
  }
  return html;
}

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
    social: String(env.SOCIAL || 'off').toLowerCase() === 'on',
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
  const ORDER = ' FROM entries ORDER BY date DESC, ts DESC';
  const [people, entries] = await Promise.all([
    env.DB.prepare('SELECT name, color FROM people ORDER BY created ASC').all(),
    unmigrated(
      () => env.DB.prepare('SELECT id, who, date, miles, note, ts, logged_by, device' + ORDER).all(),
      () => env.DB.prepare('SELECT id, who, date, miles, note, ts' + ORDER).all()
    ),
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
  // Nothing in the future. Every number on the board weighs a total against the
  // days that have actually passed, so a whole month logged on day one reads as
  // a runaway lead. One day of slack: "today" is the viewer's local date, and
  // far enough east it genuinely is tomorrow already.
  if (date > new Date(Date.now() + 86400000).toISOString().slice(0, 10)) {
    return json({ error: 'That day has not happened yet.' }, 400);
  }

  const note = String(body.note || '').trim().slice(0, MAX_NOTE);
  const now = Date.now();

  const name = await joinPerson(who, env, now);

  // Who was at the keyboard, as opposed to who the miles are for. Both come
  // from the browser and are as trustworthy as the rest of the honor system --
  // the point is that logging for somebody else stops being invisible. The
  // device id is the sturdier half: it survives someone editing the name, so
  // four entries typed on one phone still read as four entries from one phone.
  const by = String(body.by || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  const rawDev = String(body.dev || '');
  const dev = DEVICE_RE.test(rawDev) ? rawDev : null;

  const id = now.toString(36) + Math.random().toString(36).slice(2, 8);
  const miles2 = Math.round(miles * 100) / 100;
  await unmigrated(
    () =>
      env.DB
        .prepare('INSERT INTO entries (id, who, date, miles, note, ts, logged_by, device) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)')
        .bind(id, name, date, miles2, note, now, by || null, dev)
        .run(),
    // Un-migrated: log the miles anyway. Losing the attribution on a handful of
    // entries is a far smaller problem than nobody being able to log at all.
    () =>
      env.DB
        .prepare('INSERT INTO entries (id, who, date, miles, note, ts) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
        .bind(id, name, date, miles2, note, now)
        .run()
  );

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
  // Drop anyone left with nothing at all so the board does not carry ghosts.
  // Someone who has only ever chatted stays — they are still in the group.
  await env.DB.prepare(
    'DELETE FROM people WHERE name NOT IN (SELECT who FROM entries) AND name NOT IN (SELECT who FROM messages)'
  ).run();

  return json({ ok: true });
}

/* ---------- chat ---------- */

async function readChat(env) {
  const rows = await env.DB
    .prepare('SELECT id, who, body, img, w, h, ts FROM messages ORDER BY ts DESC LIMIT ?1')
    .bind(CHAT_PAGE)
    .all();
  // Oldest first: the page reads top to bottom like every other chat.
  return { messages: (rows.results || []).reverse() };
}

async function addMessage(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: 'Malformed request.' }, 400);

  const denied = authorize(body, env);
  if (denied) return denied;

  const who = String(body.who || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  if (!who) return json({ error: 'Pick who you are first.' }, 400);

  const text = String(body.body || '').trim().slice(0, MAX_MSG);
  const photo = body.image ? decodeDataUrl(String(body.image)) : null;
  if (body.image && !photo) {
    return json({ error: 'That photo did not come through. Try a JPEG or PNG.' }, 400);
  }
  if (photo && photo.bytes.length > MAX_IMAGE_BYTES) {
    return json({ error: 'That photo is too big. Under 1 MB, please.' }, 400);
  }
  if (!text && !photo) return json({ error: 'Write something, or add a photo.' }, 400);

  const now = Date.now();
  const name = await joinPerson(who, env, now);

  let imgId = null;
  if (photo) {
    imgId = 'i' + now.toString(36) + Math.random().toString(36).slice(2, 8);
    await env.DB.prepare('INSERT INTO images (id, mime, bytes, ts) VALUES (?1, ?2, ?3, ?4)')
      .bind(imgId, photo.mime, photo.bytes.buffer, now)
      .run();
  }

  const id = 'm' + now.toString(36) + Math.random().toString(36).slice(2, 8);
  await env.DB
    .prepare('INSERT INTO messages (id, who, body, img, w, h, ts) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
    .bind(id, name, text, imgId, dim(body.w), dim(body.h), now)
    .run();

  return json({ ok: true, id, img: imgId });
}

async function deleteMessage(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: 'Malformed request.' }, 400);

  const denied = authorize(body, env);
  if (denied) return denied;

  const id = String(body.id || '');
  if (!id) return json({ error: 'Which message?' }, 400);

  const row = await env.DB.prepare('SELECT img FROM messages WHERE id = ?1').bind(id).first();
  await env.DB.prepare('DELETE FROM messages WHERE id = ?1').bind(id).run();
  if (row && row.img) {
    await env.DB.prepare('DELETE FROM images WHERE id = ?1').bind(row.img).run();
  }
  return json({ ok: true });
}

async function serveImage(id, env) {
  if (!/^[a-z0-9]{1,40}$/.test(id)) return json({ error: 'Not found' }, 404);
  const row = await env.DB.prepare('SELECT mime, bytes FROM images WHERE id = ?1').bind(id).first();
  if (!row) return json({ error: 'Not found' }, 404);
  return new Response(toBytes(row.bytes), {
    headers: {
      'content-type': row.mime,
      // Ids are unique per upload, so a photo never changes under its URL.
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}

/** D1 hands BLOB columns back as a plain number array; older shapes still work. */
function toBytes(v) {
  if (v instanceof ArrayBuffer) return new Uint8Array(v);
  if (ArrayBuffer.isView(v)) return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  if (Array.isArray(v)) return new Uint8Array(v);
  return new Uint8Array(0);
}

function dim(v) {
  const n = Math.round(Number(v));
  return isFinite(n) && n > 0 && n < 20000 ? n : null;
}

/** "data:image/jpeg;base64,..." -> {mime, bytes}, or null if it is not an image. */
function decodeDataUrl(s) {
  const m = /^data:([a-z0-9.+/-]+);base64,([A-Za-z0-9+/=\s]+)$/i.exec(s);
  if (!m) return null;
  const mime = m[1].toLowerCase();
  if (!IMAGE_TYPES.includes(mime)) return null;
  try {
    const bin = atob(m[2].replace(/\s+/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.length ? { mime, bytes } : null;
  } catch (e) {
    return null;
  }
}

/** A name new to the board joins people and takes the next blaze colour. */
async function joinPerson(who, env, now) {
  const existing = await env.DB.prepare('SELECT name FROM people WHERE name = ?1').bind(who).first();
  if (existing) return existing.name;
  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM people').first();
  await env.DB.prepare('INSERT OR IGNORE INTO people (name, color, created) VALUES (?1, ?2, ?3)')
    .bind(who, COLORS[(count?.n || 0) % COLORS.length], now)
    .run();
  return who;
}

/* ---------- helpers ---------- */

/* Attribution added two columns to `entries`. Rather than make the deploy a
   two-step where getting the order wrong takes the board down, every query
   that wants them falls back to the shape without them. So a deploy that lands
   before `npm run db:migrate` still serves the board and still accepts miles;
   it just cannot record who typed them until the migration runs. Only a
   missing column is caught -- any other D1 failure is still a real 500. */
async function unmigrated(withColumns, without) {
  try {
    return await withColumns();
  } catch (err) {
    const msg = String((err && err.message) || err);
    if (!/no such column|has no column named/i.test(msg)) throw err;
    return await without();
  }
}

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
  const ORDER = ' FROM entries ORDER BY date ASC, ts ASC';
  const rows = await unmigrated(
    () => env.DB.prepare('SELECT date, who, miles, note, ts, logged_by' + ORDER).all(),
    () => env.DB.prepare('SELECT date, who, miles, note, ts' + ORDER).all()
  );
  const csv = ['date,who,miles,note,logged_by,logged_at']
    .concat(
      (rows.results || []).map((r) =>
        [
          r.date,
          csvCell(r.who),
          r.miles,
          csvCell(r.note),
          csvCell(r.logged_by || ''),   // blank = logged before attribution existed, genuinely unknown
          new Date(r.ts).toISOString(),
        ].join(',')
      )
    )
    .join('\n');
  return new Response(csv + '\n', {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="miles.csv"',
    },
  });
}

function csvCell(v) {
  let s = String(v == null ? '' : v);
  // Names and notes are free text, and this file exists to be opened in a
  // spreadsheet -- where a leading =, +, - or @ is a formula, not a note.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
