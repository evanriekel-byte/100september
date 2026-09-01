-- One-off: add attribution to a board created before it existed.
--
--   npm run db:migrate        (add --local to do it to the dev database)
--
-- Run it ONCE. A second run fails with "duplicate column name: logged_by",
-- which is SQLite telling you it is already done, not a problem to fix.
-- schema.sql already carries these columns, so a board created from scratch
-- needs nothing here.
--
-- Run it BEFORE deploying the code that reads them: readState selects both
-- columns, so the board 500s against a database that has not been migrated.

ALTER TABLE entries ADD COLUMN logged_by TEXT;
ALTER TABLE entries ADD COLUMN device    TEXT;
