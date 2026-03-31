import { useQuery } from '@tanstack/react-query';
import { Venue } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { applyLocalImages } from '../../../data/venueImages';

function normalizeVenue(raw: any): Venue {
  const priceTier = Number(raw.price_tier ?? 2);

  const base = {
    id: String(raw.id),
    name: String(raw.name ?? 'Untitled Venue'),
    category: raw.category ?? 'dining',
    subcategory: raw.subcategory ?? 'Curated Venue',
    location: raw.location ?? 'Dubai',
    area: raw.area ?? 'Dubai',
    vibe_tags: Array.isArray(raw.vibe_tags) ? raw.vibe_tags : [],
    price_tier: (Math.min(Math.max(priceTier, 1), 4) as 1 | 2 | 3 | 4),
    hero_image: raw.hero_image ?? '/images/restaurants/Bagatelle/image1.jpg',
    gallery_images: Array.isArray(raw.gallery_images) ? raw.gallery_images : [],
    description_short: raw.description_short ?? 'Curated by Dubai A La Carte.',
    description_long: raw.description_long ?? 'This venue is available through our concierge experience.',
    highlights: Array.isArray(raw.highlights) ? raw.highlights : ['Concierge Access'],
    recommend_score: Number(raw.recommend_score ?? 85),
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    is_featured: Boolean(raw.is_featured),
    is_trending: Boolean(raw.is_trending),
    trending_score: Number(raw.trending_score ?? 0),
    opening_hours: raw.opening_hours ?? 'Contact concierge',
    dress_code: raw.dress_code ?? 'Smart Casual',
    booking_policy: raw.booking_policy ?? 'Reservation required',
    cuisine: raw.cuisine,
    best_time: raw.best_time,
    who_its_for: raw.who_its_for,
    insider_tip: raw.insider_tip,
    coordinates: raw.coordinates,
  };

  const localImages = applyLocalImages(base);
  return {
    ...base,
    hero_image: localImages.hero_image,
    gallery_images: localImages.gallery_images,
  };
}

export function useVenue(id?: string | null) {
  return useQuery({
    queryKey: ['venue', id],
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!id) throw new Error('Venue id is required.');

      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return normalizeVenue(data);
      } catch {
        // Fallback to mock data
        const { MOCK_VENUES } = await import('../../../data/mockData');
        const mockVenue = MOCK_VENUES.find(v => v.id === id);
        if (mockVenue) return mockVenue;
        throw new Error('Venue not found');
      }
    },
  });
}
