-- ==========================================
-- DALC Database Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- ==========================================
-- PROFILES (extends Supabase auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  relocation_stage TEXT DEFAULT 'EXPLORING',
  tier TEXT DEFAULT 'standard',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- SUPPLIERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  categories TEXT[] DEFAULT '{}',
  commission_rate NUMERIC(5,2) DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- VENUES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT 'Curated Venue',
  location TEXT DEFAULT 'Dubai',
  area TEXT DEFAULT 'Dubai',
  vibe_tags TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  price_tier INTEGER DEFAULT 2 CHECK (price_tier BETWEEN 1 AND 4),
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  description_short TEXT,
  description_long TEXT,
  highlights TEXT[] DEFAULT '{}',
  recommend_score INTEGER DEFAULT 85,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  trending_score INTEGER DEFAULT 0,
  opening_hours TEXT,
  dress_code TEXT,
  booking_policy TEXT,
  cuisine TEXT,
  best_time TEXT,
  who_its_for TEXT,
  insider_tip TEXT,
  coordinates JSONB,
  supplier_id UUID REFERENCES public.suppliers(id),
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- REQUESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  venue_id TEXT REFERENCES public.venues(id),
  venue_name TEXT,
  category TEXT NOT NULL,
  request_type TEXT DEFAULT 'booking',
  date_time TIMESTAMPTZ,
  party_size INTEGER DEFAULT 2,
  status TEXT DEFAULT 'submitted',
  priority_score INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES public.profiles(id),
  contact_name TEXT,
  contact_info TEXT,
  notes TEXT,
  internal_notes TEXT,
  supplier_response TEXT,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- REQUEST STATUS LOG
-- ==========================================
CREATE TABLE IF NOT EXISTS public.request_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_area ON public.venues(area);
CREATE INDEX IF NOT EXISTS idx_requests_user ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON public.requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_log_request ON public.request_status_log(request_id);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_status_log ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Staff can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

-- Venues: public read for published, admin full access
CREATE POLICY "Anyone can view published venues" ON public.venues
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all venues" ON public.venues
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Requests
CREATE POLICY "Users can view own requests" ON public.requests
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view all requests" ON public.requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );
CREATE POLICY "Staff can update requests" ON public.requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );

-- Suppliers: admin only
CREATE POLICY "Admins can manage suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Request log
CREATE POLICY "Staff can view request log" ON public.request_status_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'concierge'))
  );
CREATE POLICY "System can insert request log" ON public.request_status_log
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS venues_updated_at ON public.venues;
CREATE TRIGGER venues_updated_at BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS requests_updated_at ON public.requests;
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS suppliers_updated_at ON public.suppliers;
CREATE TRIGGER suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-log request status changes
CREATE OR REPLACE FUNCTION public.log_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.request_status_log (request_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS request_status_change ON public.requests;
CREATE TRIGGER request_status_change
  AFTER UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.log_request_status_change();
