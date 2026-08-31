# Hundred Mile September

A shared mile tracker for a 100-miles-in-September challenge. One page, one link,
no accounts, no server to keep alive.

**Live board:** https://claude.ai/code/artifact/8746d207-3c7c-455b-95a0-5ecd8c84c789

## How it works

`tracker.html` is published as a Claude Artifact — a hosted page with a permanent
URL that works in any phone or desktop browser. The page is also the database: the
log lives inside the HTML as a JSON block, and when someone adds miles the page
saves a **new version of itself** with the entry appended. Every other tab that has
the board open reloads to that version, so everyone sees the same numbers.

That means there's nothing to keep running, nothing to log into, and nothing that
can go down between now and September 30.

## Sharing it with friends

The board starts private to its owner. Open the page's share menu and share it with
**edit access** — edit access is what lets someone log miles. Anyone given view-only
access sees a live, read-only board and the page tells them so.

## What's on the board

- **Leaderboard** — each person's total against 100, with quarter ticks on the bar
  and an orange *blaze line* marking where you'd be if you were exactly on pace.
- **Pace chips** — `+12.4 ahead` / `-8.1 behind` against today's on-pace mark, plus
  the miles per day each person needs to finish.
- **Stat strip** — group miles, miles logged today, today's on-pace mark, headcount.
- **Activity feed** — every run, newest first, with a two-click remove for typos.

Adding a name to the "Who" dropdown is how you join; each person picks up a blaze
color that follows them through the bar and the feed.

## Hosting it on your own domain

`worker/` is the same board built to run anywhere, with no Claude accounts involved:
a Cloudflare Worker serving the page plus a small JSON API, with the log in a D1
(SQLite) database. Anyone with the link can log miles — optionally behind one shared
group password. Free at this scale, and a custom domain gets TLS automatically.

### Deploy

```sh
cd worker
npm install
npx wrangler login

npx wrangler d1 create hundred-mile-september   # paste the database_id it prints
                                                # into wrangler.toml
npm run db:remote                               # create the tables
npx wrangler secret put PASSPHRASE              # optional; skip to leave it open
npx wrangler deploy
```

That prints a `*.workers.dev` URL that already works. To put your own domain on it:
register the domain (Cloudflare Registrar sells at cost; anywhere else works too, you
just point the nameservers at Cloudflare), then **Workers & Pages -> your worker ->
Settings -> Domains & Routes -> Add custom domain**. Certificate and renewal are
handled for you.

To run it locally first:

```sh
npm run db:local
echo 'PASSPHRASE = "yourpassword"' > .dev.vars   # optional
npm run dev
```

### API

| Route | Body | Does |
|---|---|---|
| `GET /` | | the board |
| `GET /api/state` | | `{config, people, entries}` |
| `POST /api/entries` | `{who, date, miles, note, key}` | log a run |
| `POST /api/entries/delete` | `{id, key}` | remove one |
| `GET /api/export.csv` | | the whole log as CSV |
| `GET /healthz` | | `ok` |

Names are matched case-insensitively, so `evan` and `Evan` are one runner. Miles,
dates and name length are validated server-side, and every value is escaped on the
way into the page. Removing someone's last entry drops them from the board.

Open tabs poll every 30 seconds, and only while the tab is visible — a group of ten
with tabs left open all day lands well inside Cloudflare's free request allowance.

## Changing the rules

For the hosted version, edit `[vars]` in `worker/wrangler.toml` and redeploy —
distance, dates, and `UNIT = "km"` if you would rather run it in kilometres:

```toml
GOAL  = "100"
START = "2026-09-01"
END   = "2026-09-30"
UNIT  = "mi"
```

For the artifact version, the same constants live at the top of the `app-code`
script in `tracker.html`.

## Which one to run

Use the artifact if the group is a couple of people who all have Claude accounts —
it is already live and took no setup. Use `worker/` if you want a real address and
friends who just tap a link, which is most groups. The two do not share data, so
pick one before anybody starts logging.

Note that the live artifact diverges from `tracker.html` as soon as people log
miles — this repo holds the source it was seeded from, not its current data.
