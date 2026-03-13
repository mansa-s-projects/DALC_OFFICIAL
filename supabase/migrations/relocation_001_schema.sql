CREATE TABLE IF NOT EXISTS public.relocation_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  purpose TEXT CHECK (purpose IN ('employment','business','retirement','family','investment')),
  current_country TEXT,
  target_move_date DATE,
  family_size INTEGER DEFAULT 1,
  has_children BOOLEAN DEFAULT false,
  budget_range TEXT CHECK (budget_range IN ('under_10k','10k_50k','50k_200k','200k_plus')),
  property_preference TEXT CHECK (property_preference IN ('rent','buy','undecided')),
  visa_status TEXT DEFAULT 'not_started' CHECK (visa_status IN ('not_started','in_progress','approved','rejected')),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  relocation_profile_id UUID REFERENCES public.relocation_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT DEFAULT 'relocation',
  total_steps INTEGER DEFAULT 0,
  completed_steps INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.user_workflows(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','blocked','skipped')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  relocation_profile_id UUID REFERENCES public.relocation_profiles(id),
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','uploaded','verified','rejected','expired')),
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.relocation_cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relocation_profile_id UUID NOT NULL REFERENCES public.relocation_profiles(id),
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  estimated_min NUMERIC(10,2),
  estimated_max NUMERIC(10,2),
  currency TEXT DEFAULT 'AED',
  notes TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_period TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reloc_profiles_user ON public.relocation_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_reloc_workflows_user ON public.user_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_reloc_steps_workflow ON public.user_workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_reloc_docs_user ON public.user_documents(user_id);

ALTER TABLE public.relocation_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relocation_cost_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own relocation profile" ON public.relocation_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own workflows" ON public.user_workflows FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own workflow steps" ON public.user_workflow_steps FOR ALL USING (EXISTS (SELECT 1 FROM public.user_workflows WHERE id = workflow_id AND user_id = auth.uid()));
CREATE POLICY "Users manage own documents" ON public.user_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own cost estimates" ON public.relocation_cost_estimates FOR ALL USING (EXISTS (SELECT 1 FROM public.relocation_profiles WHERE id = relocation_profile_id AND user_id = auth.uid()));
