import type { Supplier } from '../../types';
import { supabase } from '../../lib/supabase';

export interface SupplierWithVenues extends Supplier {
  venue_ids: string[];
}

export interface SupplierUpsertInput {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  categories: string[];
  commission_rate: number;
  notes?: string;
  status: Supplier['status'];
}

async function attachVenueIds(suppliers: Supplier[]): Promise<SupplierWithVenues[]> {
  if (!suppliers.length) return [];

  const ids = suppliers.map((s) => s.id);
  const venueMap = new Map<string, string[]>();

  const { data, error } = await supabase
    .from('venues')
    .select('id, supplier_id')
    .in('supplier_id', ids);
  if (error) throw error;

  for (const row of data ?? []) {
    if (!row.supplier_id) continue;
    const list = venueMap.get(row.supplier_id) ?? [];
    list.push(row.id);
    venueMap.set(row.supplier_id, list);
  }

  return suppliers.map((supplier) => ({
    ...supplier,
    venue_ids: venueMap.get(supplier.id) ?? [],
  }));
}

export async function fetchSuppliersWithVenues(): Promise<SupplierWithVenues[]> {
  const { data, error } = await supabase.from('suppliers').select('*').order('name');
  if (error) throw error;
  return attachVenueIds((data ?? []) as Supplier[]);
}

async function assignSupplierToVenues(supplierId: string, venueIds: string[]) {
  const { data: currentRows, error: currentError } = await supabase
    .from('venues')
    .select('id')
    .eq('supplier_id', supplierId);
  if (currentError) throw currentError;

  const currentIds = (currentRows ?? []).map((row) => row.id);
  const toRemove = currentIds.filter((id) => !venueIds.includes(id));
  const toAssign = venueIds.filter((id) => !currentIds.includes(id));

  if (toRemove.length) {
    const { error } = await supabase.from('venues').update({ supplier_id: null }).in('id', toRemove);
    if (error) throw error;
  }

  if (toAssign.length) {
    const { error } = await supabase.from('venues').update({ supplier_id: supplierId }).in('id', toAssign);
    if (error) throw error;
  }
}

export async function createSupplierWithVenues(input: SupplierUpsertInput, venueIds: string[]): Promise<SupplierWithVenues> {
  const { data, error } = await supabase.from('suppliers').insert(input).select('*').single();
  if (error) throw error;

  const supplier = data as Supplier;
  await assignSupplierToVenues(supplier.id, venueIds);

  return {
    ...supplier,
    venue_ids: venueIds,
  };
}

export async function updateSupplierWithVenues(
  id: string,
  updates: Partial<SupplierUpsertInput>,
  venueIds: string[]
): Promise<SupplierWithVenues> {
  const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select('*').single();
  if (error) throw error;

  await assignSupplierToVenues(id, venueIds);

  return {
    ...(data as Supplier),
    venue_ids: venueIds,
  };
}

// ── Bulk import ─────────────────────────────────────────────────────────────

export interface BulkImportRow {
  /** Venue / supplier display name (from SEO file H1) */
  name: string;
  /** DALC category slugs, e.g. ['nightlife'], ['dining'] */
  categories: string[];
  /** Existing DALC venue IDs to link. Empty = new supplier, no venue link yet. */
  venue_ids: string[];
  location?: string;
  primary_keyword?: string;
  secondary_keyword?: string;
  seo_category?: string;
  hero_image_status?: string;
  source_file?: string;
}

export interface BulkImportResult {
  created: number;
  updated: number;
  errors: Array<{ name: string; error: string }>;
}

/**
 * Upsert suppliers from parsed SEO rows.
 * Matches on case-insensitive name; creates new if not found.
 * Runs venue assignment sync for each row that has venue_ids.
 */
export async function bulkUpsertSuppliers(rows: BulkImportRow[]): Promise<BulkImportResult> {
  const result: BulkImportResult = { created: 0, updated: 0, errors: [] };

  for (const row of rows) {
    try {
      const { data: existingRows } = await supabase
        .from('suppliers')
        .select('id, name, categories, notes')
        .ilike('name', row.name)
        .limit(1);

      const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;
      let supplierId: string;

      if (!existing) {
        const { data: created, error: createError } = await supabase
          .from('suppliers')
          .insert({
            name: row.name,
            categories: row.categories,
            commission_rate: 0,
            status: 'pending',
            notes: [row.location, row.seo_category].filter(Boolean).join(' | ') || null,
          })
          .select('id')
          .single();
        if (createError) throw createError;
        supplierId = (created as { id: string }).id;
        result.created++;
      } else {
        const mergedCategories = Array.from(
          new Set([...(existing.categories ?? []), ...row.categories])
        );
        const { error: updateError } = await supabase
          .from('suppliers')
          .update({ categories: mergedCategories })
          .eq('id', existing.id);
        if (updateError) throw updateError;
        supplierId = existing.id;
        result.updated++;
      }

      if (row.venue_ids.length > 0) {
        await assignSupplierToVenues(supplierId, row.venue_ids);
      }
    } catch (err) {
      result.errors.push({ name: row.name, error: (err as Error).message });
    }
  }

  return result;
}
