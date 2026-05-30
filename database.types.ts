// GENERATED FROM REMOTE PRODUCTION SUPABASE SCHEMA. DO NOT EDIT DIRECTLY.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
    activities: {
      Row: {
  id: string;
  vendor_id: string;
  category_id: string;
  slug: string;
  name: string;
  description_short: string | null;
  description_long: string | null;
  highlights: string[] | null;
  vibe_tags: string[] | null;
  service_type: string;
  duration_minutes: number | null;
  max_capacity: number | null;
  location: string | null;
  area: string | null;
  venue_name: string | null;
  coordinates: Json | null;
  age_minimum: number | null;
  dress_code: string | null;
  requirements: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  trending_score: number | null;
  booking_count: number | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  vendor_id: string;
  category_id: string;
  slug: string;
  name: string;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  vibe_tags?: string[] | null;
  service_type: string;
  duration_minutes?: number | null;
  max_capacity?: number | null;
  location?: string | null;
  area?: string | null;
  venue_name?: string | null;
  coordinates?: Json | null;
  age_minimum?: number | null;
  dress_code?: string | null;
  requirements?: string[] | null;
  included?: string[] | null;
  excluded?: string[] | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  trending_score?: number | null;
  booking_count?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  vendor_id?: string;
  category_id?: string;
  slug?: string;
  name?: string;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  vibe_tags?: string[] | null;
  service_type?: string;
  duration_minutes?: number | null;
  max_capacity?: number | null;
  location?: string | null;
  area?: string | null;
  venue_name?: string | null;
  coordinates?: Json | null;
  age_minimum?: number | null;
  dress_code?: string | null;
  requirements?: string[] | null;
  included?: string[] | null;
  excluded?: string[] | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  trending_score?: number | null;
  booking_count?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    activity_availability: {
      Row: {
  id: string;
  activity_id: string;
  availability_type: string;
  day_of_week: number | null;
  specific_date: string | null;
  start_time: string | null;
  end_time: string | null;
  capacity: number | null;
  is_active: boolean | null;
  valid_from: string | null;
  valid_until: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  activity_id: string;
  availability_type: string;
  day_of_week?: number | null;
  specific_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  capacity?: number | null;
  is_active?: boolean | null;
  valid_from?: string | null;
  valid_until?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  activity_id?: string;
  availability_type?: string;
  day_of_week?: number | null;
  specific_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  capacity?: number | null;
  is_active?: boolean | null;
  valid_from?: string | null;
  valid_until?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    activity_bookings: {
      Row: {
  id: string;
  activity_id: string;
  pricing_id: string;
  availability_id: string | null;
  user_id: string;
  booking_date: string;
  time_slot: string | null;
  party_size: number | null;
  unit_price: string;
  total_price: string;
  currency: string | null;
  ticket_code: string | null;
  ticket_status: string | null;
  status: string | null;
  payment_status: string | null;
  payment_id: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  activity_id: string;
  pricing_id: string;
  availability_id?: string | null;
  user_id: string;
  booking_date: string;
  time_slot?: string | null;
  party_size?: number | null;
  unit_price: string;
  total_price: string;
  currency?: string | null;
  ticket_code?: string | null;
  ticket_status?: string | null;
  status?: string | null;
  payment_status?: string | null;
  payment_id?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  activity_id?: string;
  pricing_id?: string;
  availability_id?: string | null;
  user_id?: string;
  booking_date?: string;
  time_slot?: string | null;
  party_size?: number | null;
  unit_price?: string;
  total_price?: string;
  currency?: string | null;
  ticket_code?: string | null;
  ticket_status?: string | null;
  status?: string | null;
  payment_status?: string | null;
  payment_id?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    activity_categories: {
      Row: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  hero_image: string | null;
  sort_order: number | null;
  parent_id: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  hero_image?: string | null;
  sort_order?: number | null;
  parent_id?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  slug?: string;
  name?: string;
  description?: string | null;
  icon?: string | null;
  hero_image?: string | null;
  sort_order?: number | null;
  parent_id?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    activity_images: {
      Row: {
  id: string;
  activity_id: string;
  url: string;
  alt_text: string | null;
  type: string | null;
  sort_order: number | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  activity_id: string;
  url: string;
  alt_text?: string | null;
  type?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  activity_id?: string;
  url?: string;
  alt_text?: string | null;
  type?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
      }
    };
    activity_pricing: {
      Row: {
  id: string;
  activity_id: string;
  tier_name: string;
  description: string | null;
  price: string;
  currency: string | null;
  pricing_model: string;
  max_guests: number | null;
  includes: string[] | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  activity_id: string;
  tier_name: string;
  description?: string | null;
  price: string;
  currency?: string | null;
  pricing_model: string;
  max_guests?: number | null;
  includes?: string[] | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  activity_id?: string;
  tier_name?: string;
  description?: string | null;
  price?: string;
  currency?: string | null;
  pricing_model?: string;
  max_guests?: number | null;
  includes?: string[] | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    agent_capacity_config: {
      Row: {
  id: string;
  created_at: string;
  owner_id: string;
  max_active_leads: number;
  max_open_tasks: number;
  enabled: boolean;
      }
      Insert: {
  id?: string;
  created_at?: string;
  owner_id: string;
  max_active_leads?: number;
  max_open_tasks?: number;
  enabled?: boolean;
      }
      Update: {
  id?: string;
  created_at?: string;
  owner_id?: string;
  max_active_leads?: number;
  max_open_tasks?: number;
  enabled?: boolean;
      }
    };
    agent_orchestration: {
      Row: {
  id: string;
  agent_name: string;
  team_theme: string | null;
  status: string | null;
  current_task: string | null;
  credits_consumed: number | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  agent_name: string;
  team_theme?: string | null;
  status?: string | null;
  current_task?: string | null;
  credits_consumed?: number | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  agent_name?: string;
  team_theme?: string | null;
  status?: string | null;
  current_task?: string | null;
  credits_consumed?: number | null;
  updated_at?: string | null;
      }
    };
    api_failure_logs: {
      Row: {
  id: string;
  created_at: string;
  route: string;
  method: string;
  status_code: number | null;
  error_message: string | null;
  payload: Json | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  route: string;
  method: string;
  status_code?: number | null;
  error_message?: string | null;
  payload?: Json | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  route?: string;
  method?: string;
  status_code?: number | null;
  error_message?: string | null;
  payload?: Json | null;
      }
    };
    autopilot_adjustment_log: {
      Row: {
  id: string;
  created_at: string;
  adjustment_type: string;
  target_key: string;
  previous_value: Json | null;
  next_value: Json | null;
  reason: string;
  confidence: string;
  applied_by: string;
      }
      Insert: {
  id?: string;
  created_at?: string;
  adjustment_type: string;
  target_key: string;
  previous_value?: Json | null;
  next_value?: Json | null;
  reason: string;
  confidence?: string;
  applied_by?: string;
      }
      Update: {
  id?: string;
  created_at?: string;
  adjustment_type?: string;
  target_key?: string;
  previous_value?: Json | null;
  next_value?: Json | null;
  reason?: string;
  confidence?: string;
  applied_by?: string;
      }
    };
    booking_requests: {
      Row: {
  id: string;
  user_id: string | null;
  venue_id: string | null;
  experience_id: string | null;
  transport_id: string | null;
  status: string | null;
  request_type: string | null;
  metadata: Json | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  user_id?: string | null;
  venue_id?: string | null;
  experience_id?: string | null;
  transport_id?: string | null;
  status?: string | null;
  request_type?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string | null;
  venue_id?: string | null;
  experience_id?: string | null;
  transport_id?: string | null;
  status?: string | null;
  request_type?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    bookings: {
      Row: {
  id: string;
  venue_id: string | null;
  user_id: string | null;
  status: string | null;
  guest_count: number | null;
  booking_date: string | null;
  booking_time: string | null;
  special_requests: string | null;
  created_at: string | null;
  request_id: string | null;
  amount: string | null;
  currency: string | null;
  updated_at: string | null;
  booking_id: string | null;
  booking_type: string | null;
  hotel_name: string | null;
  room_type: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  total_price: string | null;
  guest_first_name: string | null;
  guest_last_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
      }
      Insert: {
  id?: string;
  venue_id?: string | null;
  user_id?: string | null;
  status?: string | null;
  guest_count?: number | null;
  booking_date?: string | null;
  booking_time?: string | null;
  special_requests?: string | null;
  created_at?: string | null;
  request_id?: string | null;
  amount?: string | null;
  currency?: string | null;
  updated_at?: string | null;
  booking_id?: string | null;
  booking_type?: string | null;
  hotel_name?: string | null;
  room_type?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  guests?: number | null;
  total_price?: string | null;
  guest_first_name?: string | null;
  guest_last_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
      }
      Update: {
  id?: string;
  venue_id?: string | null;
  user_id?: string | null;
  status?: string | null;
  guest_count?: number | null;
  booking_date?: string | null;
  booking_time?: string | null;
  special_requests?: string | null;
  created_at?: string | null;
  request_id?: string | null;
  amount?: string | null;
  currency?: string | null;
  updated_at?: string | null;
  booking_id?: string | null;
  booking_type?: string | null;
  hotel_name?: string | null;
  room_type?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  guests?: number | null;
  total_price?: string | null;
  guest_first_name?: string | null;
  guest_last_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
      }
    };
    business_bookings: {
      Row: {
  id: string;
  request_id: string | null;
  service_id: string;
  user_id: string;
  package_selected: string | null;
  documents_submitted: string[] | null;
  documents_required: string[] | null;
  documents_complete: boolean | null;
  compliance_status: Json | null;
  current_step: number | null;
  total_steps: number | null;
  workflow_status: string | null;
  quoted_price: string | null;
  government_fees: string | null;
  total_price: string | null;
  currency: string | null;
  relocation_profile_id: string | null;
  status: string | null;
  estimated_completion: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  request_id?: string | null;
  service_id: string;
  user_id: string;
  package_selected?: string | null;
  documents_submitted?: string[] | null;
  documents_required?: string[] | null;
  documents_complete?: boolean | null;
  compliance_status?: Json | null;
  current_step?: number | null;
  total_steps?: number | null;
  workflow_status?: string | null;
  quoted_price?: string | null;
  government_fees?: string | null;
  total_price?: string | null;
  currency?: string | null;
  relocation_profile_id?: string | null;
  status?: string | null;
  estimated_completion?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string | null;
  service_id?: string;
  user_id?: string;
  package_selected?: string | null;
  documents_submitted?: string[] | null;
  documents_required?: string[] | null;
  documents_complete?: boolean | null;
  compliance_status?: Json | null;
  current_step?: number | null;
  total_steps?: number | null;
  workflow_status?: string | null;
  quoted_price?: string | null;
  government_fees?: string | null;
  total_price?: string | null;
  currency?: string | null;
  relocation_profile_id?: string | null;
  status?: string | null;
  estimated_completion?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    business_consultations: {
      Row: {
  id: string;
  request_id: string | null;
  service_id: string;
  user_id: string;
  consultation_type: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  meeting_type: string | null;
  meeting_link: string | null;
  meeting_location: string | null;
  agenda: string | null;
  advisor_notes: string | null;
  outcome: string | null;
  next_steps: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  request_id?: string | null;
  service_id: string;
  user_id: string;
  consultation_type?: string | null;
  scheduled_at: string;
  duration_minutes?: number | null;
  meeting_type?: string | null;
  meeting_link?: string | null;
  meeting_location?: string | null;
  agenda?: string | null;
  advisor_notes?: string | null;
  outcome?: string | null;
  next_steps?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string | null;
  service_id?: string;
  user_id?: string;
  consultation_type?: string | null;
  scheduled_at?: string;
  duration_minutes?: number | null;
  meeting_type?: string | null;
  meeting_link?: string | null;
  meeting_location?: string | null;
  agenda?: string | null;
  advisor_notes?: string | null;
  outcome?: string | null;
  next_steps?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    business_services: {
      Row: {
  id: string;
  subcategory: string;
  sub_subcategory: string | null;
  name: string;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  service_type: string;
  duration_description: string | null;
  pricing_model: string;
  price_from: string | null;
  price_currency: string | null;
  price_display: string | null;
  required_documents: string[] | null;
  eligibility_criteria: string[] | null;
  government_fees: string | null;
  government_authority: string | null;
  compliance_checklist: Json | null;
  estimated_steps: number | null;
  workflow_template: Json | null;
  location: string | null;
  freezone: string | null;
  supplier_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean | null;
  popularity_score: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  canonical_service_id: string | null;
      }
      Insert: {
  id?: string;
  subcategory: string;
  sub_subcategory?: string | null;
  name: string;
  slug: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  service_type: string;
  duration_description?: string | null;
  pricing_model: string;
  price_from?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  required_documents?: string[] | null;
  eligibility_criteria?: string[] | null;
  government_fees?: string | null;
  government_authority?: string | null;
  compliance_checklist?: Json | null;
  estimated_steps?: number | null;
  workflow_template?: Json | null;
  location?: string | null;
  freezone?: string | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  popularity_score?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
      }
      Update: {
  id?: string;
  subcategory?: string;
  sub_subcategory?: string | null;
  name?: string;
  slug?: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  service_type?: string;
  duration_description?: string | null;
  pricing_model?: string;
  price_from?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  required_documents?: string[] | null;
  eligibility_criteria?: string[] | null;
  government_fees?: string | null;
  government_authority?: string | null;
  compliance_checklist?: Json | null;
  estimated_steps?: number | null;
  workflow_template?: Json | null;
  location?: string | null;
  freezone?: string | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  popularity_score?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
      }
    };
    categories: {
      Row: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string | null;
  updated_at: string;
      }
      Insert: {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string;
      }
      Update: {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string;
      }
    };
    categories_backup_20260327: {
      Row: {
  id: string | null;
  name: string | null;
  slug: string | null;
  description: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  created_at?: string | null;
      }
    };
    concierge_requests: {
      Row: {
  id: string;
  user_id: string | null;
  assigned_admin: string | null;
  status: string | null;
  metadata: Json | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  user_id?: string | null;
  assigned_admin?: string | null;
  status?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string | null;
  assigned_admin?: string | null;
  status?: string | null;
  metadata?: Json | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    conversations: {
      Row: {
  id: string;
  request_id: string;
  author_id: string | null;
  author_role: string;
  body: string;
  attachments: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  request_id: string;
  author_id?: string | null;
  author_role?: string;
  body: string;
  attachments?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  request_id?: string;
  author_id?: string | null;
  author_role?: string;
  body?: string;
  attachments?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    crm_sync_jobs: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  job_type: string;
  provider: string;
  payload: Json;
  status: string;
  dedupe_key: string;
  attempt_count: number;
  next_attempt_at: string | null;
  last_error: string | null;
  processed_at: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  job_type: string;
  provider: string;
  payload?: Json;
  status?: string;
  dedupe_key: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  last_error?: string | null;
  processed_at?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  job_type?: string;
  provider?: string;
  payload?: Json;
  status?: string;
  dedupe_key?: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  last_error?: string | null;
  processed_at?: string | null;
      }
    };
    crm_sync_logs: {
      Row: {
  id: string;
  created_at: string;
  job_id: string;
  status: string;
  response_payload: Json | null;
  error_message: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  job_id: string;
  status: string;
  response_payload?: Json | null;
  error_message?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  job_id?: string;
  status?: string;
  response_payload?: Json | null;
  error_message?: string | null;
      }
    };
    districts: {
      Row: {
  id: string;
  emirate_id: string | null;
  name: string;
  slug: string;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  emirate_id?: string | null;
  name: string;
  slug: string;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  emirate_id?: string | null;
  name?: string;
  slug?: string;
  created_at?: string | null;
      }
    };
    emirates: {
      Row: {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
  name_ar: string | null;
  is_active: boolean;
  sort_order: number;
      }
      Insert: {
  id?: string;
  name: string;
  slug: string;
  created_at?: string | null;
  name_ar?: string | null;
  is_active?: boolean;
  sort_order?: number;
      }
      Update: {
  id?: string;
  name?: string;
  slug?: string;
  created_at?: string | null;
  name_ar?: string | null;
  is_active?: boolean;
  sort_order?: number;
      }
    };
    events: {
      Row: {
  id: string;
  created_at: string;
  event_name: string;
  page: string;
  section: string | null;
  cta_label: string | null;
  metadata: Json;
  session_id: string;
  client_event_id: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  event_name: string;
  page: string;
  section?: string | null;
  cta_label?: string | null;
  metadata?: Json;
  session_id: string;
  client_event_id?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  event_name?: string;
  page?: string;
  section?: string | null;
  cta_label?: string | null;
  metadata?: Json;
  session_id?: string;
  client_event_id?: string | null;
      }
    };
    experience_bookings: {
      Row: {
  id: string;
  request_id: string | null;
  service_id: string;
  user_id: string;
  booking_date: string;
  time_slot: string | null;
  party_size: number | null;
  tier: string | null;
  unit_price: string | null;
  total_price: string | null;
  currency: string | null;
  ticket_code: string | null;
  ticket_status: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  request_id?: string | null;
  service_id: string;
  user_id: string;
  booking_date: string;
  time_slot?: string | null;
  party_size?: number | null;
  tier?: string | null;
  unit_price?: string | null;
  total_price?: string | null;
  currency?: string | null;
  ticket_code?: string | null;
  ticket_status?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string | null;
  service_id?: string;
  user_id?: string;
  booking_date?: string;
  time_slot?: string | null;
  party_size?: number | null;
  tier?: string | null;
  unit_price?: string | null;
  total_price?: string | null;
  currency?: string | null;
  ticket_code?: string | null;
  ticket_status?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    experience_services: {
      Row: {
  id: string;
  slug: string;
  title: string;
  subcategory: string;
  duration: string | null;
  min_age: number | null;
  is_popular: boolean | null;
  is_new: boolean | null;
  hero_image_url: string | null;
  gallery_images: string[] | null;
  description_short: string | null;
  description_long: string | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  meeting_point: string | null;
  lat: string | null;
  lng: string | null;
  cancellation_policy: string | null;
  pricing_tiers: Json | null;
  time_slots: Json | null;
  status: string | null;
  emirate_id: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  slug: string;
  title: string;
  subcategory: string;
  duration?: string | null;
  min_age?: number | null;
  is_popular?: boolean | null;
  is_new?: boolean | null;
  hero_image_url?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  meeting_point?: string | null;
  lat?: string | null;
  lng?: string | null;
  cancellation_policy?: string | null;
  pricing_tiers?: Json | null;
  time_slots?: Json | null;
  status?: string | null;
  emirate_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  slug?: string;
  title?: string;
  subcategory?: string;
  duration?: string | null;
  min_age?: number | null;
  is_popular?: boolean | null;
  is_new?: boolean | null;
  hero_image_url?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  meeting_point?: string | null;
  lat?: string | null;
  lng?: string | null;
  cancellation_policy?: string | null;
  pricing_tiers?: Json | null;
  time_slots?: Json | null;
  status?: string | null;
  emirate_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    experiences: {
      Row: {
  id: string;
  service_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  venue_id: string | null;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  venue_id?: string | null;
  title: string;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  venue_id?: string | null;
  title?: string;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    experiment_assignments: {
      Row: {
  id: string;
  created_at: string;
  experiment_key: string;
  session_id: string;
  variant: string;
  dedupe_key: string;
      }
      Insert: {
  id?: string;
  created_at?: string;
  experiment_key: string;
  session_id: string;
  variant: string;
  dedupe_key: string;
      }
      Update: {
  id?: string;
  created_at?: string;
  experiment_key?: string;
  session_id?: string;
  variant?: string;
  dedupe_key?: string;
      }
    };
    experiment_events: {
      Row: {
  id: string;
  created_at: string;
  experiment_key: string;
  session_id: string;
  variant: string;
  event_name: string;
  value: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  experiment_key: string;
  session_id: string;
  variant: string;
  event_name: string;
  value?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  experiment_key?: string;
  session_id?: string;
  variant?: string;
  event_name?: string;
  value?: string | null;
      }
    };
    experiments: {
      Row: {
  id: string;
  created_at: string;
  experiment_key: string;
  status: string;
  allocation: Json;
  start_at: string | null;
  end_at: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  experiment_key: string;
  status?: string;
  allocation?: Json;
  start_at?: string | null;
  end_at?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  experiment_key?: string;
  status?: string;
  allocation?: Json;
  start_at?: string | null;
  end_at?: string | null;
      }
    };
    explore_categories: {
      Row: {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  name: string;
  slug: string;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  name?: string;
  slug?: string;
  created_at?: string | null;
      }
    };
    explore_categories_backup_20260327: {
      Row: {
  id: string | null;
  name: string | null;
  slug: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  created_at?: string | null;
      }
    };
    explore_locations: {
      Row: {
  id: string;
  name: string;
  slug: string | null;
  emirate_id: string | null;
  district_id: string | null;
  category_id: string | null;
  short_description: string | null;
  why_unique: string | null;
  best_time_to_visit: string | null;
  latitude: string | null;
  longitude: string | null;
  is_hidden_gem: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
  emirate: string | null;
  area: string | null;
  category: string | null;
  subcategory: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  tags: string[] | null;
  vibe: string | null;
  price_tier: number | null;
  opening_hours: string | null;
  best_time: string | null;
  insider_tip: string | null;
  booking_url: string | null;
  google_maps_place_id: string | null;
  source_venue_id: string | null;
  recommend_score: number | null;
  view_count: number | null;
  long_description: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  name: string;
  slug?: string | null;
  emirate_id?: string | null;
  district_id?: string | null;
  category_id?: string | null;
  short_description?: string | null;
  why_unique?: string | null;
  best_time_to_visit?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  is_hidden_gem?: boolean | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  emirate?: string | null;
  area?: string | null;
  category?: string | null;
  subcategory?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  tags?: string[] | null;
  vibe?: string | null;
  price_tier?: number | null;
  opening_hours?: string | null;
  best_time?: string | null;
  insider_tip?: string | null;
  booking_url?: string | null;
  google_maps_place_id?: string | null;
  source_venue_id?: string | null;
  recommend_score?: number | null;
  view_count?: number | null;
  long_description?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  name?: string;
  slug?: string | null;
  emirate_id?: string | null;
  district_id?: string | null;
  category_id?: string | null;
  short_description?: string | null;
  why_unique?: string | null;
  best_time_to_visit?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  is_hidden_gem?: boolean | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  emirate?: string | null;
  area?: string | null;
  category?: string | null;
  subcategory?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  tags?: string[] | null;
  vibe?: string | null;
  price_tier?: number | null;
  opening_hours?: string | null;
  best_time?: string | null;
  insider_tip?: string | null;
  booking_url?: string | null;
  google_maps_place_id?: string | null;
  source_venue_id?: string | null;
  recommend_score?: number | null;
  view_count?: number | null;
  long_description?: string | null;
  updated_at?: string | null;
      }
    };
    founder_overrides: {
      Row: {
  id: string;
  created_at: string;
  override_key: string;
  override_value: Json;
  enabled: boolean;
  expires_at: string | null;
  reason: string | null;
  updated_by: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  override_key: string;
  override_value: Json;
  enabled?: boolean;
  expires_at?: string | null;
  reason?: string | null;
  updated_by?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  override_key?: string;
  override_value?: Json;
  enabled?: boolean;
  expires_at?: string | null;
  reason?: string | null;
  updated_by?: string | null;
      }
    };
    intents: {
      Row: {
  id: string;
  user_id: string | null;
  user_input: string;
  intent_type: string;
  complexity_score: number;
  decision: string;
  entities: Json | null;
  raw_response: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  user_id?: string | null;
  user_input: string;
  intent_type: string;
  complexity_score?: number;
  decision: string;
  entities?: Json | null;
  raw_response?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  user_id?: string | null;
  user_input?: string;
  intent_type?: string;
  complexity_score?: number;
  decision?: string;
  entities?: Json | null;
  raw_response?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    lead_automations: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  trigger_name: string;
  trigger_key: string;
  action_name: string;
  status: string;
  details: Json;
  executed_at: string;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  trigger_name: string;
  trigger_key: string;
  action_name: string;
  status: string;
  details?: Json;
  executed_at?: string;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  trigger_name?: string;
  trigger_key?: string;
  action_name?: string;
  status?: string;
  details?: Json;
  executed_at?: string;
      }
    };
    lead_enrichment_data: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  provider: string;
  data: Json;
  confidence_score: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  provider: string;
  data?: Json;
  confidence_score?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  provider?: string;
  data?: Json;
  confidence_score?: string | null;
      }
    };
    lead_enrichment_jobs: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  status: string;
  dedupe_key: string;
  attempt_count: number;
  next_attempt_at: string | null;
  last_error: string | null;
  processed_at: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  status?: string;
  dedupe_key: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  last_error?: string | null;
  processed_at?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  status?: string;
  dedupe_key?: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  last_error?: string | null;
  processed_at?: string | null;
      }
    };
    lead_history: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  action_type: string;
  actor_id: string | null;
  previous_data: Json | null;
  next_data: Json | null;
  reason: string | null;
  metadata: Json;
  idempotency_key: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  action_type: string;
  actor_id?: string | null;
  previous_data?: Json | null;
  next_data?: Json | null;
  reason?: string | null;
  metadata?: Json;
  idempotency_key?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  action_type?: string;
  actor_id?: string | null;
  previous_data?: Json | null;
  next_data?: Json | null;
  reason?: string | null;
  metadata?: Json;
  idempotency_key?: string | null;
      }
    };
    lead_ownership_history: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  previous_owner_id: string | null;
  new_owner_id: string;
  changed_by: string | null;
  reason: string | null;
  metadata: Json;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  previous_owner_id?: string | null;
  new_owner_id: string;
  changed_by?: string | null;
  reason?: string | null;
  metadata?: Json;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  previous_owner_id?: string | null;
  new_owner_id?: string;
  changed_by?: string | null;
  reason?: string | null;
  metadata?: Json;
      }
    };
    lead_playbook_steps: {
      Row: {
  id: string;
  created_at: string;
  playbook_key: string;
  step_order: number;
  step_name: string;
  action_type: string;
  schedule_offset_minutes: number;
  config: Json;
      }
      Insert: {
  id?: string;
  created_at?: string;
  playbook_key: string;
  step_order: number;
  step_name: string;
  action_type: string;
  schedule_offset_minutes?: number;
  config?: Json;
      }
      Update: {
  id?: string;
  created_at?: string;
  playbook_key?: string;
  step_order?: number;
  step_name?: string;
  action_type?: string;
  schedule_offset_minutes?: number;
  config?: Json;
      }
    };
    lead_playbooks: {
      Row: {
  id: string;
  created_at: string;
  playbook_key: string;
  display_name: string;
  trigger_rule: Json;
  enabled: boolean;
      }
      Insert: {
  id?: string;
  created_at?: string;
  playbook_key: string;
  display_name: string;
  trigger_rule?: Json;
  enabled?: boolean;
      }
      Update: {
  id?: string;
  created_at?: string;
  playbook_key?: string;
  display_name?: string;
  trigger_rule?: Json;
  enabled?: boolean;
      }
    };
    lead_tasks: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  owner_id: string | null;
  task_type: string;
  title: string;
  due_at: string | null;
  completed_at: string | null;
  status: string;
  priority: string;
  created_by: string | null;
  completion_note: string | null;
  idempotency_key: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  owner_id?: string | null;
  task_type: string;
  title: string;
  due_at?: string | null;
  completed_at?: string | null;
  status?: string;
  priority?: string;
  created_by?: string | null;
  completion_note?: string | null;
  idempotency_key?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  owner_id?: string | null;
  task_type?: string;
  title?: string;
  due_at?: string | null;
  completed_at?: string | null;
  status?: string;
  priority?: string;
  created_by?: string | null;
  completion_note?: string | null;
  idempotency_key?: string | null;
      }
    };
    leads: {
      Row: {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string;
  source_page: string;
  source_section: string;
  cta_label: string;
  service_slug: string | null;
  destination: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  user_agent: string | null;
  session_id: string;
  lead_score: number;
  lead_temperature: string;
  last_scored_at: string | null;
  last_automation_at: string | null;
  automation_status: string;
  assigned_to: string | null;
  priority: string;
  follow_up_state: string;
  notifications_sent: Json;
  workflow_history: Json;
  idempotency_key: string | null;
  lead_status: string;
  owner_id: string | null;
  assigned_at: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  follow_up_count: number;
  status_updated_at: string;
  closed_at: string | null;
  lost_reason: string | null;
  won_value: string | null;
  notes_count: number;
  sla_first_contact_breached: boolean;
  sla_first_contact_breached_at: string | null;
  sla_follow_up_breached: boolean;
  sla_follow_up_breached_at: string | null;
  owner_team_id: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  name: string;
  email?: string | null;
  phone: string;
  source_page: string;
  source_section: string;
  cta_label: string;
  service_slug?: string | null;
  destination: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  session_id: string;
  lead_score?: number;
  lead_temperature?: string;
  last_scored_at?: string | null;
  last_automation_at?: string | null;
  automation_status?: string;
  assigned_to?: string | null;
  priority?: string;
  follow_up_state?: string;
  notifications_sent?: Json;
  workflow_history?: Json;
  idempotency_key?: string | null;
  lead_status?: string;
  owner_id?: string | null;
  assigned_at?: string | null;
  last_contacted_at?: string | null;
  next_follow_up_at?: string | null;
  follow_up_count?: number;
  status_updated_at?: string;
  closed_at?: string | null;
  lost_reason?: string | null;
  won_value?: string | null;
  notes_count?: number;
  sla_first_contact_breached?: boolean;
  sla_first_contact_breached_at?: string | null;
  sla_follow_up_breached?: boolean;
  sla_follow_up_breached_at?: string | null;
  owner_team_id?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  name?: string;
  email?: string | null;
  phone?: string;
  source_page?: string;
  source_section?: string;
  cta_label?: string;
  service_slug?: string | null;
  destination?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  session_id?: string;
  lead_score?: number;
  lead_temperature?: string;
  last_scored_at?: string | null;
  last_automation_at?: string | null;
  automation_status?: string;
  assigned_to?: string | null;
  priority?: string;
  follow_up_state?: string;
  notifications_sent?: Json;
  workflow_history?: Json;
  idempotency_key?: string | null;
  lead_status?: string;
  owner_id?: string | null;
  assigned_at?: string | null;
  last_contacted_at?: string | null;
  next_follow_up_at?: string | null;
  follow_up_count?: number;
  status_updated_at?: string;
  closed_at?: string | null;
  lost_reason?: string | null;
  won_value?: string | null;
  notes_count?: number;
  sla_first_contact_breached?: boolean;
  sla_first_contact_breached_at?: string | null;
  sla_follow_up_breached?: boolean;
  sla_follow_up_breached_at?: string | null;
  owner_team_id?: string | null;
      }
    };
    model_feedback_audit: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  predicted_conversion_score: string;
  predicted_value: string | null;
  actual_outcome: string;
  actual_value: string | null;
  error_magnitude: string;
  route_expected_owner: string | null;
  route_actual_owner: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  predicted_conversion_score: string;
  predicted_value?: string | null;
  actual_outcome: string;
  actual_value?: string | null;
  error_magnitude: string;
  route_expected_owner?: string | null;
  route_actual_owner?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  predicted_conversion_score?: string;
  predicted_value?: string | null;
  actual_outcome?: string;
  actual_value?: string | null;
  error_magnitude?: string;
  route_expected_owner?: string | null;
  route_actual_owner?: string | null;
      }
    };
    notification_preferences: {
      Row: {
  id: string;
  created_at: string;
  owner_id: string | null;
  team_id: string | null;
  event_type: string;
  channel: string;
  recipient: string;
  enabled: boolean;
      }
      Insert: {
  id?: string;
  created_at?: string;
  owner_id?: string | null;
  team_id?: string | null;
  event_type: string;
  channel: string;
  recipient: string;
  enabled?: boolean;
      }
      Update: {
  id?: string;
  created_at?: string;
  owner_id?: string | null;
  team_id?: string | null;
  event_type?: string;
  channel?: string;
  recipient?: string;
  enabled?: boolean;
      }
    };
    notifications: {
      Row: {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  is_read: boolean;
  action_url: string | null;
  metadata: Json;
  created_at: string;
  read_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  channel: string | null;
  recipient: string | null;
  payload: Json;
  status: string;
  sent_at: string | null;
  failed_at: string | null;
  error_message: string | null;
  dedupe_key: string | null;
  retry_count: number;
  trigger_source: string | null;
      }
      Insert: {
  id?: string;
  user_id: string;
  type?: string;
  title: string;
  message?: string;
  priority?: string;
  is_read?: boolean;
  action_url?: string | null;
  metadata?: Json;
  created_at?: string;
  read_at?: string | null;
  event_type?: string | null;
  lead_id?: string | null;
  owner_id?: string | null;
  channel?: string | null;
  recipient?: string | null;
  payload?: Json;
  status?: string;
  sent_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
  dedupe_key?: string | null;
  retry_count?: number;
  trigger_source?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  priority?: string;
  is_read?: boolean;
  action_url?: string | null;
  metadata?: Json;
  created_at?: string;
  read_at?: string | null;
  event_type?: string | null;
  lead_id?: string | null;
  owner_id?: string | null;
  channel?: string | null;
  recipient?: string | null;
  payload?: Json;
  status?: string;
  sent_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
  dedupe_key?: string | null;
  retry_count?: number;
  trigger_source?: string | null;
      }
    };
    operator_actions: {
      Row: {
  id: string;
  request_id: string;
  operator_id: string | null;
  action_type: string;
  payload: Json | null;
  note: string | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  request_id: string;
  operator_id?: string | null;
  action_type: string;
  payload?: Json | null;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  request_id?: string;
  operator_id?: string | null;
  action_type?: string;
  payload?: Json | null;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    partners: {
      Row: {
  id: string;
  name: string;
  category: string;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  name: string;
  category: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  status?: string;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  name?: string;
  category?: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  status?: string;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    payments: {
      Row: {
  id: string;
  request_id: string;
  quote_id: string | null;
  user_id: string | null;
  amount_aed: string;
  currency: string;
  payment_type: string;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  request_id: string;
  quote_id?: string | null;
  user_id?: string | null;
  amount_aed: string;
  currency?: string;
  payment_type?: string;
  status?: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  request_id?: string;
  quote_id?: string | null;
  user_id?: string | null;
  amount_aed?: string;
  currency?: string;
  payment_type?: string;
  status?: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    posts: {
      Row: {
  id: string;
  venue_id: string | null;
  title: string;
  slug: string;
  content: string;
  meta_description: string | null;
  author: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  venue_id?: string | null;
  title: string;
  slug: string;
  content: string;
  meta_description?: string | null;
  author?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  venue_id?: string | null;
  title?: string;
  slug?: string;
  content?: string;
  meta_description?: string | null;
  author?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
      }
    };
    profiles: {
      Row: {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  preferences: Json | null;
  relocation_stage: string | null;
  tier: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  skills?: string[] | null;
  preferences?: Json | null;
  relocation_stage?: string | null;
  tier?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  skills?: string[] | null;
  preferences?: Json | null;
  relocation_stage?: string | null;
  tier?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    providers: {
      Row: {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  name: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website_url?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  name?: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website_url?: string | null;
  created_at?: string | null;
      }
    };
    queue_health_metrics: {
      Row: {
  id: string;
  created_at: string;
  queue_name: string;
  pending_count: number;
  processing_count: number;
  failed_count: number;
  lag_seconds: number;
      }
      Insert: {
  id?: string;
  created_at?: string;
  queue_name: string;
  pending_count?: number;
  processing_count?: number;
  failed_count?: number;
  lag_seconds?: number;
      }
      Update: {
  id?: string;
  created_at?: string;
  queue_name?: string;
  pending_count?: number;
  processing_count?: number;
  failed_count?: number;
  lag_seconds?: number;
      }
    };
    quotes: {
      Row: {
  id: string;
  request_id: string;
  operator_id: string | null;
  amount_aed: string;
  currency: string;
  line_items: Json | null;
  notes: string | null;
  status: string;
  expires_at: string | null;
  accepted_at: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  request_id: string;
  operator_id?: string | null;
  amount_aed: string;
  currency?: string;
  line_items?: Json | null;
  notes?: string | null;
  status?: string;
  expires_at?: string | null;
  accepted_at?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  request_id?: string;
  operator_id?: string | null;
  amount_aed?: string;
  currency?: string;
  line_items?: Json | null;
  notes?: string | null;
  status?: string;
  expires_at?: string | null;
  accepted_at?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    relocation_cost_estimates: {
      Row: {
  id: string;
  relocation_profile_id: string;
  category: string;
  item_name: string;
  estimated_min: string | null;
  estimated_max: string | null;
  currency: string | null;
  notes: string | null;
  is_recurring: boolean | null;
  recurrence_period: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  relocation_profile_id: string;
  category: string;
  item_name: string;
  estimated_min?: string | null;
  estimated_max?: string | null;
  currency?: string | null;
  notes?: string | null;
  is_recurring?: boolean | null;
  recurrence_period?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  relocation_profile_id?: string;
  category?: string;
  item_name?: string;
  estimated_min?: string | null;
  estimated_max?: string | null;
  currency?: string | null;
  notes?: string | null;
  is_recurring?: boolean | null;
  recurrence_period?: string | null;
  created_at?: string | null;
      }
    };
    relocation_profiles: {
      Row: {
  id: string;
  user_id: string;
  purpose: string | null;
  current_country: string | null;
  target_move_date: string | null;
  family_size: number | null;
  has_children: boolean | null;
  budget_range: string | null;
  property_preference: string | null;
  visa_status: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  user_id: string;
  purpose?: string | null;
  current_country?: string | null;
  target_move_date?: string | null;
  family_size?: number | null;
  has_children?: boolean | null;
  budget_range?: string | null;
  property_preference?: string | null;
  visa_status?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string;
  purpose?: string | null;
  current_country?: string | null;
  target_move_date?: string | null;
  family_size?: number | null;
  has_children?: boolean | null;
  budget_range?: string | null;
  property_preference?: string | null;
  visa_status?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    request_status_log: {
      Row: {
  id: string;
  request_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  request_id: string;
  old_status?: string | null;
  new_status: string;
  changed_by?: string | null;
  notes?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string;
  old_status?: string | null;
  new_status?: string;
  changed_by?: string | null;
  notes?: string | null;
  created_at?: string | null;
      }
    };
    requests: {
      Row: {
  id: string;
  user_id: string | null;
  venue_id: string | null;
  venue_name: string | null;
  category: string;
  request_type: string | null;
  date_time: string | null;
  party_size: number | null;
  status: string | null;
  priority_score: number | null;
  assigned_to: string | null;
  contact_name: string | null;
  contact_info: string | null;
  notes: string | null;
  internal_notes: string | null;
  supplier_response: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  service_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  booking_id: string | null;
  intent_id: string | null;
  priority: string;
      }
      Insert: {
  id?: string;
  user_id?: string | null;
  venue_id?: string | null;
  venue_name?: string | null;
  category: string;
  request_type?: string | null;
  date_time?: string | null;
  party_size?: number | null;
  status?: string | null;
  priority_score?: number | null;
  assigned_to?: string | null;
  contact_name?: string | null;
  contact_info?: string | null;
  notes?: string | null;
  internal_notes?: string | null;
  supplier_response?: string | null;
  confirmed_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  booking_id?: string | null;
  intent_id?: string | null;
  priority?: string;
      }
      Update: {
  id?: string;
  user_id?: string | null;
  venue_id?: string | null;
  venue_name?: string | null;
  category?: string;
  request_type?: string | null;
  date_time?: string | null;
  party_size?: number | null;
  status?: string | null;
  priority_score?: number | null;
  assigned_to?: string | null;
  contact_name?: string | null;
  contact_info?: string | null;
  notes?: string | null;
  internal_notes?: string | null;
  supplier_response?: string | null;
  confirmed_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  booking_id?: string | null;
  intent_id?: string | null;
  priority?: string;
      }
    };
    role_permissions: {
      Row: {
  id: string;
  role: Json;
  resource: string;
  action: string;
  allowed: boolean;
      }
      Insert: {
  id?: string;
  role: Json;
  resource: string;
  action: string;
  allowed?: boolean;
      }
      Update: {
  id?: string;
  role?: Json;
  resource?: string;
  action?: string;
  allowed?: boolean;
      }
    };
    routing_rules_config: {
      Row: {
  id: string;
  created_at: string;
  version: number;
  rule_key: string;
  condition: Json;
  target_owner: string | null;
  target_team: string | null;
  priority: number;
  active: boolean;
  reason: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  version: number;
  rule_key: string;
  condition?: Json;
  target_owner?: string | null;
  target_team?: string | null;
  priority?: number;
  active?: boolean;
  reason?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  version?: number;
  rule_key?: string;
  condition?: Json;
  target_owner?: string | null;
  target_team?: string | null;
  priority?: number;
  active?: boolean;
  reason?: string | null;
      }
    };
    scoring_weights: {
      Row: {
  id: string;
  created_at: string;
  version: number;
  event_name: string;
  weight: string;
  active: boolean;
  reason: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  version: number;
  event_name: string;
  weight: string;
  active?: boolean;
  reason?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  version?: number;
  event_name?: string;
  weight?: string;
  active?: boolean;
  reason?: string | null;
      }
    };
    services: {
      Row: {
  id: string;
  subcategory_id: string;
  slug: string;
  name: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  subcategory_id: string;
  slug: string;
  name: string;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  subcategory_id?: string;
  slug?: string;
  name?: string;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    stays_availability: {
      Row: {
  id: string;
  property_id: string;
  date: string;
  is_available: boolean | null;
  price_override: string | null;
  notes: string | null;
      }
      Insert: {
  id?: string;
  property_id: string;
  date: string;
  is_available?: boolean | null;
  price_override?: string | null;
  notes?: string | null;
      }
      Update: {
  id?: string;
  property_id?: string;
  date?: string;
  is_available?: boolean | null;
  price_override?: string | null;
  notes?: string | null;
      }
    };
    stays_bookings: {
      Row: {
  id: string;
  request_id: string | null;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number | null;
  nightly_rate: string | null;
  total_nights: number | null;
  subtotal: string | null;
  deposit_paid: string | null;
  total_price: string | null;
  currency: string | null;
  relocation_profile_id: string | null;
  booking_type: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  request_id?: string | null;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests?: number | null;
  nightly_rate?: string | null;
  total_nights?: number | null;
  subtotal?: string | null;
  deposit_paid?: string | null;
  total_price?: string | null;
  currency?: string | null;
  relocation_profile_id?: string | null;
  booking_type?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string | null;
  property_id?: string;
  user_id?: string;
  check_in?: string;
  check_out?: string;
  guests?: number | null;
  nightly_rate?: string | null;
  total_nights?: number | null;
  subtotal?: string | null;
  deposit_paid?: string | null;
  total_price?: string | null;
  currency?: string | null;
  relocation_profile_id?: string | null;
  booking_type?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    stays_properties: {
      Row: {
  id: string;
  subcategory: string;
  sub_subcategory: string | null;
  name: string;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  highlights: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  area_sqft: number | null;
  amenities: string[] | null;
  location: string | null;
  area: string;
  district: string | null;
  address: string | null;
  coordinates: Json | null;
  pricing_model: string;
  price_nightly: string | null;
  price_monthly: string | null;
  price_yearly: string | null;
  price_currency: string | null;
  price_display: string | null;
  deposit_required: boolean | null;
  deposit_amount: string | null;
  seasonal_pricing: Json | null;
  availability_type: string | null;
  min_stay_nights: number | null;
  max_stay_nights: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  supplier_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  rating: string | null;
  review_count: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  canonical_service_id: string | null;
  subcategory_id: string | null;
  category_id: string | null;
      }
      Insert: {
  id?: string;
  subcategory: string;
  sub_subcategory?: string | null;
  name: string;
  slug: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  highlights?: string[] | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  max_guests?: number | null;
  area_sqft?: number | null;
  amenities?: string[] | null;
  location?: string | null;
  area: string;
  district?: string | null;
  address?: string | null;
  coordinates?: Json | null;
  pricing_model: string;
  price_nightly?: string | null;
  price_monthly?: string | null;
  price_yearly?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  deposit_required?: boolean | null;
  deposit_amount?: string | null;
  seasonal_pricing?: Json | null;
  availability_type?: string | null;
  min_stay_nights?: number | null;
  max_stay_nights?: number | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  rating?: string | null;
  review_count?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
  subcategory_id?: string | null;
  category_id?: string | null;
      }
      Update: {
  id?: string;
  subcategory?: string;
  sub_subcategory?: string | null;
  name?: string;
  slug?: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  highlights?: string[] | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  max_guests?: number | null;
  area_sqft?: number | null;
  amenities?: string[] | null;
  location?: string | null;
  area?: string;
  district?: string | null;
  address?: string | null;
  coordinates?: Json | null;
  pricing_model?: string;
  price_nightly?: string | null;
  price_monthly?: string | null;
  price_yearly?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  deposit_required?: boolean | null;
  deposit_amount?: string | null;
  seasonal_pricing?: Json | null;
  availability_type?: string | null;
  min_stay_nights?: number | null;
  max_stay_nights?: number | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  rating?: string | null;
  review_count?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
  subcategory_id?: string | null;
  category_id?: string | null;
      }
    };
    subcategories: {
      Row: {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  category_id: string;
  slug: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  category_id?: string;
  slug?: string;
  name?: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    subcategories_backup_20260327: {
      Row: {
  id: string | null;
  category_id: string | null;
  slug: string | null;
  name: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string | null;
  category_id?: string | null;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string | null;
  category_id?: string | null;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    suppliers: {
      Row: {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  categories: string[] | null;
  commission_rate: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  categories?: string[] | null;
  commission_rate?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  name?: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  categories?: string[] | null;
  commission_rate?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    system_error_logs: {
      Row: {
  id: string;
  created_at: string;
  component: string;
  severity: string;
  error_message: string;
  payload: Json | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  component: string;
  severity: string;
  error_message: string;
  payload?: Json | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  component?: string;
  severity?: string;
  error_message?: string;
  payload?: Json | null;
      }
    };
    tasks: {
      Row: {
  id: string;
  request_id: string;
  assignee_id: string | null;
  partner_id: string | null;
  title: string;
  description: string | null;
  status: string;
  due_at: string | null;
  completed_at: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  request_id: string;
  assignee_id?: string | null;
  partner_id?: string | null;
  title: string;
  description?: string | null;
  status?: string;
  due_at?: string | null;
  completed_at?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  request_id?: string;
  assignee_id?: string | null;
  partner_id?: string | null;
  title?: string;
  description?: string | null;
  status?: string;
  due_at?: string | null;
  completed_at?: string | null;
  metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    transport_bookings: {
      Row: {
  id: string;
  request_id: string | null;
  service_id: string;
  user_id: string;
  pickup_date: string;
  return_date: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  relocation_profile_id: string | null;
  workflow_step_id: string | null;
  quoted_price: string | null;
  final_price: string | null;
  currency: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  request_id?: string | null;
  service_id: string;
  user_id: string;
  pickup_date: string;
  return_date?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  relocation_profile_id?: string | null;
  workflow_step_id?: string | null;
  quoted_price?: string | null;
  final_price?: string | null;
  currency?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  request_id?: string | null;
  service_id?: string;
  user_id?: string;
  pickup_date?: string;
  return_date?: string | null;
  pickup_location?: string | null;
  dropoff_location?: string | null;
  relocation_profile_id?: string | null;
  workflow_step_id?: string | null;
  quoted_price?: string | null;
  final_price?: string | null;
  currency?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    transport_items: {
      Row: {
  id: string;
  slug: string;
  type: string;
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  daily_price_aed: string | null;
  fuel_type: string | null;
  seats: number | null;
  image_url: string | null;
  is_popular: boolean | null;
  is_new: boolean | null;
  status: string | null;
  created_at: string | null;
      }
      Insert: {
  id?: string;
  slug: string;
  type: string;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  daily_price_aed?: string | null;
  fuel_type?: string | null;
  seats?: number | null;
  image_url?: string | null;
  is_popular?: boolean | null;
  is_new?: boolean | null;
  status?: string | null;
  created_at?: string | null;
      }
      Update: {
  id?: string;
  slug?: string;
  type?: string;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  daily_price_aed?: string | null;
  fuel_type?: string | null;
  seats?: number | null;
  image_url?: string | null;
  is_popular?: boolean | null;
  is_new?: boolean | null;
  status?: string | null;
  created_at?: string | null;
      }
    };
    transport_services: {
      Row: {
  id: string;
  category: string;
  subcategory: string;
  sub_subcategory: string | null;
  name: string;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  highlights: string[] | null;
  pricing_model: string;
  price_from: string | null;
  price_currency: string | null;
  price_display: string | null;
  availability_type: string | null;
  available_days: string[] | null;
  max_capacity: number | null;
  min_booking_hours: number | null;
  advance_booking_hours: number | null;
  specifications: Json | null;
  location: string | null;
  area: string | null;
  pickup_locations: string[] | null;
  coordinates: Json | null;
  supplier_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  canonical_service_id: string | null;
  subcategory_id: string | null;
  category_id: string | null;
      }
      Insert: {
  id?: string;
  category?: string;
  subcategory: string;
  sub_subcategory?: string | null;
  name: string;
  slug: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  highlights?: string[] | null;
  pricing_model: string;
  price_from?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  availability_type?: string | null;
  available_days?: string[] | null;
  max_capacity?: number | null;
  min_booking_hours?: number | null;
  advance_booking_hours?: number | null;
  specifications?: Json | null;
  location?: string | null;
  area?: string | null;
  pickup_locations?: string[] | null;
  coordinates?: Json | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
  subcategory_id?: string | null;
  category_id?: string | null;
      }
      Update: {
  id?: string;
  category?: string;
  subcategory?: string;
  sub_subcategory?: string | null;
  name?: string;
  slug?: string;
  description_short?: string | null;
  description_long?: string | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  highlights?: string[] | null;
  pricing_model?: string;
  price_from?: string | null;
  price_currency?: string | null;
  price_display?: string | null;
  availability_type?: string | null;
  available_days?: string[] | null;
  max_capacity?: number | null;
  min_booking_hours?: number | null;
  advance_booking_hours?: number | null;
  specifications?: Json | null;
  location?: string | null;
  area?: string | null;
  pickup_locations?: string[] | null;
  coordinates?: Json | null;
  supplier_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  canonical_service_id?: string | null;
  subcategory_id?: string | null;
  category_id?: string | null;
      }
    };
    user_documents: {
      Row: {
  id: string;
  user_id: string;
  relocation_profile_id: string | null;
  document_type: string;
  document_name: string;
  file_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  user_id: string;
  relocation_profile_id?: string | null;
  document_type: string;
  document_name: string;
  file_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  status?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string;
  relocation_profile_id?: string | null;
  document_type?: string;
  document_name?: string;
  file_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  status?: string | null;
  expiry_date?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    user_roles: {
      Row: {
  id: string;
  created_at: string;
  user_id: string;
  role: Json;
  team_id: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  user_id: string;
  role: Json;
  team_id?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  user_id?: string;
  role?: Json;
  team_id?: string | null;
      }
    };
    user_workflow_steps: {
      Row: {
  id: string;
  workflow_id: string;
  step_number: number;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  workflow_id: string;
  step_number: number;
  title: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
  due_date?: string | null;
  completed_at?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  workflow_id?: string;
  step_number?: number;
  title?: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
  due_date?: string | null;
  completed_at?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    user_workflows: {
      Row: {
  id: string;
  user_id: string;
  relocation_profile_id: string | null;
  title: string;
  description: string | null;
  workflow_type: string | null;
  total_steps: number | null;
  completed_steps: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  user_id: string;
  relocation_profile_id?: string | null;
  title: string;
  description?: string | null;
  workflow_type?: string | null;
  total_steps?: number | null;
  completed_steps?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  user_id?: string;
  relocation_profile_id?: string | null;
  title?: string;
  description?: string | null;
  workflow_type?: string | null;
  total_steps?: number | null;
  completed_steps?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    users: {
      Row: {
  id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
    };
    v_avg_time_to_first_contact: {
      Row: {
  owner_id: string | null;
  avg_minutes_to_first_contact: string | null;
      }
    };
    v_booking_sync: {
      Row: {
  '?column?': number | null;
      }
    };
    v_cc_active_overrides: {
      Row: {
  override_key: string | null;
  override_value: Json | null;
  enabled: boolean | null;
  expires_at: string | null;
  reason: string | null;
  updated_by: string | null;
  created_at: string | null;
      }
    };
    v_cc_capacity_balancer: {
      Row: {
  owner_id: string | null;
  active_leads: string | null;
  open_tasks: string | null;
  max_active_leads: number | null;
  max_open_tasks: number | null;
  active_load_pct: string | null;
  task_load_pct: string | null;
  balancing_state: string | null;
      }
    };
    v_cc_competitive_intelligence: {
      Row: {
  source_page: string | null;
  day: string | null;
  leads: string | null;
  win_rate: string | null;
  avg_daily_leads: string | null;
  std_daily_leads: string | null;
  avg_win_rate: string | null;
  lead_shift_z: string | null;
  win_rate_shift: string | null;
  shift_detection: string | null;
      }
    };
    v_cc_conversion_acceleration: {
      Row: {
  lead_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  acceleration_action: string | null;
  urgency_score: number | null;
      }
    };
    v_cc_critical_alerts: {
      Row: {
  alert_type: string | null;
  lead_id: string | null;
  routing_owner: string | null;
  routing_team: string | null;
  alert_priority: string | null;
  payload: Json | null;
  occurred_at: string | null;
      }
    };
    v_cc_deal_health: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  lead_status: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  status_updated_at: string | null;
  hours_to_first_touch: string | null;
  hours_since_last_touch: string | null;
  is_stalled: boolean | null;
  close_likelihood: string | null;
  fail_likelihood: string | null;
      }
    };
    v_cc_decision_signals: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_execution_discipline_metrics: {
      Row: {
  owner_id: string | null;
  missed_first_contact_count: string | null;
  missed_follow_up_count: string | null;
  avg_response_minutes: string | null;
  discipline_risk_score: string | null;
      }
    };
    v_cc_founder_control_metrics: {
      Row: {
  leads_24h: string | null;
  won_24h: string | null;
  revenue_24h: string | null;
  top20_queue_size: string | null;
  active_pressure_cases: string | null;
  critical_leaks: string | null;
  killswitch_triggered: boolean | null;
      }
    };
    v_cc_high_dropoff_pages: {
      Row: {
  source_page: string | null;
  total_leads: string | null;
  won_count: string | null;
  dropoff_pct: string | null;
      }
    };
    v_cc_high_intent_interception: {
      Row: {
  session_id: string | null;
  intent_events: string | null;
  last_event_at: string | null;
  last_page: string | null;
  intent_band: string | null;
  interception_logic: string | null;
      }
    };
    v_cc_hot_leads_immediate_action: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_instant_response_targets: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  phone: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  requires_instant_response: boolean | null;
  response_logic: string | null;
      }
    };
    v_cc_killswitch_detection: {
      Row: {
  recent_conversion_pct: string | null;
  baseline_conversion_pct: string | null;
  high_intent_to_submit_pct: string | null;
  killswitch_triggered: boolean | null;
  killswitch_reason: string | null;
      }
    };
    v_cc_lead_value_prediction: {
      Row: {
  lead_id: string | null;
  score: number | null;
  intent_level: string | null;
  source_quality: string | null;
  events_last_30m: string | null;
  service_slug: string | null;
  value_score: string | null;
  expected_deal_value: string | null;
  prediction_explainability: Json | null;
      }
    };
    v_cc_leads_no_contact_yet: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_likely_to_convert: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
  conversion_likelihood_score: string | null;
      }
    };
    v_cc_overdue_followups: {
      Row: {
  task_id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  priority: string | null;
  due_at: string | null;
  minutes_overdue: string | null;
  score: number | null;
  intent_level: string | null;
  source_quality: string | null;
  recommended_action: string | null;
      }
    };
    v_cc_playbook_execution_mapping: {
      Row: {
  playbook_key: string | null;
  display_name: string | null;
  trigger_rule: Json | null;
  step_order: number | null;
  step_name: string | null;
  action_type: string | null;
  schedule_offset_minutes: number | null;
  config: Json | null;
      }
    };
    v_cc_predicted_vs_actual: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  predicted_conversion_score: string | null;
  predicted_value: string | null;
  actual_outcome: string | null;
  actual_value: string | null;
  prediction_error: string | null;
      }
    };
    v_cc_product_feedback_insights: {
      Row: {
  source_page: string | null;
  leads: string | null;
  won: string | null;
  hot: string | null;
  avg_score: string | null;
  conversion_pct: string | null;
  hot_unconverted_gap: string | null;
  improvement_priority: string | null;
      }
    };
    v_cc_recent_high_activity: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_reengagement_candidates: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  lead_status: string | null;
  intent_level: string | null;
  score: number | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  inactivity_anchor: string | null;
  reengagement_action: string | null;
  reengagement_priority: number | null;
      }
    };
    v_cc_revenue_leak_detection: {
      Row: {
  lead_id: string | null;
  leak_type: string | null;
  leak_priority: string | null;
  estimated_loss: string | null;
      }
    };
    v_cc_revenue_priority_queue: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  lead_status: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  expected_deal_value: string | null;
  idle_minutes: string | null;
  priority_score: string | null;
  queue_rank: string | null;
      }
    };
    v_cc_routing_adjustments: {
      Row: {
  owner_team_id: string | null;
  total: string | null;
  won: string | null;
  win_rate_pct: string | null;
  avg_first_contact_minutes: string | null;
  routing_adjustment_rule: string | null;
      }
    };
    v_cc_sales_pressure: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  lead_score: number | null;
  won_value: string | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  idle_minutes: string | null;
  escalation_rule: string | null;
  pressure_priority: number | null;
      }
    };
    v_cc_scoring_weight_adjustments: {
      Row: {
  event_name: string | null;
  current_weight: string | null;
  suggested_weight: string | null;
  win_lift_pct: string | null;
  total_count: string | null;
  adjustment_rule: string | null;
      }
    };
    v_cc_source_quality_score: {
      Row: {
  source_page: string | null;
  total_leads: string | null;
  won_leads: string | null;
  total_revenue: string | null;
  avg_score: string | null;
  win_rate_pct: string | null;
  source_quality_score: string | null;
      }
    };
    v_conversion_rate_by_owner: {
      Row: {
  owner_id: string | null;
  won_count: string | null;
  lost_count: string | null;
  total_count: string | null;
  conversion_rate_pct: string | null;
      }
    };
    v_dashboard_activity_stream: {
      Row: {
  occurred_at: string | null;
  lead_id: string | null;
  activity_type: string | null;
  actor_id: string | null;
  reason: string | null;
  metadata: Json | null;
  lead_score: number | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_alerts: {
      Row: {
  alert_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  priority_tier: string | null;
  lead_score: number | null;
  occurred_at: string | null;
  payload: Json | null;
      }
    };
    v_dashboard_hot_leads: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_leads_without_follow_up: {
      Row: {
  id: string | null;
  created_at: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_leads_without_owner: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_live_lead_feed: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  source_section: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_metrics: {
      Row: {
  new_leads_today: string | null;
  hot_leads: string | null;
  overdue_follow_ups: string | null;
  avg_minutes_to_first_contact: string | null;
  conversion_rate_pct: string | null;
  leads_by_source: Json | null;
  leads_by_service_interest: Json | null;
      }
    };
    v_dashboard_needs_first_contact: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_contacted_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_overdue_tasks: {
      Row: {
  id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  status: string | null;
  priority: string | null;
  due_at: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  lead_status: string | null;
  minutes_overdue: string | null;
  urgency_score: number | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_recent_conversions: {
      Row: {
  id: string | null;
  closed_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  won_value: string | null;
  lead_score: number | null;
  priority_tier: string | null;
  conversion_status: string | null;
      }
    };
    v_dashboard_recently_active_leads: {
      Row: {
  id: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_top_converting_sources: {
      Row: {
  source_page: string | null;
  service_slug: string | null;
  won_count: string | null;
  total_count: string | null;
  conversion_rate_pct: string | null;
  won_value_total: string | null;
      }
    };
    v_failed_notifications: {
      Row: {
  id: string | null;
  user_id: string | null;
  type: string | null;
  title: string | null;
  message: string | null;
  priority: string | null;
  is_read: boolean | null;
  action_url: string | null;
  metadata: Json | null;
  created_at: string | null;
  read_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  channel: string | null;
  recipient: string | null;
  payload: Json | null;
  status: string | null;
  sent_at: string | null;
  failed_at: string | null;
  error_message: string | null;
  dedupe_key: string | null;
  retry_count: number | null;
  trigger_source: string | null;
      }
    };
    v_hot_leads_no_contact: {
      Row: {
  id: string | null;
  owner_id: string | null;
  lead_temperature: string | null;
  lead_status: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
      }
    };
    v_leads_by_owner: {
      Row: {
  owner_id: string | null;
  lead_status: string | null;
  priority: string | null;
  lead_count: string | null;
      }
    };
    v_lost_leads_by_reason: {
      Row: {
  lost_reason: string | null;
  lost_count: string | null;
      }
    };
    v_monitoring_alert_rules: {
      Row: {
  alert_type: string | null;
  target: string | null;
  created_at: string | null;
  payload: Json | null;
      }
    };
    v_notification_volume_by_type: {
      Row: {
  event_type: string | null;
  channel: string | null;
  status: string | null;
  hour_bucket: string | null;
  volume: string | null;
      }
    };
    v_notifications_by_lead: {
      Row: {
  lead_id: string | null;
  event_type: string | null;
  channel: string | null;
  status: string | null;
  created_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  retry_count: number | null;
  error_message: string | null;
      }
    };
    v_notifications_by_owner: {
      Row: {
  owner_id: string | null;
  event_type: string | null;
  channel: string | null;
  status: string | null;
  created_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  retry_count: number | null;
      }
    };
    v_overdue_follow_ups: {
      Row: {
  id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  due_at: string | null;
  priority: string | null;
  lead_status: string | null;
  lead_temperature: string | null;
      }
    };
    v_recent_alerts: {
      Row: {
  id: string | null;
  created_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  channel: string | null;
  recipient: string | null;
  status: string | null;
  payload: Json | null;
      }
    };
    v_revenue_attribution_first_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  attributed_source: string | null;
  attributed_medium: string | null;
  attributed_campaign: string | null;
  attributed_page: string | null;
      }
    };
    v_revenue_attribution_last_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  attributed_page: string | null;
  attributed_source: string | null;
  attributed_medium: string | null;
  attributed_campaign: string | null;
      }
    };
    v_revenue_attribution_multi_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  event_name: string | null;
  page: string | null;
  attributed_value: string | null;
      }
    };
    v_revenue_forecast_simple: {
      Row: {
  forecast_date: string | null;
  daily_lead_volume: string | null;
  conversion_rate: string | null;
  avg_deal_size: string | null;
  projected_daily_revenue: string | null;
      }
    };
    v_salesperson_workload: {
      Row: {
  owner_id: string | null;
  open_leads: string | null;
  open_tasks: string | null;
  overdue_tasks: string | null;
      }
    };
    v_service_catalog: {
      Row: {
  source: string | null;
  source_id: string | null;
  canonical_service_id: string | null;
  slug: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  supplier_id: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
    };
    v_unread_dashboard_alerts: {
      Row: {
  id: string | null;
  created_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  recipient: string | null;
  payload: Json | null;
  status: string | null;
      }
    };
    v_won_leads_by_source: {
      Row: {
  source_page: string | null;
  service_slug: string | null;
  won_count: string | null;
  total_won_value: string | null;
      }
    };
    vendors: {
      Row: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  address: string | null;
  emirate: string | null;
  coordinates: Json | null;
  license_number: string | null;
  commission_rate: string | null;
  categories: string[] | null;
  operating_hours: Json | null;
  rating: string | null;
  total_reviews: number | null;
  total_bookings: number | null;
  is_verified: boolean | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
      Insert: {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  address?: string | null;
  emirate?: string | null;
  coordinates?: Json | null;
  license_number?: string | null;
  commission_rate?: string | null;
  categories?: string[] | null;
  operating_hours?: Json | null;
  rating?: string | null;
  total_reviews?: number | null;
  total_bookings?: number | null;
  is_verified?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
      Update: {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  logo_url?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  address?: string | null;
  emirate?: string | null;
  coordinates?: Json | null;
  license_number?: string | null;
  commission_rate?: string | null;
  categories?: string[] | null;
  operating_hours?: Json | null;
  rating?: string | null;
  total_reviews?: number | null;
  total_bookings?: number | null;
  is_verified?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
      }
    };
    venue_categories: {
      Row: {
  id: string;
  slug: string;
  name: string;
  plural_name: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
      }
      Insert: {
  id?: string;
  slug: string;
  name: string;
  plural_name: string;
  icon?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
      }
      Update: {
  id?: string;
  slug?: string;
  name?: string;
  plural_name?: string;
  icon?: string | null;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
      }
    };
    venue_media: {
      Row: {
  id: string;
  venue_id: string | null;
  media_type: string | null;
  url: string;
  alt_text: string | null;
  display_order: number | null;
  type: string;
  caption: string | null;
  is_hero: boolean;
  sort_order: number;
  width: number | null;
  height: number | null;
  created_at: string;
      }
      Insert: {
  id?: string;
  venue_id?: string | null;
  media_type?: string | null;
  url: string;
  alt_text?: string | null;
  display_order?: number | null;
  type?: string;
  caption?: string | null;
  is_hero?: boolean;
  sort_order?: number;
  width?: number | null;
  height?: number | null;
  created_at?: string;
      }
      Update: {
  id?: string;
  venue_id?: string | null;
  media_type?: string | null;
  url?: string;
  alt_text?: string | null;
  display_order?: number | null;
  type?: string;
  caption?: string | null;
  is_hero?: boolean;
  sort_order?: number;
  width?: number | null;
  height?: number | null;
  created_at?: string;
      }
    };
    venue_related: {
      Row: {
  venue_id: string;
  related_venue_id: string;
  reason: string | null;
  sort_order: number;
      }
      Insert: {
  venue_id: string;
  related_venue_id: string;
  reason?: string | null;
  sort_order?: number;
      }
      Update: {
  venue_id?: string;
  related_venue_id?: string;
  reason?: string | null;
  sort_order?: number;
      }
    };
    venue_tag_map: {
      Row: {
  venue_id: string;
  tag_id: string;
      }
      Insert: {
  venue_id: string;
  tag_id: string;
      }
      Update: {
  venue_id?: string;
  tag_id?: string;
      }
    };
    venue_tags: {
      Row: {
  id: string;
  slug: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
      }
      Insert: {
  id?: string;
  slug: string;
  name: string;
  type?: string;
  is_active?: boolean;
  created_at?: string;
      }
      Update: {
  id?: string;
  slug?: string;
  name?: string;
  type?: string;
  is_active?: boolean;
  created_at?: string;
      }
    };
    venues: {
      Row: {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  emirate_id: string | null;
  location: string | null;
  lat: string | null;
  lng: string | null;
  price_tier: number | null;
  vibe: string | null;
  tags: string[] | null;
  hero_image_url: string | null;
  gallery_images: string[] | null;
  description_short: string | null;
  description_long: string | null;
  seo_description: string | null;
  highlights: string[] | null;
  dress_code: string | null;
  booking_policy: string | null;
  best_time: string | null;
  who_its_for: string | null;
  opening_hours: string | null;
  is_trending: boolean | null;
  is_new: boolean | null;
  is_featured: boolean | null;
  recommend_score: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
      }
      Insert: {
  id?: string;
  slug: string;
  name: string;
  category_id?: string | null;
  emirate_id?: string | null;
  location?: string | null;
  lat?: string | null;
  lng?: string | null;
  price_tier?: number | null;
  vibe?: string | null;
  tags?: string[] | null;
  hero_image_url?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  seo_description?: string | null;
  highlights?: string[] | null;
  dress_code?: string | null;
  booking_policy?: string | null;
  best_time?: string | null;
  who_its_for?: string | null;
  opening_hours?: string | null;
  is_trending?: boolean | null;
  is_new?: boolean | null;
  is_featured?: boolean | null;
  recommend_score?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: string | null;
      }
      Update: {
  id?: string;
  slug?: string;
  name?: string;
  category_id?: string | null;
  emirate_id?: string | null;
  location?: string | null;
  lat?: string | null;
  lng?: string | null;
  price_tier?: number | null;
  vibe?: string | null;
  tags?: string[] | null;
  hero_image_url?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  seo_description?: string | null;
  highlights?: string[] | null;
  dress_code?: string | null;
  booking_policy?: string | null;
  best_time?: string | null;
  who_its_for?: string | null;
  opening_hours?: string | null;
  is_trending?: boolean | null;
  is_new?: boolean | null;
  is_featured?: boolean | null;
  recommend_score?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: string | null;
      }
    };
    venues_old: {
      Row: {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  location: string | null;
  area: string | null;
  vibe_tags: string[] | null;
  skills: string[] | null;
  price_tier: number | null;
  hero_image: string | null;
  gallery_images: string[] | null;
  description_short: string | null;
  description_long: string | null;
  highlights: string[] | null;
  recommend_score: number | null;
  is_featured: boolean | null;
  is_trending: boolean | null;
  trending_score: number | null;
  opening_hours: string | null;
  dress_code: string | null;
  booking_policy: string | null;
  cuisine: string | null;
  best_time: string | null;
  who_its_for: string | null;
  insider_tip: string | null;
  coordinates: Json | null;
  supplier_id: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  service_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  latitude: number | null;
  longitude: number | null;
  slug: string | null;
  canonical_url: string | null;
  category_slug: string | null;
  emirate_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  booking_mode: string | null;
  booking_url: string | null;
  whatsapp_number: string | null;
  min_spend_aed: number | null;
  phone: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  address: string | null;
  google_place_id: string | null;
  view_count: number;
  published_at: string | null;
  fts: Json | null;
      }
      Insert: {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  location?: string | null;
  area?: string | null;
  vibe_tags?: string[] | null;
  skills?: string[] | null;
  price_tier?: number | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  recommend_score?: number | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  trending_score?: number | null;
  opening_hours?: string | null;
  dress_code?: string | null;
  booking_policy?: string | null;
  cuisine?: string | null;
  best_time?: string | null;
  who_its_for?: string | null;
  insider_tip?: string | null;
  coordinates?: Json | null;
  supplier_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  slug?: string | null;
  canonical_url?: string | null;
  category_slug?: string | null;
  emirate_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  booking_mode?: string | null;
  booking_url?: string | null;
  whatsapp_number?: string | null;
  min_spend_aed?: number | null;
  phone?: string | null;
  website_url?: string | null;
  instagram_handle?: string | null;
  address?: string | null;
  google_place_id?: string | null;
  view_count?: number;
  published_at?: string | null;
  fts?: Json | null;
      }
      Update: {
  id?: string;
  name?: string;
  category?: string;
  subcategory?: string | null;
  location?: string | null;
  area?: string | null;
  vibe_tags?: string[] | null;
  skills?: string[] | null;
  price_tier?: number | null;
  hero_image?: string | null;
  gallery_images?: string[] | null;
  description_short?: string | null;
  description_long?: string | null;
  highlights?: string[] | null;
  recommend_score?: number | null;
  is_featured?: boolean | null;
  is_trending?: boolean | null;
  trending_score?: number | null;
  opening_hours?: string | null;
  dress_code?: string | null;
  booking_policy?: string | null;
  cuisine?: string | null;
  best_time?: string | null;
  who_its_for?: string | null;
  insider_tip?: string | null;
  coordinates?: Json | null;
  supplier_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  service_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  slug?: string | null;
  canonical_url?: string | null;
  category_slug?: string | null;
  emirate_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  booking_mode?: string | null;
  booking_url?: string | null;
  whatsapp_number?: string | null;
  min_spend_aed?: number | null;
  phone?: string | null;
  website_url?: string | null;
  instagram_handle?: string | null;
  address?: string | null;
  google_place_id?: string | null;
  view_count?: number;
  published_at?: string | null;
  fts?: Json | null;
      }
    };
    waitlist_entries: {
      Row: {
  id: string;
  user_id: string;
  experience_id: string;
  time_slot: string | null;
  booking_date: string | null;
  status: string;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
      }
      Insert: {
  id?: string;
  user_id: string;
  experience_id: string;
  time_slot?: string | null;
  booking_date?: string | null;
  status?: string;
  notified_at?: string | null;
  created_at?: string;
  updated_at?: string;
      }
      Update: {
  id?: string;
  user_id?: string;
  experience_id?: string;
  time_slot?: string | null;
  booking_date?: string | null;
  status?: string;
  notified_at?: string | null;
  created_at?: string;
  updated_at?: string;
      }
    };
    whatsapp_delivery_logs: {
      Row: {
  id: string;
  created_at: string;
  whatsapp_job_id: string;
  provider_message_id: string | null;
  delivery_status: string;
  provider_payload: Json | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  whatsapp_job_id: string;
  provider_message_id?: string | null;
  delivery_status: string;
  provider_payload?: Json | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  whatsapp_job_id?: string;
  provider_message_id?: string | null;
  delivery_status?: string;
  provider_payload?: Json | null;
      }
    };
    whatsapp_jobs: {
      Row: {
  id: string;
  created_at: string;
  lead_id: string;
  trigger_type: string;
  template_key: string;
  recipient_phone: string | null;
  payload: Json;
  dedupe_key: string;
  status: string;
  attempt_count: number;
  next_attempt_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  error_message: string | null;
      }
      Insert: {
  id?: string;
  created_at?: string;
  lead_id: string;
  trigger_type: string;
  template_key: string;
  recipient_phone?: string | null;
  payload?: Json;
  dedupe_key: string;
  status?: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  sent_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
      }
      Update: {
  id?: string;
  created_at?: string;
  lead_id?: string;
  trigger_type?: string;
  template_key?: string;
  recipient_phone?: string | null;
  payload?: Json;
  dedupe_key?: string;
  status?: string;
  attempt_count?: number;
  next_attempt_at?: string | null;
  sent_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
      }
    };
    whatsapp_templates: {
      Row: {
  id: string;
  created_at: string;
  template_key: string;
  body: string;
  variables: Json;
  enabled: boolean;
      }
      Insert: {
  id?: string;
  created_at?: string;
  template_key: string;
  body: string;
  variables?: Json;
  enabled?: boolean;
      }
      Update: {
  id?: string;
  created_at?: string;
  template_key?: string;
  body?: string;
  variables?: Json;
  enabled?: boolean;
      }
    };
    };
    Views: {
    users: {
      Row: {
  id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
    };
    v_avg_time_to_first_contact: {
      Row: {
  owner_id: string | null;
  avg_minutes_to_first_contact: string | null;
      }
    };
    v_booking_sync: {
      Row: {
  '?column?': number | null;
      }
    };
    v_cc_active_overrides: {
      Row: {
  override_key: string | null;
  override_value: Json | null;
  enabled: boolean | null;
  expires_at: string | null;
  reason: string | null;
  updated_by: string | null;
  created_at: string | null;
      }
    };
    v_cc_capacity_balancer: {
      Row: {
  owner_id: string | null;
  active_leads: string | null;
  open_tasks: string | null;
  max_active_leads: number | null;
  max_open_tasks: number | null;
  active_load_pct: string | null;
  task_load_pct: string | null;
  balancing_state: string | null;
      }
    };
    v_cc_competitive_intelligence: {
      Row: {
  source_page: string | null;
  day: string | null;
  leads: string | null;
  win_rate: string | null;
  avg_daily_leads: string | null;
  std_daily_leads: string | null;
  avg_win_rate: string | null;
  lead_shift_z: string | null;
  win_rate_shift: string | null;
  shift_detection: string | null;
      }
    };
    v_cc_conversion_acceleration: {
      Row: {
  lead_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  acceleration_action: string | null;
  urgency_score: number | null;
      }
    };
    v_cc_critical_alerts: {
      Row: {
  alert_type: string | null;
  lead_id: string | null;
  routing_owner: string | null;
  routing_team: string | null;
  alert_priority: string | null;
  payload: Json | null;
  occurred_at: string | null;
      }
    };
    v_cc_deal_health: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  lead_status: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  status_updated_at: string | null;
  hours_to_first_touch: string | null;
  hours_since_last_touch: string | null;
  is_stalled: boolean | null;
  close_likelihood: string | null;
  fail_likelihood: string | null;
      }
    };
    v_cc_decision_signals: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_execution_discipline_metrics: {
      Row: {
  owner_id: string | null;
  missed_first_contact_count: string | null;
  missed_follow_up_count: string | null;
  avg_response_minutes: string | null;
  discipline_risk_score: string | null;
      }
    };
    v_cc_founder_control_metrics: {
      Row: {
  leads_24h: string | null;
  won_24h: string | null;
  revenue_24h: string | null;
  top20_queue_size: string | null;
  active_pressure_cases: string | null;
  critical_leaks: string | null;
  killswitch_triggered: boolean | null;
      }
    };
    v_cc_high_dropoff_pages: {
      Row: {
  source_page: string | null;
  total_leads: string | null;
  won_count: string | null;
  dropoff_pct: string | null;
      }
    };
    v_cc_high_intent_interception: {
      Row: {
  session_id: string | null;
  intent_events: string | null;
  last_event_at: string | null;
  last_page: string | null;
  intent_band: string | null;
  interception_logic: string | null;
      }
    };
    v_cc_hot_leads_immediate_action: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_instant_response_targets: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  phone: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  requires_instant_response: boolean | null;
  response_logic: string | null;
      }
    };
    v_cc_killswitch_detection: {
      Row: {
  recent_conversion_pct: string | null;
  baseline_conversion_pct: string | null;
  high_intent_to_submit_pct: string | null;
  killswitch_triggered: boolean | null;
  killswitch_reason: string | null;
      }
    };
    v_cc_lead_value_prediction: {
      Row: {
  lead_id: string | null;
  score: number | null;
  intent_level: string | null;
  source_quality: string | null;
  events_last_30m: string | null;
  service_slug: string | null;
  value_score: string | null;
  expected_deal_value: string | null;
  prediction_explainability: Json | null;
      }
    };
    v_cc_leads_no_contact_yet: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_likely_to_convert: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
  conversion_likelihood_score: string | null;
      }
    };
    v_cc_overdue_followups: {
      Row: {
  task_id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  priority: string | null;
  due_at: string | null;
  minutes_overdue: string | null;
  score: number | null;
  intent_level: string | null;
  source_quality: string | null;
  recommended_action: string | null;
      }
    };
    v_cc_playbook_execution_mapping: {
      Row: {
  playbook_key: string | null;
  display_name: string | null;
  trigger_rule: Json | null;
  step_order: number | null;
  step_name: string | null;
  action_type: string | null;
  schedule_offset_minutes: number | null;
  config: Json | null;
      }
    };
    v_cc_predicted_vs_actual: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  predicted_conversion_score: string | null;
  predicted_value: string | null;
  actual_outcome: string | null;
  actual_value: string | null;
  prediction_error: string | null;
      }
    };
    v_cc_product_feedback_insights: {
      Row: {
  source_page: string | null;
  leads: string | null;
  won: string | null;
  hot: string | null;
  avg_score: string | null;
  conversion_pct: string | null;
  hot_unconverted_gap: string | null;
  improvement_priority: string | null;
      }
    };
    v_cc_recent_high_activity: {
      Row: {
  lead_id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  score: number | null;
  intent_level: string | null;
  last_activity: string | null;
  source_quality: string | null;
  recommended_action: string | null;
  events_last_30m: string | null;
  events_last_15m: string | null;
      }
    };
    v_cc_reengagement_candidates: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  lead_status: string | null;
  intent_level: string | null;
  score: number | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  inactivity_anchor: string | null;
  reengagement_action: string | null;
  reengagement_priority: number | null;
      }
    };
    v_cc_revenue_leak_detection: {
      Row: {
  lead_id: string | null;
  leak_type: string | null;
  leak_priority: string | null;
  estimated_loss: string | null;
      }
    };
    v_cc_revenue_priority_queue: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  lead_status: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  expected_deal_value: string | null;
  idle_minutes: string | null;
  priority_score: string | null;
  queue_rank: string | null;
      }
    };
    v_cc_routing_adjustments: {
      Row: {
  owner_team_id: string | null;
  total: string | null;
  won: string | null;
  win_rate_pct: string | null;
  avg_first_contact_minutes: string | null;
  routing_adjustment_rule: string | null;
      }
    };
    v_cc_sales_pressure: {
      Row: {
  lead_id: string | null;
  owner_id: string | null;
  owner_team_id: string | null;
  lead_score: number | null;
  won_value: string | null;
  lead_temperature: string | null;
  created_at: string | null;
  last_contacted_at: string | null;
  idle_minutes: string | null;
  escalation_rule: string | null;
  pressure_priority: number | null;
      }
    };
    v_cc_scoring_weight_adjustments: {
      Row: {
  event_name: string | null;
  current_weight: string | null;
  suggested_weight: string | null;
  win_lift_pct: string | null;
  total_count: string | null;
  adjustment_rule: string | null;
      }
    };
    v_cc_source_quality_score: {
      Row: {
  source_page: string | null;
  total_leads: string | null;
  won_leads: string | null;
  total_revenue: string | null;
  avg_score: string | null;
  win_rate_pct: string | null;
  source_quality_score: string | null;
      }
    };
    v_conversion_rate_by_owner: {
      Row: {
  owner_id: string | null;
  won_count: string | null;
  lost_count: string | null;
  total_count: string | null;
  conversion_rate_pct: string | null;
      }
    };
    v_dashboard_activity_stream: {
      Row: {
  occurred_at: string | null;
  lead_id: string | null;
  activity_type: string | null;
  actor_id: string | null;
  reason: string | null;
  metadata: Json | null;
  lead_score: number | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_alerts: {
      Row: {
  alert_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  priority_tier: string | null;
  lead_score: number | null;
  occurred_at: string | null;
  payload: Json | null;
      }
    };
    v_dashboard_hot_leads: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_leads_without_follow_up: {
      Row: {
  id: string | null;
  created_at: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_leads_without_owner: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_live_lead_feed: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  source_section: string | null;
  service_slug: string | null;
  lead_status: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_metrics: {
      Row: {
  new_leads_today: string | null;
  hot_leads: string | null;
  overdue_follow_ups: string | null;
  avg_minutes_to_first_contact: string | null;
  conversion_rate_pct: string | null;
  leads_by_source: Json | null;
  leads_by_service_interest: Json | null;
      }
    };
    v_dashboard_needs_first_contact: {
      Row: {
  id: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_contacted_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_overdue_tasks: {
      Row: {
  id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  status: string | null;
  priority: string | null;
  due_at: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  lead_status: string | null;
  minutes_overdue: string | null;
  urgency_score: number | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_recent_conversions: {
      Row: {
  id: string | null;
  closed_at: string | null;
  source_page: string | null;
  service_slug: string | null;
  owner_id: string | null;
  won_value: string | null;
  lead_score: number | null;
  priority_tier: string | null;
  conversion_status: string | null;
      }
    };
    v_dashboard_recently_active_leads: {
      Row: {
  id: string | null;
  owner_id: string | null;
  source_page: string | null;
  service_slug: string | null;
  lead_score: number | null;
  lead_temperature: string | null;
  priority_tier: string | null;
  last_activity_at: string | null;
  next_required_action: string | null;
      }
    };
    v_dashboard_top_converting_sources: {
      Row: {
  source_page: string | null;
  service_slug: string | null;
  won_count: string | null;
  total_count: string | null;
  conversion_rate_pct: string | null;
  won_value_total: string | null;
      }
    };
    v_failed_notifications: {
      Row: {
  id: string | null;
  user_id: string | null;
  type: string | null;
  title: string | null;
  message: string | null;
  priority: string | null;
  is_read: boolean | null;
  action_url: string | null;
  metadata: Json | null;
  created_at: string | null;
  read_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  channel: string | null;
  recipient: string | null;
  payload: Json | null;
  status: string | null;
  sent_at: string | null;
  failed_at: string | null;
  error_message: string | null;
  dedupe_key: string | null;
  retry_count: number | null;
  trigger_source: string | null;
      }
    };
    v_hot_leads_no_contact: {
      Row: {
  id: string | null;
  owner_id: string | null;
  lead_temperature: string | null;
  lead_status: string | null;
  created_at: string | null;
  source_page: string | null;
  service_slug: string | null;
      }
    };
    v_leads_by_owner: {
      Row: {
  owner_id: string | null;
  lead_status: string | null;
  priority: string | null;
  lead_count: string | null;
      }
    };
    v_lost_leads_by_reason: {
      Row: {
  lost_reason: string | null;
  lost_count: string | null;
      }
    };
    v_monitoring_alert_rules: {
      Row: {
  alert_type: string | null;
  target: string | null;
  created_at: string | null;
  payload: Json | null;
      }
    };
    v_notification_volume_by_type: {
      Row: {
  event_type: string | null;
  channel: string | null;
  status: string | null;
  hour_bucket: string | null;
  volume: string | null;
      }
    };
    v_notifications_by_lead: {
      Row: {
  lead_id: string | null;
  event_type: string | null;
  channel: string | null;
  status: string | null;
  created_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  retry_count: number | null;
  error_message: string | null;
      }
    };
    v_notifications_by_owner: {
      Row: {
  owner_id: string | null;
  event_type: string | null;
  channel: string | null;
  status: string | null;
  created_at: string | null;
  sent_at: string | null;
  failed_at: string | null;
  retry_count: number | null;
      }
    };
    v_overdue_follow_ups: {
      Row: {
  id: string | null;
  lead_id: string | null;
  owner_id: string | null;
  task_type: string | null;
  title: string | null;
  due_at: string | null;
  priority: string | null;
  lead_status: string | null;
  lead_temperature: string | null;
      }
    };
    v_recent_alerts: {
      Row: {
  id: string | null;
  created_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  channel: string | null;
  recipient: string | null;
  status: string | null;
  payload: Json | null;
      }
    };
    v_revenue_attribution_first_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  attributed_source: string | null;
  attributed_medium: string | null;
  attributed_campaign: string | null;
  attributed_page: string | null;
      }
    };
    v_revenue_attribution_last_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  attributed_page: string | null;
  attributed_source: string | null;
  attributed_medium: string | null;
  attributed_campaign: string | null;
      }
    };
    v_revenue_attribution_multi_touch: {
      Row: {
  lead_id: string | null;
  won_value: string | null;
  event_name: string | null;
  page: string | null;
  attributed_value: string | null;
      }
    };
    v_revenue_forecast_simple: {
      Row: {
  forecast_date: string | null;
  daily_lead_volume: string | null;
  conversion_rate: string | null;
  avg_deal_size: string | null;
  projected_daily_revenue: string | null;
      }
    };
    v_salesperson_workload: {
      Row: {
  owner_id: string | null;
  open_leads: string | null;
  open_tasks: string | null;
  overdue_tasks: string | null;
      }
    };
    v_service_catalog: {
      Row: {
  source: string | null;
  source_id: string | null;
  canonical_service_id: string | null;
  slug: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  supplier_id: string | null;
  created_at: string | null;
  updated_at: string | null;
      }
    };
    v_unread_dashboard_alerts: {
      Row: {
  id: string | null;
  created_at: string | null;
  event_type: string | null;
  lead_id: string | null;
  owner_id: string | null;
  recipient: string | null;
  payload: Json | null;
  status: string | null;
      }
    };
    v_won_leads_by_source: {
      Row: {
  source_page: string | null;
  service_slug: string | null;
  won_count: string | null;
  total_won_value: string | null;
      }
    };
    };
    Functions: {};
    Enums: {};
  };
}
