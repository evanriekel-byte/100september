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
  migrate.sql       one-off ALTERs for a board older than a schema change
  src/index.js      router, JSON API, validation, auth, chat, images, CSV export
  src/page.js       the ENTIRE client — markup, CSS and JS as one exported string
  src/assets.js     GENERATED: icon SVGs, base64 PNGs, web manifest
  brand/            source art the assets module is built from
  brand/make-og.py  builds brand/og.png, the 1200x630 link-preview card
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

The one piece with a script of its own is the link-preview card:

```sh
pip install pillow
python3 brand/make-og.py          # -> brand/og.png
```

It wants Archivo 800 semi-expanded, Public Sans 400 and IBM Plex Mono 400 in
`brand/fonts/`; the header comment names the Google Fonts URLs. Without them it
falls back to DejaVu and the card is legible but off-brand. The fonts are not in
the repo. Fold the new bytes into the `PNGS` map in `src/assets.js` as base64
under the key `og.png` — the router serves anything in that map by name, so no
route change is needed.

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

**The composer no longer offers that menu.** It posts as whatever name this device
has in `hms.me`, shown as a locked row — *Posting as ⬛ Evan* — with the person's own
board colour beside it. The picker only appears in two cases: a device that has never
said who it is, and someone who taps **not you?** (a shared phone, or a name typed
wrong the first time). Switching that way is deliberate and takes three taps, instead
of being one dropdown away from every message. That removes the casual affordance
without adding a login, and it is why the chat is now a config flip rather than a
rewrite away from usable.

What it still does *not* do is stop anyone determined: `hms.me` is a `localStorage`
string, and the API takes whatever `who` it is handed. The real fix is unchanged —
**per-person PINs** — and it is the same fix the miles form has been putting off since
the start. Decide whether a group of friends needs it before flipping `SOCIAL` on.

**Link previews** — `og:` and `canonical` tags in `page.js` carry an `__ORIGIN__`
placeholder that `pageFor()` in `index.js` fills in from the request, cached per
hostname. Nothing is hardcoded to `septembermiles.com`, so the `workers.dev`
fallback and any self-hosted copy preview themselves. Changing the domain needs
no code change. The card itself is `/og.png`; re-run `make-og.py` if the brand
or the wording changes.

**Search engines** — the page carries `noindex, nofollow` and `/robots.txt` is
`Disallow: /`. Reading the board is open to anyone with the link, and the board
carries real names, notes and any photo posted to the chat. The link is the
door; a search result is a second one nobody chose to open. Delete both if you
ever want the board found.

**Security headers** — every response gets `nosniff`, `X-Frame-Options: DENY`
and `Referrer-Policy: no-referrer` (the URL is the only thing gating writes, so
it must not ride along in a `Referer`). The page also gets a CSP. Both the style
block and the script are inline, so it needs `'unsafe-inline'` for each —
hashing them would mean a build step, and there deliberately is not one. What it
still buys is no script from anywhere else, no `eval`, no plugins, no framing.
**If you add anything the page loads from a new place, the CSP has to learn about
it or it fails silently.** `img-src` already covers `blob:` for exactly this
reason: the composer reads a picked photo through `URL.createObjectURL` before
the canvas downscales it.

**Attribution** — every entry records `logged_by` (the name the device had
claimed before this write) and `device` (a random per-browser id in
`hms.dev`). The feed and your history show a quiet `by Coco` tag whenever
`logged_by` differs from `who`, so logging miles for somebody else is visible
rather than anonymous. Both fields come from the browser and are exactly as
trustworthy as the rest of the honor system — see the limits below. The `device`
id is the sturdier half: it survives someone editing the name, so several
entries typed on one phone still read as one phone.

To ask the board who typed what:

```sh
npx wrangler d1 execute DB --remote --command \
  "SELECT COALESCE(device,'(before attribution)') AS device, COUNT(*) AS n, \
          GROUP_CONCAT(who) AS logged_for, COALESCE(logged_by,'?') AS typed_by \
   FROM entries GROUP BY device, logged_by ORDER BY n DESC"
```

**Migrating a board that predates attribution** — `npm run db:migrate` adds the
two columns to an existing `entries` table. **Run it before deploying the code**:
`readState` selects both columns, so an un-migrated database makes the whole
board a 500. Run it once; a second run stops with `duplicate column name:
logged_by`, which is SQLite saying it is already done. A board created fresh
from `schema.sql` already has them and needs nothing.

**Rotate the password** — `npx wrangler secret put PASSPHRASE`. Everyone is asked
once more the next time they log miles. Removing the secret entirely makes writes
open to anyone with the link.

**Back up** — `curl https://septembermiles.com/api/export.csv > miles.csv`. Worth
doing once a week during the challenge; it is the whole log in six columns —
`date,who,miles,note,logged_by,logged_at`. `logged_at` is the wall-clock moment
the row was written, which the board itself never shows and which is often the
fastest way to see that several entries were typed in one sitting. A blank
`logged_by` means the row predates attribution, so it is genuinely unknown
rather than assumed to be `who`. A
name or note starting with `=`, `+`, `-` or `@` is written with a leading
apostrophe, because that file exists to be opened in a spreadsheet and those are
the characters Excel and Sheets read as a formula rather than as text.

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
| POST | `/api/entries` | `{who, date, miles, note, key, by, dev}` | 401 on bad `key`, 400 on bad input |
| POST | `/api/entries/delete` | `{id, key}` | |
| GET | `/api/chat` | | `{messages}` — the last 200, oldest first |
| POST | `/api/chat` | `{who, body, image, w, h, key}` | `image` is a data URL, or omitted |
| POST | `/api/chat/delete` | `{id, key}` | also drops the message's photo |
| GET | `/img/<id>` | | one chat photo, cached immutable for a year |
| GET | `/robots.txt` | | `Disallow: /` |

The four chat routes 404 unless `SOCIAL = "on"`.
| GET | `/api/export.csv` | | full log, no auth |
| GET | `/healthz` | | `ok` |

Chat writes take the same group password as miles. Chat reads, like board reads, are
open to anyone with the link.

Plus `/favicon.svg`, `/icon.svg`, `/apple-touch-icon.png`, `/icon-192.png`,
`/icon-512.png`, `/icon-maskable.png`, `/og.png`, `/site.webmanifest`.

## Data model

```sql
people   (name TEXT PRIMARY KEY COLLATE NOCASE, color TEXT, created INTEGER)
entries  (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, date TEXT, miles REAL,
          note TEXT, ts INTEGER, logged_by TEXT, device TEXT)
messages (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, body TEXT, img TEXT,
          w INTEGER, h INTEGER, ts INTEGER)
images   (id TEXT PRIMARY KEY, mime TEXT, bytes BLOB, ts INTEGER)
```

Rules enforced server-side in `addEntry`:

- Names are matched case-insensitively and stored as first typed, so `evan` logs
  against the existing `Evan`.
- `0 < miles <= 80`, date must fall inside `START`..`END`, name ≤ 24 chars,
  note ≤ 60 chars.
- **No future dates.** Every number on the board weighs a total against the days
  that have actually passed, so a whole month logged on day one reads as a
  runaway lead. The cap is today in UTC plus one day of slack, because "today"
  is the viewer's local date and far enough east it genuinely is tomorrow. The
  date picker stops at the viewer's own today, and is re-checked on every paint
  so a tab left open overnight does not stay a day behind.
- A name new to the board joins `people` and takes the next color in `COLORS`
  (`joinPerson`, shared with chat — posting a message is enough to join).
- `logged_by` is trimmed and capped at 24 chars like a name; `device` must match
  `/^[a-z0-9]{1,16}$/` or it is stored as null. Neither is ever invented: a row
  written before attribution keeps both as null and is displayed unmarked.
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
yours, for the "you" tag, the form default, which chat bubbles are yours, and who the
chat composer posts as), `hms.dev` (this browser's random id, sent with every entry
so the board can group entries by the device that typed them),
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
7. **`wrangler dev` does not always pick up an edit to `[vars]`.** It reloads on
   source changes, but a changed `GOAL`/`START`/`END`/`SOCIAL` can sit there
   while `/api/state` keeps serving the old config, which looks exactly like the
   code ignoring the setting. Restart it. To test a date the calendar is not on,
   it is quicker to stub `/api/state` in the browser than to move the window.

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

Re-verified again after the audit pass, driving a local `wrangler dev` with
Playwright:

- All three tabs at 1180px, 390px and 320px, light **and** dark: no horizontal
  scroll, exactly one tab marked current, and **no CSP violations** in the
  console. The CSP caught a real one on the way in — `img-src` without `blob:`
  broke the photo composer, which is why that source is spelled out above.
- The whole challenge lifecycle against the pace maths, by stubbing `/api/state`:
  before the start, day 1, day 29, the last day, and after the end. The header,
  the "To finish" tile and the leaderboard's right-hand column all read
  correctly at each, including "1 day left" and "needs 60 today" on the final
  day, where the old build said "0 days left" and called everyone short.
- A future date rejected by the API and unreachable from the date picker; today
  and one day of timezone slack still accepted.
- A note of `=1+1+cmd|'/c calc'!A0` exported as `'=1+1+...`, inert in a spreadsheet.
- With `SOCIAL = "on"`: a text message, a photo through the composer (staged,
  downscaled, posted, served from `/img/<id>` and reopened in the lightbox),
  Escape closing it, a message of `<img src=x onerror=alert(1)><script>` rendering
  as inert text, and two-click remove.
- `/og.png` served byte-identical to `brand/og.png`; `og:`/`canonical` tags
  rewritten to whatever `Host` the request carried.
- `/robots.txt`, `/healthz`, 404 handling, and the `<noscript>` line rendering in
  both themes with scripting off.

Worth re-running by hand after any change to `page.js` or `index.js`.

## Known limits

- **Honor-system identity.** Anyone can log as anyone. Attribution makes it
  *visible* — the feed says `by Coco` when Coco logs Julia's miles — but it does
  not prevent it, and it is not evidence. `logged_by` and `device` are sent by
  the browser, so anyone willing to open devtools can send whatever they like.
  It catches the mis-tap and the casual, which is what actually happens in a
  family group. **Per-person PINs remain the only real fix.** See OVERVIEW.
- **Attribution starts from the day it shipped.** Entries logged before the
  migration have no `logged_by` and never will; there is nothing in the old rows
  to recover it from. The worker has never recorded an IP or a user-agent, and
  `[observability]` is off, so nothing else retained it either.
- **One shared password, no rate limiting.** Guesses are unlimited. Adequate for a
  private link shared with friends; not adequate if the URL goes public.
- **No editing an entry** — delete it and add it again.
- **Entries can be backdated freely** inside the window. Future-dating is
  blocked, but nothing stops someone entering last Tuesday today, which is the
  point — you log the week's runs when you get round to it.
- **Dates are the viewer's local date.** Someone logging near midnight in another
  timezone may pick a different "today" than the board's other users. Harmless here.
- **No backups run automatically.** The CSV export is manual, and it covers miles
  only — chat messages and photos are not in it.
- **`noindex` and `robots.txt` are requests, not a fence.** A well-behaved
  crawler honours them; nothing stops anyone who has the link from sharing it.
  Reading is still open by design.
- **Photos live in D1, not R2.** That keeps the whole app on one binding and inside
  the free tier, but D1 is not built to be a photo store. At a few hundred photos it
  is fine. If the group ever fills it up, move `images` to an R2 bucket: only
  `addMessage` and `serveImage` touch the bytes.
- **Chat has no editing and no read receipts,** and the unseen dot is per-device.
- **The chat ships off** (`SOCIAL = "off"`). The composer is locked to the device's
  own name, which stops the accidental and the casual, but `hms.me` is only
  `localStorage` and the API trusts the `who` it is given. See "Turning the chat on".
- **Clearing browser data forgets who you are.** Next visit the composer asks again,
  as it does on a new phone. One tap, and nothing on the server is lost.

## If you want to take it further

Roughly in order of value for effort: per-person PINs if the group ever outgrows the
honor system; editable entries; a sort toggle (finished-first, or alphabetical, to
soften the leaderboard read); reactions on chat messages; photos on activity entries
too, reusing the `images` table the chat already has.

Two smaller ones the audit left on the table. The **on-pace mark counts today as
already spent** — on the morning of day 1 it wants 3.33 miles from you and the
board says everybody is behind. That matches the label ("miles each by today")
so it was left alone, but "by the *end* of today" is a defensible reading and
the gentler one. And the **unseen-message dot is repainted from the 30-second
board poll**, which now costs a second request while the chat is on and you are
looking at another tab; if that ever matters, a cheap `HEAD`-style endpoint
returning just the newest timestamp would do the same job.
