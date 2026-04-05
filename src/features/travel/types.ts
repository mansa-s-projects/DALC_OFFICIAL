// ─── Travel Types ──────────────────────────────────────────────────────────────

export type TravelSubcategory =
  | "hotels"
  | "villas"
  | "residences"
  | "car-rental"
  | "jets";

export type TravelSortBy =
  | "recommended"
  | "price_low"
  | "price_high"
  | "newest";

export interface TravelFilters {
  subcategory?: TravelSubcategory;
  location?: string;
  area?: string;
  price_min?: number;
  price_max?: number;
  check_in?: string;
  check_out?: string;
  guests?: number;
  sort_by?: TravelSortBy;
  is_featured?: boolean;
}

export interface TravelItem {
  id: string;
  subcategory: TravelSubcategory;
  name: string;
  slug: string;
  description_short?: string;
  location: string;
  area: string;
  hero_image: string;
  gallery_images: string[];
  price_from?: number;
  price_currency: string;
  price_display?: string;
  is_featured: boolean;
  popularity_score: number;
  href: string;
}

export const TRAVEL_SUBCATEGORY_LABELS: Record<TravelSubcategory, string> = {
  hotels: "Hotels",
  villas: "Villas",
  residences: "Residences",
  "car-rental": "Car Rental",
  jets: "Private Jets",
};

export const TRAVEL_SUBCATEGORY_DESCRIPTIONS: Record<
  TravelSubcategory,
  string
> = {
  hotels: "Premium hotels and resorts in Dubai.",
  villas: "Private luxury villas with exclusive amenities.",
  residences: "Furnished apartments for extended stays.",
  "car-rental": "Luxury and exotic car rentals.",
  jets: "Private jet and helicopter charters.",
};
