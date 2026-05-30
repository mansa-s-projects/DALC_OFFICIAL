-- Patch: add columns that were defined in CREATE TABLE but skipped because
-- explore_locations already existed when 20260405100000 ran.
ALTER TABLE public.explore_locations
  ADD COLUMN IF NOT EXISTS short_description    TEXT,
  ADD COLUMN IF NOT EXISTS long_description     TEXT;
