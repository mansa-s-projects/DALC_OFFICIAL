import type {
  VisaFormData, TravelReport, VisaCategory, AIScore,
  DocumentItem, AIInsight, DALCService,
} from './types';

// ── Visa Rule Matrix ────────────────────────────────────────────────────────────

interface VisaRule {
  category: VisaCategory;
  maxStay: string;
  entries: string;
  processingDays: [number, number];
  govFeeAED: [number, number];
  conditions?: string[];
}

const VISA_TO_UAE: Record<string, VisaRule> = {
  // GCC — Visa Free
  SA: { category: 'visa_free', maxStay: 'Unlimited', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  KW: { category: 'visa_free', maxStay: 'Unlimited', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  QA: { category: 'visa_free', maxStay: 'Unlimited', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  BH: { category: 'visa_free', maxStay: 'Unlimited', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  OM: { category: 'visa_free', maxStay: 'Unlimited', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // Visa on Arrival — Western nations
  US: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0], conditions: ['Extendable once (30 days)', 'Return ticket required'] },
  GB: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  CA: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  AU: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  NZ: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  DE: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  FR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  IT: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  ES: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  NL: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  CH: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  SE: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  NO: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  DK: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  BE: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  AT: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  FI: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  PT: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  GR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  IE: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  JP: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  KR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  SG: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  MY: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  ZA: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  IL: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  HK: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  MX: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  BR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  AR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  // eVisa
  IN: { category: 'evisa', maxStay: '60 days', entries: 'Multiple', processingDays: [3, 5], govFeeAED: [350, 550], conditions: ['Apply via ICP portal', 'Hotel or sponsor required', 'Valid 60 days from issue'] },
  CN: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  RU: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [2, 5], govFeeAED: [350, 550] },
  TR: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [2, 5], govFeeAED: [350, 550] },
  EG: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  MA: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  TH: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  PH: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  ID: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  UA: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [2, 5], govFeeAED: [350, 550] },
  KZ: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  UZ: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [3, 7], govFeeAED: [350, 550] },
  // Embassy Visa
  PK: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 14], govFeeAED: [370, 600], conditions: ['UAE sponsor or hotel required', 'NOC from employer', 'Bank statement (3 months)'] },
  BD: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 14], govFeeAED: [370, 600] },
  NP: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 14], govFeeAED: [370, 600] },
  LK: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [5, 10], govFeeAED: [370, 600] },
  NG: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 21], govFeeAED: [370, 600] },
  GH: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 21], govFeeAED: [370, 600] },
  KE: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 21], govFeeAED: [370, 600] },
  ET: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [7, 21], govFeeAED: [370, 600] },
  VN: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [5, 10], govFeeAED: [370, 600] },
  IR: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [14, 30], govFeeAED: [400, 700], conditions: ['Prior approval required', 'Security clearance may apply'] },
  IQ: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [14, 30], govFeeAED: [400, 700] },
  // Restricted
  AF: { category: 'not_allowed', maxStay: 'N/A', entries: 'N/A', processingDays: [0, 0], govFeeAED: [0, 0] },
  SY: { category: 'not_allowed', maxStay: 'N/A', entries: 'N/A', processingDays: [0, 0], govFeeAED: [0, 0] },
};

// UAE passport outbound — among the strongest globally (Henley index top 10)
const VISA_FROM_UAE: Record<string, VisaRule> = {
  // North America
  US: { category: 'embassy_visa', maxStay: '180 days', entries: 'Multiple', processingDays: [21, 90], govFeeAED: [600, 600], conditions: ['DS-160 required', 'In-person interview', 'Financial proof required'] },
  CA: { category: 'evisa', maxStay: '6 months', entries: 'Multiple', processingDays: [1, 3], govFeeAED: [70, 70] },
  MX: { category: 'visa_free', maxStay: '180 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  BR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  AR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // Europe — Schengen (visa-free 90/180 days)
  DE: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  FR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  IT: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  ES: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  NL: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  CH: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  BE: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  AT: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  SE: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  NO: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  DK: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  FI: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  GR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  PT: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  IE: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  PL: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  CZ: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  HU: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  SK: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  SI: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // UK
  GB: { category: 'visa_free', maxStay: '6 months', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // Oceania
  AU: { category: 'eta', maxStay: '3 months', entries: 'Multiple', processingDays: [0, 1], govFeeAED: [60, 60] },
  NZ: { category: 'evisa', maxStay: '3 months', entries: 'Multiple', processingDays: [0, 1], govFeeAED: [25, 25] },
  // Asia-Pacific
  JP: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  KR: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  SG: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  TH: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  MY: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  ID: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  PH: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  HK: { category: 'visa_free', maxStay: '14 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // MENA
  TR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  MA: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  JO: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [100, 100] },
  EG: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [100, 100] },
  TN: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  // Africa
  KE: { category: 'evisa', maxStay: '90 days', entries: 'Single', processingDays: [1, 3], govFeeAED: [200, 200] },
  ZA: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  ET: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [1, 3], govFeeAED: [110, 110] },
  TZ: { category: 'evisa', maxStay: '30 days', entries: 'Single', processingDays: [1, 3], govFeeAED: [180, 180] },
  // South & Central Asia
  IN: { category: 'embassy_visa', maxStay: '6 months', entries: 'Multiple', processingDays: [7, 21], govFeeAED: [500, 700] },
  PK: { category: 'embassy_visa', maxStay: '30 days', entries: 'Single', processingDays: [14, 30], govFeeAED: [400, 600] },
  // Russia & CIS
  RU: { category: 'evisa', maxStay: '16 days', entries: 'Single', processingDays: [4, 7], govFeeAED: [0, 0] },
  GE: { category: 'visa_free', maxStay: '365 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  UA: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
};

// Countries where UAE residents (any passport) get enhanced/expedited access
const UAE_RESIDENT_BOOST: Partial<Record<string, VisaRule>> = {
  TH: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0], conditions: ['UAE resident visa required on entry', 'Return ticket required'] },
  MY: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0], conditions: ['UAE residence card required'] },
  ID: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [220, 220], conditions: ['UAE resident visa required', 'Extendable once'] },
  GE: { category: 'visa_free', maxStay: '365 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0], conditions: ['UAE residence document required'] },
  MV: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
};

const DEFAULT_RULE: VisaRule = {
  category: 'embassy_visa',
  maxStay: '30 days',
  entries: 'Single',
  processingDays: [10, 30],
  govFeeAED: [400, 1200],
};

function resolveRule(natCode: string, destCode: string, residence: VisaFormData['residence']): VisaRule {
  if (natCode === destCode) {
    return { category: 'visa_free', maxStay: 'Citizen / No Visa', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] };
  }

  // UAE resident with any passport traveling outbound gets enhanced access to certain destinations
  const isUAEResident = residence?.country.code === 'AE' &&
    (residence.status === 'uae_resident' || residence.status === 'expat' || residence.status === 'gcc_resident');
  if (isUAEResident && natCode !== 'AE' && destCode !== 'AE') {
    const boost = UAE_RESIDENT_BOOST[destCode];
    if (boost) return boost;
  }

  // UAE resident traveling to UAE — they already reside there
  if (destCode === 'AE' && isUAEResident) {
    return { category: 'visa_free', maxStay: 'Resident — No Entry Visa', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0], conditions: ['Valid UAE residence visa required', 'Entry stamp on arrival'] };
  }

  if (destCode === 'AE') return VISA_TO_UAE[natCode] ?? DEFAULT_RULE;
  if (natCode === 'AE') return VISA_FROM_UAE[destCode] ?? DEFAULT_RULE;

  return DEFAULT_RULE;
}

// ── AI Scoring ──────────────────────────────────────────────────────────────────

function computeScores(data: VisaFormData, rule: VisaRule): AIScore {
  const { profile, purpose, residence } = data;

  const baseEligibility: Record<VisaCategory, number> = {
    visa_free: 100, visa_on_arrival: 95, eta: 90, evisa: 78, embassy_visa: 60, not_allowed: 0,
  };
  let eligibility = baseEligibility[rule.category];
  if (profile.hasUSVisa || profile.hasUKVisa || profile.hasSchengenVisa) eligibility = Math.min(100, eligibility + 10);
  if (profile.hasUAEVisa) eligibility = Math.min(100, eligibility + 8);
  if (profile.hasVisaRefusals) eligibility = Math.max(0, eligibility - 25);
  if (profile.travelHistory === 'very_frequent') eligibility = Math.min(100, eligibility + 5);
  if (residence?.status === 'uae_resident' || residence?.status === 'us_resident' || residence?.status === 'uk_resident' || residence?.status === 'eu_resident') {
    eligibility = Math.min(100, eligibility + 7);
  }

  let confidence = eligibility;
  if (profile.hasVisaRefusals) confidence -= 20;
  if (profile.isInvestor || profile.isBusinessOwner) confidence = Math.min(100, confidence + 8);
  if (profile.hasUAEVisa) confidence = Math.min(100, confidence + 5);
  confidence = Math.max(10, Math.min(100, confidence));

  const baseRisk: Record<VisaCategory, number> = {
    visa_free: 5, visa_on_arrival: 10, eta: 12, evisa: 25, embassy_visa: 42, not_allowed: 100,
  };
  let risk = baseRisk[rule.category];
  if (profile.hasVisaRefusals) risk = Math.min(100, risk + 30);
  if (profile.hasUSVisa || profile.hasUKVisa) risk = Math.max(5, risk - 15);
  if (profile.hasUAEVisa) risk = Math.max(5, risk - 8);
  if (purpose === 'relocation' || purpose === 'employment') risk = Math.min(100, risk + 10);
  if (profile.travelHistory === 'none') risk = Math.min(100, risk + 10);

  const complexity: Record<VisaCategory, number> = {
    visa_free: 1, visa_on_arrival: 1, eta: 2, evisa: 3, embassy_visa: 5, not_allowed: 0,
  };

  let readiness = 50;
  if (profile.hasUSVisa) readiness += 10;
  if (profile.hasUKVisa) readiness += 10;
  if (profile.hasSchengenVisa) readiness += 5;
  if (profile.hasUAEVisa) readiness += 7;
  if (profile.isBusinessOwner) readiness += 5;
  if (!profile.hasVisaRefusals) readiness += 20;
  if (residence?.status === 'uae_resident' || residence?.status === 'us_resident') readiness += 8;
  readiness = Math.min(100, readiness);

  return { eligibility, confidence, risk, complexity: complexity[rule.category], readiness };
}

// ── Documents ───────────────────────────────────────────────────────────────────

function computeDocuments(data: VisaFormData, rule: VisaRule): DocumentItem[] {
  const { purpose, profile } = data;
  const base: DocumentItem[] = [
    { name: 'Valid Passport (6+ months validity)', status: 'required' },
    { name: 'Passport-size Photos (white background)', status: 'required', notes: 'DALC AI Photo Studio generates compliant photos instantly' },
    { name: 'Return / Onward Ticket', status: 'required' },
  ];

  if (rule.category === 'visa_free' || rule.category === 'visa_on_arrival') {
    const docs = [...base,
      { name: 'Proof of Accommodation', status: 'conditional' as const },
      { name: 'Travel Insurance', status: 'optional' as const },
      { name: 'Sufficient Funds (AED 3,000+ recommended)', status: 'conditional' as const },
    ];
    if (profile.familyStatus === 'family') {
      docs.push({ name: 'Family Passports & Sponsor Documents', status: 'required' });
      docs.push({ name: 'Children\'s Birth Certificates', status: 'conditional' });
    }
    return docs;
  }

  if (purpose === 'transit') {
    return [...base,
      { name: 'Confirmed Connecting Flight Ticket', status: 'required' },
      { name: 'Transit Visa (if overnight stay)', status: 'conditional' },
      { name: 'Proof of Destination Visa / Entry', status: 'required' },
    ];
  }

  if (rule.category === 'evisa' || rule.category === 'eta') {
    const docs = [...base,
      { name: 'eVisa / ETA Application Form', status: 'required' as const },
      { name: 'Hotel Booking Confirmation', status: 'required' as const },
      { name: 'Bank Statement (3 months)', status: 'conditional' as const },
      { name: 'Travel Insurance (USD 30,000+ coverage)', status: 'required' as const },
      { name: 'Flight Itinerary', status: 'required' as const },
    ];
    if (purpose === 'study') {
      docs.push({ name: 'University / Institution Acceptance Letter', status: 'required' });
      docs.push({ name: 'Proof of Tuition Fee Payment', status: 'required' });
      docs.push({ name: 'Sponsor\'s Financial Guarantee', status: 'conditional' });
    }
    if (purpose === 'medical') {
      docs.push({ name: 'Medical Institution Referral Letter', status: 'required' });
      docs.push({ name: 'Medical Records & Diagnosis Summary', status: 'required' });
      docs.push({ name: 'Proof of Medical Appointment', status: 'required' });
    }
    if (profile.familyStatus === 'family') {
      docs.push({ name: 'Spouse\'s Passport & Marriage Certificate', status: 'conditional' });
      docs.push({ name: 'Children\'s Passports & Birth Certificates', status: 'conditional' });
    }
    return docs;
  }

  // Embassy visa base
  const embassy: DocumentItem[] = [...base,
    { name: 'Visa Application Form (original)', status: 'required' },
    { name: 'Bank Statement (3–6 months)', status: 'required' },
    { name: 'Employment Letter / NOC', status: 'required' },
    { name: 'Travel Insurance (USD 50,000+ coverage)', status: 'required' },
    { name: 'Hotel / Host Invitation Letter', status: 'required' },
    { name: 'Salary Slips (3 months)', status: 'required' },
    { name: 'Business Registration / Tax Returns', status: 'conditional' },
  ];

  if (purpose === 'relocation' || purpose === 'employment') {
    embassy.push(
      { name: 'Employment Contract or Offer Letter', status: 'required' },
      { name: 'Educational Certificates (attested)', status: 'required' },
      { name: 'Medical Certificate (approved authority)', status: 'conditional' },
    );
  }

  if (purpose === 'investment') {
    embassy.push(
      { name: 'Proof of Investment (AED 2M minimum for Golden Visa)', status: 'required' },
      { name: 'Business Registration Documents', status: 'required' },
      { name: 'Source of Funds Declaration', status: 'required' },
    );
  }

  if (purpose === 'study') {
    embassy.push(
      { name: 'University Acceptance Letter (attested)', status: 'required' },
      { name: 'Proof of Tuition Fee Payment', status: 'required' },
      { name: 'Scholarship / Sponsorship Letter', status: 'conditional' },
      { name: 'Proof of Academic Qualifications', status: 'required' },
    );
  }

  if (purpose === 'medical') {
    embassy.push(
      { name: 'Medical Institution Referral / Appointment Letter', status: 'required' },
      { name: 'Medical Records (English translated)', status: 'required' },
      { name: 'Medical Financial Guarantee / Insurance', status: 'required' },
      { name: 'Companion Invitation Letter', status: 'conditional' },
    );
  }

  if (purpose === 'family_visit') {
    embassy.push(
      { name: 'Host\'s UAE Residence Visa / Passport Copy', status: 'required' },
      { name: 'Proof of Relationship (Marriage / Birth Certificate)', status: 'required' },
      { name: 'Host\'s Bank Statement & Salary', status: 'required' },
    );
  }

  if (profile.familyStatus === 'family') {
    embassy.push(
      { name: 'Spouse\'s Passport & Marriage Certificate (attested)', status: 'conditional' },
      { name: 'Children\'s Passports & Birth Certificates (attested)', status: 'conditional' },
      { name: 'Family Financial Capacity Evidence', status: 'conditional' },
    );
  }

  return embassy;
}

// ── AI Insights ─────────────────────────────────────────────────────────────────

function computeInsights(data: VisaFormData, rule: VisaRule, scores: AIScore): AIInsight[] {
  const { profile, purpose, nationalities, destination, residence, dates } = data;
  const nat = nationalities[0]?.code;
  const dest = destination?.code;
  const insights: AIInsight[] = [];

  // ── Refusal history ──
  if (profile.hasVisaRefusals) {
    insights.push({ type: 'warning', title: 'Previous Visa Refusal on Record', body: 'A prior refusal significantly impacts your approval probability. DALC recommends a certified immigration advisor review before reapplying.' });
  }

  // ── Embassy visa complexity ──
  if (scores.confidence < 60 && rule.category === 'embassy_visa') {
    insights.push({ type: 'risk', title: 'Complex Application — Expert Support Recommended', body: 'Embassy visas require extensive documentation and personal interviews. Starting 8+ weeks ahead with DALC concierge support dramatically improves outcomes.' });
  }

  // ── Strong visa history ──
  if ((profile.hasUSVisa || profile.hasUKVisa || profile.hasSchengenVisa) && rule.category !== 'visa_free') {
    insights.push({ type: 'tip', title: 'Existing Strong Visa History is an Asset', body: 'Your US/UK/Schengen visa strengthens your application. Include attested copies as supplementary credibility evidence in every application.' });
  }

  // ── UAE visa history ──
  if (profile.hasUAEVisa && rule.category === 'embassy_visa') {
    insights.push({ type: 'tip', title: 'Prior UAE Visa Boosts Your Profile', body: 'A UAE visa on record signals immigration compliance and financial capability — attach a copy as supporting evidence in your embassy visa file.' });
  }

  // ── UAE residence perks ──
  if (residence?.country.code === 'AE' && nat && nat !== 'AE' && dest && dest !== 'AE') {
    insights.push({ type: 'opportunity', title: 'UAE Residence Unlocks Enhanced Travel Access', body: 'As a UAE resident, you qualify for visa-on-arrival or visa-free entry to 50+ additional destinations — including Thailand, Malaysia, Georgia, and Maldives — that are restricted for your passport alone.' });
  }

  // ── Relocation to UAE ──
  if (purpose === 'relocation' && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Multiple Long-Term Residency Pathways Available', body: 'A visit visa is only step one. Depending on your profile, DALC can structure a Golden Visa, Employment Visa, or Freelance Permit — providing legal long-term residency.' });
  }

  // ── Investment in UAE ──
  if (purpose === 'investment' && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Golden Visa Investment Route — 10-Year Residency', body: 'Qualifying real estate investment of AED 2M+ unlocks the UAE Golden Visa — the most secure long-term residency pathway with no sponsor required.' });
  }

  // ── Visa-free / VoA smooth travel ──
  if (rule.category === 'visa_free' || rule.category === 'visa_on_arrival') {
    insights.push({ type: 'tip', title: 'Streamlined Entry — Minimal Pre-Arrival Requirements', body: 'Your passport enables seamless entry. DALC recommends securing travel insurance and hotel confirmation before departure for a friction-free arrival.' });
  }

  // ── India–UAE corridor ──
  if (nat === 'IN' && dest === 'AE' && (purpose === 'relocation' || purpose === 'employment')) {
    insights.push({ type: 'opportunity', title: 'India–UAE: The World\'s Busiest Mobility Corridor', body: 'Over 3.5 million Indians call the UAE home. DALC has specialized employment and residency pathways for Indian professionals across tech, finance, and healthcare.' });
  }

  // ── Investor profile ──
  if (profile.isInvestor && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Investor Profile — Elevated Visa Options Available', body: 'As an investor, you may qualify for the UAE Golden Visa starting at AED 500,000. Tax residency certificates and global wealth protection strategies are also available through DALC.' });
  }

  // ── No travel history ──
  if (rule.category === 'embassy_visa' && profile.travelHistory === 'none') {
    insights.push({ type: 'risk', title: 'Limited Travel History May Slow Processing', body: 'First-time travelers applying for embassy visas often face additional scrutiny. A strong financial profile and detailed itinerary are essential to compensate.' });
  }

  // ── Family travel ──
  if (profile.familyStatus === 'family' && rule.category === 'embassy_visa') {
    insights.push({ type: 'warning', title: 'Family Applications Require Additional Documentation', body: 'Spouse and children must be included in the application with attested marriage and birth certificates. Plan 2–3 extra weeks for document preparation.' });
  }

  // ── Study purpose ──
  if (purpose === 'study') {
    insights.push({ type: 'tip', title: 'Student Visa — Apply 12 Weeks Before Term Start', body: 'Student visa processing can take 4–8 weeks. An institution acceptance letter and proof of fee payment are mandatory. DALC can fast-track attestation of educational certificates.' });
  }

  // ── Medical purpose ──
  if (purpose === 'medical') {
    insights.push({ type: 'tip', title: 'Medical Visa — Priority Processing Often Available', body: 'Medical emergency visas can be expedited in 24–72 hours with proper documentation. DALC has direct embassy contacts to accelerate humanitarian cases.' });
  }

  // ── Transit ──
  if (purpose === 'transit') {
    insights.push({ type: 'tip', title: 'Transit Visa Rules Vary by Airside vs. Landside', body: 'Airside transit (remaining in the international zone) often requires no visa. Landside transit (leaving the terminal) typically requires a transit visa — confirm before travel.' });
  }

  // ── Timing insights from dates ──
  if (dates.arrival && !dates.isFlexible) {
    const daysUntil = Math.round((new Date(dates.arrival).getTime() - Date.now()) / 86400000);
    const maxProcessing = rule.processingDays[1];

    if (daysUntil > 0 && daysUntil <= maxProcessing && rule.category !== 'visa_free' && rule.category !== 'visa_on_arrival') {
      insights.push({ type: 'risk', title: `Urgent: Only ${daysUntil} Days Until Travel`, body: `Standard processing for your visa type takes ${rule.processingDays[0]}–${maxProcessing} days. Apply immediately — DALC\'s express service can compress timelines significantly.` });
    } else if (daysUntil > 60 && rule.category === 'embassy_visa') {
      insights.push({ type: 'tip', title: 'Good Lead Time — Apply 8 Weeks Before Departure', body: 'You have ample time for embassy visa preparation. Starting now allows DALC to build the strongest possible file without rushed attestations or incomplete documentation.' });
    }
  }

  return insights;
}

// ── DALC Recommendations ────────────────────────────────────────────────────────

function computeDALCServices(data: VisaFormData): DALCService[] {
  const { purpose, destination, profile } = data;
  const dest = destination?.code;

  if (dest !== 'AE') {
    return [{
      title: 'DALC Travel Concierge',
      subtitle: 'Expert guidance for your international journey',
      route: '/services/visas',
      budget: 'AED 500 – 2,000',
      timeline: '3–7 days',
      features: ['Visa application management', 'Document review & attestation', 'Travel insurance sourcing', 'Airport VIP fast-track'],
      isPrimary: true,
    }];
  }

  const services: DALCService[] = [];

  if (purpose === 'relocation') {
    services.push({
      title: 'DALC Move To Dubai Programme',
      subtitle: 'Full-service relocation concierge for individuals and families',
      route: '/services/move-to-dubai',
      budget: 'AED 15,000 – 45,000',
      timeline: '4–8 weeks',
      features: ['Visa & residency application', 'Housing search & lease negotiation', 'School enrollment & family setup', 'Bank account & utility activation', 'Dedicated relocation advisor'],
      isPrimary: true,
    });
    if (profile.isInvestor || profile.isBusinessOwner) {
      services.push({
        title: 'UAE Golden Visa Programme',
        subtitle: '10-year renewable residency — no sponsor required',
        route: '/services/golden-visa',
        budget: 'AED 2,000 – 15,000',
        timeline: '3–6 weeks',
        features: ['10-year residency', 'Family sponsorship included', 'Business & travel freedom', 'Tax residency certificate'],
        isPrimary: false,
      });
    }
  } else if (purpose === 'investment') {
    services.push({
      title: 'UAE Golden Visa — Investor Route',
      subtitle: 'Secure 10-year UAE residency through qualifying investment',
      route: '/services/golden-visa',
      budget: 'AED 2,000 – 15,000 (processing)',
      timeline: '4–8 weeks',
      features: ['AED 500K+ real estate route', '10-year renewable visa', 'Family sponsorship', 'Multiple entry', 'Tax residency certificate'],
      isPrimary: true,
    });
    services.push({
      title: 'DALC Business Setup & Licensing',
      subtitle: 'Mainland & free zone company formation with banking',
      route: '/services/business-setup',
      budget: 'AED 15,000 – 55,000',
      timeline: '1–3 weeks',
      features: ['DED or Free Zone license', 'Corporate banking', 'Investor visa', 'DIFC / DMCC / ADGM options'],
      isPrimary: false,
    });
  } else if (purpose === 'business') {
    services.push({
      title: 'DALC Business Setup & Licensing',
      subtitle: 'End-to-end company formation — mainland and free zones',
      route: '/services/business-setup',
      budget: 'AED 15,000 – 55,000',
      timeline: '1–3 weeks',
      features: ['DED / Free Zone license', 'Corporate bank account', 'Staff visa processing', 'DIFC / DMCC / ADGM options', 'PRO & government relations'],
      isPrimary: true,
    });
  } else if (purpose === 'remote_work') {
    services.push({
      title: 'UAE Freelance & Digital Nomad Visa',
      subtitle: 'Live and work legally in Dubai on your own terms',
      route: '/services/visas',
      budget: 'AED 8,000 – 20,000',
      timeline: '2–4 weeks',
      features: ['Virtual Working Programme (1 year)', 'Freelance permit (TECOM / twofour54)', 'UAE residence visa', 'Emirates ID', 'Health insurance setup'],
      isPrimary: true,
    });
  } else if (purpose === 'employment') {
    services.push({
      title: 'UAE Employment Visa Package',
      subtitle: 'End-to-end employment residency processing',
      route: '/services/visas',
      budget: 'AED 3,000 – 8,000',
      timeline: '2–4 weeks',
      features: ['Employment entry permit', 'Status change & visa stamping', 'Emirates ID', 'Medical fitness test', 'Labour card activation'],
      isPrimary: true,
    });
  } else if (purpose === 'study') {
    services.push({
      title: 'UAE Student Visa Package',
      subtitle: 'From university admission to residence — handled end-to-end',
      route: '/services/visas',
      budget: 'AED 4,000 – 9,000',
      timeline: '3–5 weeks',
      features: ['Student visa application', 'Emirates ID processing', 'Bank account setup', 'University liaison', 'Health insurance enrollment'],
      isPrimary: true,
    });
  } else if (purpose === 'medical') {
    services.push({
      title: 'UAE Medical Visa Concierge',
      subtitle: 'Priority-processed medical visa with hospital coordination',
      route: '/services/visas',
      budget: 'AED 1,500 – 4,000',
      timeline: '3–7 days (express available)',
      features: ['Medical visa application', 'Hospital appointment coordination', 'Companion visa', 'VIP airport meet & assist', 'Accommodation near medical facility'],
      isPrimary: true,
    });
  } else if (purpose === 'family_visit') {
    services.push({
      title: 'UAE Family Visit Visa',
      subtitle: 'Sponsored family visit processing — single & multiple entry',
      route: '/services/visas',
      budget: 'AED 800 – 2,500',
      timeline: '3–7 days',
      features: ['Sponsored visit visa', 'Multiple entry options', 'Extension processing', 'Emirates ID guidance', 'Airport VIP arrival service'],
      isPrimary: true,
    });
  } else {
    services.push({
      title: 'DALC Visa Processing',
      subtitle: 'Concierge-managed, fast-tracked visa applications',
      route: '/services/visas',
      budget: 'AED 500 – 1,500',
      timeline: '1–5 days',
      features: ['Visa application management', 'Document preparation', 'Status tracking', 'eVisa submission', 'Express processing available'],
      isPrimary: true,
    });
  }

  return services;
}

// ── Public Helpers ───────────────────────────────────────────────────────────────

export interface VisaQuickInfo {
  category: VisaCategory;
  label: string;
  maxStay: string;
  processingDays: [number, number];
  govFeeAED: [number, number];
}

export function getVisaQuickInfo(fromCode: string, toCode: string): VisaQuickInfo {
  const rule = resolveRule(fromCode, toCode, null);
  const LABELS: Record<VisaCategory, string> = {
    visa_free: 'Visa Free',
    visa_on_arrival: 'Visa on Arrival',
    evisa: 'eVisa',
    embassy_visa: 'Embassy Visa',
    eta: 'ETA',
    not_allowed: 'Not Permitted',
  };
  return {
    category: rule.category,
    label: LABELS[rule.category],
    maxStay: rule.maxStay,
    processingDays: rule.processingDays,
    govFeeAED: rule.govFeeAED,
  };
}

// ── Main Export ─────────────────────────────────────────────────────────────────

export function generateReport(data: VisaFormData): TravelReport {
  const nat = data.nationalities[0];
  const dest = data.destination;
  const rule = nat && dest ? resolveRule(nat.code, dest.code, data.residence) : DEFAULT_RULE;

  const scores = computeScores(data, rule);
  const documents = computeDocuments(data, rule);
  const insights = computeInsights(data, rule, scores);
  const dalcServices = computeDALCServices(data);

  const fastTrackDays = rule.processingDays[0] > 1 ? Math.max(1, rule.processingDays[0] - 1) : undefined;
  const dalcFeeMin = dalcServices[0]?.isPrimary ? 500 : 300;
  const dalcFeeMax = dalcServices[0]?.isPrimary ? 2000 : 800;

  const leadScore = Math.min(100, Math.round(
    scores.eligibility * 0.25 +
    scores.confidence * 0.25 +
    (data.purpose === 'relocation' || data.purpose === 'investment' ? 30 : 10) +
    (data.profile.isInvestor ? 20 : 0) +
    (data.profile.isBusinessOwner ? 10 : 0)
  ));

  const VISA_LABELS: Record<VisaCategory, string> = {
    visa_free: 'Visa Free',
    visa_on_arrival: 'Visa on Arrival',
    evisa: 'eVisa Required',
    embassy_visa: 'Embassy Visa Required',
    eta: 'ETA Required',
    not_allowed: 'Entry Not Permitted',
  };

  return {
    visaCategory: rule.category,
    visaLabel: VISA_LABELS[rule.category],
    maxStay: rule.maxStay,
    entries: rule.entries,
    conditions: rule.conditions ?? [],
    processingMin: rule.processingDays[0],
    processingMax: rule.processingDays[1],
    fastTrackDays,
    govFeeMin: rule.govFeeAED[0],
    govFeeMax: rule.govFeeAED[1],
    dalcFeeMin,
    dalcFeeMax,
    totalMin: rule.govFeeAED[0] + dalcFeeMin,
    totalMax: rule.govFeeAED[1] + dalcFeeMax,
    documents,
    scores,
    insights,
    dalcServices,
    leadScore,
  };
}
