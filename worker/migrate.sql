-- One-off migration for a database created before activities carried photos.
-- New databases get these columns from schema.sql and never need this file.
--
--   npm run db:migrate
--
-- Run it once. A second run fails with "duplicate column name" and rolls the
-- whole file back, so it costs nothing but the error message.

ALTER TABLE entries ADD COLUMN img TEXT;
ALTER TABLE entries ADD COLUMN w INTEGER;
ALTER TABLE entries ADD COLUMN h INTEGER;
