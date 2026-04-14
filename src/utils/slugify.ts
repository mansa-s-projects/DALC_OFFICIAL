const UAE_EMIRATE_SLUGS = [
  'dubai',
  'abu-dhabi',
  'sharjah',
  'ajman',
  'ras-al-khaimah',
  'fujairah',
  'umm-al-quwain',
] as const;

export type EmirateSlug = typeof UAE_EMIRATE_SLUGS[number];

const AREA_TO_EMIRATE: Record<string, EmirateSlug> = {
  'downtown dubai': 'dubai',
  'dubai marina': 'dubai',
  'palm jumeirah': 'dubai',
  'difc': 'dubai',
  'business bay': 'dubai',
  'jumeirah': 'dubai',
  'deira': 'dubai',
  'bur dubai': 'dubai',
  'jbr': 'dubai',
  'dubai creek': 'dubai',
  'dubai hills': 'dubai',
  'city walk': 'dubai',
  'bluewaters': 'dubai',
  'la mer': 'dubai',
  'dubai': 'dubai',
  'abu dhabi': 'abu-dhabi',
  'abu-dhabi': 'abu-dhabi',
  'yas island': 'abu-dhabi',
  'saadiyat island': 'abu-dhabi',
  'sharjah': 'sharjah',
  'ajman': 'ajman',
  'ras al khaimah': 'ras-al-khaimah',
  'fujairah': 'fujairah',
  'umm al quwain': 'umm-al-quwain',
};

export function toEmirateSlug(area: string, location?: string): EmirateSlug {
  const haystack = (area + ' ' + (location ?? '')).trim().toLowerCase();
  const entries = Object.entries(AREA_TO_EMIRATE).sort(([a], [b]) => b.length - a.length);
  for (const [key, emirate] of entries) {
    if (haystack.includes(key)) return emirate;
  }
  return 'dubai';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateVenueSlug(name: string, area?: string): string {
  const nameSlug = slugify(name);
  const areaSlug = area ? slugify(area) : '';
  if (!nameSlug) return areaSlug;
  return areaSlug ? `${nameSlug}-${areaSlug}` : nameSlug;
}

export function deduplicateSlug(
  base: string,
  existingSlugs: Set<string>,
): string {
  if (!existingSlugs.has(base)) return base;
  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) counter++;
  return `${base}-${counter}`;
}

export function isLegacyVenueId(segment: string): boolean {
  return (
    segment.startsWith('r-') ||
    segment.startsWith('bc-') ||
    segment.startsWith('nc-') ||
    segment.startsWith('de-') ||
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment)
  );
}
