-- Notifications system
-- Idempotent migration for DALC notification storage + realtime support.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'normal',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  CONSTRAINT notifications_type_check CHECK (
    type IN (
      'booking_confirmed',
      'booking_cancelled',
      'request_update',
      'message_received',
      'document_status',
      'payment_received',
      'reminder',
      'system'
    )
  ),
  CONSTRAINT notifications_priority_check CHECK (
    priority IN ('low', 'normal', 'high', 'urgent')
  ),
  CONSTRAINT notifications_read_at_check CHECK (
    (is_read = FALSE AND read_at IS NULL)
    OR (is_read = TRUE)
  )
);
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN,
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
UPDATE public.notifications
SET
  type = COALESCE(type, 'system'),
  message = COALESCE(message, ''),
  priority = COALESCE(priority, 'normal'),
  is_read = COALESCE(is_read, FALSE),
  metadata = COALESCE(metadata, '{}'::jsonb),
  created_at = COALESCE(created_at, NOW());
ALTER TABLE public.notifications
  ALTER COLUMN type SET DEFAULT 'system',
  ALTER COLUMN type SET NOT NULL,
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN message SET DEFAULT '',
  ALTER COLUMN message SET NOT NULL,
  ALTER COLUMN priority SET DEFAULT 'normal',
  ALTER COLUMN priority SET NOT NULL,
  ALTER COLUMN is_read SET DEFAULT FALSE,
  ALTER COLUMN is_read SET NOT NULL,
  ALTER COLUMN metadata SET DEFAULT '{}'::jsonb,
  ALTER COLUMN metadata SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN created_at SET NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_type_check'
      AND conrelid = 'public.notifications'::regclass
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_type_check CHECK (
        type IN (
          'booking_confirmed',
          'booking_cancelled',
          'request_update',
          'message_received',
          'document_status',
          'payment_received',
          'reminder',
          'system'
        )
      );
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_priority_check'
      AND conrelid = 'public.notifications'::regclass
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_priority_check CHECK (
        priority IN ('low', 'normal', 'high', 'urgent')
      );
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notifications_read_at_check'
      AND conrelid = 'public.notifications'::regclass
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_read_at_check CHECK (
        (is_read = FALSE AND read_at IS NULL)
        OR (is_read = TRUE)
      );
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON public.notifications(created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_own_notifications ON public.notifications;
DROP POLICY IF EXISTS notifications_own ON public.notifications;
DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
DROP POLICY IF EXISTS notifications_insert_own ON public.notifications;
DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
DROP POLICY IF EXISTS notifications_delete_own ON public.notifications;
DROP POLICY IF EXISTS notifications_admin_manage ON public.notifications;
CREATE POLICY notifications_select_own ON public.notifications
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY notifications_insert_own ON public.notifications
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'concierge')
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'concierge')
    )
  );
CREATE POLICY notifications_delete_own ON public.notifications
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'concierge')
    )
  );
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
