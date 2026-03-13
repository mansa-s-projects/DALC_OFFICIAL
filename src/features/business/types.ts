// ─── Subcategory Types ───────────────────────────────────────────────────────

export type BusinessSubcategory =
  | 'company-formation'
  | 'licensing'
  | 'banking'
  | 'tax'
  | 'residency-investment';

export type ServiceType = 'package' | 'consultation' | 'advisory' | 'filing';

export type PricingModel = 'fixed' | 'starting_from' | 'custom_quote' | 'hourly';

export type WorkflowStatus =
  | 'not_started'
  | 'in_progress'
  | 'pending_documents'
  | 'under_review'
  | 'government_processing'
  | 'completed'
  | 'cancelled';

export type ConsultationType = 'initial' | 'follow_up' | 'document_review' | 'signing';

export type MeetingType = 'online' | 'in_person' | 'phone';

export type ConsultationStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  duration_days?: number;
  responsible_party?: string;
}

export interface ComplianceItem {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  completed?: boolean;
  completed_at?: string;
}

export interface BusinessService {
  id: string;
  subcategory: BusinessSubcategory;
  sub_subcategory?: string;
  name: string;
  slug: string;
  description_short?: string;
  description_long?: string;
  hero_image?: string;
  gallery_images: string[];
  service_type: ServiceType;
  duration_description?: string;
  pricing_model: PricingModel;
  price_from?: number;
  price_currency: string;
  price_display?: string;
  required_documents: string[];
  eligibility_criteria: string[];
  government_fees: number;
  government_authority?: string;
  compliance_checklist: ComplianceItem[];
  estimated_steps: number;
  workflow_template: WorkflowStep[];
  location: string;
  freezone?: string;
  supplier_id?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  popularity_score: number;
  status: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface BusinessConsultation {
  id: string;
  request_id?: string;
  service_id: string;
  user_id: string;
  consultation_type: ConsultationType;
  scheduled_at: string;
  duration_minutes: number;
  meeting_type: MeetingType;
  meeting_link?: string;
  meeting_location?: string;
  agenda?: string;
  advisor_notes?: string;
  outcome?: string;
  next_steps?: string;
  status: ConsultationStatus;
  created_at?: string;
  updated_at?: string;
  // Joined
  service?: BusinessService;
}

export interface BusinessBooking {
  id: string;
  request_id?: string;
  service_id: string;
  user_id: string;
  package_selected?: string;
  documents_submitted: string[];
  documents_required: string[];
  documents_complete: boolean;
  compliance_status: ComplianceItem[];
  current_step: number;
  total_steps: number;
  workflow_status: WorkflowStatus;
  quoted_price?: number;
  government_fees?: number;
  total_price?: number;
  currency: string;
  relocation_profile_id?: string;
  status: BookingStatus;
  estimated_completion?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  // Joined
  service?: BusinessService;
}

// ─── Filter / Input Types ─────────────────────────────────────────────────────

export interface BusinessFilters {
  subcategory?: BusinessSubcategory;
  sub_subcategory?: string;
  service_type?: ServiceType;
  pricing_model?: PricingModel;
  price_min?: number;
  price_max?: number;
  freezone?: string;
  is_featured?: boolean;
}

export interface BusinessBookingInput {
  service_id: string;
  user_id: string;
  package_selected?: string;
  documents_required?: string[];
  quoted_price?: number;
  government_fees?: number;
  total_price?: number;
  relocation_profile_id?: string;
}

export interface ConsultationInput {
  service_id: string;
  user_id: string;
  consultation_type?: ConsultationType;
  scheduled_at: string;
  duration_minutes?: number;
  meeting_type?: MeetingType;
  agenda?: string;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface TimeSlot {
  time: string;       // ISO string
  label: string;      // e.g. "10:00 AM"
  available: boolean;
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const SUBCATEGORY_LABELS: Record<BusinessSubcategory, string> = {
  'company-formation': 'Company Formation',
  'licensing': 'Business Licensing',
  'banking': 'Banking & Finance',
  'tax': 'Tax & Accounting',
  'residency-investment': 'Residency & Investment',
};

export const SUBCATEGORY_DESCRIPTIONS: Record<BusinessSubcategory, string> = {
  'company-formation': 'Set up your mainland or free zone company in Dubai with expert guidance.',
  'licensing': 'Obtain the right trade, professional or industrial licence for your business.',
  'banking': 'Open corporate and personal accounts with top UAE banks.',
  'tax': 'VAT registration, corporate tax compliance and bookkeeping services.',
  'residency-investment': 'Golden Visa, investor residency and property investment pathways.',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  package: 'Full Package',
  consultation: 'Consultation',
  advisory: 'Advisory',
  filing: 'Filing',
};

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  pending_documents: 'Pending Documents',
  under_review: 'Under Review',
  government_processing: 'Government Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
