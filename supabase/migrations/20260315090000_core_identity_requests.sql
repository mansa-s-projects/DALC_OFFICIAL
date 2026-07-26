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
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  venue_id TEXT REFERENCES public.venues(id),
  venue_name TEXT,
  category TEXT NOT NULL,
  request_type TEXT DEFAULT 'booking',
  concierge_request_type TEXT,
  title TEXT,
  description TEXT,
  urgency TEXT,
  preferred_date DATE,
  preferred_time TIME,
  budget_range TEXT,
  special_instructions TEXT,
  date_time TIMESTAMPTZ,
  party_size INTEGER DEFAULT 2,
  status TEXT DEFAULT 'submitted',
  priority_score INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES public.profiles(id),
  contact_name TEXT,
  contact_info TEXT,
  notes TEXT,
  internal_notes TEXT,
  concierge_notes TEXT,
  supplier_response TEXT,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.request_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_area ON public.venues(area);
CREATE INDEX IF NOT EXISTS idx_requests_user ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON public.requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_log_request ON public.request_status_log(request_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_status_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Staff can view all profiles" ON public.profiles
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

CREATE POLICY "Anyone can view published venues" ON public.venues
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all venues" ON public.venues
  FOR ALL USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

CREATE POLICY "Users can view own requests" ON public.requests
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create requests" ON public.requests
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff can view all requests" ON public.requests
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );
CREATE POLICY "Staff can update requests" ON public.requests
  FOR UPDATE USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

CREATE POLICY "Admins can manage suppliers" ON public.suppliers
  FOR ALL USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
  );

CREATE POLICY "Users can view own request log" ON public.request_status_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.requests r
      WHERE r.id = request_id AND r.user_id = auth.uid()
    )
  );
CREATE POLICY "Staff can view request log" ON public.request_status_log
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'sales_manager', 'concierge')
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

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
