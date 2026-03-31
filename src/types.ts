export type Category =
  | 'restaurants'
  | 'beach-clubs'
  | 'night-clubs'
  | 'dining-entertainment'
  | 'dining'
  | 'nightlife'
  | 'yachts'
  | 'travel'
  | 'car-rental'
  | 'experiences'
  | 'wellness'
  | 'shopping'
  | 'business'
  | 'concierge'
  | 'events'
  | 'sports'
  | 'transport';

export const USER_SKILLS = [
  'NETWORKING',
  'DEAL_MAKING',
  'SOCIALITE',
  'FOODIE',
  'WELLNESS',
  'ADVENTURE',
  'LUXURY',
  'CULTURAL',
  'NIGHTLIFE',
  'FAMILY',
] as const;

export type UserSkill = typeof USER_SKILLS[number];

export const SKILL_LABELS: Record<UserSkill, string> = {
  NETWORKING: 'Networking',
  DEAL_MAKING: 'Deal Making',
  SOCIALITE: 'Socialite',
  FOODIE: 'Foodie',
  WELLNESS: 'Wellness',
  ADVENTURE: 'Adventure',
  LUXURY: 'Luxury',
  CULTURAL: 'Cultural',
  NIGHTLIFE: 'Nightlife',
  FAMILY: 'Family',
};

export const SKILL_DESCRIPTIONS: Record<UserSkill, string> = {
  NETWORKING: 'Business dinners & industry mixers',
  DEAL_MAKING: 'Private rooms & discretion',
  SOCIALITE: 'See-and-be-seen venues',
  FOODIE: "Chef's tables & tasting menus",
  WELLNESS: 'Healthy options & spas',
  ADVENTURE: 'Unique experiences',
  LUXURY: 'Premium everything',
  CULTURAL: 'Local experiences & art',
  NIGHTLIFE: 'Late scenes & DJs',
  FAMILY: 'Kid-friendly & spacious',
};

export type UserStage =
  | 'EXPLORING'
  | 'VISA_PENDING'
  | 'VISA_APPROVED'
  | 'COMPANY_SETUP'
  | 'PROPERTY_SEARCH'
  | 'ESTABLISHED';

// --- Auth & Role Types ---

export type UserRole = 'user' | 'admin' | 'concierge';
export type UserTier = 'standard' | 'gold' | 'platinum' | 'black';

// --- Venue ---

export interface Venue {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  location: string;
  area: string;
  vibe_tags: string[];
  skills: UserSkill[];
  price_tier: 1 | 2 | 3 | 4;
  hero_image: string;
  gallery_images: string[];
  description_short: string;
  description_long: string;
  highlights: string[];
  recommend_score: number;
  is_featured?: boolean;
  is_trending?: boolean;
  trending_score?: number;
  opening_hours: string;
  dress_code: string;
  booking_policy: string;

  // Editorial Fields
  cuisine?: string;
  best_time?: string;
  who_its_for?: string;
  insider_tip?: string;
  coordinates?: { lat: number; lng: number };

  // Operational Fields
  supplier_id?: string;
  status?: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

// --- User Profile ---

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  skills: UserSkill[];
  preferences: {
    scene?: 'INTIMATE' | 'HIGH_ENERGY' | 'ROOFTOP' | 'CULTURAL';
    timing?: string[];
  };
  relocation_stage: UserStage;
  role?: UserRole;
  tier?: UserTier;
}

// --- Feed ---

export interface FeedItem {
  id: string;
  type: 'TRENDING' | 'SKILL_MATCH' | 'STAGE_BASED' | 'SIMILAR';
  venue: Venue;
  relevanceScore: number;
  explanation: string;
  rank: number;
}

// --- Request ---

export type RequestStatus =
  | 'pending'
  | 'acknowledged'
  | 'submitted'
  | 'assigned'
  | 'supplier_contacted'
  | 'in_progress'
  | 'quoted'
  | 'confirmed'
  | 'declined'
  | 'completed'
  | 'cancelled';

export type RequestType = 'booking' | 'inquiry' | 'concierge';

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  acknowledged: 'Acknowledged',
  submitted: 'Submitted',
  assigned: 'Assigned',
  supplier_contacted: 'Contacting Venue',
  in_progress: 'In Progress',
  quoted: 'Quote Ready',
  confirmed: 'Confirmed',
  declined: 'Declined',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  pending: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  acknowledged: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  submitted: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  assigned: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  supplier_contacted: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  in_progress: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  quoted: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/20',
  declined: 'text-red-400 bg-red-400/10 border-red-400/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

export interface Request {
  id: string;
  user_id?: string;
  venue_id?: string;
  venue_name?: string;
  category: Category;
  request_type: RequestType;
  concierge_request_type?: string;
  title?: string;
  description?: string;
  urgency?: 'standard' | 'urgent' | 'asap';
  preferred_date?: string;
  preferred_time?: string;
  budget_range?: string;
  special_instructions?: string;
  date_time?: string | null;
  party_size: number;
  status: RequestStatus;
  priority_score: number;
  assigned_to?: string;
  contact_name?: string;
  contact_info?: string;
  notes?: string;
  internal_notes?: string;
  concierge_notes?: string;
  supplier_response?: string;
  confirmed_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RequestStatusLog {
  id: string;
  request_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

// --- Supplier ---

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  categories: string[];
  commission_rate: number;
  notes?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
}

// --- System ---

export interface SystemHealth {
  status: 'optimal' | 'degraded' | 'maintenance';
  uptime: number;
  active_users: number;
  pending_requests: number;
}
