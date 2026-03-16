-- ==========================================
-- DALC Core Taxonomy + Booking Graph
-- SECTION 7 alignment
-- ==========================================

-- Users compatibility layer (main app table remains profiles).
-- This view provides a canonical `users` surface for BI/integrations.
CREATE OR REPLACE VIEW public.users AS
SELECT
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  p.role,
  p.created_at,
  p.updated_at
FROM public.profiles p;

-- ==========================================
-- TAXONOMY TABLES
-- category -> subcategory -> service
-- ==========================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (category_id, slug)
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (subcategory_id, slug)
);

-- ==========================================
-- EXPERIENCE + BOOKING TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  venue_id TEXT REFERENCES public.venues(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  venue_id TEXT REFERENCES public.venues(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  amount NUMERIC(12,2),
  currency TEXT DEFAULT 'AED',
  booking_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- If a legacy `bookings` table already exists, backfill missing core columns.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS request_id UUID,
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS venue_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS booking_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ==========================================
-- RELATIONSHIP WIRES ON EXISTING TABLES
-- service -> venue, user -> request already exists via profiles
-- request -> booking via bookings.request_id
-- ==========================================

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_services_subcategory_id ON public.services(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_experiences_service_id ON public.experiences(service_id);
CREATE INDEX IF NOT EXISTS idx_experiences_venue_id ON public.experiences(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_request_id ON public.bookings(request_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_venues_service_id ON public.venues(service_id);
CREATE INDEX IF NOT EXISTS idx_requests_service_id ON public.requests(service_id);

-- ==========================================
-- RLS
-- ==========================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can manage bookings" ON public.bookings;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Anyone can view subcategories" ON public.subcategories
  FOR SELECT USING (true);
CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);
CREATE POLICY "Anyone can view experiences" ON public.experiences
  FOR SELECT USING (true);

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Staff can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

CREATE POLICY "Staff can manage bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

-- ==========================================
-- UPDATED_AT TRIGGERS
-- ==========================================

DROP TRIGGER IF EXISTS categories_updated_at ON public.categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS subcategories_updated_at ON public.subcategories;
CREATE TRIGGER subcategories_updated_at BEFORE UPDATE ON public.subcategories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS experiences_updated_at ON public.experiences;
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
