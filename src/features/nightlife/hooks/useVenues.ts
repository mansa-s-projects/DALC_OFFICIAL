import { useQuery } from '@tanstack/react-query';
import { Category, Venue } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { MOCK_VENUES } from '../../../data/venues/mockData';
import { normalizeVenue } from '../lib/normalizeVenue';

export interface UseVenuesFilters {
  category?: Category | 'all';
  priceRange?: [number, number];
  location?: string;
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
        return supabaseVenues.length > 0 ? supabaseVenues : getMockFallback(category, location, priceRange);
      } catch {
        return getMockFallback(category, location, priceRange);
      }
    },
  });
}
