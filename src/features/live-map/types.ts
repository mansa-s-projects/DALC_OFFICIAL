// ─── Live Map Types ────────────────────────────────────────────────────────────

export type MapCategory =
  | "all"
  | "restaurants"
  | "beach-clubs"
  | "night-clubs"
  | "dining-entertainment"
  | "experiences"
  | "transport"
  | "stays";

export interface MapVenue {
  id: string;
  name: string;
  category: string;
  description?: string;
  latitude: number;
  longitude: number;
  area?: string;
  hero_image?: string;
  price_tier?: number;
}

export interface MapViewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface MapFilterOption {
  id: MapCategory;
  label: string;
  color: string;
}

export const MAP_FILTER_OPTIONS: MapFilterOption[] = [
  { id: "all", label: "All", color: "#C8A46B" },
  { id: "restaurants", label: "Dining", color: "#E74C3C" },
  { id: "beach-clubs", label: "Beach Clubs", color: "#3498DB" },
  { id: "night-clubs", label: "Nightlife", color: "#9B59B6" },
  { id: "experiences", label: "Experiences", color: "#2ECC71" },
  { id: "transport", label: "Transport", color: "#F39C12" },
  { id: "stays", label: "Travel Stays", color: "#1ABC9C" },
];
