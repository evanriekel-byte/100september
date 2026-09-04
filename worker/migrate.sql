-- One-off: add attribution to a board created before it existed.
--
--   npm run db:migrate        (add --local to do it to the dev database)
--
-- Run it ONCE. A second run fails with "duplicate column name: logged_by",
-- which is SQLite telling you it is already done, not a problem to fix.
-- schema.sql already carries these columns, so a board created from scratch
-- needs nothing here.
--
-- Order does not matter. The Worker falls back to the pre-attribution shape of
-- every query, so a deploy that lands before this still serves the board and
-- still takes miles; it just cannot record who typed them until this runs, and
-- picks that up the moment it does.

ALTER TABLE entries ADD COLUMN logged_by TEXT;
ALTER TABLE entries ADD COLUMN device    TEXT;
