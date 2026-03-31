'use client';

import React from 'react';
import { motion } from 'motion/react';
import { VENUE_CATEGORIES } from '@/data/venuesData';
import type { CategoryTabId } from './CategoryTabs';

// ─── Hero Images ──────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', alt: 'Fine dining ambiance' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', alt: 'Beach club sunset' },
  { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', alt: 'Dubai nightlife' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface VenueHeroProps {
  onCategorySelect: (id: CategoryTabId) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VenueHero({ onCategorySelect }: VenueHeroProps) {
  const handleCategoryClick = (catId: string) => {
    onCategorySelect(catId as CategoryTabId);
    document.getElementById('venues-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
      {/* ── Background Collage — 3 panels ─────────────────────── */}
      <div className="absolute inset-0 grid grid-cols-3">
        {HERO_IMAGES.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover scale-105"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* ── Gradient Overlays ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/70 to-luxury-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 via-transparent to-transparent" />

      {/* ── Gold Accent Lines ─────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-luxury-gold/0 via-luxury-gold/40 to-luxury-gold/0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-luxury-gold/0 via-luxury-gold/30 to-luxury-gold/0" />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-luxury-gold/50" />
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.5em]">
              The Concierge Collection
            </p>
            <div className="h-px w-8 bg-luxury-gold/50" />
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display text-white font-medium leading-[0.95] mb-6">
            Dubai À La Carte
            <span className="block text-luxury-gold mt-1">Venues</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Hand-selected restaurants, beach clubs, nightlife, and entertainment
            — curated for the discerning few.
          </p>
        </motion.div>

        {/* ── Category Pills ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mt-10 flex-wrap"
        >
          {VENUE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group/pill flex items-center gap-2 bg-white/5 hover:bg-luxury-gold/10 backdrop-blur-sm border border-white/10 hover:border-luxury-gold/30 rounded-full px-4 py-2 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/pill:text-luxury-gold transition-colors">
                {cat.title}
              </span>
              <span className="text-[9px] font-medium tabular-nums text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-full">
                {cat.items.length}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll Indicator ──────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-luxury-gold/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
