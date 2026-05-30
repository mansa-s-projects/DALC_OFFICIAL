-- ============================================================
-- Migration: venue_related
-- Explicit many-to-many table for "You might also like" links.
-- Replaces any ad-hoc related venue logic in application code.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.venue_related (
  venue_id         TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  related_venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  reason           TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (venue_id, related_venue_id),
  CONSTRAINT no_self_relation CHECK (venue_id != related_venue_id)
);
COMMENT ON TABLE  public.venue_related                  IS 'Curated related venue pairs for "You might also like" sections.';
COMMENT ON COLUMN public.venue_related.venue_id         IS 'Source venue that displays the recommendation.';
COMMENT ON COLUMN public.venue_related.related_venue_id IS 'Recommended venue.';
COMMENT ON COLUMN public.venue_related.reason           IS 'Optional editorial reason (e.g. "Similar vibe", "Same area").';
COMMENT ON COLUMN public.venue_related.sort_order       IS 'Controls display order of recommendations (ascending).';
-- Indexes
CREATE INDEX IF NOT EXISTS idx_venue_related_source  ON public.venue_related (venue_id,         sort_order);
CREATE INDEX IF NOT EXISTS idx_venue_related_target  ON public.venue_related (related_venue_id);
-- RLS
ALTER TABLE public.venue_related ENABLE ROW LEVEL SECURITY;
CREATE POLICY "venue_related_public_read"
  ON public.venue_related FOR SELECT
  USING (TRUE);
CREATE POLICY "venue_related_admin_write"
  ON public.venue_related FOR ALL
  USING (auth.role() = 'service_role');
