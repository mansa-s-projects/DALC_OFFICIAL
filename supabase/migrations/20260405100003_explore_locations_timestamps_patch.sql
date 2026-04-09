-- Patch: add created_at / updated_at that were in the original CREATE TABLE
-- but silently skipped because explore_locations already existed.
ALTER TABLE public.explore_locations
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT now();
