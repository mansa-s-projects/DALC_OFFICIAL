import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { ExploreLocation } from '../types';

export function useExploreLocations() {
  return useQuery<ExploreLocation[]>({
    queryKey: ['explore_locations'],
    queryFn: async () => {
      const { data, error } = await supabase!
        .from('explore_locations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ExploreLocation[];
    },
    enabled: !!supabase,
    staleTime: 1000 * 60 * 5,
  });
}
