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
  schema.sql        four tables; safe to re-run, everything is IF NOT EXISTS
  src/index.js      router, JSON API, validation, auth, chat, images, CSV export
  src/page.js       the ENTIRE client — markup, CSS and JS as one exported string
  src/assets.js     GENERATED: icon SVGs, base64 PNGs, web manifest
  brand/            source art the assets module is built from
tracker.html        RETIRED. The original Claude Artifact version, kept for reference
```

`src/page.js` is one big template literal, and two rules keep it working:

1. **No backticks and no `${`**, or the module stops parsing.
2. **A backslash meant for the browser has to be written twice.** The template
   literal eats single ones, so `/\\s+/g` in this file is `/\s+/g` in the served
   page. Writing it once silently ships `/s+/g` — a regex that matches the letter s.
   Check with `node -e "import('./src/page.js').then(m=>console.log(m.PAGE))"`.

Nothing else imports from it.

The client is three views behind one hash router (`#/log`, `#/group`, `#/social`),
all present in the DOM and toggled with `hidden`. Adding a fourth means: a `.tab`
anchor in `nav#nav`, a `section.view` with a matching `view-<name>` id, and the name
in the `VIEWS` array.

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
GOAL   = "100"          # per person
START  = "2026-09-01"
END    = "2026-09-30"   # inclusive; day count is derived, not configured
UNIT   = "mi"           # "km" switches the whole app to kilometres
SOCIAL = "off"          # "on" adds the Social tab — read the section below first
```

**Turning the chat on** — set `SOCIAL = "on"` and deploy. With it off the Social tab
is not rendered, `#/social` lands on Log, and `/api/chat`, `/api/chat/delete` and
`/img/<id>` all 404 — the feature is unreachable, not merely hidden. The tables and
the code stay in place either way, so it is a one-line change in both directions.

It ships off on purpose. Identity here is a name picked from a dropdown, which is a
fine trade for miles — an entry is a fact, a wrong one is obvious in the feed, and
anyone can delete it. It is a worse trade for a conversation, where the same
mechanism lets anyone put words in someone else's mouth and there is no way to tell.
Worth doing before flipping it on, cheapest first:

1. **Lock the composer to the device's own name.** `hms.me` is already in
   `localStorage`; drop the dropdown from the composer and post as that name, with a
   small "not you?" escape. Removes the casual affordance without adding a login.
2. **Per-person PINs.** The real fix, and the one the honour system has been putting
   off since the start. See "If you want to take it further".

**Rotate the password** — `npx wrangler secret put PASSPHRASE`. Everyone is asked
once more the next time they log miles. Removing the secret entirely makes writes
open to anyone with the link.

**Back up** — `curl https://septembermiles.com/api/export.csv > miles.csv`. Worth
doing once a week during the challenge; it is the whole log in four columns.

**Restore** — D1 keeps point-in-time restore. Check `npx wrangler d1 time-travel --help`
for the current syntax before relying on it.

**Wipe the board** —
`npx wrangler d1 execute DB --remote --command "DELETE FROM entries; DELETE FROM messages; DELETE FROM images; DELETE FROM people;"`

**Add the chat tables to a database created before they existed** — `npm run db:remote`.
The whole schema is `IF NOT EXISTS`, so it adds `messages` and `images` and leaves
`people` and `entries` alone.

**This is required even with `SOCIAL = "off"`.** `deleteEntry` reads `messages` to
decide whether someone still belongs on the board, so removing an entry against a
database without that table is a 500. Run it before the deploy, not after.

**Watch live logs** — `npx wrangler tail`. The only thing worth watching for is a
500, which always means a D1 problem; every user-facing failure is a 4xx with a
readable message.

## API

| method | route | body | notes |
|---|---|---|---|
| GET | `/` | | the board |
| GET | `/api/state` | | `{config, people, entries}` — everything the board renders from |
| POST | `/api/entries` | `{who, date, miles, note, key}` | 401 on bad `key`, 400 on bad input |
| POST | `/api/entries/delete` | `{id, key}` | |
| GET | `/api/chat` | | `{messages}` — the last 200, oldest first |
| POST | `/api/chat` | `{who, body, image, w, h, key}` | `image` is a data URL, or omitted |
| POST | `/api/chat/delete` | `{id, key}` | also drops the message's photo |
| GET | `/img/<id>` | | one chat photo, cached immutable for a year |

The four chat routes 404 unless `SOCIAL = "on"`.
| GET | `/api/export.csv` | | full log, no auth |
| GET | `/healthz` | | `ok` |

Chat writes take the same group password as miles. Chat reads, like board reads, are
open to anyone with the link.

Plus `/favicon.svg`, `/icon.svg`, `/apple-touch-icon.png`, `/icon-192.png`,
`/icon-512.png`, `/icon-maskable.png`, `/site.webmanifest`.

## Data model

```sql
people   (name TEXT PRIMARY KEY COLLATE NOCASE, color TEXT, created INTEGER)
entries  (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, date TEXT, miles REAL,
          note TEXT, ts INTEGER)
messages (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, body TEXT, img TEXT,
          w INTEGER, h INTEGER, ts INTEGER)
images   (id TEXT PRIMARY KEY, mime TEXT, bytes BLOB, ts INTEGER)
```

Rules enforced server-side in `addEntry`:

- Names are matched case-insensitively and stored as first typed, so `evan` logs
  against the existing `Evan`.
- `0 < miles <= 80`, date must fall inside `START`..`END`, name ≤ 24 chars,
  note ≤ 60 chars.
- A name new to the board joins `people` and takes the next color in `COLORS`
  (`joinPerson`, shared with chat — posting a message is enough to join).
- Deleting someone's last entry prunes them from `people` **only if they have no
  messages either**. If they come back they may be assigned a different color.

And in `addMessage`:

- Body ≤ 500 chars. A message needs a body, a photo, or both.
- `image` is a `data:` URL; only `image/jpeg`, `png`, `webp` and `gif` are accepted,
  and only up to 1 MB decoded. The browser downscales to a 1280 px longest edge and
  steps JPEG quality down until it is under ~420 KB, so that ceiling is a backstop
  for anything posting straight to the API.
- `messages.img` is the `images.id`. Deleting a message deletes its photo; nothing
  else references it.

Client state that is not on the server: `localStorage` holds `hms.me` (which name is
yours, for the "you" tag, the form default, and which chat bubbles are yours),
`hms.key` (the password), and `hms.seen` (the newest message timestamp you have
looked at, which drives the dot on the Social tab). All three are per-device
conveniences; losing them costs one dropdown selection and one password entry.

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

Re-verified the same way after the three-page rebuild, plus:

- All three tabs at 1180px, 390px and 320px, light and dark: no horizontal scroll,
  exactly one tab marked selected, no console errors.
- Logging through the form, then the entry appearing in **your history** with the
  right streak, average and best day.
- The group activity filter narrowing the feed to one person and back.
- A photo sent through the composer, stored, served from `/img/<id>` **byte-identical**
  to the file uploaded, and reopened full-size in the lightbox.
- The chat pinned to the newest message after a photo finishes loading — the bug that
  the `load` listener in `paintChat` exists to fix.
- A message and a name of `<img src=x onerror=alert(1)>` / `<script>alert(2)</script>`
  render as inert text on both the chat and the board: no element created, no alert.
- Wrong password, empty message, non-image data URL, and two-click remove on both a
  message and an entry (one click never deletes).

Worth re-running by hand after any change to `page.js` or `index.js`.

## Known limits

- **Honor-system identity.** Anyone can log as anyone. See OVERVIEW for why.
- **One shared password, no rate limiting.** Guesses are unlimited. Adequate for a
  private link shared with friends; not adequate if the URL goes public.
- **No editing an entry** — delete it and add it again.
- **Dates are the viewer's local date.** Someone logging near midnight in another
  timezone may pick a different "today" than the board's other users. Harmless here.
- **No backups run automatically.** The CSV export is manual, and it covers miles
  only — chat messages and photos are not in it.
- **Photos live in D1, not R2.** That keeps the whole app on one binding and inside
  the free tier, but D1 is not built to be a photo store. At a few hundred photos it
  is fine. If the group ever fills it up, move `images` to an R2 bucket: only
  `addMessage` and `serveImage` touch the bytes.
- **Chat has no editing and no read receipts,** and the unseen dot is per-device.
- **The chat ships off** (`SOCIAL = "off"`), because a name in a dropdown is a much
  weaker thing to hang a conversation on than a mileage entry. See "Turning the chat
  on" above.

## If you want to take it further

Roughly in order of value for effort: per-person PINs if the group ever outgrows the
honor system; editable entries; a sort toggle (finished-first, or alphabetical, to
soften the leaderboard read); an `og:image` so the link previews properly when it gets
texted around; reactions on chat messages; photos on activity entries too, reusing the
`images` table the chat already has.
