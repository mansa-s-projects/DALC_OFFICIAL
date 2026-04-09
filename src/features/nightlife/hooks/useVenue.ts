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
        const byId = await supabase.from('venues').select('*').eq('id', id).single();
        if (!byId.error && byId.data) return normalizeVenue(byId.data);

        const bySlug = await supabase.from('venues').select('*').eq('slug', id).single();
        if (!bySlug.error && bySlug.data) return normalizeVenue(bySlug.data);

        throw byId.error ?? new Error('Venue not found');
      } catch {
        const { MOCK_VENUES } = await import('../../../data/venues/mockData');
        const mockVenue = MOCK_VENUES.find(v => v.id === id || (v as { slug?: string }).slug === id);
        if (mockVenue) return mockVenue;
        throw new Error('Venue not found');
      }
    },
  });
}
