-- Fix: cast explore_locations.id from UUID to TEXT so slug-based seed inserts work.
ALTER TABLE public.explore_locations ALTER COLUMN id TYPE TEXT;
