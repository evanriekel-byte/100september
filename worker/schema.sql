CREATE TABLE IF NOT EXISTS people (
  name    TEXT PRIMARY KEY COLLATE NOCASE,
  color   TEXT NOT NULL,
  created INTEGER NOT NULL
);

-- logged_by / device: who was at the keyboard, not who the miles are for.
-- Identity is still the honor system; these only make it visible.
CREATE TABLE IF NOT EXISTS entries (
  id        TEXT PRIMARY KEY,
  who       TEXT NOT NULL COLLATE NOCASE,
  date      TEXT NOT NULL,
  miles     REAL NOT NULL,
  note      TEXT NOT NULL DEFAULT '',
  ts        INTEGER NOT NULL,
  logged_by TEXT,
  device    TEXT
);

CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date DESC, ts DESC);
CREATE INDEX IF NOT EXISTS idx_entries_who  ON entries(who);

-- Group chat. A message carries text, a photo, or both.
CREATE TABLE IF NOT EXISTS messages (
  id   TEXT PRIMARY KEY,
  who  TEXT NOT NULL COLLATE NOCASE,
  body TEXT NOT NULL DEFAULT '',
  img  TEXT,
  w    INTEGER,
  h    INTEGER,
  ts   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts DESC);

-- Photos posted to chat, already downscaled by the browser before upload.
CREATE TABLE IF NOT EXISTS images (
  id    TEXT PRIMARY KEY,
  mime  TEXT NOT NULL,
  bytes BLOB NOT NULL,
  ts    INTEGER NOT NULL
);
