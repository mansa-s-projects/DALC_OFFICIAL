import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { normalizeVenue } from '../lib/normalizeVenue';

export function useVenues(category?: string) {
  return useQuery({
    queryKey: ['venues', category],
    staleTime: 5 * 60 * 1000,

    queryFn: async () => {
      let query = supabase
        .from('venues')
        .select('*')
        .eq('status', 'published');

      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Normalize all venues
      return (data || []).map(normalizeVenue);
    },
  });
}