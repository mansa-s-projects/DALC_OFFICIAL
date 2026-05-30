-- ============================================================
-- Migration: venues_schema_upgrade
-- Adds slug, SEO, booking, geo, FTS, and FK columns to venues.
-- Keeps TEXT PK (id) intact — requests.venue_id FK is preserved.
-- ============================================================

-- ── 1. Slug generation function ──────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_venue_slug(input_name TEXT, input_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base_slug  TEXT;
  final_slug TEXT;
  counter    INTEGER := 0;
BEGIN
  base_slug := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(input_name, '[^a-zA-Z0-9\s\-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-{2,}', '-', 'g'
    )
  );
  base_slug := TRIM(BOTH '-' FROM base_slug);

  final_slug := base_slug;

  -- Ensure uniqueness by appending counter if slug already exists
  WHILE EXISTS (
    SELECT 1 FROM public.venues
    WHERE slug = final_slug AND id != input_id
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;
COMMENT ON FUNCTION public.generate_venue_slug IS 'Generates a unique URL slug for a venue from its name. Appends numeric suffix on collision.';
-- ── 2. Add new columns ────────────────────────────────────────

ALTER TABLE public.venues
  -- Slug & canonical routing
  ADD COLUMN IF NOT EXISTS slug                TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS canonical_url       TEXT,

  -- Category FK (links to venue_categories)
  ADD COLUMN IF NOT EXISTS category_id         UUID REFERENCES public.venue_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category_slug       TEXT,

  -- Emirate FK (links to emirates)
  ADD COLUMN IF NOT EXISTS emirate_id          UUID REFERENCES public.emirates(id) ON DELETE SET NULL,

  -- SEO metadata
  ADD COLUMN IF NOT EXISTS seo_title           TEXT,
  ADD COLUMN IF NOT EXISTS seo_description     TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords        TEXT[] DEFAULT '{}',

  -- Booking
  ADD COLUMN IF NOT EXISTS booking_mode        TEXT DEFAULT 'request'
                                               CHECK (booking_mode IN ('request', 'direct', 'whatsapp', 'external')),
  ADD COLUMN IF NOT EXISTS booking_url         TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number     TEXT,
  ADD COLUMN IF NOT EXISTS min_spend_aed       INTEGER,

  -- Contact & social
  ADD COLUMN IF NOT EXISTS phone               TEXT,
  ADD COLUMN IF NOT EXISTS website_url         TEXT,
  ADD COLUMN IF NOT EXISTS instagram_handle    TEXT,
  ADD COLUMN IF NOT EXISTS address             TEXT,

  -- Geo (separate lat/lng for indexed geo queries)
  ADD COLUMN IF NOT EXISTS latitude            NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS longitude           NUMERIC(10, 7),
  ADD COLUMN IF NOT EXISTS google_place_id     TEXT,

  -- Engagement counters
  ADD COLUMN IF NOT EXISTS view_count          INTEGER NOT NULL DEFAULT 0,

  -- Publishing
  ADD COLUMN IF NOT EXISTS published_at        TIMESTAMPTZ;
-- ── 3. FTS column ─────────────────────────────────────────────
-- Added separately because GENERATED columns cannot be combined
-- with ADD COLUMN IF NOT EXISTS in older Postgres minor versions.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'venues'
      AND column_name  = 'fts'
  ) THEN
    ALTER TABLE public.venues
      ADD COLUMN fts tsvector
        GENERATED ALWAYS AS (
          setweight(to_tsvector('english', COALESCE(name, '')),              'A') ||
          setweight(to_tsvector('english', COALESCE(description_short, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(area, '')),              'C') ||
          setweight(to_tsvector('english', COALESCE(category, '')),          'D')
        ) STORED;
  END IF;
END
$$;
-- ── 3b. Fix FK on category_id if it still points to old 'categories' table ──
-- category_id may have been added by a prior migration referencing the wrong table.
DO $$
BEGIN
  -- Drop any FK on venues.category_id that does NOT reference venue_categories
  IF EXISTS (
    SELECT 1 FROM information_schema.referential_constraints rc
    JOIN information_schema.key_column_usage kcu
      ON kcu.constraint_name = rc.constraint_name
     AND kcu.table_schema    = rc.constraint_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = rc.unique_constraint_name
    WHERE kcu.table_schema  = 'public'
      AND kcu.table_name    = 'venues'
      AND kcu.column_name   = 'category_id'
      AND ccu.table_name   != 'venue_categories'
  ) THEN
    ALTER TABLE public.venues DROP CONSTRAINT IF EXISTS venues_category_id_fkey;
    ALTER TABLE public.venues
      ADD CONSTRAINT venues_category_id_fkey
        FOREIGN KEY (category_id) REFERENCES public.venue_categories(id) ON DELETE SET NULL;
  END IF;
END
$$;
-- ── 4. Backfill: category_id + category_slug ─────────────────

UPDATE public.venues v
SET
  category_id   = vc.id,
  category_slug = vc.slug
FROM public.venue_categories vc
WHERE LOWER(v.category) = vc.slug
   OR LOWER(v.category) = LOWER(vc.name)
   OR LOWER(v.category) = LOWER(vc.plural_name);
-- ── 5. Backfill: emirate_id (default Dubai for existing rows) ─

UPDATE public.venues
SET emirate_id = (SELECT id FROM public.emirates WHERE slug = 'dubai' LIMIT 1)
WHERE emirate_id IS NULL;
-- ── 6. Slug backfill trigger ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.venues_before_insert_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_venue_slug(NEW.name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_venues_slug ON public.venues;
CREATE TRIGGER trg_venues_slug
  BEFORE INSERT ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.venues_before_insert_slug();
-- ── 7. updated_at trigger ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_venues_updated_at ON public.venues;
CREATE TRIGGER trg_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ── 8. Backfill slugs for all existing rows ───────────────────

UPDATE public.venues
SET slug = public.generate_venue_slug(name, id)
WHERE slug IS NULL;
-- ── 9. Set published_at for existing published rows ───────────

UPDATE public.venues
SET published_at = created_at
WHERE status = 'published'
  AND published_at IS NULL;
-- ── 10. Column comments ───────────────────────────────────────

COMMENT ON COLUMN public.venues.slug             IS 'URL-safe unique slug — primary identifier for public routes (e.g. /venues/bliss-beach-club).';
COMMENT ON COLUMN public.venues.category_id      IS 'FK to venue_categories — canonical category assignment.';
COMMENT ON COLUMN public.venues.category_slug    IS 'Denormalised category slug for fast filter queries without join.';
COMMENT ON COLUMN public.venues.emirate_id       IS 'FK to emirates — geo-scoping for multi-emirate expansion.';
COMMENT ON COLUMN public.venues.booking_mode     IS 'Controls booking CTA: request | direct | whatsapp | external.';
COMMENT ON COLUMN public.venues.min_spend_aed    IS 'Minimum spend in AED — used in price tier display.';
COMMENT ON COLUMN public.venues.fts              IS 'Full-text search tsvector (generated, stored). Indexed for GIN similarity search.';
COMMENT ON COLUMN public.venues.view_count       IS 'Cumulative page view counter — updated by API route on each venue detail load.';
COMMENT ON COLUMN public.venues.published_at     IS 'When the venue was first made public — used for sorting by "new".';
