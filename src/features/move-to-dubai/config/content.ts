// ─── Move to Dubai — Static Content Configuration ────────────────────────────
// Extracted from MoveToDubai.tsx to keep the layout component focused.
// Edit copy, icons, and ordering here — not in the page component.

import { Shield, Zap, ArrowRight, Star } from 'lucide-react';
import React from 'react';

// ─── Why DALC ─────────────────────────────────────────────────────────────────

export interface WhyDalcItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const WHY_DALC: WhyDalcItem[] = [
  {
    icon: React.createElement(Shield, { className: 'w-6 h-6' }),
    title: 'Discretion',
    desc: 'Your situation remains entirely confidential. We operate with the same discretion as a private family office.',
  },
  {
    icon: React.createElement(Zap, { className: 'w-6 h-6' }),
    title: 'Speed',
    desc: 'We move fast. Most clients have their structure agreed within 72 hours of first contact.',
  },
  {
    icon: React.createElement(ArrowRight, { className: 'w-6 h-6' }),
    title: 'End-to-End',
    desc: 'One point of contact handles everything — visa, company, banking, and settlement.',
  },
  {
    icon: React.createElement(Star, { className: 'w-6 h-6' }),
    title: 'Premium Partners',
    desc: 'Direct access to tier-one law firms, private banks, and licensed UAE authorities.',
  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export const PROCESS: ProcessStep[] = [
  {
    num: '01',
    title: 'Tell us your situation',
    desc: 'Fill in a quick form or send us a WhatsApp message. No commitment, no obligation.',
  },
  {
    num: '02',
    title: 'We design your setup',
    desc: 'Our team maps out the right visa category, company structure, and banking pathway for you.',
  },
  {
    num: '03',
    title: 'We execute everything',
    desc: 'From first application to keys in hand — we handle every step, on your behalf.',
  },
];
