-- ==========================================
-- EXPLORE LOCATIONS SCHEMA
-- Comprehensive UAE discovery locations system
-- ==========================================

-- ==========================================
-- EXPLORE_LOCATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.explore_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  emirate TEXT DEFAULT 'Dubai',
  area TEXT,
  category TEXT DEFAULT 'Landmark',
  subcategory TEXT,
  is_hidden_gem BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  vibe TEXT,
  price_tier INTEGER DEFAULT 2 CHECK (price_tier BETWEEN 1 AND 4),
  opening_hours TEXT,
  best_time TEXT,
  insider_tip TEXT,
  booking_url TEXT,
  google_maps_place_id TEXT,
  source_venue_id TEXT,
  recommend_score INTEGER DEFAULT 85,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- ==========================================
-- INDEXES
-- ==========================================

-- Ensure all columns exist in case table pre-existed without them
ALTER TABLE public.explore_locations
  ADD COLUMN IF NOT EXISTS emirate              TEXT DEFAULT 'Dubai',
  ADD COLUMN IF NOT EXISTS area                 TEXT,
  ADD COLUMN IF NOT EXISTS category             TEXT DEFAULT 'Landmark',
  ADD COLUMN IF NOT EXISTS subcategory          TEXT,
  ADD COLUMN IF NOT EXISTS is_hidden_gem        BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured          BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS hero_image           TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images       TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags                 TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS vibe                 TEXT,
  ADD COLUMN IF NOT EXISTS price_tier           INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS opening_hours        TEXT,
  ADD COLUMN IF NOT EXISTS best_time            TEXT,
  ADD COLUMN IF NOT EXISTS insider_tip          TEXT,
  ADD COLUMN IF NOT EXISTS booking_url          TEXT,
  ADD COLUMN IF NOT EXISTS google_maps_place_id TEXT,
  ADD COLUMN IF NOT EXISTS source_venue_id      TEXT,
  ADD COLUMN IF NOT EXISTS recommend_score      INTEGER DEFAULT 85,
  ADD COLUMN IF NOT EXISTS view_count           INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_explore_locations_emirate ON public.explore_locations(emirate);
CREATE INDEX IF NOT EXISTS idx_explore_locations_category ON public.explore_locations(category);
CREATE INDEX IF NOT EXISTS idx_explore_locations_hidden_gem ON public.explore_locations(is_hidden_gem);
CREATE INDEX IF NOT EXISTS idx_explore_locations_featured ON public.explore_locations(is_featured);
CREATE INDEX IF NOT EXISTS idx_explore_locations_coords ON public.explore_locations(latitude, longitude);
-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.explore_locations ENABLE ROW LEVEL SECURITY;
-- Public read access for all locations
DROP POLICY IF EXISTS "Anyone can view explore locations" ON public.explore_locations;
CREATE POLICY "Anyone can view explore locations" ON public.explore_locations
  FOR SELECT USING (true);
-- Admin-only write access
DROP POLICY IF EXISTS "Admins can manage explore locations" ON public.explore_locations;
CREATE POLICY "Admins can manage explore locations" ON public.explore_locations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
-- ==========================================
-- TRIGGERS
-- ==========================================
DROP TRIGGER IF EXISTS explore_locations_updated_at ON public.explore_locations;
CREATE TRIGGER explore_locations_updated_at 
  BEFORE UPDATE ON public.explore_locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
