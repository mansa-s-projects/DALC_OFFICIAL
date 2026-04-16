import { supabase } from './supabase';
import { queryPublished } from './supabase-query';
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

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_SERVICES: BusinessService[] = [
  {
    id: 'mock-svc-1',
    subcategory: 'company-formation',
    sub_subcategory: 'Free Zone',
    name: 'DMCC Free Zone Company Setup',
    slug: 'dmcc-free-zone-company-setup',
    description_short: "Full-service company formation in DMCC â€” one of Dubai's most prestigious free zones.",
    description_long: 'Establish your business in the Dubai Multi Commodities Centre (DMCC), the world-ranked free zone offering 100% foreign ownership, zero corporate tax, and a global business community. Our team handles every step from name reservation to licence issuance.',
    hero_image: '/images/hotels/four-seasons-difc.jpg',
    gallery_images: [],
    service_type: 'package',
    duration_description: '3â€“5 business weeks',
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
    hero_image: '/images/hotels/address-downtown.jpg',
    gallery_images: [],
    service_type: 'package',
    duration_description: '2â€“4 business weeks',
    pricing_model: 'starting_from',
    price_from: 12000,
    price_currency: 'AED',
    price_display: 'From AED 12,000',
    required_documents: ['Passport copies (all shareholders)', 'Emirates ID (if resident)', 'NOC from sponsor (if applicable)', 'Tenancy contract for office'],
    eligibility_criteria: ['Any nationality', 'Minimum 1 shareholder', 'Local service agent required for some activities'],
    government_fees: 6800,
    government_authority: 'DED â€” Dubai Economy & Tourism',
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
    description_short: 'Open a corporate account with a leading UAE bank â€” we handle introductions and applications.',
    description_long: 'Banking setup is a critical step for any new business in the UAE. We leverage established relationships with major UAE banks to streamline your application and increase approval chances.',
    hero_image: '/images/hotels/the-ritz-carlton-difc.jpg',
    gallery_images: [],
    service_type: 'advisory',
    duration_description: '2â€“6 weeks (bank dependent)',
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
    name: 'UAE Golden Visa â€” Investor Pathway',
    slug: 'uae-golden-visa-investor-pathway',
    description_short: '10-year UAE residency visa through property investment or business investment.',
    description_long: 'The UAE Golden Visa offers long-term residency for investors, entrepreneurs and exceptional talents. The investor pathway requires AED 2M in qualifying assets. We guide you through every step of the application and ICA submission.',
    hero_image: '/images/hotels/the-lana-dubai.jpg',
    gallery_images: [],
    service_type: 'package',
    duration_description: '4â€“8 weeks',
    pricing_model: 'starting_from',
    price_from: 8000,
    price_currency: 'AED',
    price_display: 'From AED 8,000',
    required_documents: ['Valid passport', 'Emirates ID (if applicable)', 'Title deed or investment certificate', 'Medical fitness certificate', 'Emirates ID application form'],
    eligibility_criteria: ['AED 2M+ property investment OR AED 2M+ business investment', 'Valid passport with 6+ months validity', 'No criminal record'],
    government_fees: 4200,
    government_authority: 'ICA â€” Federal Authority for Identity & Citizenship',
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
    hero_image: '/images/hotels/park-hyatt-dubai.jpg',
    gallery_images: [],
    service_type: 'filing',
    duration_description: '1â€“2 weeks for registration',
    pricing_model: 'starting_from',
    price_from: 2500,
    price_currency: 'AED',
    price_display: 'From AED 2,500',
    required_documents: ['Trade licence', 'Emirates ID of owner', 'Bank statements (12 months)', 'Sales invoices', 'Customs declarations (if applicable)'],
    eligibility_criteria: ['Annual taxable supplies â‰¥ AED 375,000 (mandatory)', 'Annual taxable supplies â‰¥ AED 187,500 (voluntary)'],
    government_fees: 0,
    government_authority: 'FTA â€” Federal Tax Authority',
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
  {
    id: 'mock-svc-6',
    subcategory: 'licensing',
    sub_subcategory: 'Advertiser Permit',
    name: 'UAE Media Council Advertiser Permit',
    slug: 'uae-media-council-advertiser-permit',
    description_short: 'Mandatory permit for influencers, content creators, and freelancers promoting products or services on social media in UAE.',
    description_long: 'As of February 1, 2026, all influencers, content creators, and freelancers promoting products or services on social media in the UAE must obtain an Advertiser Permit from the UAE Media Council. This applies to paid, gifted, or unpaid promotional content across all social media platforms, websites, and blogs. The permit number must be displayed prominently on your account. Valid for 1 year (free for citizens and residents for 3 years). Non-residents must apply through an authorized talent management agency for a 3-month permit.',
    hero_image: '/images/hotels/raffles-dubai.jpg',
    gallery_images: [],
    service_type: 'filing',
    duration_description: '15 business days',
    pricing_model: 'starting_from',
    price_from: 1500,
    price_currency: 'AED',
    price_display: 'From AED 1,500',
    required_documents: ['Valid passport', 'Emirates ID (or passport + valid UAE visa/talent agency sponsorship for non-residents)', 'Trade license for electronic media (from Invest in Dubai or relevant authority)', 'Good Conduct Certificate (police clearance) from Dubai Police', 'Portfolio or social media account links'],
    eligibility_criteria: ['Minimum age 18 years', 'Clean criminal record', 'UAE resident or citizen (non-residents require talent management agency)', 'Active social media presence'],
    government_fees: 0,
    government_authority: 'UAE Media Council â€” National Media Authority',
    compliance_checklist: [
      { id: 'cc-1', label: 'Electronic media trade license obtained', description: 'Trade license specifically for electronic media activities', required: true, completed: false },
      { id: 'cc-2', label: 'Good Conduct Certificate obtained', description: 'Police clearance from Dubai Police', required: true, completed: false },
      { id: 'cc-3', label: 'UAE Media Council e-services account created', required: true, completed: false },
      { id: 'cc-4', label: 'Advertiser Permit application submitted', required: true, completed: false },
      { id: 'cc-5', label: 'Permit number displayed on social accounts', description: 'Must be prominently visible on all platforms', required: true, completed: false },
    ],
    estimated_steps: 5,
    workflow_template: [
      { step: 1, title: 'Trade License Acquisition', description: 'Obtain electronic media trade license from Invest in Dubai or relevant authority if not already held', duration_days: 5, responsible_party: 'Client + Advisor' },
      { step: 2, title: 'Police Clearance', description: 'Apply for Good Conduct Certificate from Dubai Police', duration_days: 3, responsible_party: 'Client' },
      { step: 3, title: 'Document Compilation', description: 'Gather all required documents and portfolio materials', duration_days: 2, responsible_party: 'Advisor' },
      { step: 4, title: 'UAE Media Council Application', description: 'Submit Advertiser Permit application through UAE Media Council e-services portal', duration_days: 3, responsible_party: 'Advisor' },
      { step: 5, title: 'Permit Issuance & Compliance Setup', description: 'Receive permit and update all social media accounts with permit number', duration_days: 2, responsible_party: 'Client + Advisor' },
    ],
    location: 'Dubai',
    is_featured: true,
    popularity_score: 85,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// â”€â”€â”€ Service Functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getBusinessServices(filters?: BusinessFilters): Promise<BusinessService[]> {
  return queryPublished<BusinessService>({
    table: 'business_services',
    orderBy: { column: 'popularity_score', ascending: false },
    filters: {
      subcategory: filters?.subcategory ? { op: 'eq', value: filters.subcategory } : undefined,
      sub_subcategory: filters?.sub_subcategory ? { op: 'eq', value: filters.sub_subcategory } : undefined,
      service_type: filters?.service_type ? { op: 'eq', value: filters.service_type } : undefined,
      pricing_model: filters?.pricing_model ? { op: 'eq', value: filters.pricing_model } : undefined,
      price_from_min: filters?.price_min != null ? { op: 'gte', value: filters.price_min, column: 'price_from' } : undefined,
      price_from_max: filters?.price_max != null ? { op: 'lte', value: filters.price_max, column: 'price_from' } : undefined,
      is_featured: filters?.is_featured != null ? { op: 'eq', value: filters.is_featured } : undefined,
    },
  });
}

export async function getServiceBySlug(slug: string): Promise<BusinessService | null> {
  const { data, error } = await supabase
    .from('business_services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as BusinessService | null;
}

export async function getFeaturedServices(subcategory?: string): Promise<BusinessService[]> {
  let query = supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('business_bookings')
    .select('*, service:business_services(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as BusinessBooking[];
}

export async function scheduleConsultation(input: ConsultationInput): Promise<BusinessConsultation> {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('business_consultations')
    .select('*, service:business_services(*)')
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as BusinessConsultation[];
}

const BUSINESS_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const BUSINESS_SLOT_DURATION_MINUTES = 60;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createBusinessSlots(date: string, occupiedHours: Set<number>): TimeSlot[] {
  return BUSINESS_HOURS.map((hour) => {
    const slotTime = new Date(`${date}T00:00:00.000Z`);
    slotTime.setUTCHours(hour, 0, 0, 0);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return {
      time: slotTime.toISOString(),
      label: `${displayHour}:00 ${ampm}`,
      available: !occupiedHours.has(hour),
    };
  });
}

export async function getAvailableSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
  if (!date) {
    return [];
  }

  if (!serviceId || !UUID_PATTERN.test(serviceId)) {
    return createBusinessSlots(date, new Set<number>());
  }

  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const { data, error } = await supabase
    .from('business_consultations')
    .select('scheduled_at, duration_minutes')
    .eq('service_id', serviceId)
    .gte('scheduled_at', dayStart.toISOString())
    .lt('scheduled_at', dayEnd.toISOString())
    .in('status', ['scheduled', 'confirmed', 'in_progress']);

  if (error) throw error;

  const occupiedHours = new Set<number>();
  const consultations = (data ?? []) as Array<Pick<BusinessConsultation, 'scheduled_at' | 'duration_minutes'>>;

  for (const consultation of consultations) {
    const start = new Date(consultation.scheduled_at);
    const end = new Date(
      start.getTime() +
        (consultation.duration_minutes ?? BUSINESS_SLOT_DURATION_MINUTES) * 60_000,
    );

    for (const hour of BUSINESS_HOURS) {
      const slotStart = new Date(dayStart);
      slotStart.setUTCHours(hour, 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + BUSINESS_SLOT_DURATION_MINUTES);

      if (start < slotEnd && end > slotStart) {
        occupiedHours.add(hour);
      }
    }
  }

  return createBusinessSlots(date, occupiedHours);
}

export async function getComplianceChecklist(serviceId: string): Promise<ComplianceItem[]> {
  const { data, error } = await supabase
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
  const { data, error } = await supabase.rpc('update_compliance_item', {
    booking_id: bookingId,
    item_id: item.id,
    item_completed: completed,
  });

  if (error) throw error;
  if (data == null) {
    throw new Error('Compliance update returned no data');
  }
}
