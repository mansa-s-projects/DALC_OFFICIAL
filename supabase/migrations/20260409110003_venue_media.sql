-- ============================================================
-- Migration: venue_media
-- Structured media table replacing gallery_images TEXT[] on venues.
-- Supports hero images, gallery, video, and cover art per venue.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.venue_media (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id     TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'image'
               CHECK (type IN ('image', 'video', 'thumbnail', 'cover')),
  alt_text     TEXT,
  caption      TEXT,
  is_hero      BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  width        INTEGER,
  height       INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist if table pre-dated this migration
ALTER TABLE public.venue_media
  ADD COLUMN IF NOT EXISTS type         TEXT NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS alt_text     TEXT,
  ADD COLUMN IF NOT EXISTS caption      TEXT,
  ADD COLUMN IF NOT EXISTS is_hero      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sort_order   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS width        INTEGER,
  ADD COLUMN IF NOT EXISTS height       INTEGER,
  ADD COLUMN IF NOT EXISTS created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW();

COMMENT ON TABLE  public.venue_media              IS 'Structured media assets per venue. Replaces the flat gallery_images TEXT[] column.';
COMMENT ON COLUMN public.venue_media.venue_id     IS 'FK to venues.id (TEXT). Cascades on venue delete.';
COMMENT ON COLUMN public.venue_media.url          IS 'Absolute URL or Supabase Storage path for the media asset.';
COMMENT ON COLUMN public.venue_media.type         IS 'Asset type: image | video | thumbnail | cover.';
COMMENT ON COLUMN public.venue_media.is_hero      IS 'True for the primary hero image — only one hero allowed per venue (enforced by partial unique index).';
COMMENT ON COLUMN public.venue_media.sort_order   IS 'Ascending display order within the gallery.';

-- One hero image per venue (partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_venue_media_one_hero
  ON public.venue_media (venue_id)
  WHERE is_hero = TRUE;

-- Fast lookup of all media for a venue
CREATE INDEX IF NOT EXISTS idx_venue_media_venue_id
  ON public.venue_media (venue_id, sort_order);

-- ── Backfill: hero images from venues.hero_image ─────────────

-- If venue_media.venue_id is still UUID, cast to TEXT to match venues.id (TEXT PK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'venue_media'
      AND column_name  = 'venue_id'
      AND udt_name     = 'uuid'
  ) THEN
    ALTER TABLE public.venue_media DROP CONSTRAINT IF EXISTS venue_media_venue_id_fkey;
    ALTER TABLE public.venue_media ALTER COLUMN venue_id TYPE TEXT;
    ALTER TABLE public.venue_media
      ADD CONSTRAINT venue_media_venue_id_fkey
        FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;
  END IF;
END
$$;

INSERT INTO public.venue_media (venue_id, url, type, is_hero, sort_order)
SELECT
  id        AS venue_id,
  hero_image AS url,
  'image'   AS type,
  TRUE      AS is_hero,
  0         AS sort_order
FROM public.venues
WHERE hero_image IS NOT NULL
  AND hero_image != ''
ON CONFLICT DO NOTHING;

-- ── Backfill: gallery images from venues.gallery_images ──────

INSERT INTO public.venue_media (venue_id, url, type, is_hero, sort_order)
SELECT
  v.id      AS venue_id,
  img       AS url,
  'image'   AS type,
  FALSE     AS is_hero,
  ROW_NUMBER() OVER (PARTITION BY v.id ORDER BY idx)::INTEGER AS sort_order
FROM public.venues v,
     UNNEST(v.gallery_images) WITH ORDINALITY AS t(img, idx)
WHERE v.gallery_images IS NOT NULL
  AND ARRAY_LENGTH(v.gallery_images, 1) > 0
ON CONFLICT DO NOTHING;

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE public.venue_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venue_media_public_read"
  ON public.venue_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_media.venue_id
        AND status = 'published'
    )
  );

CREATE POLICY "venue_media_admin_write"
  ON public.venue_media FOR ALL
  USING (auth.role() = 'service_role');
