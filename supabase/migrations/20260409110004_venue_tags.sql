-- ============================================================
-- Migration: venue_tags + venue_tag_map
-- Structured tagging system for venues.
-- Replaces the loose vibe_tags TEXT[] column with a proper
-- FK-enforced many-to-many relationship.
-- ============================================================

-- ── 1. Tags master table ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.venue_tags (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      TEXT NOT NULL UNIQUE,
  name      TEXT NOT NULL,
  type      TEXT NOT NULL DEFAULT 'vibe'
            CHECK (type IN ('vibe', 'feature', 'cuisine', 'occasion', 'crowd')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.venue_tags       IS 'Canonical tags taxonomy. Replaces free-text vibe_tags arrays.';
COMMENT ON COLUMN public.venue_tags.slug  IS 'URL-safe unique slug — used in filter queries and frontend chips.';
COMMENT ON COLUMN public.venue_tags.type  IS 'Tag classification: vibe | feature | cuisine | occasion | crowd.';

-- ── 2. Seed tags ──────────────────────────────────────────────

INSERT INTO public.venue_tags (slug, name, type) VALUES
  -- Vibe
  ('rooftop',           'Rooftop',            'vibe'),
  ('beachfront',        'Beachfront',         'vibe'),
  ('underground',       'Underground',        'vibe'),
  ('sunset-views',      'Sunset Views',       'vibe'),
  ('neon-lit',          'Neon Lit',           'vibe'),
  ('open-air',          'Open Air',           'vibe'),
  ('poolside',          'Poolside',           'vibe'),
  -- Features
  ('live-dj',           'Live DJ',            'feature'),
  ('live-band',         'Live Band',          'feature'),
  ('valet',             'Valet Parking',      'feature'),
  ('bottle-service',    'Bottle Service',     'feature'),
  ('private-tables',    'Private Tables',     'feature'),
  ('dress-code',        'Dress Code',         'feature'),
  ('ladies-night',      'Ladies Night',       'feature'),
  ('smoking-area',      'Smoking Area',       'feature'),
  ('shisha',            'Shisha',             'feature'),
  -- Cuisine
  ('japanese',          'Japanese',           'cuisine'),
  ('mediterranean',     'Mediterranean',      'cuisine'),
  ('latin',             'Latin',              'cuisine'),
  ('international',     'International',      'cuisine'),
  ('seafood',           'Seafood',            'cuisine'),
  ('middle-eastern',    'Middle Eastern',     'cuisine'),
  -- Occasion
  ('date-night',        'Date Night',         'occasion'),
  ('birthday',          'Birthday',           'occasion'),
  ('business-dinner',   'Business Dinner',    'occasion'),
  ('group-booking',     'Group Booking',      'occasion'),
  ('corporate',         'Corporate',          'occasion'),
  -- Crowd
  ('expats',            'Expats',             'crowd'),
  ('tourists',          'Tourists',           'crowd'),
  ('locals',            'Locals',             'crowd'),
  ('celebrities',       'Celebrities',        'crowd')
ON CONFLICT (slug) DO NOTHING;

-- ── 3. Junction table ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.venue_tag_map (
  venue_id   TEXT NOT NULL REFERENCES public.venues(id)      ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.venue_tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (venue_id, tag_id)
);

COMMENT ON TABLE public.venue_tag_map IS 'Many-to-many venue ↔ tag associations.';

-- ── 4. Backfill from vibe_tags TEXT[] ────────────────────────
-- Maps existing free-text vibe_tags values to canonical tag slugs.
-- Unmatched tags are silently skipped.

INSERT INTO public.venue_tag_map (venue_id, tag_id)
SELECT DISTINCT
  v.id          AS venue_id,
  t.id          AS tag_id
FROM
  public.venues v,
  UNNEST(v.vibe_tags) AS raw_tag,
  public.venue_tags t
WHERE LOWER(TRIM(raw_tag)) = t.slug
   OR LOWER(TRIM(raw_tag)) = LOWER(t.name)
ON CONFLICT DO NOTHING;

-- ── 5. RLS ────────────────────────────────────────────────────

ALTER TABLE public.venue_tags    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_tag_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venue_tags_public_read"
  ON public.venue_tags FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "venue_tags_admin_write"
  ON public.venue_tags FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "venue_tag_map_public_read"
  ON public.venue_tag_map FOR SELECT
  USING (TRUE);

CREATE POLICY "venue_tag_map_admin_write"
  ON public.venue_tag_map FOR ALL
  USING (auth.role() = 'service_role');

-- ── 6. Indexes ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_venue_tag_map_venue_id ON public.venue_tag_map (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_tag_map_tag_id   ON public.venue_tag_map (tag_id);
CREATE INDEX IF NOT EXISTS idx_venue_tags_type         ON public.venue_tags (type) WHERE is_active = TRUE;
