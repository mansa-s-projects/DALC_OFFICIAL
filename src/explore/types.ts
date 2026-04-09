export interface ExploreLocation {
  id: string;
  name: string;
  short_description: string | null;
  long_description?: string | null;
  latitude: number;
  longitude: number;
  emirate: string;
  area?: string | null;
  category: string;
  subcategory?: string | null;
  is_hidden_gem: boolean;
  is_featured: boolean;
  hero_image?: string | null;
  gallery_images?: string[];
  tags?: string[];
  vibe?: string | null;
  price_tier?: number;
  opening_hours?: string | null;
  best_time?: string | null;
  insider_tip?: string | null;
  booking_url?: string | null;
  source_venue_id?: string | null;
  recommend_score?: number;
  view_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface ExploreFilterState {
  emirate: string;
  category: string;
  hiddenGems: 'all' | 'true' | 'false';
  featured: 'all' | 'true';
  search: string;
  priceTier: 'all' | '1' | '2' | '3' | '4';
}

export const DEFAULT_FILTERS: ExploreFilterState = {
  emirate: 'All Emirates',
  category: 'All Categories',
  hiddenGems: 'all',
  featured: 'all',
  search: '',
  priceTier: 'all',
};
