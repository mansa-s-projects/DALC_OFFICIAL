// ─── Move to Dubai — Service Definitions ─────────────────────────────────────
// Static configuration for the 4 public-facing service pages.
// Used by ServicePage.tsx to render the correct content per slug.

import type { LucideProps } from 'lucide-react';
import { FileCheck, Building2, Landmark, MapPin } from 'lucide-react';

export type ServiceIconComponent = React.ComponentType<LucideProps>;

export interface ServiceDefinition {
  slug: 'visa-services' | 'company-formation' | 'banking' | 'relocation-support';
  label: string;
  tagline: string;
  description: string;
  /** Lucide icon component — type-safe, no runtime string lookup required. */
  icon: ServiceIconComponent;
  heroAccent: string; // short badge label
  whoFor: string[];
  included: string[];
  timeline: { phase: string; detail: string }[];
  whatsappText: string; // pre-filled WA message
}

export const SERVICES: ServiceDefinition[] = [
  {
    slug: 'visa-services',
    label: 'Visa Services',
    tagline: 'The right residency, structured for you.',
    description:
      'UAE residency visas, golden visas, investor visas, and family sponsorship — every pathway assessed and executed with precision. We handle the paperwork, you focus on the move.',
    icon: FileCheck,
    heroAccent: 'Residency & Visas',
    whoFor: [
      'Entrepreneurs and business founders',
      'Remote workers seeking long-term residency',
      'Investors and HNW individuals',
      'Families requiring dependent sponsorship',
      'Professionals transitioning from employment visas',
    ],
    included: [
      'Visa type assessment and eligibility check',
      'Document preparation and attestation guidance',
      'GDRFA and ICA application management',
      'Emirates ID registration support',
      'Health and medical fitness coordination',
      'Visa stamping and status tracking',
    ],
    timeline: [
      { phase: 'Week 1', detail: 'Eligibility assessment & document checklist' },
      { phase: 'Week 2–3', detail: 'Application preparation & submission' },
      { phase: 'Week 4–6', detail: 'Approval tracking & Emirates ID registration' },
    ],
    whatsappText: 'Hi DALC — I\'d like to learn more about UAE Visa Services for my relocation.',
  },
  {
    slug: 'company-formation',
    label: 'Company Formation',
    tagline: 'Your business in Dubai, built correctly from day one.',
    description:
      'Mainland, free zone, or offshore — we evaluate your business model and establish the structure that maximises flexibility and tax efficiency. Fully licensed and operational within weeks.',
    icon: Building2,
    heroAccent: 'Business Setup',
    whoFor: [
      'Founders launching a UAE-based entity',
      'International companies expanding to MENA',
      'Freelancers seeking a professional license',
      'Holding companies and investment vehicles',
      'E-commerce and digital businesses',
    ],
    included: [
      'Business structure advisory (mainland vs free zone)',
      'Trade name reservation and approval',
      'License application and regulatory filing',
      'Ejari / office address arrangement',
      'Corporate bank account introduction',
      'Shareholder agreement drafting guidance',
    ],
    timeline: [
      { phase: 'Days 1–3', detail: 'Structure advisory & name reservation' },
      { phase: 'Week 1–2', detail: 'License application & regulatory processing' },
      { phase: 'Week 3–4', detail: 'License issued + bank account introduction' },
    ],
    whatsappText: 'Hi DALC — I\'d like to discuss Company Formation in Dubai for my business.',
  },
  {
    slug: 'banking',
    label: 'Private Banking',
    tagline: 'Accounts opened. Capital protected. Discreetly.',
    description:
      'Navigating UAE banking as a newcomer is complex. We leverage direct relationships with tier-one local and international private banks to open personal and corporate accounts with minimum friction.',
    icon: Landmark,
    heroAccent: 'Banking & Finance',
    whoFor: [
      'HNW individuals requiring private banking',
      'Business owners needing corporate accounts',
      'International clients with complex structures',
      'Investors requiring multi-currency accounts',
      'Families managing cross-border wealth',
    ],
    included: [
      'Bank selection and suitability assessment',
      'Document preparation and KYC support',
      'Direct bank introductions (personal and corporate)',
      'Multi-currency and international wire setup',
      'Credit card and digital banking guidance',
      'Private banking relationship management',
    ],
    timeline: [
      { phase: 'Days 1–2', detail: 'Bank selection and document preparation' },
      { phase: 'Week 1', detail: 'Bank introduction and KYC submission' },
      { phase: 'Week 2–4', detail: 'Account approval and activation' },
    ],
    whatsappText: 'Hi DALC — I need help opening a bank account in Dubai. Can you assist?',
  },
  {
    slug: 'relocation-support',
    label: 'Relocation Support',
    tagline: 'Every detail of your move, handled.',
    description:
      'From finding the right neighbourhood to settling your family in — our relocation team manages your entire transition on the ground in Dubai. Concierge-grade handling for everything in between.',
    icon: MapPin,
    heroAccent: 'Full Relocation',
    whoFor: [
      'Families relocating with children and dependants',
      'Executives requiring full-service transition support',
      'Individuals moving without prior Dubai knowledge',
      'Corporate relocations requiring group logistics',
      'Anyone who values their time above all else',
    ],
    included: [
      'Neighbourhood and property advisory',
      'School search and enrollment coordination',
      'Airport reception and arrival logistics',
      'Utilities, internet and home setup',
      'Healthcare registration and GP introduction',
      'Ongoing concierge support for first 90 days',
    ],
    timeline: [
      { phase: '4 weeks before', detail: 'Property search, school shortlisting, logistics plan' },
      { phase: 'Arrival week', detail: 'Airport reception, property handover, utilities setup' },
      { phase: 'First 90 days', detail: 'Ongoing support and concierge access' },
    ],
    whatsappText: 'Hi DALC — I\'m relocating to Dubai and need full relocation support.',
  },
];

export const WA_NUMBER = '971585987600';
export const waUrl = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
export const WA_DEFAULT_TEXT = 'Hi DALC — I\'d like to learn more about relocating to Dubai.';
