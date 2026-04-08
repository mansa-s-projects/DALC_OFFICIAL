// ─── Transport Subcategory Types ───────────────────────────────────────────────

export type TransportSubcategory = 'cars' | 'yachts' | 'jets';

export type PricingModel = 'hourly' | 'daily' | 'fixed' | 'per_trip' | 'custom';

export type AvailabilityType = 'on_demand' | 'scheduled' | 'seasonal' | 'by_request';

export type TransportStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// ─── Specification Types ─────────────────────────────────────────────────────────

interface CarSpecifications {
  make?: string;
  model?: string;
  year?: number;
  seats?: number;
  transmission?: string;
  fuel?: string;
  color?: string;
  engine?: string;
  horsepower?: string;
  acceleration_0_100?: string;
  top_speed?: string;
}

interface YachtSpecifications {
  length_ft?: number;
  cabins?: number;
  crew_size?: number;
  max_guests?: number;
  builder?: string;
  year_built?: number;
  beam_ft?: number;
  draft_ft?: number;
  cruising_speed?: string;
  range_nm?: number;
}

interface JetSpecifications {
  aircraft_type?: string;
  range_km?: number;
  seats?: number;
  luggage_capacity?: string;
  cruising_speed?: string;
  max_altitude?: string;
  year_manufactured?: number;
  operator?: string;
}

export type TransportSpecifications = CarSpecifications | YachtSpecifications | JetSpecifications;

// ─── Core Transport Service Interface ───────────────────────────────────────────

export interface TransportService {
  id: string;
  category: 'transport';
  subcategory: TransportSubcategory;
  sub_subcategory?: string;
  name: string;
  slug: string;
  description_short?: string;
  description_long?: string;
  hero_image?: string;
  gallery_images: string[];
  highlights: string[];
  
  // Pricing
  pricing_model: PricingModel;
  price_from?: number;
  price_currency: string;
  price_display?: string;
  
  // Availability
  availability_type: AvailabilityType;
  available_days: string[];
  max_capacity?: number;
  min_booking_hours: number;
  advance_booking_hours: number;
  
  // Specifications (flexible JSONB for vehicle/vessel/aircraft details)
  specifications: TransportSpecifications;
  
  // Location
  location: string;
  area?: string;
  pickup_locations: string[];
  coordinates?: { lat: number; lng: number };
  
  // Supplier
  supplier_id?: string;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Admin
  is_featured: boolean;
  is_trending: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

// ─── Transport Booking Interface ────────────────────────────────────────────────

export interface TransportBooking {
  id: string;
  request_id?: string;
  service_id: string;
  user_id: string;
  
  // Booking details
  pickup_date: string;
  return_date?: string;
  pickup_location?: string;
  dropoff_location?: string;
  duration_hours?: number;
  
  // Optional links
  relocation_profile_id?: string;
  workflow_step_id?: string;
  
  // Pricing
  quoted_price?: number;
  final_price?: number;
  currency: string;
  
  // Status
  status: TransportStatus;
  
  created_at?: string;
  updated_at?: string;
  
  // Joined
  service?: TransportService;
}

// ─── Filter Types ───────────────────────────────────────────────────────────────

export interface TransportFilters {
  subcategory?: TransportSubcategory;
  sub_subcategory?: string;
  pricing_model?: PricingModel;
  price_min?: number;
  price_max?: number;
  availability_type?: AvailabilityType;
  search?: string;
  featured_only?: boolean;
  capacity_min?: number;
  // Car-specific
  transmission?: string;
  fuel_type?: string;
  // Yacht-specific
  min_length_ft?: number;
  max_length_ft?: number;
  crew_included?: boolean;
  // Jet-specific
  aircraft_type?: string;
  min_range_km?: number;
}

// ─── Input Types ────────────────────────────────────────────────────────────────

export interface TransportBookingInput {
  service_id: string;
  user_id: string;
  pickup_date: string;
  return_date?: string;
  pickup_location?: string;
  dropoff_location?: string;
  duration_hours?: number;
  relocation_profile_id?: string;
  workflow_step_id?: string;
  quoted_price?: number;
  special_requests?: string;
}

// ─── Availability Types ─────────────────────────────────────────────────────────

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  alternative_dates?: string[];
  price_estimate?: number;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

// ─── Label Maps ─────────────────────────────────────────────────────────────────

export const SUBCATEGORY_LABELS: Record<TransportSubcategory, string> = {
  cars: 'Luxury Cars',
  yachts: 'Yacht Charter',
  jets: 'Private Jets',
};

export const SUBCATEGORY_DESCRIPTIONS: Record<TransportSubcategory, string> = {
  cars: 'From luxury sedans to supercars — experience Dubai in style.',
  yachts: 'Cruise the Arabian Gulf on a private yacht with full crew.',
  jets: 'Charter private jets and helicopters for business or leisure.',
};

export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  hourly: 'Per Hour',
  daily: 'Per Day',
  fixed: 'Fixed Price',
  per_trip: 'Per Trip',
  custom: 'Custom Quote',
};

export const AVAILABILITY_TYPE_LABELS: Record<AvailabilityType, string> = {
  on_demand: 'On Demand',
  scheduled: 'Scheduled',
  seasonal: 'Seasonal',
  by_request: 'By Request',
};

export const STATUS_LABELS: Record<TransportStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ─── Sub-subcategory Maps ───────────────────────────────────────────────────────

export const CAR_SUBCATEGORIES = [
  { value: 'economy', label: 'Economy' },
  { value: 'standard', label: 'Standard' },
  { value: 'luxury-sedans', label: 'Luxury Sedans' },
  { value: 'business', label: 'Business' },
  { value: 'sports-cars', label: 'Sports Cars' },
  { value: 'electric', label: 'Electric' },
  { value: 'suvs', label: 'SUVs' },
  { value: 'chauffeur-service', label: 'Chauffeur Service' },
  { value: 'long-term-rental', label: 'Long Term Rental' },
];

export const YACHT_SUBCATEGORIES = [
  { value: 'day-cruises', label: 'Day Cruises' },
  { value: 'overnight-charters', label: 'Overnight Charters' },
  { value: 'fishing-trips', label: 'Fishing Trips' },
  { value: 'party-yachts', label: 'Party Yachts' },
];

export const JET_SUBCATEGORIES = [
  { value: 'private-charter', label: 'Private Charter' },
  { value: 'shared-flights', label: 'Shared Flights' },
  { value: 'helicopter-tours', label: 'Helicopter Tours' },
];

// ─── Specification Labels by Subcategory ────────────────────────────────────────

export const CAR_SPEC_LABELS: Record<string, string> = {
  make: 'Make',
  model: 'Model',
  year: 'Year',
  seats: 'Seats',
  transmission: 'Transmission',
  fuel: 'Fuel Type',
  color: 'Color',
  engine: 'Engine',
  horsepower: 'Horsepower',
  acceleration_0_100: '0-100 km/h',
  top_speed: 'Top Speed',
};

export const YACHT_SPEC_LABELS: Record<string, string> = {
  length_ft: 'Length',
  cabins: 'Cabins',
  crew_size: 'Crew',
  max_guests: 'Max Guests',
  builder: 'Builder',
  year_built: 'Year Built',
  beam_ft: 'Beam',
  draft_ft: 'Draft',
  cruising_speed: 'Cruising Speed',
  range_nm: 'Range',
};

export const JET_SPEC_LABELS: Record<string, string> = {
  aircraft_type: 'Aircraft Type',
  range_km: 'Range',
  seats: 'Seats',
  luggage_capacity: 'Luggage Capacity',
  cruising_speed: 'Cruising Speed',
  max_altitude: 'Max Altitude',
  year_manufactured: 'Year',
  operator: 'Operator',
};
