-- ============================================================
-- Migration: venue_categories
-- Creates the venue_categories lookup table and seeds core data
-- ============================================================

CREATE TABLE IF NOT EXISTS public.venue_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  plural_name  TEXT NOT NULL,
  icon         TEXT,
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.venue_categories                IS 'Canonical venue category definitions — single source of truth for category slugs used in routes and DB.';
COMMENT ON COLUMN public.venue_categories.slug           IS 'URL-safe slug matching app route segment (e.g. nightlife, beach-clubs).';
COMMENT ON COLUMN public.venue_categories.plural_name    IS 'Display label for list pages (e.g. "Beach Clubs").';
COMMENT ON COLUMN public.venue_categories.sort_order     IS 'Controls display order in category nav.';

-- Seed core nightlife/venue categories
INSERT INTO public.venue_categories (slug, name, plural_name, icon, description, sort_order) VALUES
  ('nightlife',             'Nightlife',              'Nightlife',              '🎉', 'Night clubs, rooftop bars, and late-night venues.',      1),
  ('beach-clubs',           'Beach Club',             'Beach Clubs',            '🏖️', 'Premium day-to-night beach clubs across Dubai.',         2),
  ('restaurants',           'Restaurant',             'Restaurants',            '🍽️', 'Fine dining, casual, and specialty restaurants.',         3),
  ('dining-entertainment',  'Dining Entertainment',   'Dining Entertainment',   '🎭', 'Immersive dining experiences with live entertainment.',   4),
  ('experiences',           'Experience',             'Experiences',            '✨', 'Activities, events, and unique Dubai experiences.',       5),
  ('wellness',              'Wellness',               'Wellness',               '🧘', 'Spas, fitness, and wellness destinations.',               6)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE public.venue_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venue_categories_public_read"
  ON public.venue_categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "venue_categories_admin_write"
  ON public.venue_categories FOR ALL
  USING (auth.role() = 'service_role');
