import { supabase, isMockMode } from '../../lib/supabase';
import { MOCK_VENUES } from '../../data/mockData';
import type { Venue } from '../../types';

export interface SearchResult {
  id: string;
  type: 'venue' | 'experience' | 'service';
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

export async function searchAll(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (isMockMode) {
    const results = MOCK_VENUES.filter((v) => {
      return (
        v.name.toLowerCase().includes(q) ||
        v.description_short.toLowerCase().includes(q) ||
        v.area.toLowerCase().includes(q) ||
        v.subcategory.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.vibe_tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
    return results.map(venueToResult);
  }

  if (!supabase) return [];

  const { data, error } = await supabase
    .from('venues')
    .select('id, name, category, subcategory, area, hero_image, description_short, price_tier, recommend_score')
    .or(`name.ilike.%${q}%,description_short.ilike.%${q}%,area.ilike.%${q}%,subcategory.ilike.%${q}%`)
    .limit(24);

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
