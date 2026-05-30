export type StepId =
  | 'nationality'
  | 'residence'
  | 'destination'
  | 'purpose'
  | 'profile'
  | 'dates'
  | 'generating'
  | 'report';

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  popular?: boolean;
  isGCC?: boolean;
}

export type ResidencyStatus =
  | 'citizen'
  | 'uae_resident'
  | 'gcc_resident'
  | 'us_resident'
  | 'uk_resident'
  | 'eu_resident'
  | 'perm_resident'
  | 'expat';

export type TravelPurpose =
  | 'tourism'
  | 'business'
  | 'study'
  | 'employment'
  | 'medical'
  | 'transit'
  | 'investment'
  | 'relocation'
  | 'family_visit'
  | 'remote_work';

export interface TravelProfile {
  travelHistory: 'none' | 'occasional' | 'frequent' | 'very_frequent';
  hasVisaRefusals: boolean;
  hasUSVisa: boolean;
  hasUKVisa: boolean;
  hasSchengenVisa: boolean;
  hasUAEVisa: boolean;
  isInvestor: boolean;
  isBusinessOwner: boolean;
  familyStatus: 'single' | 'married' | 'family';
}

export interface VisaFormData {
  nationalities: Country[];
  residence: { country: Country; status: ResidencyStatus } | null;
  destination: Country | null;
  purpose: TravelPurpose | null;
  profile: TravelProfile;
  dates: { arrival: string; departure: string; isFlexible: boolean };
}

export type VisaCategory =
  | 'visa_free'
  | 'visa_on_arrival'
  | 'evisa'
  | 'embassy_visa'
  | 'eta'
  | 'not_allowed';

export interface AIScore {
  eligibility: number;
  confidence: number;
  risk: number;
  complexity: number;
  readiness: number;
}

export interface DocumentItem {
  name: string;
  status: 'required' | 'conditional' | 'optional';
  notes?: string;
}

export interface AIInsight {
  type: 'risk' | 'tip' | 'warning' | 'opportunity';
  title: string;
  body: string;
}

export interface DALCService {
  title: string;
  subtitle: string;
  route: string;
  budget: string;
  timeline: string;
  features: string[];
  isPrimary: boolean;
}

export interface TravelReport {
  visaCategory: VisaCategory;
  visaLabel: string;
  maxStay: string;
  entries: string;
  conditions: string[];
  processingMin: number;
  processingMax: number;
  fastTrackDays?: number;
  govFeeMin: number;
  govFeeMax: number;
  dalcFeeMin: number;
  dalcFeeMax: number;
  totalMin: number;
  totalMax: number;
  documents: DocumentItem[];
  scores: AIScore;
  insights: AIInsight[];
  dalcServices: DALCService[];
  leadScore: number;
}
