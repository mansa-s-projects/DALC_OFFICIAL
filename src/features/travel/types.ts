// ─── Travel Types ──────────────────────────────────────────────────────────────

export type TravelSubcategory =
  | "flights"
  | "hotels"
  | "residences"
  | "car-rental"
  | "jets";

export type TravelSortBy =
  | "recommended"
  | "price_low"
  | "price_high"
  | "newest"
  | "rating";

export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type FlightType = "round_trip" | "one_way" | "multi_city";

export type JetCategory =
  | "light"
  | "midsize"
  | "super-midsize"
  | "large"
  | "ultra-long-range"
  | "vip-airliner";

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

// ─── Airport ──────────────────────────────────────────────────────────────────

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  region: string;
}

// ─── Flight Search ────────────────────────────────────────────────────────────

export interface FlightSearchParams {
  type: FlightType;
  origin: Airport | null;
  destination: Airport | null;
  depart_date: string;
  return_date: string;
  adults: number;
  children: number;
  infants: number;
  cabin_class: CabinClass;
}

// ─── Hotel ────────────────────────────────────────────────────────────────────

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  stars: number;
  rating: number;
  reviews: number;
  price_from: number;
  currency: string;
  image: string;
  amenities: string[];
  location: string;
  badge?: string;
  popular: boolean;
  featured: boolean;
  description: string;
}

export interface HotelSearchParams {
  destination: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  stars_min?: number;
  price_max?: number;
}

// ─── Private Jet ─────────────────────────────────────────────────────────────

export interface Aircraft {
  id: string;
  category: JetCategory;
  name: string;
  manufacturer: string;
  capacity: number;
  range_km: number;
  speed_kmh: number;
  price_from_hour: number;
  currency: string;
  image: string;
  features: string[];
  ideal_for: string;
  popular_routes: string[];
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const TRAVEL_SUBCATEGORY_LABELS: Record<TravelSubcategory, string> = {
  flights: "Flights",
  hotels: "Hotels",
  residences: "Residences",
  "car-rental": "Car Rental",
  jets: "Private Jets",
};

export const TRAVEL_SUBCATEGORY_DESCRIPTIONS: Record<TravelSubcategory, string> = {
  flights: "Book commercial & private flights worldwide.",
  hotels: "Premium hotels and resorts across the globe.",
  residences: "Furnished apartments for extended stays.",
  "car-rental": "Luxury and exotic car rentals.",
  jets: "Private jet and helicopter charters.",
};

export const CABIN_CLASS_LABELS: Record<CabinClass, string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class",
};

export const JET_CATEGORY_LABELS: Record<JetCategory, string> = {
  light: "Light Jet",
  midsize: "Midsize Jet",
  "super-midsize": "Super Midsize",
  large: "Large Jet",
  "ultra-long-range": "Ultra Long Range",
  "vip-airliner": "VIP Airliner",
};
