import { useQuery } from '@tanstack/react-query';
import { Category, Venue } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { applyLocalImages } from '../../../data/venueImages';
import { MOCK_VENUES } from '../../../data/mockData';

export interface UseVenuesFilters {
  category?: Category | 'all';
  priceRange?: [number, number];
  location?: string;
}

const VENUE_DEFAULTS: Omit<Venue, 'id' | 'name' | 'category'> = {
  subcategory: 'Curated Venue',
  location: 'Dubai',
  area: 'Dubai',
  vibe_tags: [],
  price_tier: 2,
  hero_image: '/images/restaurants/Bagatelle/image1.jpg',
  gallery_images: [],
  description_short: 'Curated by Dubai A La Carte.',
  description_long: 'This venue is available through our concierge experience.',
  skills: [],
  highlights: ['Concierge Access'],
  recommend_score: 85,
  opening_hours: 'Contact concierge',
  dress_code: 'Smart Casual',
  booking_policy: 'Reservation required',
};

function normalizeVenue(raw: any): Venue {
  const category = (raw.category ?? 'dining') as Category;
  const priceTier = Number(raw.price_tier ?? 2);

  const base = {
    id: String(raw.id),
    name: String(raw.name ?? 'Untitled Venue'),
    category,
    subcategory: raw.subcategory ?? VENUE_DEFAULTS.subcategory,
    location: raw.location ?? VENUE_DEFAULTS.location,
    area: raw.area ?? VENUE_DEFAULTS.area,
    vibe_tags: Array.isArray(raw.vibe_tags) ? raw.vibe_tags : VENUE_DEFAULTS.vibe_tags,
    price_tier: (Math.min(Math.max(priceTier, 1), 4) as 1 | 2 | 3 | 4),
    hero_image: raw.hero_image ?? VENUE_DEFAULTS.hero_image,
    gallery_images: Array.isArray(raw.gallery_images) ? raw.gallery_images : VENUE_DEFAULTS.gallery_images,
    description_short: raw.description_short ?? VENUE_DEFAULTS.description_short,
    description_long: raw.description_long ?? VENUE_DEFAULTS.description_long,
    highlights: Array.isArray(raw.highlights) ? raw.highlights : VENUE_DEFAULTS.highlights,
    recommend_score: Number(raw.recommend_score ?? VENUE_DEFAULTS.recommend_score),
    skills: Array.isArray(raw.skills) ? raw.skills : VENUE_DEFAULTS.skills,
    is_featured: Boolean(raw.is_featured),
    is_trending: Boolean(raw.is_trending),
    trending_score: Number(raw.trending_score ?? 0),
    opening_hours: raw.opening_hours ?? VENUE_DEFAULTS.opening_hours,
    dress_code: raw.dress_code ?? VENUE_DEFAULTS.dress_code,
    booking_policy: raw.booking_policy ?? VENUE_DEFAULTS.booking_policy,
    cuisine: raw.cuisine,
    best_time: raw.best_time,
    who_its_for: raw.who_its_for,
    insider_tip: raw.insider_tip,
    coordinates: raw.coordinates,
  };

  // Apply local images if available
  const localImages = applyLocalImages(base);
  return {
    ...base,
    hero_image: localImages.hero_image,
    gallery_images: localImages.gallery_images,
  };
}

function getMockFallback(category?: Category | 'all', location?: string, priceRange?: [number, number]): Venue[] {
  let venues = [...MOCK_VENUES];

  if (category && category !== 'all') {
    venues = venues.filter(v => v.category === category);
  }
  if (location) {
    venues = venues.filter(v => v.area.toLowerCase().includes(location.toLowerCase()));
  }
  if (priceRange) {
    venues = venues.filter(v => v.price_tier >= priceRange[0] && v.price_tier <= priceRange[1]);
  }

  return venues;
}

export function useVenues(filters: UseVenuesFilters = {}) {
  const { category, location, priceRange } = filters;

  return useQuery({
    queryKey: ['venues', category ?? 'all', location ?? '', priceRange ?? null],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        let query = supabase.from('venues').select('*');

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        if (location) {
          query = query.ilike('area', `%${location}%`);
        }

        if (priceRange) {
          query = query.gte('price_tier', priceRange[0]).lte('price_tier', priceRange[1]);
        }

        query = query.eq('status', 'published');

        const { data, error } = await query;
        if (error) throw error;

        const supabaseVenues = (data ?? []).map(normalizeVenue);
        // If Supabase returns results, use them; otherwise fallback
        return supabaseVenues.length > 0 ? supabaseVenues : getMockFallback(category, location, priceRange);
      } catch {
        // Supabase unavailable — use mock data
        return getMockFallback(category, location, priceRange);
      }
    },
  });
}

