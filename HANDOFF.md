# Handoff

Everything needed to run, change, or repair September Miles. For what the app *is*
and why it behaves the way it does, read [OVERVIEW.md](OVERVIEW.md) first.

## Where it lives

| | |
|---|---|
| Primary URL | https://septembermiles.com (and `www.`) |
| Fallback URL | https://hundred-mile-september.eavnrie.workers.dev |
| Cloudflare Worker | `hundred-mile-september` |
| D1 database | `hundred-mile-september` |
| Domain registrar | Cloudflare (the zone is in the same account as the Worker) |
| Repo branch | `claude/100-mile-challenge-tracker-uq7g61` |

Both custom domains are attached to the Worker under **Workers & Pages →
hundred-mile-september → Settings → Domains & Routes**, with certificates issued
and renewed by Cloudflare.

**Not in this repo:** the Cloudflare account id, the D1 `database_id`, and the group
password. The account and database ids are in the working copy's `worker/wrangler.toml`
(untracked edit) and can be re-listed any time with `npx wrangler d1 list`. The
password is a Worker secret named `PASSPHRASE` — it is write-only, so if it is
forgotten it gets rotated, not recovered.

## Layout

```
worker/
  wrangler.toml     config + the challenge itself (see "Change the rules")
  schema.sql        two tables; safe to re-run, everything is IF NOT EXISTS
  src/index.js      router, JSON API, validation, auth, CSV export
  src/page.js       the ENTIRE client — markup, CSS and JS as one exported string
  src/assets.js     GENERATED: icon SVGs, base64 PNGs, web manifest
  brand/            source art the assets module is built from
tracker.html        RETIRED. The original Claude Artifact version, kept for reference
```

`src/page.js` is one big template literal. It contains no backticks and no `${`, and
it must stay that way or the module stops parsing. Nothing else imports from it.

`src/assets.js` is generated from `brand/`. Editing it by hand is fine for a one-off,
but the art is the SVGs — regenerate rather than hand-patch base64.

## Deploy

```sh
cd worker
npm install
npx wrangler deploy
```

That is the whole loop for any code change. First-time setup on a new machine also
needs `npx wrangler login` and the real `database_id` pasted into `wrangler.toml`.

Local development:

```sh
npm run db:local                                  # create tables in the local D1
echo 'PASSPHRASE = "anything"' > .dev.vars        # optional; .dev.vars is gitignored
npm run dev                                       # http://127.0.0.1:8787
```

## Operations

**Change the rules** — edit `[vars]` in `worker/wrangler.toml`, then deploy. These
drive every label, the date picker bounds, the pace math, and server-side validation:

```toml
GOAL  = "100"          # per person
START = "2026-09-01"
END   = "2026-09-30"    # inclusive; day count is derived, not configured
UNIT  = "mi"           # "km" switches the whole app to kilometres
```

**Rotate the password** — `npx wrangler secret put PASSPHRASE`. Everyone is asked
once more the next time they log miles. Removing the secret entirely makes writes
open to anyone with the link.

**Back up** — `curl https://septembermiles.com/api/export.csv > miles.csv`. Worth
doing once a week during the challenge; it is the whole log in four columns.

**Restore** — D1 keeps point-in-time restore. Check `npx wrangler d1 time-travel --help`
for the current syntax before relying on it.

**Wipe the board** —
`npx wrangler d1 execute DB --remote --command "DELETE FROM entries; DELETE FROM people;"`

**Watch live logs** — `npx wrangler tail`. The only thing worth watching for is a
500, which always means a D1 problem; every user-facing failure is a 4xx with a
readable message.

## API

| method | route | body | notes |
|---|---|---|---|
| GET | `/` | | the board |
| GET | `/api/state` | | `{config, people, entries}` — everything the page renders from |
| POST | `/api/entries` | `{who, date, miles, note, key}` | 401 on bad `key`, 400 on bad input |
| POST | `/api/entries/delete` | `{id, key}` | |
| GET | `/api/export.csv` | | full log, no auth |
| GET | `/healthz` | | `ok` |

Plus `/favicon.svg`, `/icon.svg`, `/apple-touch-icon.png`, `/icon-192.png`,
`/icon-512.png`, `/icon-maskable.png`, `/site.webmanifest`.

## Data model

```sql
people  (name TEXT PRIMARY KEY COLLATE NOCASE, color TEXT, created INTEGER)
entries (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, date TEXT, miles REAL,
         note TEXT, ts INTEGER)
```

Rules enforced server-side in `addEntry`:

- Names are matched case-insensitively and stored as first typed, so `evan` logs
  against the existing `Evan`.
- `0 < miles <= 80`, date must fall inside `START`..`END`, name ≤ 24 chars,
  note ≤ 60 chars.
- A name new to the board joins `people` and takes the next color in `COLORS`.
- Deleting someone's last entry prunes them from `people`. If they come back they
  may be assigned a different color.

Client state that is not on the server: `localStorage` holds `hms.me` (which name is
yours, for the "you" tag and the form default) and `hms.key` (the password). Both are
per-device conveniences; losing them costs one dropdown selection and one password
entry.

## Gotchas that cost time

These all bit during the first deploy. Every one of them announces itself clearly if
you read the output.

1. **Windows Command Prompt does not support `#` comments.** Pasting a command with a
   trailing comment produces `Unknown arguments: #, opens, a, browser`. PowerShell is
   fine. Copy the command, not the note beside it.
2. **Save `wrangler.toml` before running anything.** An unsaved edit produced
   `Executing on remote database DB (PASTE_YOUR_DATABASE_ID_HERE)` and
   `Invalid property: databaseId => Invalid uuid`. The error names the placeholder.
3. **`d1 execute` asks "Ok to proceed?" and defaults to no.** The answer has to be
   typed while the prompt is on screen. `yes` typed at the shell prompt afterward
   just runs a program called `yes`.
4. **A brand-new hostname has no certificate for a few minutes.**
   `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` on a just-created `workers.dev` subdomain or
   custom domain means wait, not break. Retry in a new tab — Chrome caches SSL
   failures hard.
5. **`wrangler secret put` before the first deploy** offers to create the Worker.
   Answer Y; the following `deploy` fills it with real code and keeps the secret.
6. **`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`** on Windows is Node
   noise on exit. It printed immediately before a successful login. Ignore it.

## Verification done

No CI. Everything below was checked by hand against a real `wrangler dev` with a
local D1 and a seeded mid-challenge board, driving the page with Playwright:

- Validation: wrong password, missing password, out-of-window date, zero miles,
  900 miles, blank name — all rejected with the right status and message.
- `"  evan  "` merged into the existing `Evan` rather than creating a second person.
- A name of `<img src=x onerror=alert(1)>` renders as inert text; no element created,
  no alert fired.
- A run logged in one browser appeared in a second browser's board.
- Two-click remove, CSV export, 404 handling, `/healthz`.
- Every brand route: correct content-type and byte count matching the source file.
- Light and dark themes at 1180px, 390px and 320px, with no horizontal scroll.

Worth re-running by hand after any change to `page.js` or `index.js`.

## Known limits

- **Honor-system identity.** Anyone can log as anyone. See OVERVIEW for why.
- **One shared password, no rate limiting.** Guesses are unlimited. Adequate for a
  private link shared with friends; not adequate if the URL goes public.
- **No editing an entry** — delete it and add it again.
- **Dates are the viewer's local date.** Someone logging near midnight in another
  timezone may pick a different "today" than the board's other users. Harmless here.
- **No backups run automatically.** The CSV export is manual.

## If you want to take it further

Roughly in order of value for effort: per-person PINs if the group ever outgrows the
honor system; editable entries; a sort toggle (finished-first, or alphabetical, to
soften the leaderboard read); streaks; an `og:image` so the link previews properly
when it gets texted around.
