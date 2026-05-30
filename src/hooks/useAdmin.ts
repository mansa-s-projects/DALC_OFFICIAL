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
        supabase.from('requests').select('id, status, created_at'),
        supabase.from('venues').select('id'),
        supabase.from('suppliers').select('id'),
      ]);

      // Schema-sync views are optional until the migration is applied.
      const [serviceCatalogRes, bookingSyncRes] = await Promise.all([
        supabase.from('v_service_catalog').select('source_id'),
        supabase.from('v_booking_sync').select('*', { count: 'exact', head: true }),
      ]);

      const requests = (requestsRes.data ?? []) as RequestRow[];
      const pending = requests.filter((r) => (PENDING_STATUSES as readonly string[]).includes(r.status)).length;
      const confirmed = requests.filter((r) => r.status === 'confirmed').length;
      const completed = requests.filter((r) => r.status === 'completed').length;
      const venuesCount = (venuesRes.data ?? []).length;
      const suppliersCount = (suppliersRes.data ?? []).length;
      const syncedServicesCount = serviceCatalogRes.error ? null : (serviceCatalogRes.data ?? []).length;
      const syncedBookingsCount = bookingSyncRes.error ? null : (bookingSyncRes.count ?? 0);

      return {
        totalRequests: requests.length,
        pendingRequests: pending,
        confirmedRequests: confirmed,
        completedRequests: completed,
        totalVenues: venuesCount,
        totalSuppliers: suppliersCount,
        syncedServices: syncedServicesCount,
        syncedBookings: syncedBookingsCount,
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
