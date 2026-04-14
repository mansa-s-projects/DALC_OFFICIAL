import { useQuery } from '@tanstack/react-query';
import { Category } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { normalizeVenue } from '../lib/normalizeVenue';

export interface UseVenuesFilters {
  category?: Category | 'all';
  priceRange?: [number, number];
  location?: string;
}

export function useVenues(filters: UseVenuesFilters = {}) {
  const { category, location, priceRange } = filters;

  return useQuery({
    queryKey: ['venues', category ?? 'all', location ?? '', priceRange ?? null],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
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

      return (data ?? []).map(normalizeVenue);
    },
  });
}
