import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from '@/lib/supabase-admin';
import { DALC_EXPERIENCE_CATEGORIES } from '@/features/experiences/catalog';
import { DESERT_SUBCATEGORIES } from '@/features/experiences/desertData';
import { WATER_MODELS } from '@/features/experiences/waterData';
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaialacharte.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const experienceUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/experiences`, changeFrequency: 'daily', priority: 0.9 },
    ...DALC_EXPERIENCE_CATEGORIES.map((cat) => ({
      url: `${BASE}/experiences/${cat.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...DESERT_SUBCATEGORIES.map((sub) => ({
      url: `${BASE}/experiences/desert-adventures/${sub.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...WATER_MODELS.map((model) => ({
      url: `${BASE}/experiences/water-activities/${model.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  if (!hasSupabaseAdminCredentials()) {
    return [
      { url: `${BASE}/`, changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE}/explore`, changeFrequency: 'daily', priority: 0.9 },
      ...experienceUrls,
    ];
  }

  const admin = getSupabaseAdminClient();

  const [venuesResult, emiratesResult, categoriesResult] = await Promise.all([
    admin
      .from('venues')
      .select('slug, updated_at, emirates!emirate_id(slug)')
      .eq('status', 'published')
      .not('slug', 'is', null),
    admin.from('emirates').select('slug').eq('is_active', true),
    admin.from('venue_categories').select('slug').eq('is_active', true),
  ]);

  type EmirateLookup = { slug: string } | { slug: string }[] | null;

  const venueUrls: MetadataRoute.Sitemap = (venuesResult.data ?? []).map((v) => {
    const emirateLookup = v.emirates as EmirateLookup;
    const emirateSlug = Array.isArray(emirateLookup)
      ? emirateLookup[0]?.slug ?? 'dubai'
      : emirateLookup?.slug ?? 'dubai';
    return {
      url: `${BASE}/venue/${emirateSlug}/${v.slug}`,
      lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const emirates = emiratesResult.data ?? [];
  const categories = categoriesResult.data ?? [];

  const categoryUrls: MetadataRoute.Sitemap = emirates.flatMap((e) =>
    categories.map((c) => ({
      url: `${BASE}/explore/${e.slug}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  );

  const emirateUrls: MetadataRoute.Sitemap = emirates.map((e) => ({
    url: `${BASE}/explore/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/explore`, changeFrequency: 'daily', priority: 0.9 },
    ...experienceUrls,
    ...emirateUrls,
    ...categoryUrls,
    ...venueUrls,
  ];
}
