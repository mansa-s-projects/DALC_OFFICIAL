'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRICE_RANGES, FUEL_TYPES } from '@/data/carsData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarFiltersProps {
  totalCount: number;
  searchQuery: string;
  activePrice: string;
  onPriceChange: (id: string) => void;
  activeFuel: string;
  onFuelChange: (fuel: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CarFilters({
  totalCount,
  searchQuery,
  activePrice,
  onPriceChange,
  activeFuel,
  onFuelChange,
}: CarFiltersProps) {
  const [showPanel, setShowPanel] = React.useState(false);

  const hasActive = activePrice !== 'all' || activeFuel !== 'All';
  const activeCount = (activePrice !== 'all' ? 1 : 0) + (activeFuel !== 'All' ? 1 : 0);

  const clearAll = () => {
    onPriceChange('all');
    onFuelChange('All');
  };

  return (
    <>
      {/* ── Header row ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-medium">
          {searchQuery ? (
            <>
              <span className="text-gray-400 font-semibold tabular-nums">{totalCount}</span>
              {' '}results for{' '}
              <span className="text-gray-400 italic">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : (
            <>
              <span className="text-gray-400 font-semibold tabular-nums">{totalCount}</span>
              {' '}vehicles
            </>
          )}
        </p>

        <div className="flex items-center gap-4">
          {hasActive && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-luxury-gold transition-colors duration-200"
            >
              <X className="w-2.5 h-2.5" />
              Clear
            </button>
          )}

          <button
            onClick={() => setShowPanel((p) => !p)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-widest border rounded-lg transition-all duration-300',
              showPanel || hasActive
                ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40'
                : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20 hover:text-white'
            )}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Filters
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-luxury-gold text-black flex items-center justify-center text-[8px] font-black tabular-nums">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Filter Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mb-10"
          >
            <div className="bg-white/[0.02] border border-white/8 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Price Range */}
              <div>
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onPriceChange(r.id)}
                      className={cn(
                        'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-full transition-all duration-200',
                        activePrice === r.id
                          ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                          : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">
                  Fuel Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {FUEL_TYPES.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => onFuelChange(fuel)}
                      className={cn(
                        'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-full transition-all duration-200',
                        activeFuel === fuel
                          ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                          : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                      )}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
