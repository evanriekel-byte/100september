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

## Changing the rules

The constants live at the top of the `app-code` script in `tracker.html`:

```js
var GOAL  = 100;           // miles per person
var START = '2026-09-01';
var END   = '2026-09-30';
var DAYS  = 30;
```

Note that the live board diverges from this file as soon as people start logging —
this repo holds the source the board was seeded from, not its current data.
