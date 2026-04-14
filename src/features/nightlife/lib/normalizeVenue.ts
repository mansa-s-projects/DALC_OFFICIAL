import { Category, Venue } from '../../../types';
import { applyLocalImages } from '../../../data/venues/venueImages';

const VENUE_DEFAULTS: Omit<Venue, 'id' | 'name' | 'category'> = {
  subcategory: 'Curated Venue',
  location: 'Dubai',
  area: 'Dubai',
  vibe_tags: [],
  price_tier: 2,
  hero_image: '/images/restaurants/Bagatelle/image1.jpg',
  gallery_images: [],
  description_short: 'Curated by Dubai A La Carte.',
  description_long: 'This venue is available through our concierge experience.',
  skills: [],
  highlights: ['Concierge Access'],
  recommend_score: 85,
  opening_hours: 'Contact concierge',
  dress_code: 'Smart Casual',
  booking_policy: 'Reservation required',
};

export function normalizeVenue(raw: Record<string, unknown>): Venue {
  const category = (raw.category ?? 'dining') as Category;
  const priceTier = Number(raw.price_tier ?? 2);

  const base = {
    id: String(raw.id),
    name: String(raw.name ?? 'Untitled Venue'),
    category,
    subcategory: (raw.subcategory as string) ?? VENUE_DEFAULTS.subcategory,
    location: (raw.location as string) ?? VENUE_DEFAULTS.location,
    area: (raw.area as string) ?? VENUE_DEFAULTS.area,
    vibe_tags: Array.isArray(raw.vibe_tags) ? (raw.vibe_tags as string[]) : VENUE_DEFAULTS.vibe_tags,
    price_tier: (Math.min(Math.max(priceTier, 1), 4) as 1 | 2 | 3 | 4),
    hero_image: (raw.hero_image as string) ?? VENUE_DEFAULTS.hero_image,
    gallery_images: Array.isArray(raw.gallery_images) ? (raw.gallery_images as string[]) : VENUE_DEFAULTS.gallery_images,
    description_short: (raw.description_short as string) ?? VENUE_DEFAULTS.description_short,
    description_long: (raw.description_long as string) ?? VENUE_DEFAULTS.description_long,
    highlights: Array.isArray(raw.highlights) ? (raw.highlights as string[]) : VENUE_DEFAULTS.highlights,
    recommend_score: Number(raw.recommend_score ?? VENUE_DEFAULTS.recommend_score),
    skills: Array.isArray(raw.skills) ? (raw.skills as Venue['skills']) : VENUE_DEFAULTS.skills,
    is_featured: Boolean(raw.is_featured),
    is_trending: Boolean(raw.is_trending),
    trending_score: Number(raw.trending_score ?? 0),
    opening_hours: (raw.opening_hours as string) ?? VENUE_DEFAULTS.opening_hours,
    dress_code: (raw.dress_code as string) ?? VENUE_DEFAULTS.dress_code,
    booking_policy: (raw.booking_policy as string) ?? VENUE_DEFAULTS.booking_policy,
    cuisine: raw.cuisine as string | undefined,
    best_time: raw.best_time as string | undefined,
    who_its_for: raw.who_its_for as string | undefined,
    insider_tip: raw.insider_tip as string | undefined,
    coordinates: raw.coordinates as { lat: number; lng: number } | undefined,
    slug: (raw.slug as string) ?? undefined,
    emirate: (raw.emirate_slug as string) ?? (raw.emirate as string) ?? 'dubai',
    category_slug: (raw.category_slug as string) ?? undefined,
    seo_title: (raw.seo_title as string) ?? undefined,
    seo_description: (raw.seo_description as string) ?? undefined,
    canonical_url: (raw.canonical_url as string) ?? undefined,
    booking_mode: (raw.booking_mode as Venue['booking_mode']) ?? 'request',
    booking_url: (raw.booking_url as string) ?? undefined,
    whatsapp_number: (raw.whatsapp_number as string) ?? undefined,
    min_spend_aed: raw.min_spend_aed != null ? Number(raw.min_spend_aed) : undefined,
    latitude: raw.latitude != null ? Number(raw.latitude) : undefined,
    longitude: raw.longitude != null ? Number(raw.longitude) : undefined,
    view_count: Number(raw.view_count ?? 0),
    published_at: (raw.published_at as string) ?? undefined,
  };

  const localImages = applyLocalImages(base);
  return {
    ...base,
    hero_image: localImages.hero_image,
    gallery_images: localImages.gallery_images,
  };
}
