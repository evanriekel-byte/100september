# September Miles

A shared board for a group taking on the same personal challenge: 100 miles in
September. Run it, walk it — it takes a distance and a date, nothing else.

Two tabs: **Log** your own activity and see your history, **Group** for the
leaderboard and everyone's activity. A third, **Social** — a group chat with photos —
is built but ships switched off (`SOCIAL` in `worker/wrangler.toml`); see HANDOFF for
why and how to turn it on.

**Live: [septembermiles.com](https://septembermiles.com)**

- **[OVERVIEW.md](OVERVIEW.md)** — what the app is, what the board shows, and the
  thinking behind it.
- **[HANDOFF.md](HANDOFF.md)** — deploy, operations, API, data model, gotchas, and
  known limits.

## Quick start

```sh
cd worker
npm install
npx wrangler deploy      # ships to the live Worker
npm run dev              # or run it locally at 127.0.0.1:8787
```

Change the challenge — distance, dates, miles vs. kilometres — in `[vars]` in
`worker/wrangler.toml`, then deploy.

## What's here

```
worker/          the app: a Cloudflare Worker serving the page and a JSON API,
                 with the log in a D1 (SQLite) database
worker/brand/    source art for the icon set
tracker.html     retired — the original self-publishing Claude Artifact version,
                 kept for reference. It is not what runs at septembermiles.com
```
