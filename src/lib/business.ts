import { supabase, isMockMode } from './supabase';
import type {
  BusinessService,
  BusinessBooking,
  BusinessConsultation,
  BusinessFilters,
  BusinessBookingInput,
  ConsultationInput,
  ComplianceItem,
  TimeSlot,
} from '../types/business';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SERVICES: BusinessService[] = [
  {
    id: 'mock-svc-1',
    subcategory: 'company-formation',
    sub_subcategory: 'Free Zone',
    name: 'DMCC Free Zone Company Setup',
    slug: 'dmcc-free-zone-company-setup',
    description_short: "Full-service company formation in DMCC — one of Dubai's most prestigious free zones.",
    description_long: 'Establish your business in the Dubai Multi Commodities Centre (DMCC), the world-ranked free zone offering 100% foreign ownership, zero corporate tax, and a global business community. Our team handles every step from name reservation to licence issuance.',
    hero_image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    service_type: 'package',
    duration_description: '3–5 business weeks',
    pricing_model: 'starting_from',
    price_from: 15000,
    price_currency: 'AED',
    price_display: 'From AED 15,000',
    required_documents: ['Passport copy', 'UAE entry visa', 'Business plan', 'No-objection letter (if employed)'],
    eligibility_criteria: ['Non-UAE national or UAE national', 'Minimum age 21', 'Clean criminal record'],
    government_fees: 8500,
    government_authority: 'DMCC Authority',
    compliance_checklist: [
      { id: 'cc-1', label: 'Trade name approved', description: 'Name checked and reserved with DMCC', required: true, completed: false },
      { id: 'cc-2', label: 'Memorandum of Association drafted', required: true, completed: false },
      { id: 'cc-3', label: 'Office space secured', required: true, completed: false },
      { id: 'cc-4', label: 'Licence issued', required: true, completed: false },
    ],
    estimated_steps: 6,
    workflow_template: [
      { step: 1, title: 'Initial Consultation', description: 'Assess business needs and recommend structure', duration_days: 1, responsible_party: 'Advisor' },
      { step: 2, title: 'Name Reservation', description: 'Reserve company trade name with DMCC', duration_days: 2, responsible_party: 'DMCC Authority' },
      { step: 3, title: 'Document Preparation', description: 'Prepare MOA, shareholder resolutions and corporate documents', duration_days: 5, responsible_party: 'Legal Team' },
      { step: 4, title: 'Licence Application', description: 'Submit full application to DMCC', duration_days: 7, responsible_party: 'DMCC Authority' },
      { step: 5, title: 'Office Registration', description: 'Register Flexi-desk or physical office address', duration_days: 3, responsible_party: 'DMCC' },
      { step: 6, title: 'Licence Issuance', description: 'Collect trade licence and share certificates', duration_days: 1, responsible_party: 'Advisor' },
    ],
    location: 'Dubai',
    freezone: 'DMCC',
    is_featured: true,
    popularity_score: 95,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-svc-2',
    subcategory: 'company-formation',
    sub_subcategory: 'Mainland',
    name: 'Dubai Mainland LLC Formation',
    slug: 'dubai-mainland-llc-formation',
    description_short: 'Establish a mainland Limited Liability Company with full market access across the UAE.',
    description_long: 'A mainland LLC gives you unrestricted access to the UAE market, the ability to work with government entities, and freedom to operate from any commercial location. We handle DED registration, notarisation and all government interactions.',
    hero_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    service_type: 'package',
    duration_description: '2–4 business weeks',
    pricing_model: 'starting_from',
    price_from: 12000,
    price_currency: 'AED',
    price_display: 'From AED 12,000',
    required_documents: ['Passport copies (all shareholders)', 'Emirates ID (if resident)', 'NOC from sponsor (if applicable)', 'Tenancy contract for office'],
    eligibility_criteria: ['Any nationality', 'Minimum 1 shareholder', 'Local service agent required for some activities'],
    government_fees: 6800,
    government_authority: 'DED — Dubai Economy & Tourism',
    compliance_checklist: [
      { id: 'cc-1', label: 'Activity approved by DED', required: true, completed: false },
      { id: 'cc-2', label: 'MOA notarised', required: true, completed: false },
      { id: 'cc-3', label: 'Commercial licence issued', required: true, completed: false },
    ],
    estimated_steps: 5,
    workflow_template: [
      { step: 1, title: 'Activity Selection', description: 'Select and confirm business activities with DED', duration_days: 1, responsible_party: 'Advisor' },
      { step: 2, title: 'Name Reservation', description: 'Reserve trade name with DED', duration_days: 2, responsible_party: 'DED' },
      { step: 3, title: 'MOA Preparation & Notarisation', description: 'Draft and notarise Memorandum of Association', duration_days: 5, responsible_party: 'Notary Public' },
      { step: 4, title: 'Initial Approval', description: 'Obtain initial approval from DED', duration_days: 5, responsible_party: 'DED' },
      { step: 5, title: 'Licence Collection', description: 'Pay fees and collect commercial licence', duration_days: 2, responsible_party: 'Advisor' },
    ],
    location: 'Dubai',
    is_featured: true,
    popularity_score: 88,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-svc-3',
    subcategory: 'banking',
    sub_subcategory: 'Corporate Account',
    name: 'UAE Corporate Bank Account Opening',
    slug: 'uae-corporate-bank-account-opening',
    description_short: 'Open a corporate account with a leading UAE bank — we handle introductions and applications.',
    description_long: 'Banking setup is a critical step for any new business in the UAE. We leverage established relationships with major UAE banks to streamline your application and increase approval chances.',
    hero_image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [],
    service_type: 'advisory',
    duration_description: '2–6 weeks (bank dependent)',
    pricing_model: 'fixed',
    price_from: 5000,
    price_currency: 'AED',
    price_display: 'AED 5,000',
    required_documents: ['Trade licence', 'MOA / AOA', 'Shareholder passports', 'Proof of address', 'Business plan', 'Source of funds declaration'],
    eligibility_criteria: ['Active UAE trade licence', 'Clean compliance record', 'Minimum average balance varies by bank'],
    government_fees: 0,
    government_authority: 'UAE Central Bank (regulated)',
    compliance_checklist: [
      { id: 'cc-1', label: 'KYC documents compiled', required: true, completed: false },
      { id: 'cc-2', label: 'Bank introduction made', required: true, completed: false },
      { id: 'cc-3', label: 'Account application submitted', required: true, completed: false },
      { id: 'cc-4', label: 'Account activated', required: true, completed: false },
    ],
    estimated_steps: 4,
    workflow_template: [
      { step: 1, title: 'Bank Selection', description: 'Match business profile to suitable banking partner', duration_days: 2, responsible_party: 'Advisor' },
      { step: 2, title: 'KYC Package Preparation', description: 'Compile all Know Your Customer documents', duration_days: 3, responsible_party: 'Client + Advisor' },
      { step: 3, title: 'Bank Introduction & Submission', description: 'Warm introduction to relationship manager and submit application', duration_days: 5, responsible_party: 'Advisor' },
      { step: 4, title: 'Account Activation', description: 'Follow up with bank and activate account', duration_days: 21, responsible_party: 'Bank' },
    ],
    location: 'Dubai',
    is_featured: true,
    popularity_score: 80,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-svc-4',
    subcategory: 'residency-investment',
    sub_subcategory: 'Golden Visa',
    name: 'UAE Golden Visa — Investor Pathway',
    slug: 'uae-golden-visa-investor-pathway',
    description_short: '10-year UAE residency visa through property investment or business investment.',
    description_long: 'The UAE Golden Visa offers long-term residency for investors, entrepreneurs and exceptional talents. The investor pathway requires AED 2M in qualifying assets. We guide you through every step of the application and ICA submission.',
    hero_image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=2574&auto=format&fit=crop',
    gallery_images: [],
    service_type: 'package',
    duration_description: '4–8 weeks',
    pricing_model: 'starting_from',
    price_from: 8000,
    price_currency: 'AED',
    price_display: 'From AED 8,000',
    required_documents: ['Valid passport', 'Emirates ID (if applicable)', 'Title deed or investment certificate', 'Medical fitness certificate', 'Emirates ID application form'],
    eligibility_criteria: ['AED 2M+ property investment OR AED 2M+ business investment', 'Valid passport with 6+ months validity', 'No criminal record'],
    government_fees: 4200,
    government_authority: 'ICA — Federal Authority for Identity & Citizenship',
    compliance_checklist: [
      { id: 'cc-1', label: 'Investment proof verified', required: true, completed: false },
      { id: 'cc-2', label: 'Medical fitness test completed', required: true, completed: false },
      { id: 'cc-3', label: 'ICA application submitted', required: true, completed: false },
      { id: 'cc-4', label: 'Emirates ID biometrics done', required: true, completed: false },
      { id: 'cc-5', label: 'Visa stamped', required: true, completed: false },
    ],
    estimated_steps: 5,
    workflow_template: [
      { step: 1, title: 'Eligibility Assessment', description: 'Confirm investment qualifies under Golden Visa criteria', duration_days: 1, responsible_party: 'Advisor' },
      { step: 2, title: 'Document Compilation', description: 'Gather all supporting documents', duration_days: 5, responsible_party: 'Client + Advisor' },
      { step: 3, title: 'Medical Fitness Test', description: 'Complete required medical examination at approved centre', duration_days: 2, responsible_party: 'Client' },
      { step: 4, title: 'ICA Application Submission', description: 'Submit full Golden Visa application to ICA', duration_days: 7, responsible_party: 'ICA' },
      { step: 5, title: 'Visa & Emirates ID Collection', description: 'Collect visa stamp and Emirates ID', duration_days: 5, responsible_party: 'Advisor' },
    ],
    location: 'Dubai',
    is_featured: true,
    popularity_score: 92,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-svc-5',
    subcategory: 'tax',
    sub_subcategory: 'VAT',
    name: 'VAT Registration & Compliance',
    slug: 'vat-registration-compliance',
    description_short: 'End-to-end VAT registration and ongoing compliance management for UAE businesses.',
    description_long: 'UAE VAT compliance is mandatory for businesses exceeding AED 375,000 in annual turnover. Our tax advisors handle FTA registration, return filing, and audit support to keep your business fully compliant.',
    hero_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2611&auto=format&fit=crop',
    gallery_images: [],
    service_type: 'filing',
    duration_description: '1–2 weeks for registration',
    pricing_model: 'starting_from',
    price_from: 2500,
    price_currency: 'AED',
    price_display: 'From AED 2,500',
    required_documents: ['Trade licence', 'Emirates ID of owner', 'Bank statements (12 months)', 'Sales invoices', 'Customs declarations (if applicable)'],
    eligibility_criteria: ['Annual taxable supplies ≥ AED 375,000 (mandatory)', 'Annual taxable supplies ≥ AED 187,500 (voluntary)'],
    government_fees: 0,
    government_authority: 'FTA — Federal Tax Authority',
    compliance_checklist: [
      { id: 'cc-1', label: 'FTA e-services account created', required: true, completed: false },
      { id: 'cc-2', label: 'VAT registration submitted', required: true, completed: false },
      { id: 'cc-3', label: 'TRN certificate received', required: true, completed: false },
      { id: 'cc-4', label: 'First VAT return filed', required: false, completed: false },
    ],
    estimated_steps: 3,
    workflow_template: [
      { step: 1, title: 'Eligibility & Turnover Review', description: 'Confirm mandatory or voluntary registration threshold', duration_days: 1, responsible_party: 'Tax Advisor' },
      { step: 2, title: 'FTA Application', description: 'Complete and submit VAT registration on FTA portal', duration_days: 3, responsible_party: 'Tax Advisor' },
      { step: 3, title: 'TRN Issuance', description: 'Receive Tax Registration Number from FTA', duration_days: 10, responsible_party: 'FTA' },
    ],
    location: 'Dubai',
    is_featured: false,
    popularity_score: 72,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getBusinessServices(filters?: BusinessFilters): Promise<BusinessService[]> {
  if (isMockMode) {
    let results = [...MOCK_SERVICES];
    if (filters?.subcategory) results = results.filter(s => s.subcategory === filters.subcategory);
    if (filters?.sub_subcategory) results = results.filter(s => s.sub_subcategory === filters.sub_subcategory);
    if (filters?.service_type) results = results.filter(s => s.service_type === filters.service_type);
    if (filters?.pricing_model) results = results.filter(s => s.pricing_model === filters.pricing_model);
    if (filters?.price_min != null) results = results.filter(s => (s.price_from ?? 0) >= filters.price_min!);
    if (filters?.price_max != null) results = results.filter(s => (s.price_from ?? 0) <= filters.price_max!);
    if (filters?.is_featured != null) results = results.filter(s => s.is_featured === filters.is_featured);
    return results;
  }

  let query = supabase!
    .from('business_services')
    .select('*')
    .eq('status', 'published')
    .order('popularity_score', { ascending: false });

  if (filters?.subcategory) query = query.eq('subcategory', filters.subcategory);
  if (filters?.sub_subcategory) query = query.eq('sub_subcategory', filters.sub_subcategory);
  if (filters?.service_type) query = query.eq('service_type', filters.service_type);
  if (filters?.pricing_model) query = query.eq('pricing_model', filters.pricing_model);
  if (filters?.price_min != null) query = query.gte('price_from', filters.price_min);
  if (filters?.price_max != null) query = query.lte('price_from', filters.price_max);
  if (filters?.is_featured != null) query = query.eq('is_featured', filters.is_featured);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as BusinessService[];
}

export async function getServiceBySlug(slug: string): Promise<BusinessService | null> {
  if (isMockMode) {
    return MOCK_SERVICES.find(s => s.slug === slug) ?? null;
  }

  const { data, error } = await supabase!
    .from('business_services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data as BusinessService | null;
}

export async function getFeaturedServices(subcategory?: string): Promise<BusinessService[]> {
  if (isMockMode) {
    let results = MOCK_SERVICES.filter(s => s.is_featured);
    if (subcategory) results = results.filter(s => s.subcategory === subcategory);
    return results;
  }

  let query = supabase!
    .from('business_services')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('popularity_score', { ascending: false })
    .limit(6);

  if (subcategory) query = query.eq('subcategory', subcategory);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as BusinessService[];
}

export async function createBusinessBooking(input: BusinessBookingInput): Promise<BusinessBooking> {
  if (isMockMode) {
    const service = MOCK_SERVICES.find(s => s.id === input.service_id);
    return {
      id: `mock-booking-${Date.now()}`,
      service_id: input.service_id,
      user_id: input.user_id,
      package_selected: input.package_selected,
      documents_submitted: [],
      documents_required: input.documents_required ?? service?.required_documents ?? [],
      documents_complete: false,
      compliance_status: service?.compliance_checklist ?? [],
      current_step: 1,
      total_steps: service?.estimated_steps ?? 1,
      workflow_status: 'not_started',
      quoted_price: input.quoted_price,
      government_fees: input.government_fees,
      total_price: input.total_price,
      currency: 'AED',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as BusinessBooking;
  }

  const { data, error } = await supabase!
    .from('business_bookings')
    .insert({
      service_id: input.service_id,
      user_id: input.user_id,
      package_selected: input.package_selected,
      documents_required: input.documents_required ?? [],
      quoted_price: input.quoted_price,
      government_fees: input.government_fees,
      total_price: input.total_price,
      relocation_profile_id: input.relocation_profile_id,
      status: 'pending',
      workflow_status: 'not_started',
      current_step: 1,
    })
    .select('*, service:business_services(*)')
    .single();

  if (error) throw error;
  return data as BusinessBooking;
}

export async function getUserBusinessBookings(userId: string): Promise<BusinessBooking[]> {
  if (isMockMode) return [] as BusinessBooking[];

  const { data, error } = await supabase!
    .from('business_bookings')
    .select('*, service:business_services(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BusinessBooking[];
}

export async function scheduleConsultation(input: ConsultationInput): Promise<BusinessConsultation> {
  if (isMockMode) {
    return {
      id: `mock-consult-${Date.now()}`,
      service_id: input.service_id,
      user_id: input.user_id,
      consultation_type: input.consultation_type ?? 'initial',
      scheduled_at: input.scheduled_at,
      duration_minutes: input.duration_minutes ?? 60,
      meeting_type: input.meeting_type ?? 'online',
      agenda: input.agenda,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as BusinessConsultation;
  }

  const { data, error } = await supabase!
    .from('business_consultations')
    .insert({
      service_id: input.service_id,
      user_id: input.user_id,
      consultation_type: input.consultation_type ?? 'initial',
      scheduled_at: input.scheduled_at,
      duration_minutes: input.duration_minutes ?? 60,
      meeting_type: input.meeting_type ?? 'online',
      agenda: input.agenda,
      status: 'scheduled',
    })
    .select('*, service:business_services(*)')
    .single();

  if (error) throw error;
  return data as BusinessConsultation;
}

export async function getUserConsultations(userId: string): Promise<BusinessConsultation[]> {
  if (isMockMode) return [] as BusinessConsultation[];

  const { data, error } = await supabase!
    .from('business_consultations')
    .select('*, service:business_services(*)')
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as BusinessConsultation[];
}

export async function getAvailableSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
  // In mock mode (and currently always) generate slots — real impl would query a calendar API
  if (isMockMode || serviceId) {
    const slots: TimeSlot[] = [];
    const base = new Date(date);
    const hours = [9, 10, 11, 14, 15, 16, 17];
    const unavailable = [10, 15]; // mock some as taken

    for (const h of hours) {
      base.setHours(h, 0, 0, 0);
      const label = base.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      slots.push({
        time: base.toISOString(),
        label,
        available: !unavailable.includes(h),
      });
    }
    return slots;
  }

  return [] as TimeSlot[];
}

export async function getComplianceChecklist(serviceId: string): Promise<ComplianceItem[]> {
  if (isMockMode) {
    const service = MOCK_SERVICES.find(s => s.id === serviceId);
    return service?.compliance_checklist ?? [];
  }

  const { data, error } = await supabase!
    .from('business_services')
    .select('compliance_checklist')
    .eq('id', serviceId)
    .single();

  if (error) throw error;
  return (data?.compliance_checklist ?? []) as ComplianceItem[];
}

export async function updateComplianceItem(
  bookingId: string,
  item: ComplianceItem,
  completed: boolean
): Promise<void> {
  if (isMockMode) return;

  const { data: booking, error: fetchError } = await supabase!
    .from('business_bookings')
    .select('compliance_status')
    .eq('id', bookingId)
    .single();

  if (fetchError) throw fetchError;

  const updated = ((booking?.compliance_status as ComplianceItem[]) ?? []).map(c =>
    c.id === item.id
      ? { ...c, completed, completed_at: completed ? new Date().toISOString() : undefined }
      : c
  );

  const { error: updateError } = await supabase!
    .from('business_bookings')
    .update({ compliance_status: updated })
    .eq('id', bookingId);

  if (updateError) throw updateError;
}
