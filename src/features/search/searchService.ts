import { supabase, isMockMode } from '../../lib/supabase';
import { MOCK_VENUES } from '../../data/mockData';
import type { Venue } from '../../types';

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

function venueToResult(v: Venue): SearchResult {
  return {
    id: v.id,
    type: 'venue',
    title: v.name,
    subtitle: v.description_short,
    category: v.category,
    area: v.area,
    image: v.hero_image,
    slug: v.id,
    href: `/venue/${v.id}`,
    price_tier: v.price_tier,
    score: v.recommend_score,
  };
}

// Search venues
async function searchVenues(q: string): Promise<SearchResult[]> {
  if (isMockMode) {
    return MOCK_VENUES
      .filter((v) =>
        v.name.toLowerCase().includes(q) ||
        v.description_short.toLowerCase().includes(q) ||
        v.area.toLowerCase().includes(q) ||
        v.subcategory.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      )
      .map(venueToResult);
  }

  if (!supabase) return [];

  const { data, error } = await supabase
    .from('venues')
    .select('id, name, category, subcategory, area, hero_image, description_short, price_tier, recommend_score')
    .or(`name.ilike.%${q}%,description_short.ilike.%${q}%,area.ilike.%${q}%,subcategory.ilike.%${q}%`)
    .limit(10);

  if (error || !data) return [];

  return data.map((v: any): SearchResult => ({
    id: String(v.id),
    type: 'venue',
    title: v.name,
    subtitle: v.description_short ?? '',
    category: v.category ?? '',
    area: v.area ?? 'Dubai',
    image: v.hero_image ?? '',
    slug: String(v.id),
    href: `/venue/${v.id}`,
    price_tier: v.price_tier,
    score: v.recommend_score,
  }));
}

// Search experiences
async function searchExperiences(q: string): Promise<SearchResult[]> {
  if (!supabase || isMockMode) return [];

  const { data, error } = await supabase
    .from('experiences')
    .select('id, title, description, category, location, hero_image, price_tier')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(6);

  if (error || !data) return [];

  return data.map((v: any): SearchResult => ({
    id: String(v.id),
    type: 'experience',
    title: v.title,
    subtitle: v.description ?? '',
    category: v.category ?? '',
    area: v.location ?? 'Dubai',
    image: v.hero_image ?? '',
    slug: String(v.id),
    href: `/experiences/${v.category}/${v.id}`,
    price_tier: v.price_tier,
  }));
}

// Search transport
async function searchTransport(q: string): Promise<SearchResult[]> {
  if (!supabase || isMockMode) return [];

  const { data, error } = await supabase
    .from('transport_vehicles')
    .select('id, name, type, category, location, image, hourly_rate')
    .or(`name.ilike.%${q}%,type.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(6);

  if (error || !data) return [];

  return data.map((v: any): SearchResult => ({
    id: String(v.id),
    type: 'transport',
    title: v.name,
    subtitle: v.type ?? '',
    category: v.category ?? '',
    area: v.location ?? 'Dubai',
    image: v.image ?? '',
    slug: String(v.id),
    href: `/transport/${v.category}/${v.id}`,
    price_tier: v.hourly_rate ? Math.min(4, Math.ceil(v.hourly_rate / 250)) : undefined,
  }));
}

// Search business services
async function searchBusiness(q: string): Promise<SearchResult[]> {
  if (!supabase || isMockMode) return [];

  const { data, error } = await supabase
    .from('business_services')
    .select('id, name, category, description, image')
    .or(`name.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(6);

  if (error || !data) return [];

  return data.map((v: any): SearchResult => ({
    id: String(v.id),
    type: 'business',
    title: v.name,
    subtitle: v.description ?? '',
    category: v.category ?? '',
    area: 'Dubai',
    image: v.image ?? '',
    slug: String(v.id),
    href: `/business#${v.category}`,
  }));
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Run all searches in parallel
  const [venues, experiences, transport, business] = await Promise.all([
    searchVenues(q),
    searchExperiences(q),
    searchTransport(q),
    searchBusiness(q),
  ]);

  // Combine and prioritize venues, then others
  return [...venues, ...experiences, ...transport, ...business];
}
