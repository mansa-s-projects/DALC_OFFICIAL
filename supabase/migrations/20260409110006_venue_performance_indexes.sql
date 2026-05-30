-- ============================================================
-- Migration: venue_performance_indexes
-- All performance indexes for the upgraded venues schema.
-- Run after all venue_* migration files.
-- ============================================================

-- ── Enable pg_trgm for fuzzy name search ─────────────────────

CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ── venues: primary listing query index ──────────────────────
-- Covers: status filter + category + emirate + price_tier sort
-- Partial: only published rows are index-eligible

CREATE INDEX IF NOT EXISTS idx_venues_listing
  ON public.venues (category_slug, emirate_id, price_tier, is_featured DESC, trending_score DESC)
  WHERE status = 'published';
-- ── venues: slug lookup (public routes /venues/[slug]) ────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_venues_slug
  ON public.venues (slug)
  WHERE slug IS NOT NULL;
-- ── venues: full-text search ──────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_fts
  ON public.venues USING gin(fts);
-- ── venues: skills GIN (skills TEXT[] column) ────────────────

CREATE INDEX IF NOT EXISTS idx_venues_skills
  ON public.venues USING gin(skills);
-- ── venues: geo bounding-box queries ─────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_coords
  ON public.venues (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
-- ── venues: featured + trending lists ────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_featured
  ON public.venues (is_featured DESC, trending_score DESC)
  WHERE status = 'published' AND is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_venues_trending
  ON public.venues (trending_score DESC, view_count DESC)
  WHERE status = 'published' AND trending_score > 0;
-- ── venues: price tier filter ─────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_price_tier
  ON public.venues (price_tier, category_slug)
  WHERE status = 'published';
-- ── venues: emirate scoping ───────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_emirate
  ON public.venues (emirate_id, category_slug)
  WHERE status = 'published';
-- ── venues: category FK ───────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_venues_category_id
  ON public.venues (category_id)
  WHERE category_id IS NOT NULL;
-- ── venues: published_at for "new arrivals" sort ─────────────

CREATE INDEX IF NOT EXISTS idx_venues_published_at
  ON public.venues (published_at DESC)
  WHERE status = 'published' AND published_at IS NOT NULL;
-- ── venues: trigram index for ILIKE name search ───────────────

CREATE INDEX IF NOT EXISTS idx_venues_name_trgm
  ON public.venues USING gin(name gin_trgm_ops);
-- ── venue_media: venue lookup ────────────────────────────────
-- Already created in venue_media migration; guard with IF NOT EXISTS

CREATE INDEX IF NOT EXISTS idx_venue_media_venue_id
  ON public.venue_media (venue_id, sort_order);
-- ── venue_tag_map: bidirectional lookups ─────────────────────
-- Already created in venue_tags migration; guard with IF NOT EXISTS

CREATE INDEX IF NOT EXISTS idx_venue_tag_map_venue_id ON public.venue_tag_map (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_tag_map_tag_id   ON public.venue_tag_map (tag_id);
-- ── venue_related: source → related lookup ───────────────────
-- Already created in venue_related migration; guard with IF NOT EXISTS

CREATE INDEX IF NOT EXISTS idx_venue_related_source ON public.venue_related (venue_id, sort_order);
