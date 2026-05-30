-- =============================================================================
-- DALC Core Operating Loop Migration
-- Adds: intents, quotes, payments, tasks, conversations, operator_actions,
--       partners tables. Extends requests with intent_id + priority.
-- =============================================================================

-- ============================================================
-- PARTNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partners (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  category       TEXT NOT NULL,
  contact_email  TEXT,
  contact_phone  TEXT,
  status         TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata       JSONB DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_partners_category ON public.partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_status   ON public.partners(status);
-- ============================================================
-- INTENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.intents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_input       TEXT NOT NULL,
  intent_type      TEXT NOT NULL,
  complexity_score INTEGER NOT NULL DEFAULT 1,
  decision         TEXT NOT NULL,
  entities         JSONB DEFAULT '{}'::jsonb,
  raw_response     JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_intents_user_id     ON public.intents(user_id);
CREATE INDEX IF NOT EXISTS idx_intents_intent_type ON public.intents(intent_type);
CREATE INDEX IF NOT EXISTS idx_intents_created_at  ON public.intents(created_at DESC);
-- ============================================================
-- EXTEND REQUESTS: add intent_id + priority
-- ============================================================
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS intent_id UUID REFERENCES public.intents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS priority  TEXT NOT NULL DEFAULT 'NORMAL'
    CHECK (priority IN ('HIGH', 'NORMAL', 'LOW'));
CREATE INDEX IF NOT EXISTS idx_requests_intent_id ON public.requests(intent_id);
CREATE INDEX IF NOT EXISTS idx_requests_priority  ON public.requests(priority);
-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  operator_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_aed   NUMERIC(12, 2) NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'AED',
  line_items   JSONB DEFAULT '[]'::jsonb,
  notes        TEXT,
  status       TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  expires_at   TIMESTAMPTZ,
  accepted_at  TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status     ON public.quotes(status);
-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id            UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  quote_id              UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_aed            NUMERIC(12, 2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'AED',
  payment_type          TEXT NOT NULL DEFAULT 'deposit'
                          CHECK (payment_type IN ('deposit', 'full', 'partial', 'refund')),
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  stripe_session_id     TEXT,
  stripe_payment_intent TEXT,
  metadata              JSONB DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_request_id        ON public.payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status            ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session_id ON public.payments(stripe_session_id);
-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  assignee_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_id   UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open', 'in_progress', 'blocked', 'done', 'cancelled')),
  due_at       TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata     JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tasks_request_id  ON public.tasks(request_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON public.tasks(status);
-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_role  TEXT NOT NULL DEFAULT 'user'
                 CHECK (author_role IN ('user', 'operator', 'system', 'ai')),
  body         TEXT NOT NULL,
  attachments  JSONB DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conversations_request_id ON public.conversations(request_id);
CREATE INDEX IF NOT EXISTS idx_conversations_author_id  ON public.conversations(author_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at);
-- ============================================================
-- OPERATOR_ACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.operator_actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  operator_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type  TEXT NOT NULL,
  payload      JSONB DEFAULT '{}'::jsonb,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_operator_actions_request_id  ON public.operator_actions(request_id);
CREATE INDEX IF NOT EXISTS idx_operator_actions_operator_id ON public.operator_actions(operator_id);
CREATE INDEX IF NOT EXISTS idx_operator_actions_action_type ON public.operator_actions(action_type);
-- ============================================================
-- handle_updated_at utility function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
-- ============================================================
-- updated_at triggers
-- ============================================================
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['partners','intents','quotes','payments','tasks','conversations','operator_actions']
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS %I ON public.%I;
      CREATE TRIGGER %I
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    ', tbl || '_updated_at', tbl, tbl || '_updated_at', tbl);
  END LOOP;
END;
$$;
-- ============================================================
-- RLS: enable but stay permissive for service_role callers
-- ============================================================
ALTER TABLE public.intents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners         ENABLE ROW LEVEL SECURITY;
-- Users see their own intents
CREATE POLICY "Users view own intents"   ON public.intents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts intents"   ON public.intents FOR INSERT WITH CHECK (true);
-- Users see quotes for their requests
CREATE POLICY "Users view own quotes"    ON public.quotes  FOR SELECT
  USING (request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid()));
-- Users see their own payments
CREATE POLICY "Users view own payments"  ON public.payments FOR SELECT
  USING (user_id = auth.uid());
-- Users see tasks for their requests
CREATE POLICY "Users view own tasks"     ON public.tasks FOR SELECT
  USING (request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid()));
-- Users see messages in their requests
CREATE POLICY "Users view own convos"    ON public.conversations FOR SELECT
  USING (request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid()));
CREATE POLICY "Users post own convos"    ON public.conversations FOR INSERT
  WITH CHECK (request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid()));
-- Actions restricted to service_role (operators use admin client)
CREATE POLICY "Operators insert actions" ON public.operator_actions FOR INSERT WITH CHECK (true);
CREATE POLICY "Operators view actions"   ON public.operator_actions FOR SELECT USING (true);
-- Partners readable by all authenticated
CREATE POLICY "Auth users view partners" ON public.partners FOR SELECT USING (auth.role() = 'authenticated');
