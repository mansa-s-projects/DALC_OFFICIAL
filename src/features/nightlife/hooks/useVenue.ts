import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { normalizeVenue } from '../lib/normalizeVenue';

export function useVenue(slug: string) {
  return useQuery({
    queryKey: ['venue', slug],
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,

    queryFn: async () => {
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) return null;

      return normalizeVenue(data as Record<string, unknown>);
    },
  });
}
