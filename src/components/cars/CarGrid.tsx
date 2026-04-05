'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CarCard from './CarCard';
import type { CarItem } from '@/data/transport/carsData';

// ─── Animation ────────────────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface CarGridProps {
  cars: (CarItem & { categoryId: string })[];
  animationKey: string;
}

export default function CarGrid({ cars, animationKey }: CarGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {cars.length === 0 ? (
          <div className="text-center py-28 border border-white/5 rounded-2xl">
            <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
            <p className="font-display text-2xl text-white mb-2">No vehicles found</p>
            <p className="text-gray-600 text-sm font-light">
              Adjust your filters or search to browse more options.
            </p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {cars.map((car) => (
              <CarCard key={car.id} car={car} categoryId={car.categoryId} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
