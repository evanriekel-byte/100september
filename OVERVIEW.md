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
3. Enters miles, a date, and an optional note.
4. Types the shared group password, once per device. Their browser remembers it.

That's it. No login, no email, no app. On a phone, Share → Add to Home Screen puts
it on the home screen and it launches without browser chrome, like an app.

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

**Activity** — every entry, newest first, colored by person, with a two-click remove
for typos. Capped at 24 with a "show all" toggle.

Rows sort by total, so the board does read a little like a leaderboard. That is
deliberate — seeing where you sit is most of why people open a shared board — but
the goal, the chips, and the finish marker are all measured against your own 100.

## How it works

A single [Cloudflare Worker](https://workers.cloudflare.com) serves the page and a
small JSON API; entries live in a [D1](https://developers.cloudflare.com/d1/)
SQLite database. There is no build step, no framework, and no server to keep alive.
It costs the price of the domain — the compute and database sit inside Cloudflare's
free tier at this size, with room to spare.

Open tabs re-fetch every 30 seconds, but only while the tab is visible, so a phone
in a pocket costs nothing.

## Identity, honestly

Identity is **a name in a dropdown, on the honor system**. There are no per-person
accounts or PINs. Anyone on the board can log miles under anyone's name, by accident
or on purpose.

That is a deliberate trade. Per-person logins would add friction for every single
participant to defend against a problem that does not exist in a group of friends,
and the activity feed makes anything strange obvious immediately. The shared
password is not there to tell people apart — it only stops a stranger who stumbles
on the URL from writing to the board. **Reading is open to anyone with the link.**

## Design

The mark is an S drawn as two lanes with a gap running through it, tilted 8°, in a
cyan-to-violet gradient on navy — matching the `SEPTEMBERMILES.com` wordmark in the
header, so brand, domain, and browser tab all agree.

One rule holds the interface together: **the brand gradient never means anything.**
Green means ahead of pace, orange marks the on-pace line, and those two are the only
colors that carry status. The gradient is reserved for identity — the mark, the
wordmark, the primary button, and the chip you earn at 100. No participant is ever
assigned an orange blaze color, because orange already means "pace" on every bar.

The board is designed for both light and dark, and for phones first: on a narrow
screen the log form sits above the leaderboard, because logging is the thing you
came to do.

---

Setup, deployment, and operations: [HANDOFF.md](HANDOFF.md).
