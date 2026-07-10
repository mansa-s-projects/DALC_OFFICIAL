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
      url: `${BASE}/experiences/desertAdventure/${sub.slug}`,
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

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/explore`, changeFrequency: 'daily', priority: 0.9 },
    ...experienceUrls,
    { url: `${BASE}/nightlife`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/nightlife/clubs`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/nightlife/beach-clubs`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/nightlife/restaurants`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/nightlife/dining`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/nightlife/private-events`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/travel`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/travel/flights`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/travel/hotels`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/travel/jets`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/travel/car-rental`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/services`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/services/golden-visa`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/services/business-setup`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/services/real-estate`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/services/visas`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/services/event-planning`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/services/wellness`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/services/vip-security`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/business`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/transport`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/move-to-dubai`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/journal`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/journal/best-beach-clubs-dubai`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/journal/dubai-desert-safari-guide`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/journal/move-to-dubai-guide`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/journal/dubai-golden-visa-guide`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/journal/private-yacht-charter-dubai`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/journal/downtown-dubai-guide`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/journal/palm-jumeirah-guide`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/journal/dubai-marina-guide`, changeFrequency: 'weekly', priority: 0.75 },
  ];

  return [
    ...staticUrls,
    ...emirateUrls,
    ...categoryUrls,
    ...venueUrls,
  ];
}
