-- ============================================================
-- Activities System — Full Schema
-- Tables: activity_categories, vendors, activities,
--         activity_images, activity_pricing,
--         activity_availability, activity_bookings
-- ============================================================

-- 1. ACTIVITY CATEGORIES (self-referencing tree)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  hero_image TEXT,
  sort_order INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.activity_categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_categories_parent ON public.activity_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_activity_categories_sort ON public.activity_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_categories_active ON public.activity_categories(is_active);

ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON public.activity_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage categories"
  ON public.activity_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 2. VENDORS (activity-specific supplier)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  address TEXT,
  emirate TEXT DEFAULT 'Dubai',
  coordinates JSONB,
  license_number TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  operating_hours JSONB,
  rating NUMERIC(3,2),
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'onboarding')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_emirate ON public.vendors(emirate);
CREATE INDEX IF NOT EXISTS idx_vendors_categories ON public.vendors USING GIN(categories);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vendors"
  ON public.vendors FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins manage vendors"
  ON public.vendors FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 3. ACTIVITIES (core table)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  category_id UUID NOT NULL REFERENCES public.activity_categories(id),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description_short TEXT,
  description_long TEXT,
  highlights TEXT[] DEFAULT '{}',
  vibe_tags TEXT[] DEFAULT '{}',
  service_type TEXT NOT NULL CHECK (service_type IN ('event', 'recurring', 'on_demand', 'seasonal')),
  duration_minutes INTEGER,
  max_capacity INTEGER,
  location TEXT DEFAULT 'Dubai',
  area TEXT,
  venue_name TEXT,
  coordinates JSONB,
  age_minimum INTEGER,
  dress_code TEXT,
  requirements TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  trending_score INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'sold_out')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_vendor ON public.activities(vendor_id);
CREATE INDEX IF NOT EXISTS idx_activities_slug ON public.activities(slug);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_service_type ON public.activities(service_type);
CREATE INDEX IF NOT EXISTS idx_activities_area ON public.activities(area);
CREATE INDEX IF NOT EXISTS idx_activities_trending ON public.activities(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_activities_featured ON public.activities(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_activities_vibe_tags ON public.activities USING GIN(vibe_tags);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published activities"
  ON public.activities FOR SELECT
  USING (status IN ('published', 'sold_out'));

CREATE POLICY "Admins manage activities"
  ON public.activities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 4. ACTIVITY IMAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  type TEXT DEFAULT 'gallery' CHECK (type IN ('hero', 'gallery', 'thumbnail')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_images_activity ON public.activity_images(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_images_type ON public.activity_images(activity_id, type);
CREATE INDEX IF NOT EXISTS idx_activity_images_sort ON public.activity_images(activity_id, sort_order);

ALTER TABLE public.activity_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activity images"
  ON public.activity_images FOR SELECT
  USING (true);

CREATE POLICY "Admins manage activity images"
  ON public.activity_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 5. ACTIVITY PRICING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  tier_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_person', 'per_group', 'fixed', 'flat_rate')),
  max_guests INTEGER,
  includes TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_pricing_activity ON public.activity_pricing(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_pricing_active ON public.activity_pricing(activity_id, is_active);
CREATE INDEX IF NOT EXISTS idx_activity_pricing_sort ON public.activity_pricing(activity_id, sort_order);

ALTER TABLE public.activity_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing"
  ON public.activity_pricing FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage pricing"
  ON public.activity_pricing FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 6. ACTIVITY AVAILABILITY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  availability_type TEXT NOT NULL CHECK (availability_type IN ('recurring', 'specific_date', 'always', 'by_request')),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  specific_date DATE,
  start_time TIME,
  end_time TIME,
  capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_avail_activity ON public.activity_availability(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_avail_day ON public.activity_availability(activity_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_activity_avail_date ON public.activity_availability(activity_id, specific_date);
CREATE INDEX IF NOT EXISTS idx_activity_avail_active ON public.activity_availability(is_active);
CREATE INDEX IF NOT EXISTS idx_activity_avail_season ON public.activity_availability(valid_from, valid_until);

ALTER TABLE public.activity_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active availability"
  ON public.activity_availability FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage availability"
  ON public.activity_availability FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 7. ACTIVITY BOOKINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activity_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id),
  pricing_id UUID NOT NULL REFERENCES public.activity_pricing(id),
  availability_id UUID REFERENCES public.activity_availability(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  booking_date DATE NOT NULL,
  time_slot TEXT,
  party_size INTEGER DEFAULT 1 CHECK (party_size > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  ticket_code TEXT UNIQUE,
  ticket_status TEXT DEFAULT 'active' CHECK (ticket_status IN ('active', 'used', 'expired', 'refunded')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'refund_requested')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'failed')),
  payment_id TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_bookings_activity ON public.activity_bookings(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_user ON public.activity_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_date ON public.activity_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_capacity ON public.activity_bookings(activity_id, booking_date, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_activity_bookings_ticket ON public.activity_bookings(ticket_code);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_status ON public.activity_bookings(status);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_payment ON public.activity_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_activity_bookings_created ON public.activity_bookings(created_at DESC);

ALTER TABLE public.activity_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bookings"
  ON public.activity_bookings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users create own bookings"
  ON public.activity_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own bookings"
  ON public.activity_bookings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff manage all bookings"
  ON public.activity_bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge')));


-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_categories_updated_at
  BEFORE UPDATE ON public.activity_categories
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();

CREATE TRIGGER vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();

CREATE TRIGGER activity_pricing_updated_at
  BEFORE UPDATE ON public.activity_pricing
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();

CREATE TRIGGER activity_availability_updated_at
  BEFORE UPDATE ON public.activity_availability
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();

CREATE TRIGGER activity_bookings_updated_at
  BEFORE UPDATE ON public.activity_bookings
  FOR EACH ROW EXECUTE FUNCTION update_activities_updated_at();


-- ============================================================
-- FUNCTION: generate ticket code
-- ============================================================

CREATE OR REPLACE FUNCTION generate_activity_ticket_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := 'DALC-';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
      IF i = 4 THEN code := code || '-'; END IF;
    END LOOP;

    SELECT EXISTS(SELECT 1 FROM public.activity_bookings WHERE ticket_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TRIGGER: auto-generate ticket code on booking insert
-- ============================================================

CREATE OR REPLACE FUNCTION set_activity_booking_ticket()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_code IS NULL THEN
    NEW.ticket_code := generate_activity_ticket_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_booking_ticket_code
  BEFORE INSERT ON public.activity_bookings
  FOR EACH ROW EXECUTE FUNCTION set_activity_booking_ticket();
