-- Recovery migration for DALC missing production tables
-- This file adds the missing tables and policies required by the current app.

-- Leads + events + AI intent tracking
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source_page TEXT,
  source_section TEXT,
  cta_label TEXT,
  service_slug TEXT,
  destination TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  idempotency_key TEXT UNIQUE,
  lead_temperature TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_session_id ON public.leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_idempotency_key ON public.leads(idempotency_key);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_event_id TEXT UNIQUE,
  event_name TEXT NOT NULL,
  page TEXT,
  section TEXT,
  cta_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON public.events(event_name);

CREATE TABLE IF NOT EXISTS public.intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  user_input TEXT NOT NULL,
  intent_type TEXT,
  complexity_score INTEGER,
  decision TEXT,
  raw_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intents_user_id ON public.intents(user_id);
CREATE INDEX IF NOT EXISTS idx_intents_intent_type ON public.intents(intent_type);

-- Explore / SEO lookup tables
CREATE TABLE IF NOT EXISTS public.emirates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.venue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.explore_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  emirate TEXT,
  area TEXT,
  category TEXT,
  subcategory TEXT,
  is_hidden_gem BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  vibe TEXT,
  price_tier INTEGER DEFAULT 3,
  opening_hours TEXT,
  best_time TEXT,
  insider_tip TEXT,
  source_venue_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_explore_locations_emirate ON public.explore_locations(emirate);
CREATE INDEX IF NOT EXISTS idx_explore_locations_category ON public.explore_locations(category);
CREATE INDEX IF NOT EXISTS idx_explore_locations_is_featured ON public.explore_locations(is_featured);

-- Transport catalog + bookings
CREATE TABLE IF NOT EXISTS public.transport_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT DEFAULT 'transport',
  subcategory TEXT NOT NULL,
  sub_subcategory TEXT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_short TEXT,
  description_long TEXT,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  pricing_model TEXT,
  price_from NUMERIC DEFAULT 0,
  price_currency TEXT DEFAULT 'AED',
  price_display TEXT,
  availability_type TEXT,
  available_days TEXT[] DEFAULT '{}',
  max_capacity INTEGER,
  min_booking_hours INTEGER DEFAULT 0,
  advance_booking_hours INTEGER DEFAULT 0,
  specifications JSONB DEFAULT '{}'::jsonb,
  location TEXT,
  area TEXT,
  pickup_locations TEXT[] DEFAULT '{}',
  coordinates JSONB,
  supplier_id UUID REFERENCES public.suppliers(id),
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transport_services_subcategory ON public.transport_services(subcategory);
CREATE INDEX IF NOT EXISTS idx_transport_services_status ON public.transport_services(status);
CREATE INDEX IF NOT EXISTS idx_transport_services_featured ON public.transport_services(is_featured);

CREATE TABLE IF NOT EXISTS public.transport_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id),
  service_id UUID REFERENCES public.transport_services(id),
  user_id UUID REFERENCES public.profiles(id),
  pickup_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  pickup_location TEXT,
  dropoff_location TEXT,
  duration_hours INTEGER,
  relocation_profile_id UUID,
  workflow_step_id UUID,
  quoted_price NUMERIC,
  final_price NUMERIC,
  currency TEXT DEFAULT 'AED',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transport_bookings_service_id ON public.transport_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_user_id ON public.transport_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_status ON public.transport_bookings(status);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_pickup_date ON public.transport_bookings(pickup_date);

-- Hotel & stays booking tables
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  booking_type TEXT,
  status TEXT DEFAULT 'pending',
  hotel_id TEXT,
  hotel_name TEXT,
  room_type TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  total_price NUMERIC,
  currency TEXT DEFAULT 'AED',
  guest_first_name TEXT,
  guest_last_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id),
  amount_aed NUMERIC,
  status TEXT DEFAULT 'sent',
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id),
  quote_id UUID REFERENCES public.quotes(id),
  amount_aed NUMERIC,
  payment_type TEXT,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_request_id ON public.payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_quote_id ON public.payments(quote_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE TABLE IF NOT EXISTS public.stays_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  description_short TEXT,
  description_long TEXT,
  location TEXT,
  area TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  base_price NUMERIC,
  price_currency TEXT DEFAULT 'AED',
  cleaning_fee NUMERIC DEFAULT 0,
  service_fee NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  furnished BOOLEAN DEFAULT false,
  beachfront BOOLEAN DEFAULT false,
  private_pool BOOLEAN DEFAULT false,
  instant_booking BOOLEAN DEFAULT false,
  star_rating INTEGER,
  seasonal_pricing JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stays_properties_slug ON public.stays_properties(slug);
CREATE INDEX IF NOT EXISTS idx_stays_properties_status ON public.stays_properties(status);
CREATE INDEX IF NOT EXISTS idx_stays_properties_featured ON public.stays_properties(is_featured);

CREATE TABLE IF NOT EXISTS public.stays_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.stays_properties(id),
  date DATE,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stays_availability_property_id ON public.stays_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_stays_availability_date ON public.stays_availability(date);

CREATE TABLE IF NOT EXISTS public.stays_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.stays_properties(id),
  user_id UUID REFERENCES public.profiles(id),
  check_in DATE,
  check_out DATE,
  guests INTEGER DEFAULT 1,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  special_requests TEXT,
  nights INTEGER,
  base_price_total NUMERIC,
  seasonal_adjustment NUMERIC,
  cleaning_fee NUMERIC,
  service_fee NUMERIC,
  security_deposit NUMERIC,
  discount_amount NUMERIC,
  total_price NUMERIC,
  currency TEXT DEFAULT 'AED',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stays_bookings_property_id ON public.stays_bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_user_id ON public.stays_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_stays_bookings_status ON public.stays_bookings(status);

-- Enable RLS on new tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emirates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays_bookings ENABLE ROW LEVEL SECURITY;

-- Public read policies for published and active editorial tables
CREATE POLICY "Public can view active emirates" ON public.emirates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active venue categories" ON public.venue_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view explore locations" ON public.explore_locations
  FOR SELECT USING (true);

CREATE POLICY "Public can view published transport services" ON public.transport_services
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published stays properties" ON public.stays_properties
  FOR SELECT USING (status = 'published');

-- User and staff access policies for bookings and requests
CREATE POLICY "Users can view own transport bookings" ON public.transport_bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all transport bookings" ON public.transport_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

CREATE POLICY "Users can view own stays bookings" ON public.stays_bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all stays bookings" ON public.stays_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.requests WHERE id = request_id));
CREATE POLICY "Staff can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.requests WHERE id = request_id));
CREATE POLICY "Staff can view all quotes" ON public.quotes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

-- Insert-only policies for server-only tables (service role bypasses RLS)
CREATE POLICY "Server can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Server can insert events" ON public.events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Server can insert intents" ON public.intents
  FOR INSERT WITH CHECK (true);

-- Admin policies for management tables
CREATE POLICY "Admins can manage transport services" ON public.transport_services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage stays properties" ON public.stays_properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage explore locations" ON public.explore_locations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage emirates" ON public.emirates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage venue categories" ON public.venue_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
