import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { normalizeVenue } from '../lib/normalizeVenue';

export function useVenue(id?: string | null) {
  return useQuery({
    queryKey: ['venue', id],
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!id) throw new Error('Venue id is required.');

      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return normalizeVenue(data);
      } catch {
        // Fallback to mock data
        const { MOCK_VENUES } = await import('../../../data/venues/mockData');
        const mockVenue = MOCK_VENUES.find(v => v.id === id);
        if (mockVenue) return mockVenue;
        throw new Error('Venue not found');
      }
    },
  });
}
