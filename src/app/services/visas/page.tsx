'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Camera, Zap, Globe, FileText, Clock, Shield, Star, ChevronRight,
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, Users, Award,
} from 'lucide-react';
import { COUNTRIES } from './visa-finder/_lib/countries';
import { getVisaQuickInfo } from './visa-finder/_lib/intelligence';
import type { VisaCategory } from './visa-finder/_lib/types';

// ── Quick Destination Data — derived from the engine ───────────────────────────

const DESTINATION_CODES = [
  'JP', 'GB', 'FR', 'TH', 'SG', 'TR', 'MA', 'GE', 'AU', 'CA', 'KE', 'EG', 'US', 'DE', 'IT', 'ID',
] as const;

const CATEGORY_COLOR: Record<VisaCategory, string> = {
  visa_free:     'emerald',
  visa_on_arrival: 'amber',
  evisa:         'sky',
  eta:           'violet',
  embassy_visa:  'red',
  not_allowed:   'red',
};

const BADGE_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  violet:  'bg-violet-500/10  text-violet-400  border-violet-500/25',
  sky:     'bg-sky-500/10     text-sky-400     border-sky-500/25',
  amber:   'bg-amber-500/10   text-amber-400   border-amber-500/25',
  red:     'bg-red-500/10     text-red-400     border-red-500/25',
};

function buildQuickDestinations() {
  return DESTINATION_CODES.map(code => {
    const country = COUNTRIES.find(c => c.code === code);
    const info = getVisaQuickInfo('AE', code);
    const color = CATEGORY_COLOR[info.category];
    const [dMin, dMax] = info.processingDays;
    const [fMin] = info.govFeeAED;
    const days = dMin === 0 ? null : dMax === dMin ? `${dMin}d` : `${dMin}–${dMax}d`;
    const fee = fMin === 0 ? null : `AED ${fMin}`;
    return { code, flag: country?.flag ?? '🌍', name: country?.name ?? code, badge: info.label, color, days, fee };
  });
}

const QUICK_DESTINATIONS = buildQuickDestinations();

const STATS = [
  { value: '195', label: 'Countries covered', icon: Globe },
  { value: '48h', label: 'Average processing', icon: Clock },
  { value: '12k+', label: 'Applications filed', icon: Users },
  { value: '99%', label: 'Approval rate', icon: Award },
];

const FEATURES = [
  {
    icon: Camera,
    title: 'AI Passport Photo Studio',
    desc: 'Upload any selfie — our AI removes the background, crops to face, and exports a biometric-compliant passport photo in seconds.',
    badge: 'Exclusive',
    href: '/services/visas/photo-studio',
    primary: true,
  },
  {
    icon: Sparkles,
    title: 'Visa Intelligence Engine',
    desc: 'Analyses your passport, travel history, and trip purpose to produce an eligibility score, document checklist, and approval probability.',
    badge: 'Smart',
    href: '/services/visas/visa-finder',
    primary: false,
  },
  {
    icon: FileText,
    title: 'Document Vault',
    desc: 'Securely store your passport, bank statements, and travel documents — pre-fill any future application instantly.',
    badge: 'Coming Soon',
    href: '#',
    primary: false,
  },
  {
    icon: TrendingUp,
    title: 'Application Tracker',
    desc: 'Real-time status updates for every visa you\'ve applied for. Live embassy processing times and personalised next-step guidance.',
    badge: 'Coming Soon',
    href: '#',
    primary: false,
  },
];

const TESTIMONIALS = [
  { name: 'Priya S.', country: '🇮🇳 Indian in Dubai', text: 'The passport photo tool saved me AED 150 and 2 hours. Generated a perfect white-background photo in 30 seconds.' },
  { name: 'Khalid A.', country: '🇵🇰 Pakistani professional', text: 'The AI visa report told me exactly what documents I needed and which risks to address. Embassy approved first try.' },
  { name: 'Sophie T.', country: '🇫🇷 French expat', text: 'Best visa platform I\'ve used. The intelligence report is so much more detailed than anything on iVisa or VisaHQ.' },
];

// ── Animated Globe SVG ──────────────────────────────────────────────────────────

function AnimatedGlobe() {
  return (
    <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-20 max-lg:hidden" style={{ width: 560, height: 560 }}>
      <svg viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer rings */}
        {[1, 0.72, 0.48, 0.27].map((r, i) => (
          <circle
            key={i}
            cx="280" cy="280"
            r={280 * r}
            stroke="#C9A84C"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            opacity={0.4 - i * 0.08}
          />
        ))}
        {/* Latitude lines */}
        {[-0.4, -0.15, 0.15, 0.4].map((offset, i) => {
          const y = 280 + 280 * offset;
          const hw = Math.sqrt(Math.max(0, 280 * 280 - (280 * offset) * (280 * offset)));
          return (
            <ellipse key={i} cx="280" cy={y} rx={hw} ry={hw * 0.28}
              stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" fill="none" />
          );
        })}
        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <ellipse key={i} cx="280" cy="280" rx={280 * Math.abs(Math.cos(deg * Math.PI / 180))} ry="280"
            stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" fill="none"
            transform={`rotate(${deg} 280 280)`} />
        ))}
        {/* Glow dots at popular destinations */}
        {[
          [320, 180], [160, 250], [420, 300], [200, 350], [380, 220], [240, 160],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#C9A84C" opacity="0.8" />
            <circle cx={x} cy={y} r="8" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.3" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Quick Search Widget ──────────────────────────────────────────────────────────

function QuickSearch() {
  const [from, setFrom] = useState('AE');
  const [to, setTo] = useState('');

  const fromCountry = COUNTRIES.find(c => c.code === from);
  const toCountry = COUNTRIES.find(c => c.code === to);

  return (
    <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#0D0B08]/90 p-5 backdrop-blur-xl">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Instant Visa Check</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-[#8A7D60]">My passport</label>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#181510] px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 focus:outline-none"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center pt-4 text-[#C9A84C]/40 max-sm:hidden">
          <ArrowRight className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs text-[#8A7D60]">Travelling to</label>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#181510] px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 focus:outline-none"
          >
            <option value="">Select destination</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <Link
            href={to ? `/services/visas/visa-finder?from=${from}&to=${to}` : '/services/visas/visa-finder'}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-2.5 text-sm font-semibold text-[#080706] transition-all hover:bg-[#E8CC70] whitespace-nowrap"
          >
            Check Visa <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {fromCountry && toCountry && (
        <p className="mt-3 text-xs text-[#8A7D60]">
          {fromCountry.flag} {fromCountry.name} passport → {toCountry.flag} {toCountry.name}
        </p>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function VisaHubPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,168,76,0.12),transparent_45%)]" />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#C9A84C]/10 px-6 pb-20 pt-36 md:pt-40">
        <AnimatedGlobe />

        <div className="relative mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-[#C9A84C]/70">
              DALC Global Mobility
            </p>
            <h1 className="mb-4 max-w-3xl text-5xl font-light leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Your visa,<br />
              <span className="bg-gradient-to-r from-[#C9A84C] via-[#E8D080] to-[#C9A84C] bg-clip-text text-transparent">
                handled properly
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-[#D4C9A8]/60">
              Eligibility scoring, passport photo studio, document checklists, and a dedicated concierge — built for Dubai residents who expect more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <QuickSearch />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 flex flex-wrap items-center gap-5"
          >
            {['AI Eligibility Score', 'Document Checklist', 'Photo Studio', 'Cost Estimator'].map(feat => (
              <div key={feat} className="flex items-center gap-1.5 text-sm text-[#8A7D60]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C]/60" />
                {feat}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#C9A84C]/10 px-6 py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto mb-2 h-5 w-5 text-[#C9A84C]/60" />
              <p className="text-3xl font-light text-[#E8CC70]">{value}</p>
              <p className="mt-0.5 text-xs text-[#8A7D60]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Platform Features</p>
            <h2 className="text-3xl font-light text-white">Everything in one place</h2>
            <p className="mt-2 text-[#8A7D60]">Tools that no other visa platform offers</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, desc, badge, href, primary }) => (
              <Link
                key={title}
                href={href}
                className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  primary
                    ? 'border-[#C9A84C]/40 bg-gradient-to-br from-[#C9A84C]/10 via-[#181510] to-[#0D0B08] hover:shadow-[#C9A84C]/10'
                    : 'border-[#C9A84C]/15 bg-[#0D0B08] hover:border-[#C9A84C]/30'
                }`}
              >
                {primary && (
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.08),transparent_60%)]" />
                )}
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl border p-2.5 ${primary ? 'border-[#C9A84C]/40 bg-[#C9A84C]/15' : 'border-[#C9A84C]/15 bg-[#181510]'}`}>
                    <Icon className={`h-5 w-5 ${primary ? 'text-[#C9A84C]' : 'text-[#8A7D60]'}`} />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${
                    badge === 'Exclusive'
                      ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30'
                      : badge === 'Smart'
                        ? 'bg-[#181510] text-[#C9A84C]/60 border border-[#C9A84C]/15'
                        : 'bg-[#181510] text-[#8A7D60] border border-[#C9A84C]/10'
                  }`}>
                    {badge}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-medium text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-[#8A7D60]">{desc}</p>
                {href !== '#' && (
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-[#C9A84C]/70 transition-colors group-hover:text-[#C9A84C]">
                    Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Photo Studio CTA ─────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#C9A84C]/30 bg-gradient-to-br from-[#181510] via-[#0D0B08] to-[#0A0806]">
          <div className="grid sm:grid-cols-2">
            <div className="p-8 sm:p-10">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Exclusive Feature</p>
              <h2 className="mb-3 text-2xl font-light leading-snug text-white sm:text-3xl">
                AI Passport<br />
                <span className="text-[#C9A84C]">Photo Studio</span>
              </h2>
              <p className="mb-6 text-[#8A7D60]">
                Upload any photo — the studio removes the background, centres your face using biometric guides, and exports a government-compliant passport photo in seconds. Free, no app required.
              </p>
              <ul className="mb-7 space-y-2">
                {[
                  'Biometric face-centering guide',
                  'White background removal (AI)',
                  'ISO-standard output (35×45mm, 413×531px)',
                  'Print layout — 4 photos on A4',
                  'JPEG + PNG download',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#D4C9A8]/70">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/services/visas/photo-studio"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70]"
              >
                <Camera className="h-4 w-4" />
                Open Photo Studio
              </Link>
            </div>
            <div className="relative flex items-center justify-center overflow-hidden border-l border-[#C9A84C]/10 bg-[#0A0806] p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06),transparent_70%)]" />
              {/* Photo studio mock preview */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl border border-[#C9A84C]/30 bg-[#181510]" style={{ width: 160, height: 206 }}>
                  {/* Biometric lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-2">
                    <div className="h-px w-full bg-[#C9A84C]/20" />
                    <div className="h-px w-full bg-[#C9A84C]/20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute left-2 h-full w-px bg-[#C9A84C]/20" />
                    <div className="absolute right-2 h-full w-px bg-[#C9A84C]/20" />
                    {/* Face oval */}
                    <div className="h-20 w-14 rounded-full border border-dashed border-[#C9A84C]/50" />
                  </div>
                  {/* Gradient person silhouette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/10 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-1/2 h-16 w-20 -translate-x-1/2 rounded-t-full bg-[#C9A84C]/10" />
                  <div className="absolute top-[30%] left-1/2 h-20 w-12 -translate-x-1/2 rounded-full bg-[#C9A84C]/8" />
                </div>
                {/* Check badge */}
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[#0D0B08] px-2.5 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ─────────────────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">UAE Passport Holders</p>
              <h2 className="text-2xl font-light text-white">Popular destinations</h2>
            </div>
            <Link href="/services/visas/visa-finder" className="flex items-center gap-1.5 text-sm text-[#C9A84C]/70 hover:text-[#C9A84C]">
              All countries <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {QUICK_DESTINATIONS.map(({ code, flag, name, badge, color, days, fee }) => (
              <Link
                key={code}
                href={`/services/visas/visa-finder?from=AE&to=${code}`}
                className="group rounded-2xl border border-[#C9A84C]/10 bg-[#0D0B08] p-4 transition-all hover:-translate-y-0.5 hover:border-[#C9A84C]/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl">{flag}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase ${BADGE_STYLES[color]}`}>
                    {badge}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{name}</p>
                {days || fee ? (
                  <p className="mt-0.5 text-xs text-[#8A7D60]">
                    {[days && `${days} processing`, fee].filter(Boolean).join(' · ')}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-emerald-500/70">No visa required</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why DALC vs competitors ──────────────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Comparison</p>
            <h2 className="text-3xl font-light text-white">Why DALC vs iVisa & VisaHQ</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#C9A84C]/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#C9A84C]/10 bg-[#181510]">
                  <th className="px-5 py-3.5 text-left font-mono text-[10px] uppercase tracking-wider text-[#8A7D60]">Feature</th>
                  <th className="px-5 py-3.5 text-center font-mono text-[10px] uppercase tracking-wider text-[#C9A84C]">DALC</th>
                  <th className="px-5 py-3.5 text-center font-mono text-[10px] uppercase tracking-wider text-[#8A7D60]">iVisa</th>
                  <th className="px-5 py-3.5 text-center font-mono text-[10px] uppercase tracking-wider text-[#8A7D60]">VisaHQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/6">
                {[
                  ['AI Passport Photo Studio',  true,  false, false],
                  ['AI Eligibility Score',       true,  false, false],
                  ['Document Checklist',          true,  true,  true],
                  ['Cost Breakdown',              true,  true,  false],
                  ['Approval Risk Analysis',      true,  false, false],
                  ['Human Concierge Support',     true,  false, true],
                  ['Golden Visa Pathway',         true,  false, false],
                  ['WhatsApp Updates',            true,  false, false],
                ].map(([feat, dalc, ivisa, visahq]) => (
                  <tr key={feat as string} className="bg-[#0A0806] hover:bg-[#0D0B08]">
                    <td className="px-5 py-3 text-[#D4C9A8]/70">{feat as string}</td>
                    <td className="px-5 py-3 text-center">{dalc  ? <CheckCircle2 className="mx-auto h-4 w-4 text-[#C9A84C]" />  : <span className="text-[#8A7D60]/40">—</span>}</td>
                    <td className="px-5 py-3 text-center">{ivisa ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400/50" /> : <span className="text-[#8A7D60]/40">—</span>}</td>
                    <td className="px-5 py-3 text-center">{visahq? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400/50" /> : <span className="text-[#8A7D60]/40">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Client Stories</p>
            <h2 className="text-2xl font-light text-white">Trusted by Dubai residents</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, country, text }) => (
              <div key={name} className="rounded-2xl border border-[#C9A84C]/10 bg-[#0D0B08] p-5">
                <div className="mb-3 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-[#D4C9A8]/70">"{text}"</p>
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-xs text-[#8A7D60]">{country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#181510] to-[#0A0806] px-8 py-12 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Get started</p>
            <h2 className="mb-3 text-3xl font-light text-white sm:text-4xl">
              Your visa,<br />
              <span className="text-[#C9A84C]">handled intelligently</span>
            </h2>
            <p className="mx-auto mb-8 max-w-md text-[#8A7D60]">
              Check your visa requirements, generate a compliant passport photo, and let a DALC advisor handle the rest.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/services/visas/visa-finder"
                className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70]"
              >
                <Zap className="h-4 w-4" />
                Check My Visa
              </Link>
              <Link
                href="/services/visas/photo-studio"
                className="flex items-center gap-2 rounded-xl border border-[#C9A84C]/30 px-7 py-3 text-[#C9A84C] transition-all hover:bg-[#C9A84C]/10"
              >
                <Camera className="h-4 w-4" />
                Photo Studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
