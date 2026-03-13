// ─── Subcategory & Pricing Types ───────────────────────────────────────────────

export type StaysSubcategory = 'hotels' | 'villas' | 'residences';

export type PricingModel = 'nightly' | 'monthly' | 'yearly' | 'flexible';

export type PropertyStatus = 'available' | 'limited' | 'booked' | 'unavailable';

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

// ─── Seasonal Pricing ──────────────────────────────────────────────────────────

export interface SeasonalPricing {
  season: string;
  start_month: number; // 1-12
  end_month: number;   // 1-12
  multiplier: number;  // e.g., 1.2 for 20% premium
  label: string;
}

// ─── Core Property Entity ──────────────────────────────────────────────────────

export interface StaysProperty {
  id: string;
  subcategory: StaysSubcategory;
  name: string;
  slug: string;
  description_short?: string;
  description_long?: string;
  location: string;
  area: string;
  address?: string;
  coordinates?: { lat: number; lng: number };

  // Media
  hero_image: string;
  gallery_images: string[];

  // Property Details
  bedrooms?: number;
  bathrooms?: number;
  max_guests: number;
  square_meters?: number;
  floor?: number;
  year_built?: number;

  // Hotel-specific
  star_rating?: number; // 3, 4, 5
  hotel_chain?: string;

  // Villa-specific
  beachfront?: boolean;
  private_pool?: boolean;
  staff_included?: boolean;

  // Residence-specific
  lease_terms?: string[]; // ['6_months', '12_months', '24_months']
  furnished?: boolean;

  // Amenities
  amenities: string[];
  amenities_highlight: string[];

  // Pricing
  pricing_model: PricingModel;
  base_price: number;
  price_currency: string;
  price_display?: string;
  seasonal_pricing?: SeasonalPricing[];
  cleaning_fee?: number;
  service_fee?: number;
  security_deposit?: number;
  min_stay_nights?: number;
  max_stay_nights?: number;

  // Availability & Booking
  availability_calendar?: Record<string, PropertyStatus>; // 'YYYY-MM-DD': status
  instant_booking: boolean;
  check_in_time: string; // e.g., "15:00"
  check_out_time: string; // e.g., "11:00"

  // Metadata
  supplier_id?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  popularity_score: number;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

// ─── Availability & Booking ────────────────────────────────────────────────────

export interface StaysAvailability {
  property_id: string;
  date: string; // ISO date
  status: PropertyStatus;
  price_override?: number;
}

export interface StaysBooking {
  id: string;
  property_id: string;
  user_id: string;
  check_in: string; // ISO date
  check_out: string; // ISO date
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;

  // Pricing breakdown
  nights: number;
  base_price_total: number;
  seasonal_adjustment: number;
  cleaning_fee: number;
  service_fee: number;
  security_deposit: number;
  discount_amount: number;
  total_price: number;
  currency: string;

  // Status
  status: BookingStatus;
  confirmation_code?: string;
  cancellation_reason?: string;
  cancelled_at?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
  checked_in_at?: string;
  checked_out_at?: string;

  // Joined
  property?: StaysProperty;
}

// ─── Price Breakdown ───────────────────────────────────────────────────────────

export interface PriceBreakdown {
  nights: number;
  nightly_rate: number;
  base_price_total: number;
  seasonal_adjustment: number;
  cleaning_fee: number;
  service_fee: number;
  security_deposit: number;
  discount_amount: number;
  total_price: number;
  currency: string;
  price_per_night_avg: number;
}

// ─── Filter & Input Types ──────────────────────────────────────────────────────

export interface StaysFilters {
  subcategory?: StaysSubcategory;
  location?: string;
  area?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  price_min?: number;
  price_max?: number;
  star_rating?: number;
  beachfront?: boolean;
  private_pool?: boolean;
  furnished?: boolean;
  instant_booking?: boolean;
  is_featured?: boolean;
}

export interface StaysBookingInput {
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

// ─── Label Maps ────────────────────────────────────────────────────────────────

export const SUBCATEGORY_LABELS: Record<StaysSubcategory, string> = {
  hotels: 'Hotels',
  villas: 'Villas',
  residences: 'Residences',
};

export const SUBCATEGORY_DESCRIPTIONS: Record<StaysSubcategory, string> = {
  hotels: 'Luxury hotels and resorts with world-class amenities and service.',
  villas: 'Private villas with pools, beach access, and exclusive privacy.',
  residences: 'Furnished apartments and long-term rentals for extended stays.',
};

export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  nightly: 'Per Night',
  monthly: 'Per Month',
  yearly: 'Per Year',
  flexible: 'Flexible',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  available: 'Available',
  limited: 'Limited Availability',
  booked: 'Booked',
  unavailable: 'Unavailable',
};

export const AMENITY_ICONS: Record<string, string> = {
  'WiFi': 'wifi',
  'Pool': 'waves',
  'Gym': 'dumbbell',
  'Spa': 'sparkles',
  'Beach Access': 'umbrella',
  'Parking': 'car',
  'Restaurant': 'utensils',
  'Bar': 'wine',
  'Room Service': 'concierge-bell',
  'Concierge': 'headphones',
  'Air Conditioning': 'wind',
  'Kitchen': 'chef-hat',
  'Laundry': 'shirt',
  'Balcony': 'layout-grid',
  'Sea View': 'eye',
  'City View': 'building',
  'Private Pool': 'waves',
  'Garden': 'trees',
  'BBQ': 'flame',
  'Security': 'shield',
  'Elevator': 'arrow-up-down',
  'Pet Friendly': 'dog',
  'Family Friendly': 'users',
  'Business Center': 'briefcase',
  'Meeting Rooms': 'users',
  '24/7 Reception': 'clock',
  'Housekeeping': 'broom',
};
