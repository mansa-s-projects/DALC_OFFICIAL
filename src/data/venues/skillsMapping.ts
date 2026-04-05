import { Category, UserSkill, Venue } from '../../types';
import { applyLocalImages } from './venueImages';

/**
 * Infer skills for a venue based on its category, vibe_tags, price_tier, and other fields.
 * This enriches existing mock data without modifying every venue manually.
 */

const CATEGORY_SKILLS: Record<Category, UserSkill[]> = {
  restaurants: ['FOODIE', 'NETWORKING'],
  'night-clubs': ['NIGHTLIFE', 'SOCIALITE'],
  dining: ['FOODIE', 'NETWORKING'],
  nightlife: ['NIGHTLIFE', 'SOCIALITE'],
  'beach-clubs': ['WELLNESS', 'SOCIALITE'],
  'dining-entertainment': ['FOODIE', 'SOCIALITE', 'NIGHTLIFE'],
  yachts: ['LUXURY', 'ADVENTURE'],
  travel: ['LUXURY', 'ADVENTURE'],
  'car-rental': ['LUXURY'],
  experiences: ['ADVENTURE', 'CULTURAL'],
  wellness: ['WELLNESS'],
  shopping: ['LUXURY'],
  business: ['NETWORKING', 'DEAL_MAKING'],
  concierge: ['LUXURY', 'NETWORKING'],
  events: ['SOCIALITE', 'NETWORKING'],
  sports: ['ADVENTURE'],
  transport: ['LUXURY'],
};

const VIBE_SKILL_MAP: Record<string, UserSkill> = {
  // Nightlife vibes
  'Techno': 'NIGHTLIFE',
  'House': 'NIGHTLIFE',
  'Deep House': 'NIGHTLIFE',
  'Hip Hop': 'NIGHTLIFE',
  'Afrobeats': 'NIGHTLIFE',
  'DJ': 'NIGHTLIFE',
  'Live Music': 'NIGHTLIFE',
  'High Energy': 'NIGHTLIFE',
  'Afterparty': 'NIGHTLIFE',
  'Late Night': 'NIGHTLIFE',
  'Festival': 'NIGHTLIFE',
  'Party': 'NIGHTLIFE',

  // Social vibes
  'Exclusive': 'SOCIALITE',
  'SEE_AND_BE_SEEN': 'SOCIALITE',
  'See-and-be-seen': 'SOCIALITE',
  'Rooftop': 'SOCIALITE',
  'Views': 'SOCIALITE',
  'Glamorous': 'SOCIALITE',
  'Chic': 'SOCIALITE',
  'Social': 'SOCIALITE',
  'Theatrical': 'SOCIALITE',

  // Luxury vibes
  'Luxury': 'LUXURY',
  'VIP': 'LUXURY',
  'Opulent': 'LUXURY',
  'Private': 'LUXURY',
  'Ultra VIP': 'LUXURY',
  'Bottle Service': 'LUXURY',

  // Food vibes
  'Michelin': 'FOODIE',
  'Celebrity Chef': 'FOODIE',
  'Ceviche': 'FOODIE',
  'Tasting': 'FOODIE',
  'Fusion': 'FOODIE',

  // Cultural vibes
  'Cuban': 'CULTURAL',
  'Greek': 'CULTURAL',
  'Bedouin': 'CULTURAL',
  'Tokyo': 'CULTURAL',
  'Shanghai 30s': 'CULTURAL',
  'Parisian': 'CULTURAL',
  '1960s': 'CULTURAL',
  'Speakeasy': 'CULTURAL',
  'Jazz': 'CULTURAL',
  'Artistic': 'CULTURAL',

  // Wellness vibes
  'Sunset': 'WELLNESS',
  'Relaxed': 'WELLNESS',
  'Beachfront': 'WELLNESS',
  'Waterfront': 'WELLNESS',

  // Adventure vibes
  'Desert': 'ADVENTURE',
  'Water': 'ADVENTURE',
  'Outdoor': 'ADVENTURE',
  'Open Air': 'ADVENTURE',

  // Networking vibes
  'Business': 'NETWORKING',
  'Corporate': 'NETWORKING',
  'Sophisticated': 'NETWORKING',
  'Classic': 'NETWORKING',
  'Intimate': 'DEAL_MAKING',

  // Family vibes
  'Family': 'FAMILY',
  'Casual': 'FAMILY',
};

export function inferSkills(venue: Omit<Venue, 'skills'>): UserSkill[] {
  const skillSet = new Set<UserSkill>();

  // Add category-based skills
  const categorySkills = CATEGORY_SKILLS[venue.category] || [];
  categorySkills.forEach((s) => skillSet.add(s));

  // Add vibe-based skills
  for (const vibe of venue.vibe_tags) {
    const skill = VIBE_SKILL_MAP[vibe];
    if (skill) skillSet.add(skill);
  }

  // Price tier 4 always implies LUXURY
  if (venue.price_tier === 4) {
    skillSet.add('LUXURY');
  }

  // Featured venues are typically SOCIALITE
  if (venue.is_featured) {
    skillSet.add('SOCIALITE');
  }

  // who_its_for inference
  const whoFor = (venue.who_its_for || '').toLowerCase();
  if (whoFor.includes('business') || whoFor.includes('elite')) skillSet.add('NETWORKING');
  if (whoFor.includes('family') || whoFor.includes('families')) skillSet.add('FAMILY');
  if (whoFor.includes('couple')) skillSet.add('DEAL_MAKING');
  if (whoFor.includes('foodie') || whoFor.includes('gourmand')) skillSet.add('FOODIE');
  if (whoFor.includes('vip') || whoFor.includes('baller')) skillSet.add('LUXURY');

  return Array.from(skillSet);
}

// Trending scores based on venue characteristics (simulating real-time data)
const TRENDING_OVERRIDES: Record<string, { is_trending: boolean; trending_score: number }> = {
  'nc-nyx': { is_trending: true, trending_score: 98 },
  'nc-raspoutine': { is_trending: true, trending_score: 95 },
  'nc-paraiso': { is_trending: true, trending_score: 96 },
  'nc-soho-meydan': { is_trending: true, trending_score: 92 },
  'nc-ongaku': { is_trending: true, trending_score: 94 },
  'nc-epik': { is_trending: true, trending_score: 90 },
  'r-verde-fs': { is_trending: true, trending_score: 93 },
  'r-coucou': { is_trending: true, trending_score: 91 },
  'r-ling-ling': { is_trending: true, trending_score: 97 },
  'r-hakkasan': { is_trending: true, trending_score: 88 },
  'r-il-gattopardo': { is_trending: true, trending_score: 86 },
  'nc-babylon-club': { is_trending: true, trending_score: 89 },
};

/**
 * Enrich a venue with inferred skills and trending data.
 */
export function enrichVenue(venue: Omit<Venue, 'skills'> & { skills?: UserSkill[] }): Venue {
  const trending = TRENDING_OVERRIDES[venue.id];
  const localImages = applyLocalImages(venue as any);
  return {
    ...venue,
    hero_image: localImages.hero_image,
    gallery_images: localImages.gallery_images,
    skills: venue.skills?.length ? venue.skills : inferSkills(venue),
    is_trending: trending?.is_trending ?? venue.is_trending ?? false,
    trending_score: trending?.trending_score ?? venue.trending_score ?? Math.round(venue.recommend_score * 0.8),
  };
}

/**
 * Enrich all venues in the mock data array.
 */
export function enrichVenues(venues: Array<Omit<Venue, 'skills'> & { skills?: UserSkill[] }>): Venue[] {
  return venues.map(enrichVenue);
}
