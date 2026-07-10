'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck,
  Building2,
  Landmark,
  MapPin,
} from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import LeadCaptureForm from '../components/LeadCaptureForm';
import { FloatingWhatsApp, InlineWhatsApp } from '../components/WhatsAppButton';
import { SERVICES, waUrl } from '../data/services';
import {
  MOVE_TO_DUBAI_EVENTS,
  initMoveToDubaiAttribution,
  trackMoveToDubaiEvent,
} from '../config/tracking';

// ─── DALC palette ─────────────────────────────────────────────────────────────

const C = {
  gold:      '#C9A84C',
  goldBright:'#E8CC70',
  goldDim:   '#7A6025',
  goldFaint: '#3D2E0C',
  void:      '#080706',
  ink:       '#0D0B08',
  deep:      '#120F0A',
  card:      '#1E1B14',
  card2:     '#242118',
  beige:     '#F5EDD8',
  beigeMid:  '#D4C9A8',
  white:     'rgba(245,237,216,0.95)',
  muted:     'rgba(212,195,150,0.60)',
  dim:       'rgba(212,195,150,0.30)',
  faint:     'rgba(212,195,150,0.14)',
  rim:       'rgba(212,195,150,0.07)',
  rim2:      'rgba(212,195,150,0.12)',
  rim3:      'rgba(212,195,150,0.22)',
  goldGlow:  'rgba(201,168,76,0.12)',
  goldOrb:   'rgba(201,168,76,0.08)',
  textBg:    '#100800',
};

// ─── Animation helper ─────────────────────────────────────────────────────────

const fade = {
  initial:     { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport:    { once: true, margin: '-60px' } as const,
  transition:  { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as const,
};

// ─── Visa Type Data ───────────────────────────────────────────────────────────

const VISA_TYPES = [
  {
    id: 'golden',
    label: 'Golden Visa',
    duration: '10 Years',
    badge: 'Most Popular',
    tagline: 'Long-term self-sponsored residence',
    desc: 'The UAE Golden Visa grants a 10-year renewable residence permit without requiring a local sponsor. Available to investors, entrepreneurs, exceptional talents, scientists, and outstanding students.',
    requirements: [
      'Property investment ≥ AED 2M (fully owned)',
      'OR business ownership with ≥ AED 2M capital',
      'OR employment in a specialised field (doctor, engineer, etc.)',
      'OR academic distinction / Olympic achievement',
    ],
    highlight: true,
  },
  {
    id: 'investor',
    label: 'Investor Visa',
    duration: '2–3 Years',
    badge: 'Business Founders',
    tagline: 'Tied to your UAE company or property',
    desc: 'A standard investor residence visa valid for 2–3 years, renewable. Requires either a licensed UAE business or a qualifying property investment. Extendable through business continuity.',
    requirements: [
      'Active UAE mainland or free zone business license',
      'OR property investment ≥ AED 750K',
      'Valid Emirates ID and medical fitness',
      'No-objection from relevant authority',
    ],
    highlight: false,
  },
  {
    id: 'remote-work',
    label: 'Remote Work Visa',
    duration: '1 Year',
    badge: 'Digital Nomads',
    tagline: 'Live in Dubai, work for the world',
    desc: 'Officially called the Virtual Working Programme, this visa allows employed or self-employed professionals to live in Dubai while working remotely for foreign companies. Renewable annually.',
    requirements: [
      'Employment contract or proof of self-employment',
      'Monthly income ≥ USD 5,000',
      'Active health insurance',
      'Valid passport (6+ months remaining)',
    ],
    highlight: false,
  },
  {
    id: 'family',
    label: 'Family Sponsorship',
    duration: '1–3 Years',
    badge: 'Dependants',
    tagline: 'Bring your family to Dubai',
    desc: "UAE residents can sponsor their spouse, children (under 18, or up to 25 if studying), and in some cases parents. Sponsorship is tied to the primary visa holder's status and income.",
    requirements: [
      'Sponsor holds valid UAE residence visa',
      'Minimum monthly salary (AED 4,000–6,000 depending on family)',
      'Valid tenancy contract (Ejari) or proof of accommodation',
      'Birth/marriage certificates — attested and legalised',
    ],
    highlight: false,
  },
  {
    id: 'employment',
    label: 'Employment Visa',
    duration: '2–3 Years',
    badge: 'Professionals',
    tagline: 'Sponsored by your UAE employer',
    desc: 'The standard employment visa is sponsored by a UAE employer and valid for 2–3 years. We assist professionals transitioning from one employment visa to another or converting from a tourist entry.',
    requirements: [
      'Valid job offer from UAE-licensed employer',
      'Labour contract and salary of at least AED 4,000/month',
      'Medical fitness test and Emirates ID registration',
      'Entry permit prior to visa stamping (if outside UAE)',
    ],
    highlight: false,
  },
];

// ─── Documents Required ───────────────────────────────────────────────────────

const DOCUMENTS = [
  { category: 'Identity', items: ['Valid passport (6+ months validity)', 'Passport copies — all pages', 'Recent passport photographs (white background)'] },
  { category: 'Financial', items: ['Bank statements (3–6 months)', 'Proof of income or employment', 'Property title deed (if applicable)'] },
  { category: 'Legal', items: ['Birth certificate (attested)', 'Marriage certificate (if sponsoring spouse)', 'Trade license or MoA (for business visas)'] },
  { category: 'Medical', items: ['Medical fitness certificate', 'Health insurance (active policy)', 'Emirates ID application (biometrics)'] },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: 'How long does the UAE visa process take?',
    a: 'Typically 3–6 weeks end-to-end depending on the visa type. Golden Visa applications run 4–8 weeks. Employment visas can be faster (2–3 weeks) when the employer is already established. We track your application at every stage.',
  },
  {
    q: 'What is the difference between a Golden Visa and a standard residence visa?',
    a: 'A Golden Visa is self-sponsored and valid for 10 years — you do not need a UAE employer or local sponsor. A standard residence visa (investor or employment) is typically 2–3 years and requires a sponsor. Both allow you to live and work in the UAE.',
  },
  {
    q: 'Can I get a UAE visa without setting up a company?',
    a: 'Yes. If you qualify for the Golden Visa through property investment or professional standing, no company is required. The Remote Work Visa also requires no UAE company — just proof of foreign employment. We assess the right pathway for your situation.',
  },
  {
    q: 'Can I sponsor my family on a UAE residence visa?',
    a: 'Yes, if your residence visa is valid and you meet the minimum income requirements (typically AED 4,000–6,000/month). You can sponsor a spouse, children under 18 (or up to 25 if studying), and in some cases parents. We manage the full sponsorship process.',
  },
  {
    q: 'What happens if I leave the UAE for more than 6 months?',
    a: 'For most standard visas, absence from the UAE for more than 6 consecutive months can invalidate the visa. Golden Visa holders have more flexibility. We advise clients on travel planning to maintain visa validity and flag any exceptions ahead of time.',
  },
  {
    q: 'Do I need to be inside the UAE to apply?',
    a: 'Not necessarily. Many applications — including Golden Visa — can be started remotely. You will need to enter the UAE for biometrics and Emirates ID. We coordinate timing so that your entry aligns with the application process for a smooth one-trip visit.',
  },
];

// ─── Other services (excluding visa) ─────────────────────────────────────────

const OTHER_SERVICES = SERVICES.filter((s) => s.slug !== 'visa-services');

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'company-formation': Building2,
  'banking': Landmark,
  'relocation-support': MapPin,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisaServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    initMoveToDubaiAttribution();
  }, []);

  const goToVisaFinder = () => {
    trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_START_MOVE_CLICK, {
      source_section: 'hero',
      cta_label: 'get_started',
      destination: '/services/visas/visa-finder',
      service_slug: 'visa-services',
    });
    router.push('/services/visas/visa-finder');
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: C.void }}>

      {/* Ambient orb */}
      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none animate-breathe"
        style={{ background: `radial-gradient(circle, ${C.goldOrb} 0%, rgba(212,195,150,0.03) 50%, transparent 65%)`, filter: 'blur(80px)', zIndex: 0 }}
      />

      <FloatingWhatsApp
        message="Hi DALC — I'd like to learn more about UAE Visa Services for my relocation."
        onClick={() => trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_FLOATING_CLICK, {
          source_section: 'floating', cta_label: 'whatsapp_floating', destination: 'whatsapp', service_slug: 'visa-services',
        })}
      />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Warm bg glow */}
        <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none"
             style={{ background: `radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.07) 0%, transparent 60%)` }} />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} suppressHydrationWarning>
            <Link
              href="/move-to-dubai"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 mb-14"
              style={{ color: C.dim }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.dim; }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Move to Dubai
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — headline */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} suppressHydrationWarning>

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 mb-10"
                style={{ border: `1px solid rgba(201,168,76,0.30)`, background: C.goldGlow }}
              >
                <FileCheck className="w-4 h-4" style={{ color: C.gold }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: C.gold }}>
                  Residency & Visas
                </span>
              </div>

              <h1
                className="font-display font-light leading-[0.9] mb-5"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: C.white }}
              >
                UAE Visa &
                <br />
                <span className="italic" style={{ color: C.gold }}>Residency.</span>
              </h1>

              <p
                className="font-display font-light italic mb-6"
                style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: C.muted }}
              >
                The right residency, structured for you.
              </p>

              <p className="font-body font-light text-base leading-relaxed max-w-lg mb-12" style={{ color: C.muted }}>
                UAE residency visas, golden visas, investor visas, and family sponsorship — every pathway
                assessed and executed with precision. We handle the paperwork, you focus on the move.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goToVisaFinder}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-85"
                  style={{ background: C.gold, color: C.textBg }}
                >
                  Start Application <ArrowRight className="w-4 h-4" />
                </button>
                <InlineWhatsApp
                  label="Chat on WhatsApp"
                  variant="green"
                  message="Hi DALC — I'd like to learn more about UAE Visa Services for my relocation."
                  onClick={() => trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_HERO_CLICK, {
                    source_section: 'hero', cta_label: 'whatsapp_hero', destination: 'whatsapp', service_slug: 'visa-services',
                  })}
                />
              </div>
            </motion.div>

            {/* Right — timeline card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              suppressHydrationWarning
              className="p-8"
              style={{ background: C.card, border: `1px solid ${C.rim}`, borderRadius: '10px' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-6" style={{ color: C.goldDim }}>
                Typical Timeline
              </p>
              <ol className="space-y-5">
                {[
                  { phase: 'Week 1', detail: 'Eligibility assessment & document checklist' },
                  { phase: 'Week 2–3', detail: 'Application preparation & submission' },
                  { phase: 'Week 4–6', detail: 'Approval tracking & Emirates ID registration' },
                ].map((t, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] mt-0.5"
                      style={{ border: `1px solid rgba(201,168,76,0.40)`, color: C.gold }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider block mb-0.5" style={{ color: C.gold }}>
                        {t.phase}
                      </span>
                      <p className="font-body font-light text-sm" style={{ color: C.muted }}>{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${C.rim}` }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: C.dim }}>
                  What we manage
                </p>
                <ul className="space-y-2">
                  {[
                    'GDRFA and ICA application management',
                    'Emirates ID registration support',
                    'Health and medical fitness coordination',
                    'Visa stamping and status tracking',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-[6px] shrink-0 w-1 h-1 rounded-full" style={{ background: C.gold }} />
                      <span className="font-body font-light text-xs" style={{ color: C.muted }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VISA TYPES ── */}
      <section className="py-28 px-4 md:px-8" style={{ borderTop: `1px solid ${C.rim}` }}>
        <div className="max-w-7xl mx-auto">

          <motion.div {...fade} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                Visa Pathways
              </span>
            </div>
            <h2
              className="font-display font-light"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: C.white }}
            >
              Which visa is
              <br />
              <span className="italic" style={{ color: C.gold }}>right for you?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VISA_TYPES.map((visa, i) => (
              <motion.div
                key={visa.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`cipher-card p-7 flex flex-col ${visa.highlight ? 'lg:row-span-1' : ''}`}
                style={{
                  background: visa.highlight ? C.card2 : C.card,
                  border: visa.highlight ? `1px solid rgba(201,168,76,0.30)` : `1px solid ${C.rim}`,
                  borderRadius: '10px',
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                    style={{ color: C.gold, background: C.goldGlow, border: `1px solid rgba(201,168,76,0.25)` }}
                  >
                    {visa.badge}
                  </span>
                  <span
                    className="font-mono text-[11px] tracking-wider"
                    style={{ color: C.beigeMid }}
                  >
                    {visa.duration}
                  </span>
                </div>

                <h3
                  className="font-display font-light mb-1"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', color: C.white }}
                >
                  {visa.label}
                </h3>
                <p className="font-display font-light italic text-sm mb-4" style={{ color: C.gold }}>
                  {visa.tagline}
                </p>
                <p className="font-body font-light text-sm leading-relaxed mb-6 flex-1" style={{ color: C.muted }}>
                  {visa.desc}
                </p>

                <div style={{ borderTop: `1px solid ${C.rim}`, paddingTop: '20px' }}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-3" style={{ color: C.dim }}>
                    Key Requirements
                  </p>
                  <ul className="space-y-2">
                    {visa.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2.5">
                        <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: C.goldDim }} />
                        <span className="font-body font-light text-xs leading-relaxed" style={{ color: C.dim }}>
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="cipher-card p-7 flex flex-col items-start justify-between"
              style={{ background: C.goldFaint, border: `1px solid rgba(201,168,76,0.20)`, borderRadius: '10px' }}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-4" style={{ color: C.goldDim }}>
                  Not Sure Which?
                </p>
                <h3 className="font-display font-light mb-3" style={{ fontSize: '26px', color: C.white }}>
                  We'll assess your situation and recommend the right pathway.
                </h3>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: C.muted }}>
                  Free eligibility check. No commitment. We respond within 2 hours.
                </p>
              </div>
              <button
                onClick={goToVisaFinder}
                className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 hover:opacity-85 px-6 py-3"
                style={{ background: C.gold, color: C.textBg }}
              >
                Check Requirements <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR + WHAT'S INCLUDED ── */}
      <section className="py-16 px-4 md:px-8" style={{ borderTop: `1px solid ${C.rim}` }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: '1px', background: C.rim }}
          >
            <motion.div
              {...fade}
              className="p-10 md:p-14"
              style={{ background: C.ink }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-8" style={{ color: C.goldDim }}>
                Who It's For
              </p>
              <ul className="space-y-4">
                {[
                  'Entrepreneurs and business founders',
                  'Remote workers seeking long-term residency',
                  'Investors and HNW individuals',
                  'Families requiring dependent sponsorship',
                  'Professionals transitioning from employment visas',
                  'Digital nomads and freelancers',
                  'Retirees seeking full-time UAE residency',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.gold, opacity: 0.7 }} />
                    <span className="font-body font-light text-sm" style={{ color: C.muted }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fade}
              className="p-10 md:p-14"
              style={{ background: C.card }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-8" style={{ color: C.goldDim }}>
                What's Included
              </p>
              <ul className="space-y-4">
                {[
                  'Visa type assessment and eligibility check',
                  'Document preparation and attestation guidance',
                  'GDRFA and ICA application management',
                  'Emirates ID registration support',
                  'Health and medical fitness coordination',
                  'Visa stamping and status tracking',
                  'Family sponsorship processing (if required)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: C.gold, opacity: 0.6 }} />
                    <span className="font-body font-light text-sm" style={{ color: C.muted }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS REQUIRED ── */}
      <section className="py-28 px-4 md:px-8" style={{ background: C.ink, borderTop: `1px solid ${C.rim}`, borderBottom: `1px solid ${C.rim}` }}>
        <div className="max-w-7xl mx-auto">

          <motion.div {...fade} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                Documents Required
              </span>
            </div>
            <h2
              className="font-display font-light"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: C.white }}
            >
              What to prepare
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DOCUMENTS.map((doc, i) => (
              <motion.div
                key={doc.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="cipher-card p-6"
                style={{ background: C.card, border: `1px solid ${C.rim}`, borderRadius: '10px' }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-5" style={{ color: C.goldDim }}>
                  {doc.category}
                </p>
                <ul className="space-y-3">
                  {doc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-[5px] shrink-0 w-1 h-1 rounded-full" style={{ background: C.gold }} />
                      <span className="font-body font-light text-xs leading-relaxed" style={{ color: C.muted }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p {...fade} className="mt-8 font-body font-light text-xs text-center" style={{ color: C.dim }}>
            Requirements vary by visa type. We provide a personalised document checklist after your initial assessment.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          <motion.div {...fade} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                Frequently Asked
              </span>
            </div>
            <h2
              className="font-display font-light"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: C.white }}
            >
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-1">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 px-6 text-left transition-colors duration-200"
                  style={{
                    background: openFaq === i ? C.card : C.ink,
                    borderTop: `1px solid ${C.rim}`,
                    borderLeft: openFaq === i ? `2px solid ${C.gold}` : `2px solid transparent`,
                  }}
                >
                  <span
                    className="font-display font-light pr-8"
                    style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: openFaq === i ? C.white : C.muted }}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className="shrink-0 w-4 h-4 transition-transform duration-300"
                    style={{ color: C.gold, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden', background: C.card }}
                    >
                      <p
                        className="px-6 pb-6 pt-2 font-body font-light text-sm leading-relaxed"
                        style={{ color: C.muted, borderLeft: `2px solid ${C.gold}` }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <div style={{ borderTop: `1px solid ${C.rim}` }} />
          </div>
        </div>
      </section>

      {/* ── LEAD FORM ── */}
      <section
        id="visa-contact"
        className="py-28 px-4 md:px-8"
        style={{ background: C.ink, borderTop: `1px solid ${C.rim}` }}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: '1px', background: C.rim }}
          >
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 md:p-16 flex flex-col justify-between"
              style={{ background: C.ink }}
            >
              <div>
                <div className="w-10 h-[1px] mb-10" style={{ background: C.gold }} />
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-6" style={{ background: C.goldDim }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                    Get Started
                  </span>
                </div>
                <h2
                  className="font-display font-light leading-tight mb-6"
                  style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: C.white }}
                >
                  Ready to begin
                  <br />
                  <span className="italic" style={{ color: C.gold }}>your residency?</span>
                </h2>
                <p className="font-body font-light text-sm leading-relaxed max-w-sm mb-12" style={{ color: C.muted }}>
                  Tell us your situation. We'll reply within 2 hours with a clear plan, the right visa pathway,
                  and a full document checklist — no commitment required.
                </p>
                <ul className="space-y-3">
                  {['Free eligibility assessment', 'Response within 2 hours', '100% confidential'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: C.gold, opacity: 0.7 }} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: C.dim }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${C.rim}` }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] mb-4" style={{ color: C.dim }}>
                  Prefer to message directly?
                </p>
                <InlineWhatsApp
                  message="Hi DALC — I'd like to learn more about UAE Visa Services for my relocation."
                  label="Chat on WhatsApp"
                  variant="ghost"
                  className="text-[11px]"
                  onClick={() => trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_CONTACT_CLICK, {
                    source_section: 'contact', cta_label: 'whatsapp_contact', destination: 'whatsapp', service_slug: 'visa-services',
                  })}
                />
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 md:p-16"
              style={{ background: C.card }}
            >
              <LeadCaptureForm
                contextMessage="I am interested in UAE Visa Services at DALC for my relocation"
                leadContext={{
                  source_page: '/move-to-dubai/visa-services',
                  source_section: 'contact',
                  cta_label: 'lead_form_get_started',
                  service_slug: 'visa-services',
                  destination: 'whatsapp',
                }}
                onSubmitSuccess={() =>
                  trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_LEAD_FORM_SUBMIT_SUCCESS, {
                    source_section: 'contact',
                    cta_label: 'lead_form_get_started',
                    destination: 'whatsapp',
                    service_slug: 'visa-services',
                  })
                }
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OTHER SERVICES ── */}
      <section className="py-20 px-4 md:px-8" style={{ borderTop: `1px solid ${C.rim}` }}>
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-8" style={{ color: C.dim }}>
            Also Available
          </p>
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ gap: '1px', background: C.rim }}
          >
            {OTHER_SERVICES.map((svc) => {
              const Icon = (SERVICE_ICONS[svc.slug] ?? ChevronRight) as React.FC<React.SVGProps<SVGSVGElement>>;
              return (
                <Link
                  key={svc.slug}
                  href={`/move-to-dubai/${svc.slug}`}
                  className="group flex items-center justify-between p-6 transition-all duration-300"
                  style={{ background: C.ink }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.card; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.ink; }}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: C.goldDim }} />
                    <div>
                      <p className="font-display font-light text-base transition-colors duration-300" style={{ color: C.muted }}>
                        {svc.label}
                      </p>
                      <p className="font-body font-light text-xs mt-0.5" style={{ color: C.dim }}>{svc.tagline}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-all duration-300" style={{ color: C.rim2 }} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
