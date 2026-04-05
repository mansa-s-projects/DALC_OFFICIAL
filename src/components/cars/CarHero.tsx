'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CAR_CATEGORIES } from '@/data/transport/carsData';
import type { CarTabId } from './CarTabs';

// ─── Component ────────────────────────────────────────────────────────────────

interface CarHeroProps {
  onCategorySelect: (id: CarTabId) => void;
}

export default function CarHero({ onCategorySelect }: CarHeroProps) {
  const handleClick = (catId: string) => {
    onCategorySelect(catId as CarTabId);
    document.getElementById('car-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[60vh] min-h-[460px] flex items-center justify-center overflow-hidden">
      {/* ── Background ────────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury car on Dubai highway"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/65 to-luxury-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 via-transparent to-transparent" />

      {/* Gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-luxury-gold/0 via-luxury-gold/40 to-luxury-gold/0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 bg-gradient-to-t from-luxury-gold/0 via-luxury-gold/30 to-luxury-gold/0" />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-luxury-gold/50" />
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.5em]">
              Dubai À La Carte
            </p>
            <div className="h-px w-8 bg-luxury-gold/50" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display text-white font-medium leading-[0.95] mb-5">
            Car Rental
            <span className="block text-luxury-gold mt-1">in Dubai</span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg font-light tracking-wide max-w-lg mx-auto leading-relaxed">
            Browse available vehicles for daily rental. From economy to supercar — delivered to your door.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2.5 mt-9 flex-wrap"
        >
          {CAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="group/pill flex items-center gap-2 bg-white/5 hover:bg-luxury-gold/10 backdrop-blur-sm border border-white/10 hover:border-luxury-gold/30 rounded-full px-3.5 py-1.5 transition-all duration-300"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover/pill:text-luxury-gold transition-colors">
                {cat.title}
              </span>
              <span className="text-[8px] font-medium tabular-nums text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-full">
                {cat.items.length}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
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
