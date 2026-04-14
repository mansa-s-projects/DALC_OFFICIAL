import { supabase } from '../../lib/supabase';

// ─── DB Row Types ──────────────────────────────────────────────────────────────

interface VenueSearchRow {
  id: string | number;
  name: string;
  category: string;
  subcategory?: string;
  area?: string;
  hero_image?: string | null;
  description_short?: string | null;
  price_tier?: number | null;
  recommend_score?: number | null;
}

interface ExperienceSearchRow {
  id: string | number;
  name: string;
  description_short?: string | null;
  subcategory?: string | null;
  location?: string | null;
  hero_image?: string | null;
  price_tier?: number | null;
}

interface TransportSearchRow {
  id: string | number;
  name: string;
  subcategory?: string | null;
  description_short?: string | null;
  hero_image?: string | null;
  area?: string | null;
}

interface BusinessSearchRow {
  id: string | number;
  name: string;
  subcategory?: string | null;
  description_short?: string | null;
  hero_image?: string | null;
}

export interface SearchResult {
  id: string;
  type: 'venue' | 'experience' | 'transport' | 'business';
  title: string;
  subtitle: string;
  category: string;
  area: string;
  image: string;
  slug: string;
  href: string;
  price_tier?: number;
  score?: number;
}

async function searchVenues(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('id, name, category, subcategory, area, hero_image, description_short, price_tier, recommend_score')
    .or(`name.ilike.%${q}%,description_short.ilike.%${q}%,area.ilike.%${q}%,subcategory.ilike.%${q}%`)
    .limit(10);

  if (error || !data) return [];

  return (data as VenueSearchRow[]).map((v): SearchResult => ({
    id: String(v.id),
    type: 'venue',
    title: v.name,
    subtitle: v.description_short ?? '',
    category: v.category ?? '',
    area: v.area ?? 'Dubai',
    image: v.hero_image ?? '',
    slug: String(v.id),
    href: `/venue/${v.id}`,
    price_tier: v.price_tier ?? undefined,
    score: v.recommend_score ?? undefined,
  }));
}

async function searchExperiences(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('id, name, slug, description_short, area, location, status')
    .or(`name.ilike.%${q}%,description_short.ilike.%${q}%,area.ilike.%${q}%`)
    .in('status', ['published', 'sold_out'])
    .limit(6);

  if (error || !data) return [];

  return (data as { id: string; name: string; slug: string; description_short: string | null; area: string | null; location: string | null; status: string }[]).map((v): SearchResult => ({
    id: String(v.id),
    type: 'experience',
    title: v.name,
    subtitle: v.description_short ?? '',
    category: 'activity',
    area: v.area ?? v.location ?? 'Dubai',
    image: '',
    slug: v.slug,
    href: `/experiences/${v.slug}`,
  }));
}

async function searchTransport(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('transport_services')
    .select('id, name, subcategory, description_short, hero_image, area')
    .or(`name.ilike.%${q}%,description_short.ilike.%${q}%,subcategory.ilike.%${q}%`)
    .eq('status', 'published')
    .limit(6);

  if (error || !data) return [];

  return (data as TransportSearchRow[]).map((v): SearchResult => ({
    id: String(v.id),
    type: 'transport',
    title: v.name,
    subtitle: v.description_short ?? '',
    category: v.subcategory ?? '',
    area: v.area ?? 'Dubai',
    image: v.hero_image ?? '',
    slug: String(v.id),
    href: `/transport/${v.subcategory}/${v.id}`,
  }));
}

async function searchBusiness(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .from('business_services')
    .select('id, name, subcategory, description_short, hero_image')
    .or(`name.ilike.%${q}%,subcategory.ilike.%${q}%`)
    .limit(6);

  if (error || !data) return [];

  return (data as BusinessSearchRow[]).map((v): SearchResult => ({
    id: String(v.id),
    type: 'business',
    title: v.name,
    subtitle: v.description_short ?? '',
    category: v.subcategory ?? '',
    area: 'Dubai',
    image: v.hero_image ?? '',
    slug: String(v.id),
    href: `/business#${v.subcategory}`,
  }));
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  // Strip PostgREST filter-special chars to prevent filter injection
  const q = query.trim().toLowerCase().replace(/[%(),.:{}\\]/g, '');
  if (!q) return [];

  const [venues, experiences, transport, business] = await Promise.all([
    searchVenues(q),
    searchExperiences(q),
    searchTransport(q),
    searchBusiness(q),
  ]);

  return [...venues, ...experiences, ...transport, ...business];
}
