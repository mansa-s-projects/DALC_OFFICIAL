// ─── Subcategory Types ───────────────────────────────────────────────────────

export type ExperienceSubcategory =
  | 'nightlife'
  | 'adventure'
  | 'dining'
  | 'water'
  | 'sky'
  | 'wellness'
  | 'culture';

export type ServiceType = 'event' | 'recurring' | 'on_demand' | 'seasonal';

export type PricingModel = 'per_person' | 'per_group' | 'fixed' | 'tiered' | 'free';

export type TicketStatus = 'active' | 'used' | 'expired' | 'refunded';

export type ExperienceStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type AvailabilityType = 'time_slot' | 'date_based' | 'always' | 'by_request';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface PricingTier {
  tier: string;
  price: number;
  description?: string;
  includes?: string[];
  max_guests?: number;
}

export interface TimeSlotConfig {
  day: string;
  start: string;
  end: string;
  capacity: number;
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
  remaining_capacity?: number;
}

export interface CapacityResult {
  available: boolean;
  total_capacity: number;
  booked_count: number;
  remaining: number;
  is_filling_up: boolean;
  percent_full: number;
}

export interface ExperienceService {
  id: string;
  subcategory: ExperienceSubcategory;
  sub_subcategory?: string;
  name: string;
  slug: string;
  description_short?: string;
  description_long?: string;
  hero_image?: string;
  gallery_images: string[];
  highlights: string[];
  vibe_tags: string[];
  service_type: ServiceType;
  pricing_model: PricingModel;
  price_from?: number;
  price_currency: string;
  price_display?: string;
  pricing_tiers: PricingTier[];
  max_capacity?: number;
  current_bookings: number;
  availability_type: AvailabilityType;
  time_slots: TimeSlotConfig[];
  event_date?: string;
  event_end_date?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  duration_minutes?: number;
  location: string;
  area?: string;
  venue_name?: string;
  coordinates?: { lat: number; lng: number };
  age_minimum?: number;
  dress_code?: string;
  requirements: string[];
  included: string[];
  excluded: string[];
  supplier_id?: string;
  is_featured: boolean;
  is_trending: boolean;
  trending_score: number;
  booking_count: number;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived' | 'sold_out';
  created_at?: string;
  updated_at?: string;
}

export interface ExperienceBooking {
  id: string;
  request_id?: string;
  service_id: string;
  user_id: string;
  booking_date: string;
  time_slot?: string;
  party_size: number;
  tier: string;
  unit_price: number;
  total_price: number;
  currency: string;
  ticket_code: string;
  ticket_status: TicketStatus;
  status: ExperienceStatus;
  created_at?: string;
  updated_at?: string;
  // Joined
  service?: ExperienceService;
}

// ─── Filter / Input Types ─────────────────────────────────────────────────────

export interface ExperienceFilters {
  subcategory?: ExperienceSubcategory;
  sub_subcategory?: string;
  service_type?: ServiceType;
  pricing_model?: PricingModel;
  price_min?: number;
  price_max?: number;
  date_from?: string;
  date_to?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  location?: string;
  vibe_tags?: string[];
}

export interface ExperienceBookingInput {
  service_id: string;
  user_id: string;
  booking_date: string;
  time_slot?: string;
  party_size: number;
  tier: string;
  unit_price: number;
  total_price: number;
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const SUBCATEGORY_LABELS: Record<ExperienceSubcategory, string> = {
  nightlife: 'Nightlife',
  adventure: 'Adventure',
  dining: 'Dining',
  water: 'Water Experiences',
  sky: 'Sky Experiences',
  wellness: 'Wellness',
  culture: 'Culture',
};

export const SUBCATEGORY_DESCRIPTIONS: Record<ExperienceSubcategory, string> = {
  nightlife: 'Exclusive clubs, rooftop lounges, and hidden speakeasies — experience Dubai after dark.',
  adventure: 'Desert safaris, skydiving, and adrenaline-fueled experiences in the heart of the desert.',
  dining: "Chef's tables, tasting menus, and unforgettable culinary journeys across Dubai's finest venues.",
  water: 'Scuba diving, yacht cruises, and water sports in the crystal waters of the Arabian Gulf.',
  sky: 'Helicopter tours, hot air balloons, and breathtaking aerial views of the city skyline.',
  wellness: 'Spa retreats, yoga sessions, and rejuvenating experiences for mind and body.',
  culture: 'Museum tours, heritage walks, and authentic Emirati cultural experiences.',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  event: 'Special Event',
  recurring: 'Recurring',
  on_demand: 'On Demand',
  seasonal: 'Seasonal',
};

export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  per_person: 'Per Person',
  per_group: 'Per Group',
  fixed: 'Fixed Price',
  tiered: 'Tiered Pricing',
  free: 'Free',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  active: 'Active',
  used: 'Used',
  expired: 'Expired',
  refunded: 'Refunded',
};

export const EXPERIENCE_STATUS_LABELS: Record<ExperienceStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

// ─── Sub-subcategory Maps ─────────────────────────────────────────────────────

export const SUB_SUBCATEGORIES: Record<ExperienceSubcategory, { value: string; label: string }[]> = {
  nightlife: [
    { value: 'clubs', label: 'Clubs' },
    { value: 'rooftop-lounges', label: 'Rooftop Lounges' },
    { value: 'speakeasies', label: 'Speakeasies' },
    { value: 'live-music', label: 'Live Music' },
  ],
  adventure: [
    { value: 'desert-safari', label: 'Desert Safari' },
    { value: 'skydiving', label: 'Skydiving' },
    { value: 'bungee-jumping', label: 'Bungee Jumping' },
    { value: 'off-road', label: 'Off-Road' },
  ],
  dining: [
    { value: 'chefs-table', label: "Chef's Table" },
    { value: 'tasting-menu', label: 'Tasting Menu' },
    { value: 'dinner-cruise', label: 'Dinner Cruise' },
    { value: 'cooking-class', label: 'Cooking Class' },
  ],
  water: [
    { value: 'scuba-diving', label: 'Scuba Diving' },
    { value: 'jet-ski', label: 'Jet Ski' },
    { value: 'parasailing', label: 'Parasailing' },
    { value: 'kayaking', label: 'Kayaking' },
  ],
  sky: [
    { value: 'helicopter-tour', label: 'Helicopter Tour' },
    { value: 'hot-air-balloon', label: 'Hot Air Balloon' },
    { value: 'skydive-palm', label: 'Skydive Palm' },
  ],
  wellness: [
    { value: 'spa-resort', label: 'Spa Resort' },
    { value: 'yoga-retreat', label: 'Yoga Retreat' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'fitness-bootcamp', label: 'Fitness Bootcamp' },
  ],
  culture: [
    { value: 'museum-tour', label: 'Museum Tour' },
    { value: 'art-gallery', label: 'Art Gallery' },
    { value: 'heritage-walk', label: 'Heritage Walk' },
    { value: 'traditional-market', label: 'Traditional Market' },
  ],
};
