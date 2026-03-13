// ─── Concierge Request Types ──────────────────────────────────────────────────

export type ConciergeRequestType =
  | 'travel_arrival'
  | 'property_stay'
  | 'transport_lifestyle'
  | 'business_support'
  | 'event_reservation'
  | 'personal_request';

export type ConciergeStatus =
  | 'pending'
  | 'acknowledged'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ConciergeUrgency = 'standard' | 'urgent' | 'asap';

export interface ConciergeRequest {
  id: string;
  user_id: string;
  request_type: ConciergeRequestType;
  urgency: ConciergeUrgency;
  title: string;
  description: string;
  preferred_date?: string;
  preferred_time?: string;
  budget_range?: string;
  special_instructions?: string;
  status: ConciergeStatus;
  assigned_to?: string;
  concierge_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConciergeRequestInput {
  request_type: ConciergeRequestType;
  urgency: ConciergeUrgency;
  title: string;
  description: string;
  preferred_date?: string;
  preferred_time?: string;
  budget_range?: string;
  special_instructions?: string;
}

export const CONCIERGE_TYPE_LABELS: Record<ConciergeRequestType, string> = {
  travel_arrival: 'Travel & Arrivals',
  property_stay: 'Property & Stays',
  transport_lifestyle: 'Transport & Lifestyle',
  business_support: 'Business Support',
  event_reservation: 'Events & Reservations',
  personal_request: 'Personal Request',
};

export const CONCIERGE_STATUS_LABELS: Record<ConciergeStatus, string> = {
  pending: 'Pending',
  acknowledged: 'Acknowledged',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
