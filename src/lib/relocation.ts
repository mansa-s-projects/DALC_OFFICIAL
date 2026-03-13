import { supabase, isMockMode } from './supabase';
import type {
  RelocationProfile,
  UserWorkflow,
  UserWorkflowStep,
  UserDocument,
  RelocationCostEstimate,
  CreateRelocationProfileInput,
  UpdateRelocationProfileInput,
  CreateWorkflowInput,
  CreateDocumentInput,
  AddCostEstimateInput,
  DefaultWorkflowStep,
  RelocationPurpose,
} from '../types/relocation';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: RelocationProfile = {
  id: 'mock-profile-001',
  user_id: 'mock-user-001',
  purpose: 'business',
  current_country: 'United Kingdom',
  target_move_date: '2025-09-01',
  family_size: 3,
  has_children: true,
  budget_range: '50k_200k',
  property_preference: 'rent',
  visa_status: 'in_progress',
  notes: 'Looking for a 3-bedroom apartment near DIFC.',
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_WORKFLOW: UserWorkflow = {
  id: 'mock-workflow-001',
  user_id: 'mock-user-001',
  relocation_profile_id: 'mock-profile-001',
  title: 'Dubai Business Relocation',
  description: 'Your personalised step-by-step relocation plan.',
  workflow_type: 'relocation',
  total_steps: 8,
  completed_steps: 2,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_STEPS: UserWorkflowStep[] = [
  { id: 'step-1', workflow_id: 'mock-workflow-001', step_number: 1, title: 'Gather Personal Documents', description: 'Passport, birth certificate, marriage certificate if applicable.', category: 'Documentation', status: 'completed', due_date: null, completed_at: new Date().toISOString(), notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-2', workflow_id: 'mock-workflow-001', step_number: 2, title: 'Apply for UAE Residence Visa', description: 'Submit application via GDRFA or ICP portal.', category: 'Visa', status: 'completed', due_date: null, completed_at: new Date().toISOString(), notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-3', workflow_id: 'mock-workflow-001', step_number: 3, title: 'Set Up Company / Freezone Registration', description: 'Choose between mainland, freezone or offshore structure.', category: 'Business', status: 'in_progress', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-4', workflow_id: 'mock-workflow-001', step_number: 4, title: 'Open UAE Bank Account', description: 'Personal and/or corporate account setup.', category: 'Finance', status: 'pending', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-5', workflow_id: 'mock-workflow-001', step_number: 5, title: 'Find Accommodation', description: 'Short-term rental while searching for long-term property.', category: 'Housing', status: 'pending', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-6', workflow_id: 'mock-workflow-001', step_number: 6, title: 'Register Children in School', description: 'KHDA-approved international schools in Dubai.', category: 'Education', status: 'pending', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-7', workflow_id: 'mock-workflow-001', step_number: 7, title: 'Health Insurance & Medical Registration', description: 'Mandatory health insurance in Dubai.', category: 'Healthcare', status: 'pending', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'step-8', workflow_id: 'mock-workflow-001', step_number: 8, title: 'Emirates ID & Driving Licence', description: 'Apply for Emirates ID and convert your driving licence.', category: 'Documentation', status: 'pending', due_date: null, completed_at: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_DOCUMENTS: UserDocument[] = [
  { id: 'doc-1', user_id: 'mock-user-001', relocation_profile_id: 'mock-profile-001', document_type: 'passport', document_name: 'Passport', file_url: null, file_size: null, mime_type: null, status: 'uploaded', expiry_date: '2030-01-01', notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'doc-2', user_id: 'mock-user-001', relocation_profile_id: 'mock-profile-001', document_type: 'visa_application', document_name: 'Visa Application Form', file_url: null, file_size: null, mime_type: null, status: 'pending', expiry_date: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'doc-3', user_id: 'mock-user-001', relocation_profile_id: 'mock-profile-001', document_type: 'birth_certificate', document_name: 'Birth Certificate', file_url: null, file_size: null, mime_type: null, status: 'uploaded', expiry_date: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'doc-4', user_id: 'mock-user-001', relocation_profile_id: 'mock-profile-001', document_type: 'bank_statement', document_name: 'Bank Statement (3 months)', file_url: null, file_size: null, mime_type: null, status: 'pending', expiry_date: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'doc-5', user_id: 'mock-user-001', relocation_profile_id: 'mock-profile-001', document_type: 'marriage_certificate', document_name: 'Marriage Certificate', file_url: null, file_size: null, mime_type: null, status: 'pending', expiry_date: null, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const MOCK_COSTS: RelocationCostEstimate[] = [
  { id: 'cost-1', relocation_profile_id: 'mock-profile-001', category: 'Visa & Immigration', item_name: 'Residence Visa (family of 3)', estimated_min: 3500, estimated_max: 5000, currency: 'AED', notes: null, is_recurring: false, recurrence_period: null, created_at: new Date().toISOString() },
  { id: 'cost-2', relocation_profile_id: 'mock-profile-001', category: 'Visa & Immigration', item_name: 'Emirates ID', estimated_min: 370, estimated_max: 370, currency: 'AED', notes: null, is_recurring: false, recurrence_period: null, created_at: new Date().toISOString() },
  { id: 'cost-3', relocation_profile_id: 'mock-profile-001', category: 'Housing', item_name: '3BR Apartment Rent (DIFC area)', estimated_min: 20000, estimated_max: 45000, currency: 'AED', notes: null, is_recurring: true, recurrence_period: 'monthly', created_at: new Date().toISOString() },
  { id: 'cost-4', relocation_profile_id: 'mock-profile-001', category: 'Housing', item_name: 'Security Deposit', estimated_min: 40000, estimated_max: 90000, currency: 'AED', notes: null, is_recurring: false, recurrence_period: null, created_at: new Date().toISOString() },
  { id: 'cost-5', relocation_profile_id: 'mock-profile-001', category: 'Education', item_name: 'International School (per child)', estimated_min: 45000, estimated_max: 100000, currency: 'AED', notes: 'Per academic year', is_recurring: true, recurrence_period: 'yearly', created_at: new Date().toISOString() },
  { id: 'cost-6', relocation_profile_id: 'mock-profile-001', category: 'Healthcare', item_name: 'Health Insurance (family)', estimated_min: 8000, estimated_max: 20000, currency: 'AED', notes: null, is_recurring: true, recurrence_period: 'yearly', created_at: new Date().toISOString() },
  { id: 'cost-7', relocation_profile_id: 'mock-profile-001', category: 'Business Setup', item_name: 'Freezone License', estimated_min: 15000, estimated_max: 35000, currency: 'AED', notes: null, is_recurring: false, recurrence_period: null, created_at: new Date().toISOString() },
  { id: 'cost-8', relocation_profile_id: 'mock-profile-001', category: 'Transportation', item_name: 'Vehicle (lease/purchase)', estimated_min: 2500, estimated_max: 8000, currency: 'AED', notes: null, is_recurring: true, recurrence_period: 'monthly', created_at: new Date().toISOString() },
];

// ─── Default Workflow Steps by Purpose ───────────────────────────────────────

const BASE_STEPS: DefaultWorkflowStep[] = [
  { step_number: 1, title: 'Gather Personal Documents', description: 'Collect passport, birth certificate, and any other required personal documents.', category: 'Documentation' },
  { step_number: 2, title: 'Apply for UAE Residence Visa', description: 'Submit your visa application via GDRFA or ICP online portal.', category: 'Visa' },
  { step_number: 3, title: 'Open UAE Bank Account', description: 'Set up a personal bank account with a UAE bank.', category: 'Finance' },
  { step_number: 4, title: 'Find Accommodation', description: 'Research and secure suitable housing in Dubai.', category: 'Housing' },
  { step_number: 5, title: 'Health Insurance & Medical Registration', description: 'Arrange mandatory health insurance coverage for yourself and family.', category: 'Healthcare' },
  { step_number: 6, title: 'Emirates ID', description: 'Apply for your Emirates ID once residency is approved.', category: 'Documentation' },
  { step_number: 7, title: 'UAE Driving Licence', description: 'Convert your existing licence or take driving lessons.', category: 'Transportation' },
  { step_number: 8, title: 'Register Utilities & Services', description: 'Set up DEWA, internet, and other essential services.', category: 'Admin' },
];

const PURPOSE_EXTRA_STEPS: Record<RelocationPurpose, DefaultWorkflowStep[]> = {
  business: [
    { step_number: 3, title: 'Choose Business Structure', description: 'Decide between mainland, freezone, or offshore company.', category: 'Business' },
    { step_number: 4, title: 'Register Company / Freezone License', description: 'Complete company registration and obtain your trade license.', category: 'Business' },
    { step_number: 5, title: 'Open Corporate Bank Account', description: 'Set up business banking with a UAE-based bank.', category: 'Finance' },
  ],
  employment: [
    { step_number: 3, title: 'Obtain Employment Visa', description: 'Your employer will sponsor your work visa and residency.', category: 'Visa' },
    { step_number: 4, title: 'Attest Employment Contract', description: 'Have your employment contract legally attested.', category: 'Documentation' },
  ],
  retirement: [
    { step_number: 3, title: 'Apply for Retirement Visa', description: 'UAE retirement visa requires proof of savings or property ownership.', category: 'Visa' },
    { step_number: 4, title: 'Pension & Income Transfer Setup', description: 'Arrange international pension payments to your UAE account.', category: 'Finance' },
  ],
  family: [
    { step_number: 3, title: 'Family Residence Visa Sponsorship', description: 'Sponsor your family members\' residence visas.', category: 'Visa' },
    { step_number: 4, title: 'Register Children in School', description: 'Enrol children in KHDA-approved international schools.', category: 'Education' },
    { step_number: 5, title: 'Attest Family Documents', description: 'Marriage certificate and birth certificates require apostille/attestation.', category: 'Documentation' },
  ],
  investment: [
    { step_number: 3, title: 'Property Due Diligence', description: 'Engage a RERA-registered agent for property purchase.', category: 'Investment' },
    { step_number: 4, title: 'Investor Visa Application', description: 'Apply for a 10-year Golden Visa via property investment.', category: 'Visa' },
    { step_number: 5, title: 'DLD Registration & Transfer', description: 'Complete property transfer at Dubai Land Department.', category: 'Investment' },
  ],
};

export function generateDefaultWorkflow(profile: RelocationProfile): DefaultWorkflowStep[] {
  if (!profile.purpose) return BASE_STEPS;

  const extras = PURPOSE_EXTRA_STEPS[profile.purpose] ?? [];
  const combined = [...BASE_STEPS];

  // Insert purpose-specific steps after step 2, renumber
  const insertAt = 2;
  const head = combined.slice(0, insertAt);
  const tail = combined.slice(insertAt);
  const withExtras = [...head, ...extras, ...tail];

  // Renumber sequentially
  return withExtras.map((step, idx) => ({ ...step, step_number: idx + 1 }));
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getRelocationProfile(userId: string): Promise<RelocationProfile | null> {
  if (isMockMode) return MOCK_PROFILE;

  const { data, error } = await supabase!
    .from('relocation_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as RelocationProfile | null;
}

export async function createRelocationProfile(
  input: CreateRelocationProfileInput
): Promise<RelocationProfile> {
  if (isMockMode) return { ...MOCK_PROFILE, ...input, id: 'mock-profile-001' };

  const { data, error } = await supabase!
    .from('relocation_profiles')
    .upsert(input, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as RelocationProfile;
}

export async function updateRelocationProfile(
  id: string,
  updates: UpdateRelocationProfileInput
): Promise<RelocationProfile> {
  if (isMockMode) return { ...MOCK_PROFILE, ...updates, id };

  const { data, error } = await supabase!
    .from('relocation_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as RelocationProfile;
}

// ─── Workflows ────────────────────────────────────────────────────────────────

export async function getUserWorkflows(userId: string): Promise<UserWorkflow[]> {
  if (isMockMode) return [MOCK_WORKFLOW];

  const { data, error } = await supabase!
    .from('user_workflows')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as UserWorkflow[];
}

export async function createWorkflow(input: CreateWorkflowInput): Promise<UserWorkflow> {
  if (isMockMode) return { ...MOCK_WORKFLOW, ...input, id: `mock-workflow-${Date.now()}` };

  const { data, error } = await supabase!
    .from('user_workflows')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as UserWorkflow;
}

export async function getWorkflowSteps(workflowId: string): Promise<UserWorkflowStep[]> {
  if (isMockMode) return MOCK_STEPS;

  const { data, error } = await supabase!
    .from('user_workflow_steps')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('step_number', { ascending: true });

  if (error) throw error;
  return (data ?? []) as UserWorkflowStep[];
}

export async function updateWorkflowStep(
  stepId: string,
  status: UserWorkflowStep['status']
): Promise<UserWorkflowStep> {
  const mockStep = MOCK_STEPS.find((s) => s.id === stepId);
  if (isMockMode) return { ...(mockStep ?? MOCK_STEPS[0]), status };

  const { data, error } = await supabase!
    .from('user_workflow_steps')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', stepId)
    .select()
    .single();

  if (error) throw error;
  return data as UserWorkflowStep;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function getUserDocuments(userId: string): Promise<UserDocument[]> {
  if (isMockMode) return MOCK_DOCUMENTS;

  const { data, error } = await supabase!
    .from('user_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as UserDocument[];
}

export async function uploadDocument(input: CreateDocumentInput): Promise<UserDocument> {
  if (isMockMode) {
    return {
      ...input,
      id: `mock-doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase!
    .from('user_documents')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as UserDocument;
}

export async function updateDocumentStatus(
  docId: string,
  status: UserDocument['status']
): Promise<UserDocument> {
  const mockDoc = MOCK_DOCUMENTS.find((d) => d.id === docId);
  if (isMockMode) return { ...(mockDoc ?? MOCK_DOCUMENTS[0]), status };

  const { data, error } = await supabase!
    .from('user_documents')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', docId)
    .select()
    .single();

  if (error) throw error;
  return data as UserDocument;
}

// ─── Cost Estimates ───────────────────────────────────────────────────────────

export async function getCostEstimates(profileId: string): Promise<RelocationCostEstimate[]> {
  if (isMockMode) return MOCK_COSTS;

  const { data, error } = await supabase!
    .from('relocation_cost_estimates')
    .select('*')
    .eq('relocation_profile_id', profileId)
    .order('category', { ascending: true });

  if (error) throw error;
  return (data ?? []) as RelocationCostEstimate[];
}

export async function addCostEstimate(
  input: AddCostEstimateInput
): Promise<RelocationCostEstimate> {
  if (isMockMode) {
    return { ...input, id: `mock-cost-${Date.now()}`, created_at: new Date().toISOString() };
  }

  const { data, error } = await supabase!
    .from('relocation_cost_estimates')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as RelocationCostEstimate;
}
