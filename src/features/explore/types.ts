// ─── Explore Types ─────────────────────────────────────────────────────────────

export type ExploreCategory =
  | "restaurants"
  | "beach-clubs"
  | "night-clubs"
  | "dining-entertainment"
  | "experiences"
  | "transport"
  | "stays"
  | "business"
  | "wellness";

export type ExploreSortBy =
  | "trending"
  | "newest"
  | "price_low"
  | "price_high"
  | "recommended";

export interface ExploreFilter {
  category?: ExploreCategory;
  subcategory?: string;
  area?: string;
  price_tier?: number[];
  vibe_tags?: string[];
  sort_by?: ExploreSortBy;
}

export interface ExploreItem {
  id: string;
  type: "venue" | "experience" | "transport" | "stay" | "business";
  title: string;
  subtitle: string;
  category: ExploreCategory;
  area: string;
  image: string;
  href: string;
  price_tier?: number;
  is_featured?: boolean;
  is_trending?: boolean;
  trending_score?: number;
}

export const EXPLORE_CATEGORY_LABELS: Record<ExploreCategory, string> = {
  restaurants: "Restaurants",
  "beach-clubs": "Beach Clubs",
  "night-clubs": "Night Clubs",
  "dining-entertainment": "Dining & Entertainment",
  experiences: "Experiences",
  transport: "Transport",
  stays: "Stays",
  business: "Business",
  wellness: "Wellness",
};
