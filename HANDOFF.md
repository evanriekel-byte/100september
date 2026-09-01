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
| Default branch | `claude/100-mile-challenge-tracker-uq7g61` — what the live Worker was built from |

Both custom domains are attached to the Worker under **Workers & Pages →
hundred-mile-september → Settings → Domains & Routes**, with certificates issued
and renewed by Cloudflare.

### Not yet live

> This document describes the repo. Activity photos and the open board are committed
> on **`claude/activity-photos`** but **not deployed**. To land them, from the repo
> root:
>
> ```sh
> git push origin claude/activity-photos:claude/100-mile-challenge-tracker-uq7g61
> git fetch origin
> git branch -f claude/100-mile-challenge-tracker-uq7g61 origin/claude/100-mile-challenge-tracker-uq7g61
> git checkout claude/100-mile-challenge-tracker-uq7g61
> cd worker
> npm run db:migrate            # adds entries.img/w/h — before the deploy, not after
> npx wrangler secret delete PASSPHRASE
> npx wrangler deploy
> ```
>
> Pushing branch-to-branch rather than merging locally keeps the untracked
> `database_id` edit in `wrangler.toml` from being clobbered. **Delete this section
> once it is done.**

**Not in this repo:** the Cloudflare account id and the D1 `database_id`. Both live in
the working copy's `worker/wrangler.toml` as an untracked edit over the
`PASTE_YOUR_DATABASE_ID_HERE` placeholder, and can be re-listed any time with
`npx wrangler d1 list`. Keep that edit out of commits — switching branches will fight
you for the file otherwise.

There is **no `PASSPHRASE` secret**; the board takes writes from anyone with the link.
See "The password is a switch" under Operations for what that costs and how to put it
back.

## Layout

```
worker/
  wrangler.toml     config + the challenge itself (see "Change the rules")
  schema.sql        four tables; safe to re-run, everything is IF NOT EXISTS
  migrate.sql       one-off ALTERs for a database older than a feature
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

**When a change touches the database, run the schema before the deploy**, never after
— the new code will query columns the old database does not have and return 500s in
the gap. See the two `db:` commands under Operations.

Local development:

```sh
npm run db:local                                  # create tables in the local D1
npm run db:migrate:local                          # only if your local DB predates a column
npm run dev                                       # http://127.0.0.1:8787
```

There is nothing to configure for auth locally: with no `.dev.vars`, `wrangler dev`
behaves exactly like production does today. To exercise the locked path instead, write
`PASSPHRASE = "anything"` into `worker/.dev.vars` (gitignored).

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

**The password is a switch, and it is currently off.** There is no `PASSPHRASE`
secret set, so `config.locked` is false, the password fields never render, and
anyone with the link can log miles and attach photos. Nothing in the code was
removed — `authorize()` simply returns early when the secret is absent.

```sh
npx wrangler secret put PASSPHRASE      # lock writes again, asked once per device
npx wrangler secret delete PASSPHRASE   # open writes to anyone with the link
```

Worth knowing what open writes now cost, since activities carry photos:
`septembermiles.com` is a short public domain, and a stranger who finds it can write
rows and upload images into your D1. For a family board that is a fine trade against
asking five people for a password. If it is ever abused, `secret put` takes effect on
the next request — no deploy, no code change — and everyone re-enters it once.

**Back up** — `curl https://septembermiles.com/api/export.csv > miles.csv`. Worth
doing once a week during the challenge; it is the whole log in five columns. The
`photo` column holds each entry's `/img/<id>` path, not the image — the CSV is not a
backup of the photos themselves.

**Restore** — D1 keeps point-in-time restore. Check `npx wrangler d1 time-travel --help`
for the current syntax before relying on it.

**Wipe the board** —
`npx wrangler d1 execute DB --remote --command "DELETE FROM entries; DELETE FROM messages; DELETE FROM images; DELETE FROM people;"`

**Add the chat tables to a database created before they existed** — `npm run db:remote`.
The whole schema is `IF NOT EXISTS`, so it adds `messages` and `images` and leaves
`people` and `entries` alone.

**Add photo columns to an `entries` table that predates them** — `npm run db:migrate`.
`IF NOT EXISTS` cannot add a column to a table that already exists, so the three
`ALTER TABLE` statements live in `migrate.sql` instead. Run it once. A second run
fails with "duplicate column name" and D1 rolls the whole file back, so the mistake
costs nothing but the error message. A database created from `schema.sql` today
already has the columns and never needs this.

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
| POST | `/api/entries` | `{who, date, miles, note, image, w, h, key}` | `image` is a data URL, or omitted |
| POST | `/api/entries/delete` | `{id, key}` | |
| GET | `/api/chat` | | `{messages}` — the last 200, oldest first |
| POST | `/api/chat` | `{who, body, image, w, h, key}` | `image` is a data URL, or omitted |
| POST | `/api/chat/delete` | `{id, key}` | also drops the message's photo |
| GET | `/img/<id>` | | one photo, from an entry or a message, cached immutable for a year |

The three `/api/chat*` routes 404 unless `SOCIAL = "on"`. `/img/` is not gated —
activity photos are served from it with the chat switched off.
| GET | `/api/export.csv` | | full log, no auth |
| GET | `/healthz` | | `ok` |

Chat writes are authorised exactly like miles — which today means not at all. Reads
were always open to anyone with the link.

Plus `/favicon.svg`, `/icon.svg`, `/apple-touch-icon.png`, `/icon-192.png`,
`/icon-512.png`, `/icon-maskable.png`, `/site.webmanifest`.

## Data model

```sql
people   (name TEXT PRIMARY KEY COLLATE NOCASE, color TEXT, created INTEGER)
entries  (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, date TEXT, miles REAL,
          note TEXT, img TEXT, w INTEGER, h INTEGER, ts INTEGER)
messages (id TEXT PRIMARY KEY, who TEXT COLLATE NOCASE, body TEXT, img TEXT,
          w INTEGER, h INTEGER, ts INTEGER)
images   (id TEXT PRIMARY KEY, mime TEXT, bytes BLOB, ts INTEGER)
```

`images` is shared: `entries.img` and `messages.img` both point into it, and one
`takePhoto` / `dropPhoto` pair on the server handles both, so miles and chat accept
byte-for-byte the same thing. Deleting either row deletes its photo, so nothing is
ever orphaned.

Rules enforced server-side in `addEntry`:

- Names are matched case-insensitively and stored as first typed, so `evan` logs
  against the existing `Evan`.
- `0 < miles <= 80`, date must fall inside `START`..`END`, name ≤ 24 chars,
  note ≤ 60 chars.
- A name new to the board joins `people` and takes the next color in `COLORS`
  (`joinPerson`, shared with chat — posting a message is enough to join).
- Deleting someone's last entry prunes them from `people` **only if they have no
  messages either**. If they come back they may be assigned a different color.

Both `addEntry` and `addMessage` also take an optional photo:

- `image` is a `data:` URL; only `image/jpeg`, `png`, `webp` and `gif` are accepted,
  and only up to 1 MB decoded. The browser downscales to a 1280 px longest edge and
  steps JPEG quality down until it is under ~420 KB, so that ceiling is a backstop
  for anything posting straight to the API.
- `w` and `h` are the downscaled dimensions, stored so a thumbnail reserves its space
  before the image loads.

And in `addMessage` specifically:

- Body ≤ 500 chars. A message needs a body, a photo, or both.

Client state that is not on the server: `localStorage` holds `hms.me` (which name is
yours, for the "you" tag, the form default, which chat bubbles are yours, and who the
chat composer posts as),
`hms.key` (the password — carried but unused while none is set), and `hms.seen` (the
newest message timestamp you have looked at, which drives the dot on the Social tab).
All three are per-device conveniences. Losing them costs one dropdown selection
today, plus one password entry if a password is ever set again.

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
local D1 and a seeded mid-challenge board, driving the page with Playwright. Each
block is the round of checks done when that feature landed, kept as a record of what
has actually been exercised.

**The original board** (checked while a password was still in force):

- Validation: wrong password, missing password, out-of-window date, zero miles,
  900 miles, blank name — all rejected with the right status and message.
- `"  evan  "` merged into the existing `Evan` rather than creating a second person.
- A name of `<img src=x onerror=alert(1)>` renders as inert text; no element created,
  no alert fired.
- A run logged in one browser appeared in a second browser's board.
- Two-click remove, CSV export, 404 handling, `/healthz`.
- Every brand route: correct content-type and byte count matching the source file.
- Light and dark themes at 1180px, 390px and 320px, with no horizontal scroll.

**The three-page rebuild** — re-verified all of the above, plus:

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

**The locked composer** — first visit asks who you are and then locks to that name; a
known device shows no dropdown at all; messages are attributed to the locked name;
not-you / cancel / switch all behave; a 30-second refresh mid-typing keeps the name.

**Activity photos and the open board** — checked in all four combinations of
`SOCIAL` on/off and password set/unset:

- A photo attached through the miles form, stored, and served back from `/img/<id>`
  **byte-identical** to the file uploaded.
- Thumbnail in your history and in the group activity feed; both open full size in
  the lightbox; Escape closes it.
- Deleting the entry deletes the photo with it — `images` row gone, `/img/<id>` 404,
  and no reference left in the CSV export.
- Entries with no photo unaffected, and no stray thumbnail rendered for them.
- `/img/` reachable with `SOCIAL = "off"` while all three `/api/chat*` routes 404.
- Non-image data URL rejected; oversized photo rejected.
- The whole chat suite still passing with `SOCIAL = "on"`.

Worth re-running by hand after any change to `page.js` or `index.js`. One cheap
smoke test catches a whole class of `page.js` breakage — every function the client
calls is actually defined:

```sh
node --input-type=module -e "import('./src/page.js').then(m=>{
  const js=m.PAGE.split('<script>')[1].split('</script>')[0];
  const def=new Set([...js.matchAll(/function\s+(\w+)\s*\(/g)].map(x=>x[1]));
  [...js.matchAll(/var\s+(\w+)\s*=/g)].forEach(x=>def.add(x[1]));
  const called=[...new Set([...js.matchAll(/(?:^|[^\w.\$])([a-z]\w*)\s*\(/g)].map(x=>x[1]))];
  console.log(called.filter(n=>!def.has(n)));})"
```

Anything printed that is not a JS builtin is a function that was deleted or renamed
out from under its callers.

## Known limits

- **Honor-system identity.** Anyone can log as anyone. See OVERVIEW for why.
- **Writes are open to anyone with the link.** No password is set, so a stranger who
  finds the domain can add entries and upload photos. Deliberate — see "The password
  is a switch" — and reversible in one command.

- **Dates are the viewer's local date.** Someone logging near midnight in another
  timezone may pick a different "today" than the board's other users. Harmless here.
- **No backups run automatically.** The CSV export is manual, it names photos but
  does not contain them, and chat messages are not in it at all.
- **Photos live in D1, not R2.** That keeps the whole app on one binding and inside
  the free tier, but D1 is not built to be a photo store. At a few hundred photos it
  is fine. If the group ever fills it up, move `images` to an R2 bucket: only
  `takePhoto`, `dropPhoto` and `serveImage` touch the bytes.
- **A thumbnail is the full photo, scaled by CSS.** Only one size is stored, so a
  history row with ten photos downloads ten full images. At ~150 KB each and this
  many entries it does not matter; at a thousand it would.
- **No editing, for miles or messages** — delete it and add it again. That includes
  swapping a photo on an entry that is already logged.
- **The chat ships off** (`SOCIAL = "off"`). The composer is locked to the device's
  own name, which stops the accidental and the casual, but `hms.me` is only
  `localStorage` and the API trusts the `who` it is given. See "Turning the chat on".
- **Clearing browser data forgets who you are.** Next visit the composer asks again,
  as it does on a new phone. One tap, and nothing on the server is lost.

## If you want to take it further

Roughly in order of value for effort: per-person PINs if the group ever outgrows the
honor system; editable entries; a sort toggle (finished-first, or alphabetical, to
soften the leaderboard read); an `og:image` so the link previews properly when it gets
texted around; reactions on chat messages; a second stored size so a thumbnail is not
the full photo.
