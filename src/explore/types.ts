export interface ExploreLocation {
  id: string;
  name: string;
  short_description: string | null;
  latitude: number;
  longitude: number;
  is_hidden_gem: boolean;
  created_at: string;
  emirate?: string | null;
  category?: string | null;
}

export interface ExploreFilterState {
  emirate: string;
  category: string;
  hiddenGems: 'all' | 'true' | 'false';
  search: string;
}

export const DEFAULT_FILTERS: ExploreFilterState = {
  emirate: 'All Emirates',
  category: 'All Categories',
  hiddenGems: 'all',
  search: '',
};
