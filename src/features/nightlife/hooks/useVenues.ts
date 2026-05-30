import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { normalizeVenue } from '../lib/normalizeVenue';

type UseVenuesFilters = {
  category?: string;
};

export function useVenues(filters?: UseVenuesFilters) {
  return useQuery({
    queryKey: ['venues', filters],
    staleTime: 5 * 60 * 1000,

    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*')
        .eq('status', 'published');

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(normalizeVenue);
    },
  });
}
