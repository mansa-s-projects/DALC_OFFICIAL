import type { ManifestItem } from '../types.js';
import { QUERY_TEMPLATES, DEFAULT_QUERY_TEMPLATES } from '../config.js';

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

function buildVars(item: ManifestItem): Record<string, string> {
  return {
    name: item.name,
    brand: item.brand ?? '',
    model: item.name,
    category: item.category,
    subcategory: item.subcategory ?? '',
    vibe: item.subcategory ?? item.category,
    city: item.city ?? 'Dubai',
    country: item.country ?? 'UAE',
  };
}

export function generateQueries(item: ManifestItem): string[] {
  const key = `${item.vertical}/${item.category}`;
  const templates =
    (QUERY_TEMPLATES as Record<string, string[]>)[key] ??
    (QUERY_TEMPLATES as Record<string, string[]>)[item.vertical] ??
    DEFAULT_QUERY_TEMPLATES;

  const vars = buildVars(item);
  const queries = templates
    .map((t) => interpolate(t, vars))
    .map((q) => q.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (queries.length === 0) {
    queries.push(`${item.name} Dubai luxury`);
  }

  return queries;
}
