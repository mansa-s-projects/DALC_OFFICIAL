import { supabase } from '../../lib/supabase';
import type { BookingEntity } from './bookingTypes';

export async function listBookings(limit = 100): Promise<BookingEntity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('id, request_id, user_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    requestId: row.request_id,
    userId: row.user_id ?? null,
    status: row.status,
    createdAt: row.created_at ?? null,
  }));
}
