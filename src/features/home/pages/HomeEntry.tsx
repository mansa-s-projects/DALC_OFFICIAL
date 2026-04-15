'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Phone, Shield, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

const WA = '971585987600';
const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent('Hello Dubai À La Carte, I would like to book an experience in Dubai.')}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Homepage Data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: 'Luxury Cars',
    subtitle: 'Economy to supercar — daily rental',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop',
    href: '/travel/car-rental',
    featured: true,
  },
  {
    title: 'Yacht Charter',
    subtitle: 'Private yacht charters and marina departures',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
    href: '/experiences/water-activities',
    featured: true,
  },
  {
    title: 'Desert Adventures',
    subtitle: 'Safari, quad bikes, dune buggies',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Water Activities',
    subtitle: 'Jet Ski, Jetcar, Flyboard',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Villa Experience',
    subtitle: 'Private pools and luxury stays',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop',
    href: '/travel/villas',
  },
  {
    title: 'Abu Dhabi Tours',
    subtitle: 'Mosque, Ferrari World, city tours',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Entertainment',
    subtitle: 'Theme parks and attractions',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Wellness & Spa',
    subtitle: 'Massage, hammam, relaxation',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Hot Air Balloon',
    subtitle: 'Sunrise flights over the desert',
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
  {
    title: 'Oman Tours',
    subtitle: 'Musandam fjords and mountain tours',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop',
    href: '/experiences',
  },
];

const EXPERIENCES = [
  { name: 'Jet Ski', tag: 'Water', image: 'https://images.unsplash.com/photo-1590664863685-a99b5f5f7555?q=80&w=600&auto=format&fit=crop' },
  { name: 'Evening Desert Safari', tag: 'Desert', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600&auto=format&fit=crop' },
  { name: 'Polaris RZR Ride', tag: 'Adventure', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600&auto=format&fit=crop' },
  { name: 'Private Villa Pool', tag: 'Leisure', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop' },
  { name: 'Sheikh Zayed Mosque', tag: 'Culture', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=600&auto=format&fit=crop' },
  { name: 'Balloon Experience', tag: 'Air', image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop' },
  { name: 'Musandam Tour', tag: 'Oman', image: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Massage & Wellness', tag: 'Wellness', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop' },
];

const STATS = [
  { value: '100+', label: 'Luxury Vehicles' },
  { value: '28+', label: 'Private Yachts' },
  { value: '50+', label: 'Curated Experiences' },
  { value: '24/7', label: 'Concierge Service' },
];

const MARQUEE_ITEMS = [
  'Luxury Cars', 'Yacht Charter', 'Desert Safari', 'Private Villa',
  'Jet Ski', 'Hot Air Balloon', 'Musandam Tour', 'Abu Dhabi Tours',
  'Water Activities', 'Wellness & Spa', 'Flyboard', 'Dune Buggy',
  'Ferrari World', 'Private Concierge', 'Supercar Rental', 'VIP Transfer',
];

const WHY_ITEMS = [
  {
    icon: Star,
    num: '01',
    title: 'Handpicked Experiences',
    desc: 'Every car, yacht, and activity is vetted for quality. No fillers, no compromises — only what we would book ourselves.',
  },
  {
    icon: Phone,
    num: '02',
    title: 'Instant WhatsApp Booking',
    desc: 'No forms, no waiting. Message us directly and receive confirmation within minutes. Fast and personal.',
  },
  {
    icon: Shield,
    num: '03',
    title: 'Personal Concierge',
    desc: 'A dedicated team manages every detail — from airport pickup to dinner reservations to last-minute changes.',
  },
] as const;

// ─── DALC palette constants (keep in sync with tailwind.config cipher namespace) ──

const C = {
  gold:       '#C9A84C',
  goldBright: '#E8CC70',
  goldDim:    '#7A6025',
  goldFaint:  '#3D2E0C',
  ink:        '#0D0B08',
  deep:       '#120F0A',
  card:       '#1E1B14',
  beige:      '#F5EDD8',
  beigeMid:   '#D4C9A8',
  beigeDim:   'rgba(212,195,150,0.30)',
  white:      'rgba(245,237,216,0.95)',
  muted:      'rgba(212,195,150,0.60)',
  dim:        'rgba(212,195,150,0.30)',
  faint:      'rgba(212,195,150,0.14)',
  rim:        'rgba(212,195,150,0.07)',
  rim2:       'rgba(212,195,150,0.12)',
  rim3:       'rgba(212,195,150,0.22)',
  goldGlow:   'rgba(201,168,76,0.12)',
  goldGlow2:  'rgba(201,168,76,0.20)',
  goldOrb:    'rgba(201,168,76,0.08)',
  textBg:     '#100800',
};

// ─── Animation helper ─────────────────────────────────────────────────────────

const fade = {
  initial:     { opacity: 0, y: 28 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport:    { once: true, margin: '-60px' } as const,
  transition:  { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomeEntry() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const handleEmailSubmit = async () => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return;

    setEmailStatus('saving');
    if (supabase) {
      const { error } = await supabase.from('requests').insert({
        category: 'travel',
        request_type: 'inquiry',
        contact_name: 'DALC Newsletter',
        contact_info: normalized,
        notes: 'source=dalc_homepage',
      });
      if (error) { setEmailStatus('error'); return; }
    } else {
      const existing = JSON.parse(localStorage.getItem('dalc_access_emails') || '[]') as string[];
      localStorage.setItem('dalc_access_emails', JSON.stringify(Array.from(new Set([...existing, normalized]))));
    }
    setEmailStatus('done');
    setEmail('');
  };

  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="min-h-screen bg-cipher-void overflow-x-hidden">

      {/* ── Ambient gold-to-beige orb — warm, not cold ── */}
      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none animate-breathe"
        style={{
          background: `radial-gradient(circle, ${C.goldOrb} 0%, rgba(212,195,150,0.04) 45%, transparent 65%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Navbar />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO                                                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop"
            alt="Dubai skyline"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        {/* Warm black gradient overlay — not cold/blue */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080706 0%, rgba(8,7,6,0.65) 50%, rgba(8,7,6,0.25) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,7,6,0.55) 0%, transparent 40%)' }} />

        <div className="relative z-10 text-center max-w-4xl px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-5 mb-10">
              <div className="h-px w-10" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: C.goldDim }}>
                Premium Concierge · Dubai
              </span>
              <div className="h-px w-10" style={{ background: C.goldDim }} />
            </div>

            {/* Headline — beige-warm white, not cold */}
            <h1
              className="font-display font-light leading-[0.88] mb-2"
              style={{ fontSize: 'clamp(72px, 13vw, 168px)', letterSpacing: '-0.02em', color: C.white }}
            >
              Dubai
            </h1>
            <h1
              className="font-display font-light italic leading-[0.88] mb-14"
              style={{ fontSize: 'clamp(54px, 10vw, 128px)', letterSpacing: '-0.01em', color: C.gold }}
            >
              À La Carte
            </h1>

            <p className="font-body font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-14" style={{ color: C.muted }}>
              Luxury travel, yacht charters, desert adventures, and VIP experiences —
              curated and delivered with precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-10 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-opacity duration-200 hover:opacity-85"
                style={{ background: C.gold, color: C.textBg }}
              >
                Explore Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 font-mono text-[11px] uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-all duration-200"
                style={{ border: `1px solid ${C.rim2}`, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.rim3; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.rim2; e.currentTarget.style.color = C.muted; }}
              >
                <Phone className="w-3.5 h-3.5" /> Book via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-5 h-8 rounded-full flex items-start justify-center p-1.5" style={{ border: `1px solid ${C.rim2}` }}>
            <div className="w-0.5 h-2 rounded-full" style={{ background: `rgba(201,168,76,0.6)` }} />
          </div>
        </motion.div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. MARQUEE — gold + beige alternating                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div
        className="overflow-hidden py-5"
        style={{ background: C.ink, borderTop: `1px solid ${C.rim}`, borderBottom: `1px solid ${C.rim}` }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-10">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.beigeMid : C.dim }}
              >
                {item}
              </span>
              <span style={{ color: C.goldDim, fontSize: '8px' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. COLLECTION                                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-36 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          <motion.div {...fade} className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                The Collection
              </span>
            </div>
            <h2
              className="font-display font-light leading-[1.0]"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', color: C.white }}
            >
              What Would You
              <br />
              <span className="italic" style={{ color: C.gold }}>Like to Experience?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={cat.featured ? 'sm:col-span-2' : ''}
              >
                <Link
                  href={cat.href}
                  className={`cipher-card group relative block overflow-hidden ${cat.featured ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
                  style={{ borderRadius: '10px', border: `1px solid ${C.rim}` }}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.2) 60%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                    <h3 className="font-display font-light" style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: C.white }}>
                      {cat.title}
                    </h3>
                    <p className="font-body font-light text-sm mt-1" style={{ color: C.muted }}>
                      {cat.subtitle}
                    </p>
                  </div>
                  <div
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{ background: 'rgba(212,195,150,0.10)', backdropFilter: 'blur(8px)' }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: C.gold }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. CURATED EXPERIENCES                                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-4 md:px-8" style={{ borderTop: `1px solid ${C.rim}` }}>
        <div className="max-w-7xl mx-auto">

          <motion.div {...fade} className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-6" style={{ background: C.goldDim }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                  Curated For You
                </span>
              </div>
              <h2 className="font-display font-light" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: C.white }}>
                Popular
                <br />
                <span className="italic" style={{ color: C.gold }}>This Season</span>
              </h2>
            </div>
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200"
              style={{ color: C.dim }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.dim; }}
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {EXPERIENCES.map((exp, i) => (
              <motion.a
                key={exp.name}
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`I want to book ${exp.name} in Dubai`)}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="cipher-card group relative block aspect-[3/4] overflow-hidden"
                style={{ borderRadius: '10px', border: `1px solid ${C.rim}` }}
              >
                <img
                  src={exp.image}
                  alt={exp.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.30) 60%, transparent 100%)' }} />
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                    style={{ color: C.gold, background: C.goldGlow, border: `1px solid rgba(201,168,76,0.25)` }}
                  >
                    {exp.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="font-display font-light text-base" style={{ color: C.white }}>{exp.name}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/explore"
              className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200"
              style={{ color: C.dim }}
            >
              View All Experiences →
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. NUMBERS — gold values, beige labels                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4"
        style={{ background: C.ink, borderTop: `1px solid ${C.rim}`, borderBottom: `1px solid ${C.rim}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p
                  className="leading-none mb-3"
                  style={{
                    fontFamily: 'var(--font-mono, DM Mono, monospace)',
                    fontSize: 'clamp(40px, 5vw, 60px)',
                    letterSpacing: '0.02em',
                    color: C.gold,
                  }}
                >
                  {stat.value}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: C.beigeMid }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 6. THE DIFFERENCE                                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-36 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fade} className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                Why Choose Us
              </span>
            </div>
            <h2
              className="font-display font-light"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', color: C.white }}
            >
              The Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHY_ITEMS.map((prop, i) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="cipher-card p-8"
                style={{ background: C.card, borderRadius: '10px', border: `1px solid ${C.rim}` }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] mb-8" style={{ color: C.goldDim }}>
                  {prop.num}
                </p>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
                  style={{ background: C.goldGlow, border: `1px solid rgba(201,168,76,0.25)` }}
                >
                  <prop.icon className="w-4 h-4" style={{ color: C.gold }} />
                </div>
                <h3
                  className="font-display font-light mb-4"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', color: C.white }}
                >
                  {prop.title}
                </h3>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: C.muted }}>
                  {prop.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 7. WHATSAPP CTA                                                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-4 md:px-8 relative overflow-hidden" style={{ borderTop: `1px solid ${C.rim}` }}>
        {/* Warm beige-gold orb right side */}
        <div
          className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.goldOrb} 0%, rgba(212,195,150,0.03) 50%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fade}>
            <div className="h-px w-12 mx-auto mb-12" style={{ background: `rgba(201,168,76,0.3)` }} />
            <h2
              className="font-display font-light leading-[0.9] mb-3"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: C.white }}
            >
              Ready to Experience
            </h2>
            <h2
              className="font-display font-light italic leading-[0.9] mb-10"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: C.gold }}
            >
              Dubai?
            </h2>
            <p className="font-body font-light text-base max-w-md mx-auto mb-14 leading-relaxed" style={{ color: C.muted }}>
              Tell us what you need. Our concierge team handles everything —
              from your first message to your last ride.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-[#25D366] hover:opacity-90 text-white font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-200 flex items-center justify-center gap-2.5"
              >
                <WhatsAppIcon className="w-4 h-4" /> Message on WhatsApp
              </a>
              <Link
                href="/request"
                className="w-full sm:w-auto px-10 py-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200"
                style={{ border: `1px solid ${C.rim2}`, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.rim3; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.rim2; e.currentTarget.style.color = C.muted; }}
              >
                Submit a Request
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 8. NEWSLETTER                                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 md:px-8"
        style={{ background: C.ink, borderTop: `1px solid ${C.rim}` }}
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.div {...fade}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-6" style={{ background: C.goldDim }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: C.goldDim }}>
                Stay Updated
              </span>
              <div className="h-px w-6" style={{ background: C.goldDim }} />
            </div>
            <h2
              className="font-display font-light mb-3"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.white }}
            >
              Get Exclusive Access
            </h2>
            <p className="font-body font-light text-sm mb-10" style={{ color: C.dim }}>
              Receive curated offers and new experiences before anyone else.
            </p>

            {emailStatus === 'done' ? (
              <p className="font-mono text-sm tracking-wider" style={{ color: C.gold }}>You're on the list.</p>
            ) : (
              <div className="flex gap-2" suppressHydrationWarning>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="flex-1 min-w-0 px-5 py-4 font-body font-light text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(212,195,150,0.03)',
                    border: `1px solid ${C.rim2}`,
                    borderRadius: '3px',
                    color: C.white,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.07)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.rim2; e.currentTarget.style.boxShadow = 'none'; }}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={emailStatus === 'saving' || !email.trim()}
                  className="px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ background: C.gold, color: C.textBg, borderRadius: '3px' }}
                >
                  {emailStatus === 'saving' ? 'Sending...' : 'Join'}
                </button>
              </div>
            )}
            {emailStatus === 'error' && (
              <p className="mt-3 font-mono text-[11px] tracking-wider" style={{ color: 'rgba(224,85,85,0.8)' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 9. SEO CONTENT                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8" style={{ borderTop: `1px solid ${C.rim}` }}>
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade}>
            <h2
              className="font-display font-light mb-8"
              style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: C.white }}
            >
              Premium Concierge Services in Dubai
            </h2>
            <div className="space-y-5 text-sm leading-relaxed font-body font-light" style={{ color: C.dim }}>
              <p>
                Dubai À La Carte is a premium concierge platform offering luxury car rentals, private yacht charters,
                desert safari experiences, water activities, villa stays, Abu Dhabi tours, and wellness services across
                the UAE.
              </p>
              <p>
                Our fleet includes over 100 vehicles from economy to supercar, 28+ private yachts ranging from compact
                day cruisers to mega yachts, and a curated selection of desert adventures including Polaris RZR rides,
                Yamaha Raptor 700 and Grizzly 700 quad biking, Maverick R and Maverick X3 dune buggies, and morning and
                evening desert safaris with private guides.
              </p>
              <p>
                Water activities include Jet Ski, Jetcar, Yamaha VX Deluxe, Yamaha JetBlaster, Yamaha GP HO, Yamaha
                FX SVHO, and Flyboard experiences along the Dubai Marina and Palm Jumeirah coastline.
              </p>
              <p>
                We also arrange private villa pool access, Sheikh Zayed Mosque tours, Abu Dhabi city tours, Ferrari
                World visits, hot air balloon flights over the desert, Musandam Oman tours, and luxury massage and
                wellness treatments — all available for instant booking via WhatsApp with 24/7 concierge support.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
