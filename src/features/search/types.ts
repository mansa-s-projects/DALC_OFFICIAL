// ─── Search Types ──────────────────────────────────────────────────────────────

export type SearchResultType =
  | "venue"
  | "experience"
  | "transport"
  | "business"
  | "stay";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  category: string;
  area: string;
  image: string;
  slug: string;
  href: string;
  price_tier?: number;
  score?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  hasQuery: boolean;
}

export interface SearchSuggestionItem {
  label: string;
  category?: string;
  href?: string;
}

export const SEARCH_RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  venue: "Venue",
  experience: "Experience",
  transport: "Transport",
  business: "Business",
  stay: "Stay",
};
