import 'server-only';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { normalizeVenue } from '@/features/nightlife/lib/normalizeVenue';
import type { Venue } from '@/types';

export interface FetchVenuesOptions {
  emirate?: string;
  category?: string;
  limit?: number;
}

type RawVenueRow = Record<string, unknown> & {
  emirates?: { slug: string } | null;
  venue_categories?: { slug: string } | null;
};

export async function fetchVenues(options: FetchVenuesOptions = {}): Promise<Venue[]> {
  const { emirate, category, limit = 100 } = options;
  const admin = getSupabaseAdminClient();

  let query = admin
    .from('venues')
    .select('*, emirates!emirate_id(slug), venue_categories!category_id(slug)')
    .eq('status', 'published')
    .order('recommend_score', { ascending: false })
    .limit(limit);

  if (emirate) {
    const { data: emirateRow } = await admin
      .from('emirates')
      .select('id')
      .eq('slug', emirate)
      .single();
    if (emirateRow) {
      query = query.eq('emirate_id', emirateRow.id);
    }
  }

  if (category) {
    query = query.eq('category_slug', category);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((raw: RawVenueRow) => {
    const flat: Record<string, unknown> = {
      ...raw,
      emirate_slug: raw.emirates?.slug ?? 'dubai',
      category_slug: raw.venue_categories?.slug ?? (raw.category_slug as string | undefined),
    };
    delete flat.emirates;
    delete flat.venue_categories;
    return normalizeVenue(flat);
  });
}

export async function fetchVenueBySlug(emirate: string, slug: string): Promise<Venue | null> {
  const admin = getSupabaseAdminClient();

  const { data, error } = await admin
    .from('venues')
    .select('*, emirates!emirate_id(slug), venue_categories!category_id(slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  const raw = data as RawVenueRow;
  const flat: Record<string, unknown> = {
    ...raw,
    emirate_slug: raw.emirates?.slug ?? emirate,
    category_slug: raw.venue_categories?.slug ?? (raw.category_slug as string | undefined),
  };
  delete flat.emirates;
  delete flat.venue_categories;
  return normalizeVenue(flat);
}
