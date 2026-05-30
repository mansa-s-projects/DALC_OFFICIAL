-- Business Services
CREATE TABLE IF NOT EXISTS public.business_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory TEXT NOT NULL CHECK (subcategory IN ('company-formation','licensing','banking','tax','residency-investment')),
  sub_subcategory TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_short TEXT,
  description_long TEXT,
  hero_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  service_type TEXT NOT NULL CHECK (service_type IN ('package','consultation','advisory','filing')),
  duration_description TEXT,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('fixed','starting_from','custom_quote','hourly')),
  price_from NUMERIC(10,2),
  price_currency TEXT DEFAULT 'AED',
  price_display TEXT,
  required_documents TEXT[] DEFAULT '{}',
  eligibility_criteria TEXT[] DEFAULT '{}',
  government_fees NUMERIC(10,2) DEFAULT 0,
  government_authority TEXT,
  compliance_checklist JSONB DEFAULT '[]',
  estimated_steps INTEGER DEFAULT 1,
  workflow_template JSONB DEFAULT '[]',
  location TEXT DEFAULT 'Dubai',
  freezone TEXT,
  supplier_id UUID,
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.business_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  service_id UUID NOT NULL REFERENCES public.business_services(id),
  user_id UUID NOT NULL,
  consultation_type TEXT DEFAULT 'initial' CHECK (consultation_type IN ('initial','follow_up','document_review','signing')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_type TEXT DEFAULT 'online' CHECK (meeting_type IN ('online','in_person','phone')),
  meeting_link TEXT,
  meeting_location TEXT,
  agenda TEXT,
  advisor_notes TEXT,
  outcome TEXT,
  next_steps TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','confirmed','in_progress','completed','cancelled','no_show')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.business_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  service_id UUID NOT NULL REFERENCES public.business_services(id),
  user_id UUID NOT NULL,
  package_selected TEXT,
  documents_submitted TEXT[] DEFAULT '{}',
  documents_required TEXT[] DEFAULT '{}',
  documents_complete BOOLEAN DEFAULT false,
  compliance_status JSONB DEFAULT '[]',
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 1,
  workflow_status TEXT DEFAULT 'not_started' CHECK (workflow_status IN ('not_started','in_progress','pending_documents','under_review','government_processing','completed','cancelled')),
  quoted_price NUMERIC(10,2),
  government_fees NUMERIC(10,2),
  total_price NUMERIC(10,2),
  currency TEXT DEFAULT 'AED',
  relocation_profile_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','completed','cancelled')),
  estimated_completion DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_biz_services_subcategory ON public.business_services(subcategory);
CREATE INDEX IF NOT EXISTS idx_biz_services_slug ON public.business_services(slug);
CREATE INDEX IF NOT EXISTS idx_biz_services_status ON public.business_services(status);
CREATE INDEX IF NOT EXISTS idx_biz_bookings_user ON public.business_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_consultations_user ON public.business_consultations(user_id);
-- RLS
ALTER TABLE public.business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published business services" ON public.business_services FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage business services" ON public.business_services FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users view own consultations" ON public.business_consultations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create consultations" ON public.business_consultations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view own business bookings" ON public.business_bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create business bookings" ON public.business_bookings FOR INSERT WITH CHECK (user_id = auth.uid());
