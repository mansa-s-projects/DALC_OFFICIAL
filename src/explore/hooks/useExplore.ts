import { useQuery } from '@tanstack/react-query';
import { getFeaturedExperiences } from '../../lib/experiences';
import { getFeaturedTransport } from '../../lib/transport';
import { getFeaturedProperties } from '../../lib/stays';
import { getFeaturedServices } from '../../lib/business';
import { MOCK_VENUES } from '../../data/venues/mockData';
import type { ExperienceService } from '../../types/experiences';
import type { TransportService } from '../../types/transport';
import type { StaysProperty } from '../../types/stays';
import type { BusinessService } from '../../types/business';
import type { Venue } from '../../types';

// ─── Shared Result Shape ──────────────────────────────────────────────────────

export type ExploreVertical =
  | 'experiences'
  | 'transport'
  | 'stays'
  | 'business'
  | 'nightlife';

export interface ExploreItem {
  id: string;
  vertical: ExploreVertical;
  /** Discriminates which original type this came from */
  type: 'experience' | 'transport' | 'stay' | 'service' | 'venue';
  name: string;
  slug: string;
  href: string;
  hero_image?: string;
  description_short?: string;
  price_from?: number;
  price_display?: string;
  area?: string;
  tags: string[];
  /** Composite ranking score used for default sort */
  score: number;
}

export interface ExploreFilters {
  query?: string;
  vertical?: ExploreVertical;
  area?: string;
  maxPrice?: number;
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

function fromExperience(e: ExperienceService): ExploreItem {
  return {
    id: e.id,
    vertical: 'experiences',
    type: 'experience',
    name: e.name,
    slug: e.slug,
    href: `/experiences/${e.subcategory}/${e.slug}`,
    hero_image: e.hero_image,
    description_short: e.description_short,
    price_from: e.price_from,
    price_display: e.price_display,
    area: e.area,
    tags: [...(e.vibe_tags ?? []), e.subcategory],
    score: (e.current_bookings ?? 0) + (e.is_trending ? 20 : 0),
  };
}

function fromTransport(t: TransportService): ExploreItem {
  return {
    id: t.id,
    vertical: 'transport',
    type: 'transport',
    name: t.name,
    slug: t.slug,
    href: `/transport/${t.subcategory}/${t.slug}`,
    hero_image: t.hero_image,
    description_short: t.description_short,
    price_from: t.price_from,
    price_display: t.price_display,
    area: t.area,
    tags: [t.subcategory, ...(t.highlights?.slice(0, 2) ?? [])],
    score: t.is_featured ? 30 : 10,
  };
}

function fromStay(s: StaysProperty): ExploreItem {
  return {
    id: s.id,
    vertical: 'stays',
    type: 'stay',
    name: s.name,
    slug: s.slug,
    href: `/stays/${s.subcategory}/${s.slug}`,
    hero_image: s.hero_image,
    description_short: s.description_short,
    price_from: s.base_price,
    price_display: s.price_display,
    area: s.area,
    tags: [s.subcategory, ...(s.amenities_highlight?.slice(0, 2) ?? [])],
    score: (s.star_rating ?? 0) * 10 + (s.is_featured ? 20 : 0),
  };
}

function fromService(b: BusinessService): ExploreItem {
  return {
    id: b.id,
    vertical: 'business',
    type: 'service',
    name: b.name,
    slug: b.slug,
    href: `/business/${b.subcategory}/${b.slug}`,
    hero_image: b.hero_image,
    description_short: b.description_short,
    price_from: b.price_from,
    price_display: b.price_display,
    area: undefined,
    tags: [b.subcategory, b.service_type],
    score: b.is_featured ? 25 : 8,
  };
}

function fromVenue(v: Venue): ExploreItem {
  return {
    id: v.id,
    vertical: 'nightlife',
    type: 'venue',
    name: v.name,
    slug: v.id,
    href: `/venue/${v.id}`,
    hero_image: v.hero_image,
    description_short: v.description_short,
    price_from: undefined,
    price_display: '$'.repeat(v.price_tier),
    area: v.area,
    tags: [v.category, ...(v.vibe_tags?.slice(0, 3) ?? [])],
    score: (v.recommend_score ?? 0) + (v.is_trending ? 15 : 0) + (v.is_featured ? 10 : 0),
  };
}

// ─── Aggregate Fetcher ────────────────────────────────────────────────────────

async function fetchAllExploreItems(): Promise<ExploreItem[]> {
  const [experiences, transport, stays, services] = await Promise.all([
    getFeaturedExperiences(),
    getFeaturedTransport(),
    getFeaturedProperties(),
    getFeaturedServices(),
  ]);

  const venues = MOCK_VENUES.slice(0, 12); // cap nightlife to 12

  return [
    ...experiences.map(fromExperience),
    ...transport.map(fromTransport),
    ...stays.map(fromStay),
    ...services.map(fromService),
    ...venues.map(fromVenue),
  ];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExplore(filters?: ExploreFilters) {
  const { data: allItems = [], ...rest } = useQuery({
    queryKey: ['explore'],
    queryFn: fetchAllExploreItems,
    staleTime: 5 * 60 * 1000,
  });

  // Apply client-side filters
  const items = allItems
    .filter((item) => {
      if (filters?.vertical && item.vertical !== filters.vertical) return false;
      if (filters?.area && !item.area?.toLowerCase().includes(filters.area.toLowerCase())) {
        return false;
      }
      if (filters?.maxPrice && item.price_from !== undefined && item.price_from > filters.maxPrice) {
        return false;
      }
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const searchable = [item.name, item.description_short, ...item.tags]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.score - a.score);

  return { items, ...rest };
}
