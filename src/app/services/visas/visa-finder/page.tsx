'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronDown, ChevronLeft, Camera, Upload, Download,
  RefreshCcw, Sparkles, ArrowRight, Clock, CreditCard,
  TrendingUp, FileText, Globe, MessageCircle, Check,
  Info, Zap,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  popular?: boolean;
}

type VisaType = 'visa-free' | 'visa-on-arrival' | 'evisa' | 'visa-required' | 'unknown';

interface VisaRequirement {
  type: VisaType;
  label: string;
  duration: string;
  processingTime: string;
  costAED: string;
  successRate: string;
  requirements: string[];
  notes?: string;
}

interface VisaTypeStyle {
  color: string;
  bg: string;
  border: string;
  badge: string;
}

interface PhotoApiResponse {
  success: boolean;
  processedImage?: string;
  error?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', popular: true },
  { code: 'SA', name: 'Saudi Arabia',         flag: '🇸🇦', region: 'Middle East', popular: true },
  { code: 'KW', name: 'Kuwait',               flag: '🇰🇼', region: 'Middle East' },
  { code: 'QA', name: 'Qatar',               flag: '🇶🇦', region: 'Middle East' },
  { code: 'BH', name: 'Bahrain',             flag: '🇧🇭', region: 'Middle East' },
  { code: 'OM', name: 'Oman',               flag: '🇴🇲', region: 'Middle East' },
  { code: 'JO', name: 'Jordan',             flag: '🇯🇴', region: 'Middle East' },
  { code: 'EG', name: 'Egypt',             flag: '🇪🇬', region: 'Middle East', popular: true },
  { code: 'LB', name: 'Lebanon',           flag: '🇱🇧', region: 'Middle East' },
  { code: 'IQ', name: 'Iraq',             flag: '🇮🇶', region: 'Middle East' },
  { code: 'GB', name: 'United Kingdom',   flag: '🇬🇧', region: 'Europe', popular: true },
  { code: 'DE', name: 'Germany',         flag: '🇩🇪', region: 'Europe', popular: true },
  { code: 'FR', name: 'France',         flag: '🇫🇷', region: 'Europe', popular: true },
  { code: 'IT', name: 'Italy',         flag: '🇮🇹', region: 'Europe' },
  { code: 'ES', name: 'Spain',        flag: '🇪🇸', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { code: 'SE', name: 'Sweden',     flag: '🇸🇪', region: 'Europe' },
  { code: 'NO', name: 'Norway',    flag: '🇳🇴', region: 'Europe' },
  { code: 'DK', name: 'Denmark',  flag: '🇩🇰', region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { code: 'GR', name: 'Greece',  flag: '🇬🇷', region: 'Europe' },
  { code: 'PL', name: 'Poland',  flag: '🇵🇱', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe' },
  { code: 'HU', name: 'Hungary',  flag: '🇭🇺', region: 'Europe' },
  { code: 'RO', name: 'Romania',  flag: '🇷🇴', region: 'Europe' },
  { code: 'RU', name: 'Russia',  flag: '🇷🇺', region: 'Europe' },
  { code: 'TR', name: 'Turkey',  flag: '🇹🇷', region: 'Europe', popular: true },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', popular: true },
  { code: 'CA', name: 'Canada',       flag: '🇨🇦', region: 'Americas', popular: true },
  { code: 'BR', name: 'Brazil',      flag: '🇧🇷', region: 'Americas' },
  { code: 'MX', name: 'Mexico',     flag: '🇲🇽', region: 'Americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'Americas' },
  { code: 'IN', name: 'India',       flag: '🇮🇳', region: 'South Asia', popular: true },
  { code: 'PK', name: 'Pakistan',   flag: '🇵🇰', region: 'South Asia', popular: true },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'South Asia', popular: true },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'South Asia' },
  { code: 'NP', name: 'Nepal',    flag: '🇳🇵', region: 'South Asia' },
  { code: 'CN', name: 'China',       flag: '🇨🇳', region: 'East Asia', popular: true },
  { code: 'JP', name: 'Japan',       flag: '🇯🇵', region: 'East Asia', popular: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'East Asia' },
  { code: 'HK', name: 'Hong Kong',  flag: '🇭🇰', region: 'East Asia' },
  { code: 'SG', name: 'Singapore',  flag: '🇸🇬', region: 'Southeast Asia', popular: true },
  { code: 'MY', name: 'Malaysia',   flag: '🇲🇾', region: 'Southeast Asia' },
  { code: 'TH', name: 'Thailand',   flag: '🇹🇭', region: 'Southeast Asia' },
  { code: 'ID', name: 'Indonesia',  flag: '🇮🇩', region: 'Southeast Asia' },
  { code: 'PH', name: 'Philippines',flag: '🇵🇭', region: 'Southeast Asia', popular: true },
  { code: 'VN', name: 'Vietnam',    flag: '🇻🇳', region: 'Southeast Asia' },
  { code: 'AU', name: 'Australia',  flag: '🇦🇺', region: 'Oceania', popular: true },
  { code: 'NZ', name: 'New Zealand',flag: '🇳🇿', region: 'Oceania' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { code: 'NG', name: 'Nigeria',    flag: '🇳🇬', region: 'Africa', popular: true },
  { code: 'KE', name: 'Kenya',      flag: '🇰🇪', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia',   flag: '🇪🇹', region: 'Africa' },
  { code: 'GH', name: 'Ghana',      flag: '🇬🇭', region: 'Africa' },
  { code: 'MA', name: 'Morocco',    flag: '🇲🇦', region: 'Africa', popular: true },
  { code: 'TN', name: 'Tunisia',    flag: '🇹🇳', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania',   flag: '🇹🇿', region: 'Africa' },
];

const UAE_REQUIREMENTS: Record<string, VisaRequirement> = {
  SA: { type: 'visa-free', label: 'Visa Free', duration: 'Unlimited', processingTime: 'Instant', costAED: 'AED 0', successRate: '100%', requirements: ['Valid GCC passport or national ID'], notes: 'GCC nationals may reside indefinitely in the UAE.' },
  KW: { type: 'visa-free', label: 'Visa Free', duration: 'Unlimited', processingTime: 'Instant', costAED: 'AED 0', successRate: '100%', requirements: ['Valid GCC passport or national ID'] },
  QA: { type: 'visa-free', label: 'Visa Free', duration: 'Unlimited', processingTime: 'Instant', costAED: 'AED 0', successRate: '100%', requirements: ['Valid GCC passport or national ID'] },
  BH: { type: 'visa-free', label: 'Visa Free', duration: 'Unlimited', processingTime: 'Instant', costAED: 'AED 0', successRate: '100%', requirements: ['Valid GCC passport or national ID'] },
  OM: { type: 'visa-free', label: 'Visa Free', duration: 'Unlimited', processingTime: 'Instant', costAED: 'AED 0', successRate: '100%', requirements: ['Valid GCC passport or national ID'] },
  GB: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Onward/return ticket', 'Proof of accommodation'], notes: 'Automatically renewable for a further 90 days.' },
  US: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid US passport (6+ months validity)', 'Return ticket', 'Accommodation proof'] },
  CA: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  AU: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  NZ: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  DE: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  FR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  IT: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  ES: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  NL: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  CH: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  SE: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  NO: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  DK: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  FI: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  BE: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  AT: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  PT: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  GR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  PL: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  CZ: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  HU: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  RO: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  TR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  JP: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  KR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  HK: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid Hong Kong passport'] },
  SG: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  MY: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  TH: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  ID: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '97%', requirements: ['Valid passport (6+ months validity)', 'Return ticket'] },
  VN: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '97%', requirements: ['Valid passport (6+ months validity)'] },
  BR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport (6+ months validity)'] },
  MX: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '97%', requirements: ['Valid passport', 'Return ticket'] },
  AR: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport'] },
  CO: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '96%', requirements: ['Valid passport', 'Return ticket'] },
  JO: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '99%', requirements: ['Valid passport'] },
  EG: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport'] },
  LB: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 30 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '95%', requirements: ['Valid passport'] },
  MA: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport'] },
  TN: { type: 'visa-on-arrival', label: 'Visa on Arrival', duration: 'Up to 90 days', processingTime: 'On arrival', costAED: 'AED 0', successRate: '98%', requirements: ['Valid passport'] },
  RU: { type: 'evisa', label: 'eVisa Required', duration: 'Up to 30 days', processingTime: '2–4 business days', costAED: 'AED 370–550', successRate: '96%', requirements: ['Valid passport (6+ months validity)', 'Hotel booking confirmation', 'Return flight ticket', 'Travel insurance', 'Passport-size photograph (white background)'], notes: 'Apply via the ICA Smart Services portal. DALC can expedite within 24h.' },
  UA: { type: 'evisa', label: 'eVisa Available', duration: 'Up to 30 days', processingTime: '2–4 business days', costAED: 'AED 290–370', successRate: '95%', requirements: ['Valid passport (6+ months validity)', 'Hotel booking', 'Return flight ticket'] },
  CN: { type: 'evisa', label: 'eVisa Required', duration: 'Up to 30 days', processingTime: '2–5 business days', costAED: 'AED 370–740', successRate: '94%', requirements: ['Valid passport (6+ months validity)', 'Hotel booking', 'Return flight ticket', 'Bank statement (3 months)', 'Passport photograph (white background)'] },
  IN: { type: 'evisa', label: 'eVisa Required', duration: '30 days / 60 days multi', processingTime: '4–7 business days', costAED: 'AED 370–740', successRate: '92%', requirements: ['Valid passport (6+ months validity)', 'Passport photograph (white background)', 'Return flight ticket', 'Bank statement (3 months)', 'Hotel booking or host details', 'Employment letter / salary certificate'], notes: 'Apply via ICA Smart Services. DALC fast-tracks applications within 48h.' },
  PK: { type: 'evisa', label: 'eVisa Required', duration: '30 days single entry', processingTime: '3–5 business days', costAED: 'AED 290–550', successRate: '88%', requirements: ['Valid passport (6+ months validity)', 'UAE sponsor letter or hotel booking', 'Passport photograph', 'Bank statement (3 months)', 'Return flight ticket', 'Employment letter or business proof'] },
  BD: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '5–7 business days', costAED: 'AED 290–550', successRate: '85%', requirements: ['Valid passport (6+ months validity)', 'UAE sponsor or hotel booking', 'Passport photograph', 'Bank statement (3 months)', 'Employment letter'] },
  PH: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '3–5 business days', costAED: 'AED 290–370', successRate: '93%', requirements: ['Valid passport (6+ months validity)', 'Hotel booking or host information', 'Return flight ticket', 'Bank statement (3 months)', 'Employment proof / salary certificate'] },
  LK: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '3–5 business days', costAED: 'AED 290–370', successRate: '90%', requirements: ['Valid passport', 'UAE sponsor or hotel', 'Return flight ticket', 'Bank statement'] },
  NP: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '5–7 business days', costAED: 'AED 290–370', successRate: '87%', requirements: ['Valid passport', 'UAE sponsor or hotel', 'Return flight ticket', 'Bank statement'] },
  IQ: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '7–10 business days', costAED: 'AED 550–920', successRate: '80%', requirements: ['Valid passport', 'Hotel booking', 'Return ticket', 'Bank statement', 'Sponsor letter'] },
  ZA: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '5–7 business days', costAED: 'AED 370–550', successRate: '92%', requirements: ['Valid passport (6+ months)', 'Bank statement', 'Return ticket', 'Hotel booking'] },
  KE: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '5–10 business days', costAED: 'AED 370–550', successRate: '88%', requirements: ['Valid passport', 'Bank statement', 'Return ticket', 'Sponsor or hotel booking'] },
  TZ: { type: 'evisa', label: 'eVisa Required', duration: '30 days', processingTime: '7–10 business days', costAED: 'AED 370–550', successRate: '86%', requirements: ['Valid passport', 'Bank statement', 'Return ticket', 'Hotel booking'] },
  NG: { type: 'visa-required', label: 'Visa Required', duration: '30 days', processingTime: '7–14 business days', costAED: 'AED 550–1,100', successRate: '78%', requirements: ['Valid passport (6+ months remaining)', 'Sponsor letter from UAE resident', 'Bank statement (3 months minimum)', 'Employment letter on company letterhead', 'Return flight ticket', 'Passport photograph (white background)', 'Accommodation proof or hotel booking'], notes: 'Nigerian applicants require a UAE-resident sponsor. DALC provides full sponsorship assistance.' },
  ET: { type: 'visa-required', label: 'Visa Required', duration: '30 days', processingTime: '10–14 business days', costAED: 'AED 550–920', successRate: '82%', requirements: ['Valid passport', 'UAE sponsor letter', 'Bank statement', 'Employment proof'] },
  GH: { type: 'visa-required', label: 'Visa Required', duration: '30 days', processingTime: '10–14 business days', costAED: 'AED 550–920', successRate: '80%', requirements: ['Valid passport', 'UAE sponsor letter', 'Bank statement', 'Employment letter', 'Return ticket'] },
};

const VISA_TYPE_CONFIG: Record<VisaType, VisaTypeStyle> = {
  'visa-free':       { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', badge: 'bg-emerald-500 text-black' },
  'visa-on-arrival': { color: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/30',     badge: 'bg-sky-500 text-black' },
  'evisa':           { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   badge: 'bg-amber-500 text-black' },
  'visa-required':   { color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  badge: 'bg-orange-500 text-black' },
  'unknown':         { color: 'text-gray-400',    bg: 'bg-gray-400/10',    border: 'border-gray-400/30',    badge: 'bg-gray-600 text-white' },
};

const POPULAR_ROUTES = [
  { passport: 'IN', destination: 'AE' },
  { passport: 'GB', destination: 'AE' },
  { passport: 'PK', destination: 'AE' },
  { passport: 'US', destination: 'AE' },
  { passport: 'PH', destination: 'AE' },
  { passport: 'NG', destination: 'AE' },
  { passport: 'BD', destination: 'AE' },
  { passport: 'CN', destination: 'AE' },
];

const STATS = [
  { value: '190+', label: 'Countries' },
  { value: '48h',  label: 'Avg. Processing' },
  { value: '97%',  label: 'Success Rate' },
  { value: '12k+', label: 'Visas Handled' },
];

const PHOTO_FORMATS = [
  { id: 'uae',      label: 'UAE / GCC',   size: '35 × 45 mm' },
  { id: 'us',       label: 'US Passport', size: '51 × 51 mm' },
  { id: 'uk',       label: 'UK Passport', size: '35 × 45 mm' },
  { id: 'schengen', label: 'Schengen',    size: '35 × 45 mm' },
];

const RESULT_STATS = [
  { icon: Clock,       key: 'processingTime', label: 'Processing' },
  { icon: CreditCard,  key: 'costAED',        label: 'Fees' },
  { icon: TrendingUp,  key: 'successRate',    label: 'Success Rate' },
  { icon: FileText,    key: 'duration',       label: 'Max Stay' },
] as const;

// ── CountrySelect ──────────────────────────────────────────────────────────────

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  placeholder: string;
  exclude?: string;
}

function CountrySelect({ value, onChange, placeholder, exclude }: CountrySelectProps) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find(c => c.code === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return COUNTRIES
      .filter(c => c.code !== exclude)
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      .sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [query, exclude]);

  const grouped = useMemo(() => {
    const map: Record<string, Country[]> = {};
    filtered.forEach(c => { (map[c.region] ??= []).push(c); });
    return map;
  }, [filtered]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (code: string) => { onChange(code); setOpen(false); setQuery(''); };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-left transition-all duration-200 bg-[#111]',
          open ? 'border-[#C9A96E] shadow-[0_0_0_3px_rgba(201,169,110,0.12)]' : 'border-[#2a2a2a] hover:border-[#C9A96E]/50'
        )}
      >
        {selected ? (
          <>
            <span className="text-2xl leading-none">{selected.flag}</span>
            <span className="text-white font-medium flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-[#555] flex-1">{placeholder}</span>
        )}
        <ChevronDown className={cn('w-4 h-4 text-[#555] shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.13 }}
            className="absolute z-50 top-full mt-2 left-0 right-0 bg-[#111] border border-[#252525] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-[#1c1c1c]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search country…"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A96E]/40 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-64 py-2 scrollbar-thin">
              {Object.entries(grouped).map(([region, countries]) => (
                <div key={region}>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a3a]">{region}</p>
                  {countries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => pick(c.code)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#C9A96E]/8 transition-colors text-left',
                        value === c.code && 'bg-[#C9A96E]/10'
                      )}
                    >
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span className="text-[#ddd] text-sm flex-1">{c.name}</span>
                      {c.popular && (
                        <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded-full">Popular</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-[#444] text-sm">No countries found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── VisaResultPanel ────────────────────────────────────────────────────────────

function VisaResultPanel({ passport, destination }: { passport: string; destination: string }) {
  const passportCountry = COUNTRIES.find(c => c.code === passport);
  const destCountry     = COUNTRIES.find(c => c.code === destination);
  const isUAE           = destination === 'AE';
  const visaData        = isUAE ? (UAE_REQUIREMENTS[passport] ?? null) : null;
  const cfg             = VISA_TYPE_CONFIG[visaData?.type ?? 'unknown'];

  if (!passport || !destination) {
    return (
      <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center p-10">
        <div className="w-20 h-20 rounded-full bg-[#C9A96E]/5 border border-[#C9A96E]/10 flex items-center justify-center mb-5">
          <Globe className="w-8 h-8 text-[#C9A96E]/25" />
        </div>
        <p className="text-[#3a3a3a] text-sm max-w-[220px] leading-relaxed">
          Select your passport country and destination to instantly check visa requirements
        </p>
      </div>
    );
  }

  if (!isUAE || !visaData) {
    return (
      <motion.div key="generic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-7 space-y-5">
        <RouteHeader passportCountry={passportCountry} destCountry={destCountry} badge={null} />
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-5">
          <p className="text-[#777] text-sm leading-relaxed">
            Visa requirements for <span className="text-white">{passportCountry?.name}</span> travelling to{' '}
            <span className="text-white">{destCountry?.name}</span> require a personalised assessment.
          </p>
        </div>
        <WhatsAppCTA />
      </motion.div>
    );
  }

  return (
    <motion.div key={`${passport}-${destination}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-7 space-y-5">
      <RouteHeader
        passportCountry={passportCountry}
        destCountry={destCountry}
        badge={<span className={cn('px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide', cfg.badge)}>{visaData.label}</span>}
      />

      <div className="grid grid-cols-2 gap-3">
        {RESULT_STATS.map(({ icon: Icon, key, label }) => (
          <div key={label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-[#444] text-[11px] uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-white text-sm font-medium">{visaData[key]}</p>
          </div>
        ))}
      </div>

      <div className={cn('rounded-xl p-4 border', cfg.bg, cfg.border)}>
        <p className={cn('text-[11px] font-semibold uppercase tracking-wider mb-3', cfg.color)}>Required Documents</p>
        <ul className="space-y-2">
          {visaData.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#bbb]">
              <Check className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', cfg.color)} />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {visaData.notes && (
        <div className="flex gap-2.5 p-3.5 bg-[#C9A96E]/5 border border-[#C9A96E]/15 rounded-xl">
          <Info className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
          <p className="text-[#C9A96E]/75 text-xs leading-relaxed">{visaData.notes}</p>
        </div>
      )}

      <button className="w-full py-3.5 bg-[#C9A96E] text-black rounded-xl font-semibold hover:bg-[#e8c97e] transition-colors flex items-center justify-center gap-2 text-sm">
        <Zap className="w-4 h-4" /> Apply Now with DALC
      </button>
    </motion.div>
  );
}

function RouteHeader({ passportCountry, destCountry, badge }: {
  passportCountry: Country | undefined;
  destCountry: Country | undefined;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-3xl leading-none">{passportCountry?.flag}</span>
        <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
        <span className="text-3xl leading-none">{destCountry?.flag}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{passportCountry?.name} → {destCountry?.name}</p>
        <p className="text-[#444] text-[11px]">Requirements as of 2025</p>
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
}

function WhatsAppCTA() {
  return (
    <a
      href="https://wa.me/971500000000"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 bg-[#C9A96E] text-black rounded-xl font-semibold hover:bg-[#e8c97e] transition-colors text-sm"
    >
      <MessageCircle className="w-4 h-4" /> Speak to a Visa Expert
    </a>
  );
}

// ── PassportPhotoStudio ────────────────────────────────────────────────────────

function PassportPhotoStudio() {
  const [mode, setMode]           = useState<'upload' | 'camera'>('upload');
  const [captured, setCaptured]   = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview]     = useState<'original' | 'processed'>('processed');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch {
      alert('Camera access denied. Please use file upload instead.');
      setMode('upload');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setCaptured(canvas.toDataURL('image/jpeg', 0.95));
    stopCamera();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCaptured(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => setCaptured(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processPhoto = async () => {
    if (!captured) return;
    setProcessing(true);
    try {
      const res  = await fetch(captured);
      const blob = await res.blob();
      const form = new FormData();
      form.append('image', blob, 'photo.jpg');
      const apiRes = await fetch('/api/passport-photo', { method: 'POST', body: form });
      const data   = await apiRes.json() as PhotoApiResponse;
      if (data.success && data.processedImage) {
        setProcessed(data.processedImage);
        setPreview('processed');
      } else {
        alert('Processing failed: ' + (data.error ?? 'Unknown error'));
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadPhoto = (formatId: string) => {
    if (!processed) return;
    const a = document.createElement('a');
    a.href     = processed;
    a.download = `DALC-Passport-Photo-${formatId.toUpperCase()}.jpg`;
    a.click();
  };

  const reset = () => {
    setCaptured(null);
    setProcessed(null);
    setProcessing(false);
    if (mode === 'camera') startCamera();
  };

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-3xl overflow-hidden">
      <div className="p-8 border-b border-[#1e1e1e] flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <span className="text-[#C9A96E] text-xs font-semibold uppercase tracking-widest">AI Photo Studio</span>
          </div>
          <h2 className="text-2xl font-light text-white">Compliant Passport Photos, Instantly</h2>
          <p className="text-[#444] text-sm mt-1">Background removal · Face centering · Government-standard formats</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['UAE', 'USA', 'UK', 'Schengen'].map(f => (
            <span key={f} className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#666] text-xs rounded-full">{f}</span>
          ))}
        </div>
      </div>

      <div className="p-8">
        {!captured ? (
          <CaptureArea
            mode={mode}
            videoRef={videoRef}
            fileRef={fileRef}
            onStartCamera={startCamera}
            onSwitchUpload={() => { stopCamera(); setMode('upload'); }}
            onCapture={capturePhoto}
            onFile={handleFile}
            onDrop={handleDrop}
          />
        ) : (
          <ReviewArea
            captured={captured}
            processed={processed}
            processing={processing}
            preview={preview}
            onProcess={processPhoto}
            onDownload={downloadPhoto}
            onReset={reset}
            onPreviewChange={setPreview}
          />
        )}
      </div>
    </div>
  );
}

interface CaptureAreaProps {
  mode: 'upload' | 'camera';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onStartCamera: () => void;
  onSwitchUpload: () => void;
  onCapture: () => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

function CaptureArea({ mode, videoRef, fileRef, onStartCamera, onSwitchUpload, onCapture, onFile, onDrop }: CaptureAreaProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center gap-2 mb-7">
        {(['upload', 'camera'] as const).map(m => (
          <button
            key={m}
            onClick={m === 'camera' ? onStartCamera : onSwitchUpload}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all',
              mode === m
                ? 'bg-[#C9A96E] text-black border-[#C9A96E]'
                : 'text-[#777] border-[#2a2a2a] hover:text-white hover:border-[#C9A96E]/40'
            )}
          >
            {m === 'upload' ? <Upload className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {m === 'upload' ? 'Upload Photo' : 'Use Camera'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#222] hover:border-[#C9A96E]/30 rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-colors group"
        >
          <div className="w-16 h-16 bg-[#C9A96E]/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C9A96E]/10 transition-colors">
            <Upload className="w-7 h-7 text-[#C9A96E]/40 group-hover:text-[#C9A96E]/70 transition-colors" />
          </div>
          <p className="text-white mb-1 text-sm">Drop your photo here</p>
          <p className="text-[#444] text-sm mb-5">or click to browse</p>
          <span className="px-5 py-2 border border-[#C9A96E]/25 text-[#C9A96E] text-sm rounded-xl group-hover:bg-[#C9A96E]/10 transition-colors">
            Browse Files
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <p className="text-[#2a2a2a] text-xs mt-6">JPEG · PNG · HEIC — max 10 MB</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-[#C9A96E]/15">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-2 border-dashed border-[#C9A96E]/35 rounded-full" />
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-[#C9A96E]/60 text-xs">Centre your face in the oval</p>
          </div>
          <button
            onClick={onCapture}
            className="mt-5 px-10 py-4 bg-[#C9A96E] text-black font-semibold rounded-full hover:bg-[#e8c97e] transition-colors flex items-center gap-2"
          >
            <Camera className="w-5 h-5" /> Capture
          </button>
        </div>
      )}
    </div>
  );
}

interface ReviewAreaProps {
  captured: string;
  processed: string | null;
  processing: boolean;
  preview: 'original' | 'processed';
  onProcess: () => void;
  onDownload: (format: string) => void;
  onReset: () => void;
  onPreviewChange: (p: 'original' | 'processed') => void;
}

function ReviewArea({ captured, processed, processing, preview, onProcess, onDownload, onReset, onPreviewChange }: ReviewAreaProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className={cn('transition-all duration-500', preview === 'processed' && processed && 'opacity-35 scale-95')}>
          <p className="text-center text-[#444] text-xs uppercase tracking-widest mb-3">Original</p>
          <div className="aspect-[3/4] max-w-[240px] mx-auto rounded-2xl overflow-hidden border border-[#2a2a2a] bg-black">
            <img src={captured} alt="original" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className={cn('transition-all duration-500', preview === 'original' && 'opacity-35 scale-95')}>
          <p className="text-center text-[#C9A96E] text-xs uppercase tracking-widest mb-3">Passport Standard</p>
          <div className="aspect-[3/4] max-w-[240px] mx-auto rounded-2xl overflow-hidden border-2 border-[#C9A96E]/30 bg-white relative">
            {processed ? (
              <img src={processed} alt="processed" className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
                {processing ? (
                  <>
                    <div className="w-8 h-8 border-2 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin" />
                    <p className="text-[#999] text-xs text-center px-4">AI processing<br />your photo…</p>
                  </>
                ) : (
                  <button
                    onClick={onProcess}
                    className="px-5 py-2.5 bg-[#C9A96E] text-black text-sm font-semibold rounded-xl hover:bg-[#e8c97e] transition-colors flex items-center gap-1.5 shadow-[0_0_24px_rgba(201,169,110,0.35)]"
                  >
                    <Sparkles className="w-4 h-4" /> Enhance Photo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        {processed && !processing && (
          <>
            <p className="text-[#444] text-sm">Download for your application format:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-lg">
              {PHOTO_FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => onDownload(f.id)}
                  className="flex flex-col items-center p-3.5 border border-[#1e1e1e] hover:border-[#C9A96E]/30 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C9A96E] mb-1.5" />
                  <span className="text-white text-xs font-medium">{f.label}</span>
                  <span className="text-[#444] text-[10px] mt-0.5">{f.size}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-4">
          {processed && (
            <button
              onMouseEnter={() => onPreviewChange('original')}
              onMouseLeave={() => onPreviewChange('processed')}
              className="px-4 py-2 border border-[#1e1e1e] text-[#666] text-sm rounded-xl hover:text-white transition-colors"
            >
              Hold for original
            </button>
          )}
          <button onClick={onReset} className="flex items-center gap-1.5 px-4 py-2 text-[#555] text-sm hover:text-white transition-colors">
            <RefreshCcw className="w-3.5 h-3.5" /> Retake
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function VisaFinderPage() {
  const [passport,     setPassport]     = useState('');
  const [destination,  setDestination]  = useState('');

  const swapCountries = () => {
    const p = passport;
    setPassport(destination);
    setDestination(p);
  };

  const setRoute = (p: string, d: string) => {
    setPassport(p);
    setDestination(d);
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <nav className="border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-sm">
          <Link href="/services/visas" className="flex items-center gap-1.5 text-[#555] hover:text-[#C9A96E] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Visa Services
          </Link>
          <span className="text-[#222]">/</span>
          <span className="text-[#C9A96E]">Visa Finder</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E]/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#C9A96E]/4 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-full text-[#C9A96E] text-xs font-medium mb-6 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              DALC Concierge Intelligence · 190+ Countries
            </div>

            <h1 className="text-5xl md:text-6xl font-light text-white mb-4 leading-[1.1] tracking-tight">
              The World,<br />
              <span className="italic text-[#C9A96E]">At Your Service</span>
            </h1>
            <p className="text-[#555] text-lg max-w-lg mx-auto mb-10">
              Instant visa eligibility checks. AI-compliant passport photos. Expert concierge handling.
            </p>

            <div className="flex justify-center gap-10">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-light text-white">{value}</p>
                  <p className="text-[#3a3a3a] text-xs uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Finder */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid lg:grid-cols-5 gap-5 items-start">
          {/* Selector Panel */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl p-6 space-y-4"
          >
            <div>
              <label className="text-[#3a3a3a] text-[11px] uppercase tracking-widest mb-2 block">My Passport</label>
              <CountrySelect value={passport} onChange={setPassport} placeholder="Select your nationality…" exclude={destination} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#181818]" />
              <button
                onClick={swapCountries}
                title="Swap countries"
                className="w-9 h-9 bg-[#141414] border border-[#222] rounded-full flex items-center justify-center text-[#555] hover:text-[#C9A96E] hover:border-[#C9A96E]/40 transition-colors text-base"
              >
                ⇄
              </button>
              <div className="flex-1 h-px bg-[#181818]" />
            </div>

            <div>
              <label className="text-[#3a3a3a] text-[11px] uppercase tracking-widest mb-2 block">Destination Country</label>
              <CountrySelect value={destination} onChange={setDestination} placeholder="Travelling to…" exclude={passport} />
            </div>

            <div className="pt-1">
              <p className="text-[#2e2e2e] text-[10px] uppercase tracking-widest mb-3">Popular UAE Routes</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROUTES.map(({ passport: p, destination: d }) => {
                  const pc = COUNTRIES.find(c => c.code === p);
                  return (
                    <button
                      key={`${p}-${d}`}
                      onClick={() => setRoute(p, d)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all',
                        passport === p && destination === d
                          ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]'
                          : 'border-[#181818] text-[#444] hover:border-[#C9A96E]/25 hover:text-[#C9A96E]'
                      )}
                    >
                      {pc?.flag} {pc?.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Live Result */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl min-h-[480px] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <VisaResultPanel key={`${passport}→${destination}`} passport={passport} destination={destination} />
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Passport Photo Studio */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <div className="mb-6">
          <h2 className="text-3xl font-light text-white">Passport Photo Studio</h2>
          <p className="text-[#444] text-sm mt-1">Upload a selfie — AI produces a government-compliant photo in seconds.</p>
        </div>
        <PassportPhotoStudio />
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl p-10">
          <h2 className="text-2xl font-light text-white mb-10 text-center">How DALC Handles Your Visa</h2>
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {[
              { step: '01', title: 'Check Eligibility',   desc: 'Use the finder above to see your exact visa requirements instantly.' },
              { step: '02', title: 'Get Your Photo',      desc: 'AI generates a 100% compliant passport photo in under 30 seconds.' },
              { step: '03', title: 'Submit with DALC',    desc: 'Our concierge team reviews, prepares, and submits your application.' },
              { step: '04', title: 'Receive Your Visa',   desc: 'Real-time status updates. Visa delivered digitally to your inbox.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <p className="text-[#C9A96E]/20 text-5xl font-light mb-3">{step}</p>
                <h3 className="text-white font-medium mb-2 text-sm">{title}</h3>
                <p className="text-[#444] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A96E] text-black rounded-xl font-semibold hover:bg-[#e8c97e] transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp a Visa Expert
            </a>
            <Link
              href="/concierge"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#C9A96E]/25 text-[#C9A96E] rounded-xl font-medium hover:bg-[#C9A96E]/8 transition-colors text-sm"
            >
              Start Full Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
