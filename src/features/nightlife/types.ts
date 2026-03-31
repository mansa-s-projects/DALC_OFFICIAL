// ─── Nightlife Types ───────────────────────────────────────────────────────────

export type NightlifeCategory =
  | "clubs"
  | "beach-clubs"
  | "restaurants"
  | "dining-entertainment";

export type NightlifeSortBy =
  | "trending"
  | "newest"
  | "price_high"
  | "price_low"
  | "recommended";

export interface NightlifeFilters {
  category?: NightlifeCategory;
  area?: string;
  price_tier?: number[];
  vibe_tags?: string[];
  sort_by?: NightlifeSortBy;
  is_featured?: boolean;
  is_trending?: boolean;
}

export interface NightlifeVenue {
  id: string;
  name: string;
  category: NightlifeCategory;
  subcategory: string;
  location: string;
  area: string;
  vibe_tags: string[];
  price_tier: 1 | 2 | 3 | 4;
  hero_image: string;
  gallery_images: string[];
  description_short: string;
  description_long: string;
  highlights: string[];
  recommend_score: number;
  is_featured: boolean;
  is_trending: boolean;
  trending_score: number;
  opening_hours: string;
  dress_code: string;
  booking_policy: string;
  cuisine?: string;
  best_time?: string;
  who_its_for?: string;
  insider_tip?: string;
  coordinates?: { lat: number; lng: number };
}

export const NIGHTLIFE_CATEGORY_LABELS: Record<NightlifeCategory, string> = {
  clubs: "Night Clubs",
  "beach-clubs": "Beach Clubs",
  restaurants: "Restaurants",
  "dining-entertainment": "Dining & Entertainment",
};

export const NIGHTLIFE_CATEGORY_DESCRIPTIONS: Record<
  NightlifeCategory,
  string
> = {
  clubs: "Exclusive nightclubs with world-class DJs and VIP experiences.",
  "beach-clubs": "Day-to-night beachfront venues with pools and ocean views.",
  restaurants: "Fine dining and culinary hotspots across Dubai.",
  "dining-entertainment": "Dinner shows, cabaret, and immersive dining.",
};
