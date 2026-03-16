import { supabase } from '../../lib/supabase';
import type { SupplierEntity } from './supplierTypes';

export async function listSuppliers(limit = 100): Promise<SupplierEntity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('suppliers')
    .select('id, name, email, phone, status')
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email ?? null,
    phone: row.phone ?? null,
    status: row.status ?? null,
  }));
}
