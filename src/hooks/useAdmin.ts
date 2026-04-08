import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';

interface RequestRow {
  id: string;
  status: string;
  created_at: string;
}

const PENDING_STATUSES = [
  'pending',
  'acknowledged',
  'submitted',
  'assigned',
  'supplier_contacted',
  'in_progress',
  'quoted',
] as const;

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const [requestsRes, venuesRes, suppliersRes] = await Promise.all([
        supabase.from('requests').select('id, status, created_at', { count: 'exact' }),
        supabase.from('venues').select('id', { count: 'exact' }),
        supabase.from('suppliers').select('id', { count: 'exact' }),
      ]);

      // Schema-sync views are optional until the migration is applied.
      const [serviceCatalogRes, bookingSyncRes] = await Promise.all([
        supabase.from('v_service_catalog').select('source_id', { count: 'exact', head: true }),
        supabase.from('v_booking_sync').select('booking_source_id', { count: 'exact', head: true }),
      ]);

      const requests = (requestsRes.data ?? []) as RequestRow[];
      const pending = requests.filter((r) => (PENDING_STATUSES as readonly string[]).includes(r.status)).length;
      const confirmed = requests.filter((r) => r.status === 'confirmed').length;
      const completed = requests.filter((r) => r.status === 'completed').length;

      return {
        totalRequests: requestsRes.count ?? 0,
        pendingRequests: pending,
        confirmedRequests: confirmed,
        completedRequests: completed,
        totalVenues: venuesRes.count ?? 0,
        totalSuppliers: suppliersRes.count ?? 0,
        syncedServices: serviceCatalogRes.error ? null : (serviceCatalogRes.count ?? 0),
        syncedBookings: bookingSyncRes.error ? null : (bookingSyncRes.count ?? 0),
      };
    },
  });
}

// Admin: fetch all venues (including drafts)
export function useAdminVenues() {
  return useQuery({
    queryKey: ['admin', 'venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as Venue[];
    },
  });
}
