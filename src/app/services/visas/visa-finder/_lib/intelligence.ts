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
  // Visa on Arrival — Developed
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
  JP: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  KR: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  SG: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  MY: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  ZA: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
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
  // Restricted
  AF: { category: 'not_allowed', maxStay: 'N/A', entries: 'N/A', processingDays: [0, 0], govFeeAED: [0, 0] },
  SY: { category: 'not_allowed', maxStay: 'N/A', entries: 'N/A', processingDays: [0, 0], govFeeAED: [0, 0] },
};

const VISA_FROM_UAE: Record<string, VisaRule> = {
  US: { category: 'embassy_visa', maxStay: '180 days', entries: 'Multiple', processingDays: [21, 90], govFeeAED: [600, 600], conditions: ['DS-160 required', 'In-person interview', 'Financial proof required'] },
  GB: { category: 'embassy_visa', maxStay: '180 days', entries: 'Multiple', processingDays: [15, 30], govFeeAED: [500, 500] },
  CA: { category: 'evisa', maxStay: '6 months', entries: 'Multiple', processingDays: [1, 3], govFeeAED: [70, 70] },
  AU: { category: 'eta', maxStay: '3 months', entries: 'Multiple', processingDays: [0, 1], govFeeAED: [60, 60] },
  JP: { category: 'visa_free', maxStay: '15 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  SG: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  TH: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  TR: { category: 'visa_free', maxStay: '30 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  MA: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  EG: { category: 'visa_on_arrival', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [100, 100] },
  KE: { category: 'evisa', maxStay: '90 days', entries: 'Single', processingDays: [1, 3], govFeeAED: [200, 200] },
  ZA: { category: 'visa_free', maxStay: '30 days', entries: 'Single', processingDays: [0, 0], govFeeAED: [0, 0] },
  FR: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  DE: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  IT: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  ES: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  NL: { category: 'visa_free', maxStay: '90 days', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] },
  IN: { category: 'embassy_visa', maxStay: '6 months', entries: 'Multiple', processingDays: [7, 21], govFeeAED: [500, 700] },
};

const DEFAULT_RULE: VisaRule = {
  category: 'embassy_visa',
  maxStay: '30 days',
  entries: 'Single',
  processingDays: [10, 30],
  govFeeAED: [400, 1200],
};

function resolveRule(natCode: string, destCode: string): VisaRule {
  if (natCode === destCode) {
    return { category: 'visa_free', maxStay: 'Citizen / No Visa', entries: 'Multiple', processingDays: [0, 0], govFeeAED: [0, 0] };
  }
  if (destCode === 'AE') return VISA_TO_UAE[natCode] ?? DEFAULT_RULE;
  if (natCode === 'AE') return VISA_FROM_UAE[destCode] ?? DEFAULT_RULE;
  return DEFAULT_RULE;
}

// ── AI Scoring ──────────────────────────────────────────────────────────────────

function computeScores(data: VisaFormData, rule: VisaRule): AIScore {
  const { profile, purpose } = data;

  const baseEligibility: Record<VisaCategory, number> = {
    visa_free: 100, visa_on_arrival: 95, eta: 90, evisa: 78, embassy_visa: 60, not_allowed: 0,
  };
  let eligibility = baseEligibility[rule.category];
  if (profile.hasUSVisa || profile.hasUKVisa || profile.hasSchengenVisa) eligibility = Math.min(100, eligibility + 10);
  if (profile.hasVisaRefusals) eligibility = Math.max(0, eligibility - 25);
  if (profile.travelHistory === 'very_frequent') eligibility = Math.min(100, eligibility + 5);

  let confidence = eligibility;
  if (profile.hasVisaRefusals) confidence -= 20;
  if (profile.isInvestor || profile.isBusinessOwner) confidence = Math.min(100, confidence + 8);
  confidence = Math.max(10, Math.min(100, confidence));

  const baseRisk: Record<VisaCategory, number> = {
    visa_free: 5, visa_on_arrival: 10, eta: 12, evisa: 25, embassy_visa: 42, not_allowed: 100,
  };
  let risk = baseRisk[rule.category];
  if (profile.hasVisaRefusals) risk = Math.min(100, risk + 30);
  if (profile.hasUSVisa || profile.hasUKVisa) risk = Math.max(5, risk - 15);
  if (purpose === 'relocation' || purpose === 'employment') risk = Math.min(100, risk + 10);

  const complexity: Record<VisaCategory, number> = {
    visa_free: 1, visa_on_arrival: 1, eta: 2, evisa: 3, embassy_visa: 5, not_allowed: 0,
  };

  let readiness = 50;
  if (profile.hasUSVisa) readiness += 10;
  if (profile.hasUKVisa) readiness += 10;
  if (profile.hasSchengenVisa) readiness += 5;
  if (profile.isBusinessOwner) readiness += 5;
  if (!profile.hasVisaRefusals) readiness += 20;
  readiness = Math.min(100, readiness);

  return { eligibility, confidence, risk, complexity: complexity[rule.category], readiness };
}

// ── Documents ───────────────────────────────────────────────────────────────────

function computeDocuments(data: VisaFormData, rule: VisaRule): DocumentItem[] {
  const base: DocumentItem[] = [
    { name: 'Valid Passport (6+ months validity)', status: 'required' },
    { name: 'Passport-size Photos (white background)', status: 'required', notes: 'DALC AI Photo Studio generates compliant photos instantly' },
    { name: 'Return / Onward Ticket', status: 'required' },
  ];

  if (rule.category === 'visa_free' || rule.category === 'visa_on_arrival') {
    return [...base,
      { name: 'Proof of Accommodation', status: 'conditional' },
      { name: 'Travel Insurance', status: 'optional' },
      { name: 'Sufficient Funds (AED 3,000+ recommended)', status: 'conditional' },
    ];
  }

  if (rule.category === 'evisa' || rule.category === 'eta') {
    return [...base,
      { name: 'eVisa / ETA Application Form', status: 'required' },
      { name: 'Hotel Booking Confirmation', status: 'required' },
      { name: 'Bank Statement (3 months)', status: 'conditional' },
      { name: 'Travel Insurance (USD 30,000+ coverage)', status: 'required' },
      { name: 'Flight Itinerary', status: 'required' },
    ];
  }

  const embassy: DocumentItem[] = [...base,
    { name: 'Visa Application Form (original)', status: 'required' },
    { name: 'Bank Statement (3–6 months)', status: 'required' },
    { name: 'Employment Letter / NOC', status: 'required' },
    { name: 'Travel Insurance (USD 50,000+ coverage)', status: 'required' },
    { name: 'Hotel / Host Invitation Letter', status: 'required' },
    { name: 'Salary Slips (3 months)', status: 'required' },
    { name: 'Business Registration / Tax Returns', status: 'conditional' },
  ];

  if (data.purpose === 'relocation' || data.purpose === 'employment') {
    embassy.push(
      { name: 'Employment Contract or Offer Letter', status: 'required' },
      { name: 'Educational Certificates (attested)', status: 'required' },
      { name: 'Medical Certificate (approved authority)', status: 'conditional' },
    );
  }

  if (data.purpose === 'investment') {
    embassy.push(
      { name: 'Proof of Investment (AED 2M minimum)', status: 'required' },
      { name: 'Business Registration Documents', status: 'required' },
    );
  }

  return embassy;
}

// ── AI Insights ─────────────────────────────────────────────────────────────────

function computeInsights(data: VisaFormData, rule: VisaRule, scores: AIScore): AIInsight[] {
  const { profile, purpose, nationalities, destination } = data;
  const nat = nationalities[0]?.code;
  const dest = destination?.code;
  const insights: AIInsight[] = [];

  if (profile.hasVisaRefusals) {
    insights.push({ type: 'warning', title: 'Previous Visa Refusal on Record', body: 'A prior refusal significantly impacts your approval probability. DALC recommends a certified immigration advisor review before reapplying.' });
  }

  if (scores.confidence < 60 && rule.category === 'embassy_visa') {
    insights.push({ type: 'risk', title: 'Complex Application — Expert Support Recommended', body: 'Embassy visas require extensive documentation and personal interviews. Starting 8+ weeks ahead with DALC concierge support dramatically improves outcomes.' });
  }

  if ((profile.hasUSVisa || profile.hasUKVisa || profile.hasSchengenVisa) && rule.category !== 'visa_free') {
    insights.push({ type: 'tip', title: 'Existing Strong Visa History is an Asset', body: 'Your US/UK/Schengen visa strengthens your application. Include attested copies as supplementary credibility evidence in every application.' });
  }

  if (purpose === 'relocation' && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Multiple Long-Term Residency Pathways Available', body: 'A visit visa is only step one. Depending on your profile, DALC can structure a Golden Visa, Employment Visa, or Freelance Permit — providing legal long-term residency.' });
  }

  if (purpose === 'investment' && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Golden Visa Investment Route — 10-Year Residency', body: 'Qualifying real estate investment of AED 2M+ unlocks the UAE Golden Visa — the most secure long-term residency pathway with no sponsor required.' });
  }

  if (rule.category === 'visa_free' || rule.category === 'visa_on_arrival') {
    insights.push({ type: 'tip', title: 'Streamlined Entry — Minimal Pre-Arrival Requirements', body: 'Your passport enables seamless entry. DALC recommends securing travel insurance and hotel confirmation before departure for a friction-free arrival.' });
  }

  if (nat === 'IN' && dest === 'AE' && (purpose === 'relocation' || purpose === 'employment')) {
    insights.push({ type: 'opportunity', title: 'India–UAE: The World\'s Busiest Mobility Corridor', body: 'Over 3.5 million Indians call the UAE home. DALC has specialized employment and residency pathways for Indian professionals across tech, finance, and healthcare.' });
  }

  if (profile.isInvestor && dest === 'AE') {
    insights.push({ type: 'opportunity', title: 'Investor Profile — Elevated Visa Options Available', body: 'As an investor, you may qualify for the UAE Golden Visa starting at AED 500,000. Tax residency certificates and global wealth protection strategies are also available through DALC.' });
  }

  if (rule.category === 'embassy_visa' && profile.travelHistory === 'none') {
    insights.push({ type: 'risk', title: 'Limited Travel History May Slow Processing', body: 'First-time travelers applying for embassy visas often face additional scrutiny. A strong financial profile and detailed itinerary are essential to compensate.' });
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

// ── Main Export ─────────────────────────────────────────────────────────────────

export function generateReport(data: VisaFormData): TravelReport {
  const nat = data.nationalities[0];
  const dest = data.destination;
  const rule = nat && dest ? resolveRule(nat.code, dest.code) : DEFAULT_RULE;

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
