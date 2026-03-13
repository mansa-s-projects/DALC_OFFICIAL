// ─── Core Enumerations ───────────────────────────────────────────────────────

export type RelocationPurpose =
  | 'employment'
  | 'business'
  | 'retirement'
  | 'family'
  | 'investment';

export type BudgetRange =
  | 'under_10k'
  | '10k_50k'
  | '50k_200k'
  | '200k_plus';

export type PropertyPreference = 'rent' | 'buy' | 'undecided';

export type VisaStatus =
  | 'not_started'
  | 'in_progress'
  | 'approved'
  | 'rejected';

export type RelocationStatus = 'active' | 'paused' | 'completed';

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export type StepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'skipped';

export type DocumentStatus =
  | 'pending'
  | 'uploaded'
  | 'verified'
  | 'rejected'
  | 'expired';

// ─── Database Models ──────────────────────────────────────────────────────────

export interface RelocationProfile {
  id: string;
  user_id: string;
  purpose: RelocationPurpose | null;
  current_country: string | null;
  target_move_date: string | null; // ISO date string
  family_size: number;
  has_children: boolean;
  budget_range: BudgetRange | null;
  property_preference: PropertyPreference | null;
  visa_status: VisaStatus;
  notes: string | null;
  status: RelocationStatus;
  created_at: string;
  updated_at: string;
}

export interface UserWorkflow {
  id: string;
  user_id: string;
  relocation_profile_id: string | null;
  title: string;
  description: string | null;
  workflow_type: string;
  total_steps: number;
  completed_steps: number;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
}

export interface UserWorkflowStep {
  id: string;
  workflow_id: string;
  step_number: number;
  title: string;
  description: string | null;
  category: string | null;
  status: StepStatus;
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  relocation_profile_id: string | null;
  document_type: string;
  document_name: string;
  file_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: DocumentStatus;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RelocationCostEstimate {
  id: string;
  relocation_profile_id: string;
  category: string;
  item_name: string;
  estimated_min: number | null;
  estimated_max: number | null;
  currency: string;
  notes: string | null;
  is_recurring: boolean;
  recurrence_period: string | null;
  created_at: string;
}

// ─── Form / Input Types ───────────────────────────────────────────────────────

export interface IntakeFormData {
  // Step 1 — Purpose
  purpose: RelocationPurpose;

  // Step 2 — Current situation
  current_country: string;
  family_size: number;
  has_children: boolean;
  budget_range: BudgetRange;

  // Step 3 — Timeline & preferences
  target_move_date: string;
  property_preference: PropertyPreference;
  visa_status: VisaStatus;
  notes: string;
}

// ─── Service Input Types ──────────────────────────────────────────────────────

export type CreateRelocationProfileInput = Omit<
  RelocationProfile,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateRelocationProfileInput = Partial<
  Omit<RelocationProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

export type CreateWorkflowInput = Omit<
  UserWorkflow,
  'id' | 'created_at' | 'updated_at'
>;

export type CreateDocumentInput = Omit<
  UserDocument,
  'id' | 'created_at' | 'updated_at'
>;

export type AddCostEstimateInput = Omit<
  RelocationCostEstimate,
  'id' | 'created_at'
>;

// ─── Computed / Aggregated Types ──────────────────────────────────────────────

export interface CostCategory {
  category: string;
  items: RelocationCostEstimate[];
  totalMin: number;
  totalMax: number;
  hasRecurring: boolean;
}

export interface CostSummary {
  categories: CostCategory[];
  grandTotalMin: number;
  grandTotalMax: number;
  oneTimeMin: number;
  oneTimeMax: number;
  recurringMin: number;
  recurringMax: number;
  currency: string;
}

// ─── Default Workflow Step Definitions ───────────────────────────────────────

export interface DefaultWorkflowStep {
  step_number: number;
  title: string;
  description: string;
  category: string;
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const PURPOSE_LABELS: Record<RelocationPurpose, string> = {
  employment: 'Employment',
  business: 'Business Setup',
  retirement: 'Retirement',
  family: 'Family Reunification',
  investment: 'Investment',
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under_10k: 'Under AED 10,000/mo',
  '10k_50k': 'AED 10,000 – 50,000/mo',
  '50k_200k': 'AED 50,000 – 200,000/mo',
  '200k_plus': 'AED 200,000+/mo',
};

export const PROPERTY_LABELS: Record<PropertyPreference, string> = {
  rent: 'Rent',
  buy: 'Buy',
  undecided: 'Undecided',
};

export const VISA_STATUS_LABELS: Record<VisaStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  blocked: 'Blocked',
  skipped: 'Skipped',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: 'Required',
  uploaded: 'Uploaded',
  verified: 'Verified',
  rejected: 'Rejected',
  expired: 'Expired',
};
