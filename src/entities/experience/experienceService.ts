import { supabase } from '../../lib/supabase';
import type { ExperienceEntity } from './experienceTypes';

export async function listExperiences(limit = 24): Promise<ExperienceEntity[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('experiences')
    .select('id, service_id, title, category_id, subcategory_id, venue_id')
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    serviceId: row.service_id ?? null,
    title: row.title,
    categoryId: row.category_id ?? null,
    subcategoryId: row.subcategory_id ?? null,
    venueId: row.venue_id ?? null,
  }));
}
