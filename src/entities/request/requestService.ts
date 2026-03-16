import { supabase } from '../../lib/supabase';
import type { RequestEntity } from './requestTypes';

export async function listRequests(limit = 100): Promise<RequestEntity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('requests')
    .select('id, user_id, venue_id, status, category, request_type, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id ?? null,
    venueId: row.venue_id ?? null,
    status: row.status,
    category: row.category,
    requestType: row.request_type ?? null,
    createdAt: row.created_at ?? null,
  }));
}
