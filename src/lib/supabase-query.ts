import { supabase } from './supabase';

type FilterOp = 'eq' | 'gte' | 'lte' | 'ilike';

interface FieldFilter {
  op: FilterOp;
  value: unknown;
  /** Override the DB column name. Defaults to the Record key. */
  column?: string;
}

interface QueryConfig {
  table: string;
  orderBy: { column: string; ascending: boolean };
  secondaryOrderBy?: { column: string; ascending: boolean };
  filters?: Record<string, FieldFilter | undefined>;
  limit?: number;
  /** Override the default single `published` status check with multiple values. */
  statusValues?: string[];
}

export async function queryPublished<T>(config: QueryConfig): Promise<T[]> {
  const base = supabase.from(config.table).select('*');
  const withStatus = config.statusValues
    ? base.in('status', config.statusValues)
    : base.eq('status', 'published');

  let query = withStatus.order(config.orderBy.column, { ascending: config.orderBy.ascending });

  if (config.secondaryOrderBy) {
    query = query.order(config.secondaryOrderBy.column, { ascending: config.secondaryOrderBy.ascending });
  }

  if (config.filters) {
    for (const [key, filter] of Object.entries(config.filters)) {
      if (!filter || filter.value == null) continue;
      const col = filter.column ?? key;
      switch (filter.op) {
        case 'eq': query = query.eq(col, filter.value); break;
        case 'gte': query = query.gte(col, filter.value); break;
        case 'lte': query = query.lte(col, filter.value); break;
        case 'ilike': query = query.ilike(col, `%${filter.value}%`); break;
      }
    }
  }

  if (config.limit) query = query.limit(config.limit);

  const { data, error } = await query;
  if (error) {
    console.error('[queryPublished] Supabase error:', error.message);
    return [];
  }
  return (data ?? []) as T[];
}
