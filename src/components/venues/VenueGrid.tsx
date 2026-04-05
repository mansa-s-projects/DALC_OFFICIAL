'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import VenueCard from './VenueCard';
import type { VenueItem } from '@/data/venues/venuesData';

// ─── Animation Variants ───────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface VenueGridProps {
  venues: (VenueItem & { categoryId: string })[];
  animationKey: string;
  onVenueClick?: (venue: VenueItem & { categoryId: string }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VenueGrid({ venues, animationKey, onVenueClick }: VenueGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {venues.length === 0 ? (
          /* ── Empty State ──────────────────────────────────── */
          <div className="text-center py-28 border border-white/5 rounded-2xl">
            <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
            <p className="font-display text-2xl text-white mb-2">Nothing matches</p>
            <p className="text-gray-600 text-sm font-light">
              Adjust your filters or search to explore more.
            </p>
          </div>
        ) : (
          /* ── Grid ──────────────────────────────────────────── */
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                categoryId={venue.categoryId}
                onClick={() => onVenueClick?.(venue)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
