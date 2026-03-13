import { useQuery } from '@tanstack/react-query';
import { supabase, isMockMode } from '../lib/supabase';
import { Venue } from '../types';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    enabled: !isMockMode,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const [requestsRes, venuesRes, suppliersRes] = await Promise.all([
        supabase!.from('requests').select('id, status, created_at', { count: 'exact' }),
        supabase!.from('venues').select('id', { count: 'exact' }),
        supabase!.from('suppliers').select('id', { count: 'exact' }),
      ]);

      const requests = requestsRes.data ?? [];
      const pending = requests.filter((r: any) => ['submitted', 'assigned', 'supplier_contacted'].includes(r.status)).length;
      const confirmed = requests.filter((r: any) => r.status === 'confirmed').length;
      const completed = requests.filter((r: any) => r.status === 'completed').length;

      return {
        totalRequests: requestsRes.count ?? 0,
        pendingRequests: pending,
        confirmedRequests: confirmed,
        completedRequests: completed,
        totalVenues: venuesRes.count ?? 0,
        totalSuppliers: suppliersRes.count ?? 0,
      };
    },
  });
}

// Admin: fetch all venues (including drafts)
export function useAdminVenues() {
  return useQuery({
    queryKey: ['admin', 'venues'],
    enabled: !isMockMode,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from('venues')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as Venue[];
    },
  });
}
