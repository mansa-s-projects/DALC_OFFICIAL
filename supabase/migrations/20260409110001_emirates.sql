-- ============================================================
-- Migration: emirates
-- Creates the emirates lookup table and seeds UAE emirate data
-- ============================================================

CREATE TABLE IF NOT EXISTS public.emirates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  name_ar      TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist if table pre-dated this migration
ALTER TABLE public.emirates
  ADD COLUMN IF NOT EXISTS name_ar     TEXT,
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sort_order  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW();

COMMENT ON TABLE  public.emirates        IS 'UAE emirates lookup — used as FK in venues for geo-scoping.';
COMMENT ON COLUMN public.emirates.slug   IS 'URL-safe slug used in routes and filters (e.g. dubai, abu-dhabi).';
COMMENT ON COLUMN public.emirates.name_ar IS 'Arabic name for localisation support.';

-- Seed UAE emirates
INSERT INTO public.emirates (slug, name, name_ar, sort_order) VALUES
  ('dubai',           'Dubai',            'دبي',          1),
  ('abu-dhabi',       'Abu Dhabi',        'أبوظبي',       2),
  ('sharjah',         'Sharjah',          'الشارقة',      3),
  ('ras-al-khaimah',  'Ras Al Khaimah',   'رأس الخيمة',   4),
  ('ajman',           'Ajman',            'عجمان',        5),
  ('fujairah',        'Fujairah',         'الفجيرة',      6),
  ('umm-al-quwain',   'Umm Al Quwain',    'أم القيوين',   7)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE public.emirates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "emirates_public_read"
  ON public.emirates FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "emirates_admin_write"
  ON public.emirates FOR ALL
  USING (auth.role() = 'service_role');
