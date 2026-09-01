# September Miles — what it is

**Live: [septembermiles.com](https://septembermiles.com)**

A shared board for a group taking on the same personal challenge: **100 miles in
September**. Run it, walk it, the board does not care — it takes a distance and a
date, nothing else.

The 100 is a **per-person commitment**, not a group pot. Five people on the board
means five separate 100s, not a 500-mile team goal. Nothing in the app ever adds
everyone's targets together.

## Who it is for

A handful of friends and family who want to see each other's progress without
installing anything, making an account, or learning a new app. The whole product is
one URL that works in any phone or desktop browser.

## What a person does

1. Opens the link.
2. Picks their name from the **Who** dropdown — or types it once, the first time.
3. Enters miles, a date, an optional note, and an optional photo.
4. Taps **Add miles**.

That's it. No login, no email, no password, no app. On a phone, Share → Add to Home Screen puts
it on the home screen and it launches without browser chrome, like an app.

## Three pages

The app is three tabs — a bar in thumb reach on a phone, a rail under the masthead
on a desktop. Each one answers a different question, and each has its own URL
(`#/log`, `#/group`, `#/social`) so a tab survives a refresh and can be linked to.

| tab | the question it answers |
|---|---|
| **Log** | how am I doing, and let me add today's activity |
| **Group** | where does everyone stand |
| **Social** | what is everyone saying *(off by default — see below)* |

**Log** is the landing page, because logging is the thing people come to do. Three
tiles across the top — your total, your pace against the line, what you need per day
from here — then the form, then **your own history**: every activity you have logged,
with your streak, your daily average, and your best day.

An activity can carry **a photo** — the view from the turnaround, the watch face, the
dog. It shows as a thumbnail on the entry, in your history and in the group feed, and
opens full size on a tap. Photos are downscaled in the browser before they are sent,
so a 4 MB phone shot goes out around 150 KB and the board stays quick on a phone.

**Group** is the shared view: the four-tile stat strip, the leaderboard, and the full
group activity feed, filterable to one person with a tap.

**Social** is a group chat — **built, but switched off for now** (`SOCIAL = "off"`
in `wrangler.toml`). Picking your name from a dropdown is a fair trade for logging
miles, where a wrong entry is a visible, deletable fact. It is a worse trade for a
conversation, where the same dropdown lets anyone speak as anyone. The tab comes back
with a one-line config change once identity is worth trusting. What it does when it
is on: text, photos, or both.

The chat does not ask who you are every time. It posts as the name this device has
already claimed — *Posting as Evan* — with a **not you?** escape for a shared phone.
Logging miles offers a menu of everyone because you might reasonably fix someone
else's entry; a conversation offers no such menu, because there is no good reason to
type in someone else's voice. A photo is downscaled in the
browser before it is sent, so a 4 MB phone shot goes out around 150 KB. Photos can be
picked, pasted, or dragged in, and tapping one opens it full-size. Messages carry the
poster's board colour, so the chat and the leaderboard read as the same people. A dot
on the Social tab means there is something you have not seen.

## What the board shows

**Stat strip** — four numbers, yours first:

| tile | what it answers |
|---|---|
| Your miles | how far along am I, and how much is left |
| On-pace mark | how far should each of us be by today |
| On pace | how many of us are holding our own 100 |
| Miles logged | everyone's combined total, as a plain fact with no goal attached |

**Everyone** — one row per person: their total against their own 100, a progress bar
with quarter ticks, and an **orange line marking today's on-pace point**. Sitting
right of the orange line means ahead; left means behind. Each row also carries a
pace chip (`+14 ahead` / `-34 behind`) and what they'd need per day to finish from
here. Finishing your 100 replaces your position number with a check — completing
your own commitment is the win condition, not out-running anyone.

**Activity** — every entry, newest first, colored by person, photo thumbnail if there
is one, and a two-click remove for typos. Capped at 24 with a "show all" toggle, and
filterable to one person.

Rows sort by total, so the board does read a little like a leaderboard. That is
deliberate — seeing where you sit is most of why people open a shared board — but
the goal, the chips, and the finish marker are all measured against your own 100.

## How it works

A single [Cloudflare Worker](https://workers.cloudflare.com) serves the page and a
small JSON API; entries, messages and photos live in a
[D1](https://developers.cloudflare.com/d1/) SQLite database. There is no build step,
no framework, and no server to keep alive. It costs the price of the domain — the
compute and database sit inside Cloudflare's free tier at this size, with room to
spare.

Open tabs re-fetch the board every 30 seconds, and the chat every 7 seconds while the
Social tab is the one you are looking at. Both stop the moment the tab is hidden, so a
phone in a pocket costs nothing.

## Identity, honestly

Identity is **a name in a dropdown, on the honor system**. There are no per-person
accounts or PINs. Anyone on the board can log miles under anyone's name, by accident
or on purpose.

That is a deliberate trade. Per-person logins would add friction for every single
participant to defend against a problem that does not exist in a group of friends,
and the activity feed makes anything strange obvious immediately.

**There is no group password either.** It was one more thing to explain, forward, and
re-enter on a new phone, for a board whose whole appeal is that it takes ten seconds.
So writing is open to anyone with the link, the same as reading always was. The cost
is real and worth naming: a stranger who finds the domain can add rows and upload
photos. The password is not gone from the code, only unset — one command puts it back
if that ever stops being theoretical, and HANDOFF has it.

## Design

The mark is an S drawn as two lanes with a gap running through it, tilted 8°, in a
cyan-to-violet gradient on navy — matching the `SEPTEMBERMILES.com` wordmark in the
header, so brand, domain, and browser tab all agree.

One rule holds the interface together: **the brand gradient never means anything.**
Green means ahead of pace, orange marks the on-pace line, and those two are the only
colors that carry status. The gradient is reserved for identity — the mark, the
wordmark, the primary button, the send button, the tint on your own chat messages,
and the chip you earn at 100. No participant is ever assigned an orange blaze color,
because orange already means "pace" on every bar.

The navigation follows the same rule: the active tab is marked in plain ink, never in
the gradient, so nothing about where you are competes with what the colors mean. The
unseen-messages dot is the one exception, and it is orange because it is a nudge, not
an identity.

The board is designed for both light and dark, and for phones first: navigation sits
at the bottom where a thumb reaches, and the Log tab opens first, because logging is
the thing you came to do.

---

Setup, deployment, and operations: [HANDOFF.md](HANDOFF.md).
