-- ============================================================
-- Transport Vertical Schema
-- Cars, Yachts, Jets booking system
-- ============================================================

-- Transport Services Table
CREATE TABLE IF NOT EXISTS public.transport_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorization
  category TEXT NOT NULL DEFAULT 'transport',
  subcategory TEXT NOT NULL CHECK (subcategory IN ('cars', 'yachts', 'jets')),
  sub_subcategory TEXT, -- e.g., 'luxury-sedans', 'day-cruises'
  
  -- Core Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_short TEXT,
  description_long TEXT,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  
  -- Pricing
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('hourly', 'daily', 'fixed', 'per_trip', 'custom')),
  price_from NUMERIC(10,2),
  price_currency TEXT DEFAULT 'AED',
  price_display TEXT, -- e.g., "From AED 2,500/day"
  
  -- Availability
  availability_type TEXT DEFAULT 'on_demand' CHECK (availability_type IN ('on_demand', 'scheduled', 'seasonal', 'by_request')),
  available_days TEXT[] DEFAULT '{Mon,Tue,Wed,Thu,Fri,Sat,Sun}',
  max_capacity INTEGER,
  min_booking_hours INTEGER DEFAULT 1,
  advance_booking_hours INTEGER DEFAULT 24,
  
  -- Specs (flexible JSONB for vehicle/vessel/aircraft specs)
  specifications JSONB DEFAULT '{}',
  -- Cars: { make, model, year, seats, transmission, fuel }
  -- Yachts: { length_ft, cabins, crew_size, max_guests }
  -- Jets: { aircraft_type, range_km, seats, luggage_capacity }
  
  -- Location
  location TEXT DEFAULT 'Dubai',
  area TEXT,
  pickup_locations TEXT[] DEFAULT '{}',
  coordinates JSONB,
  
  -- Supplier link
  supplier_id UUID REFERENCES public.suppliers(id),
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Admin
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Transport Bookings Table
CREATE TABLE IF NOT EXISTS public.transport_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.transport_services(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Booking details
  pickup_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  pickup_location TEXT,
  dropoff_location TEXT,
  
  -- Optional links
  relocation_profile_id UUID REFERENCES public.relocation_profiles(id),
  workflow_step_id UUID,
  
  -- Pricing
  quoted_price NUMERIC(10,2),
  final_price NUMERIC(10,2),
  currency TEXT DEFAULT 'AED',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_transport_services_category ON public.transport_services(subcategory);
CREATE INDEX IF NOT EXISTS idx_transport_services_sub_sub ON public.transport_services(sub_subcategory);
CREATE INDEX IF NOT EXISTS idx_transport_services_slug ON public.transport_services(slug);
CREATE INDEX IF NOT EXISTS idx_transport_services_status ON public.transport_services(status);
CREATE INDEX IF NOT EXISTS idx_transport_services_featured ON public.transport_services(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_transport_bookings_service ON public.transport_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_user ON public.transport_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_request ON public.transport_bookings(request_id);
-- RLS Policies
ALTER TABLE public.transport_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published transport services"
  ON public.transport_services FOR SELECT
  USING (status = 'published');
CREATE POLICY "Admins manage transport services"
  ON public.transport_services FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users view own transport bookings"
  ON public.transport_bookings FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users create transport bookings"
  ON public.transport_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff manage transport bookings"
  ON public.transport_bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge')));
-- Updated at trigger
CREATE OR REPLACE FUNCTION update_transport_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS transport_services_updated_at ON public.transport_services;
CREATE TRIGGER transport_services_updated_at
  BEFORE UPDATE ON public.transport_services
  FOR EACH ROW EXECUTE FUNCTION update_transport_updated_at();
DROP TRIGGER IF EXISTS transport_bookings_updated_at ON public.transport_bookings;
CREATE TRIGGER transport_bookings_updated_at
  BEFORE UPDATE ON public.transport_bookings
  FOR EACH ROW EXECUTE FUNCTION update_transport_updated_at();
