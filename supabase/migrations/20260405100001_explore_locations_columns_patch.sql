-- Patch: fix explore_locations table that pre-existed migration 20260405100000.
-- 1. Cast id from UUID to TEXT so slug-based seed inserts work.
-- 2. Add columns that were defined in CREATE TABLE but skipped (table already existed).
ALTER TABLE public.explore_locations ALTER COLUMN id TYPE TEXT;

ALTER TABLE public.explore_locations
  ADD COLUMN IF NOT EXISTS short_description    TEXT,
  ADD COLUMN IF NOT EXISTS long_description     TEXT;
