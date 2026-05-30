-- ============================================================
-- Stays Vertical Schema
-- Hotels, Villas, Residences booking system
-- ============================================================

-- Stays Properties Table
CREATE TABLE IF NOT EXISTS public.stays_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorization
  subcategory TEXT NOT NULL CHECK (subcategory IN ('hotels', 'villas', 'residences')),
  sub_subcategory TEXT,
  
  -- Core Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_short TEXT,
  description_long TEXT,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  
  -- Property Details
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,
  area_sqft INTEGER,
  amenities TEXT[] DEFAULT '{}',
  
  -- Location
  location TEXT DEFAULT 'Dubai',
  area TEXT NOT NULL,
  district TEXT,
  address TEXT,
  coordinates JSONB,
  
  -- Pricing
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('nightly', 'monthly', 'yearly', 'flexible')),
  price_nightly NUMERIC(10,2),
  price_monthly NUMERIC(10,2),
  price_yearly NUMERIC(10,2),
  price_currency TEXT DEFAULT 'AED',
  price_display TEXT,
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount NUMERIC(10,2),
  
  -- Seasonal pricing
  seasonal_pricing JSONB DEFAULT '[]',
  -- [ { season: "peak", start: "2024-12-15", end: "2025-01-15", multiplier: 1.5 } ]
  
  -- Availability
  availability_type TEXT DEFAULT 'calendar' CHECK (availability_type IN ('calendar', 'always', 'by_request')),
  min_stay_nights INTEGER DEFAULT 1,
  max_stay_nights INTEGER,
  check_in_time TEXT DEFAULT '15:00',
  check_out_time TEXT DEFAULT '11:00',
  
  -- Supplier
  supplier_id UUID REFERENCES public.suppliers(id),
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Admin
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  rating NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Stays Availability Table (per-date availability and pricing)
CREATE TABLE IF NOT EXISTS public.stays_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.stays_properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price_override NUMERIC(10,2), -- per-night price override
  notes TEXT,
  UNIQUE(property_id, date)
);
-- Stays Bookings Table
CREATE TABLE IF NOT EXISTS public.stays_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.stays_properties(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Booking details
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  
  -- Pricing
  nightly_rate NUMERIC(10,2),
  total_nights INTEGER,
  subtotal NUMERIC(10,2),
  deposit_paid NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2),
  currency TEXT DEFAULT 'AED',
  
  -- Optional relocation link
  relocation_profile_id UUID,
  booking_type TEXT DEFAULT 'short_term' CHECK (booking_type IN ('short_term', 'long_term', 'relocation')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_stays_properties_subcategory ON public.stays_properties(subcategory);
CREATE INDEX IF NOT EXISTS idx_stays_properties_area ON public.stays_properties(area);
CREATE INDEX IF NOT EXISTS idx_stays_properties_slug ON public.stays_properties(slug);
CREATE INDEX IF NOT EXISTS idx_stays_properties_status ON public.stays_properties(status);
CREATE INDEX IF NOT EXISTS idx_stays_availability_property_date ON public.stays_availability(property_id, date);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_property ON public.stays_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_user ON public.stays_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_dates ON public.stays_bookings(check_in, check_out);
-- RLS Policies
ALTER TABLE public.stays_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published stays" ON public.stays_properties
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage stays" ON public.stays_properties FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view availability" ON public.stays_availability
  FOR SELECT USING (true);
CREATE POLICY "Admins manage availability" ON public.stays_availability FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users view own bookings" ON public.stays_bookings FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users create bookings" ON public.stays_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff manage bookings" ON public.stays_bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge')));
-- Updated at trigger
CREATE OR REPLACE FUNCTION update_stays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS stays_properties_updated_at ON public.stays_properties;
CREATE TRIGGER stays_properties_updated_at
  BEFORE UPDATE ON public.stays_properties
  FOR EACH ROW EXECUTE FUNCTION update_stays_updated_at();
DROP TRIGGER IF EXISTS stays_bookings_updated_at ON public.stays_bookings;
CREATE TRIGGER stays_bookings_updated_at
  BEFORE UPDATE ON public.stays_bookings
  FOR EACH ROW EXECUTE FUNCTION update_stays_updated_at();
