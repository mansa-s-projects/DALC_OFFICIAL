import { supabase } from '../../lib/supabase';
import type { VenueEntity } from './venueTypes';

export async function listVenues(limit = 24): Promise<VenueEntity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('venues_old')
    .select('id, name, category, subcategory, supplier_id, status')
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory ?? null,
    supplierId: row.supplier_id ?? null,
    status: row.status ?? null,
  }));
}
