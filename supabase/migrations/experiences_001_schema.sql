-- ============================================================
-- Experiences Vertical Schema
-- Nightlife, Adventure, Dining, Water, Sky, Wellness, Culture
-- ============================================================

-- Experience Services Table
CREATE TABLE IF NOT EXISTS public.experience_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Categorization
  subcategory TEXT NOT NULL CHECK (subcategory IN (
    'nightlife', 'adventure', 'dining', 'water', 'sky', 'wellness', 'culture'
  )),
  sub_subcategory TEXT,
  
  -- Core Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_short TEXT,
  description_long TEXT,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  vibe_tags TEXT[] DEFAULT '{}',
  
  -- Service Type
  service_type TEXT NOT NULL CHECK (service_type IN ('event', 'recurring', 'on_demand', 'seasonal')),
  
  -- Pricing
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person', 'per_group', 'fixed', 'tiered', 'free')),
  price_from NUMERIC(10,2),
  price_currency TEXT DEFAULT 'AED',
  price_display TEXT,
  pricing_tiers JSONB DEFAULT '[]',
  -- [ { tier: "Standard", price: 350 }, { tier: "VIP", price: 750 }, { tier: "Ultra VIP", price: 1500 } ]
  
  -- Capacity & Availability
  max_capacity INTEGER,
  current_bookings INTEGER DEFAULT 0,
  availability_type TEXT DEFAULT 'time_slot' CHECK (availability_type IN ('time_slot', 'date_based', 'always', 'by_request')),
  
  -- Time Slots (for recurring/scheduled)
  time_slots JSONB DEFAULT '[]',
  -- [ { day: "Friday", start: "21:00", end: "03:00", capacity: 200 } ]
  
  -- Event-specific (for one-time events)
  event_date TIMESTAMPTZ,
  event_end_date TIMESTAMPTZ,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  
  -- Duration
  duration_minutes INTEGER,
  
  -- Location
  location TEXT DEFAULT 'Dubai',
  area TEXT,
  venue_name TEXT,
  coordinates JSONB,
  
  -- Requirements
  age_minimum INTEGER,
  dress_code TEXT,
  requirements TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',   -- "Includes: pickup, equipment, instructor"
  excluded TEXT[] DEFAULT '{}',   -- "Excludes: food, photos"
  
  -- Supplier
  supplier_id UUID REFERENCES public.suppliers(id),
  
  -- Trending & Featured
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  trending_score INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Admin
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'sold_out')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experience Bookings Table
CREATE TABLE IF NOT EXISTS public.experience_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.experience_services(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Booking details
  booking_date DATE NOT NULL,
  time_slot TEXT,
  party_size INTEGER DEFAULT 1,
  tier TEXT DEFAULT 'Standard',
  
  -- Pricing
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  currency TEXT DEFAULT 'AED',
  
  -- Tickets
  ticket_code TEXT UNIQUE,
  ticket_status TEXT DEFAULT 'active' CHECK (ticket_status IN ('active', 'used', 'expired', 'refunded')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exp_services_subcategory ON public.experience_services(subcategory);
CREATE INDEX IF NOT EXISTS idx_exp_services_type ON public.experience_services(service_type);
CREATE INDEX IF NOT EXISTS idx_exp_services_slug ON public.experience_services(slug);
CREATE INDEX IF NOT EXISTS idx_exp_services_status ON public.experience_services(status);
CREATE INDEX IF NOT EXISTS idx_exp_services_trending ON public.experience_services(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_exp_services_featured ON public.experience_services(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_exp_services_event_date ON public.experience_services(event_date) WHERE event_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_exp_bookings_service ON public.experience_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_exp_bookings_user ON public.experience_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_exp_bookings_date ON public.experience_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_exp_bookings_ticket ON public.experience_bookings(ticket_code);

-- RLS Policies
ALTER TABLE public.experience_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published experiences" ON public.experience_services
  FOR SELECT USING (status IN ('published', 'sold_out'));

CREATE POLICY "Admins manage experiences" ON public.experience_services FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users view own experience bookings" ON public.experience_bookings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users create experience bookings" ON public.experience_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff manage experience bookings" ON public.experience_bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge')));

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS experience_services_updated_at ON public.experience_services;
CREATE TRIGGER experience_services_updated_at
  BEFORE UPDATE ON public.experience_services
  FOR EACH ROW EXECUTE FUNCTION update_experiences_updated_at();

DROP TRIGGER IF EXISTS experience_bookings_updated_at ON public.experience_bookings;
CREATE TRIGGER experience_bookings_updated_at
  BEFORE UPDATE ON public.experience_bookings
  FOR EACH ROW EXECUTE FUNCTION update_experiences_updated_at();

-- Function to generate unique ticket code
CREATE OR REPLACE FUNCTION generate_experience_ticket_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8 character code
    code := 'DALC-' || upper(substring(md5(random()::text) from 1 for 4)) || '-' || upper(substring(md5(random()::text) from 1 for 4));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.experience_bookings WHERE ticket_code = code) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;
