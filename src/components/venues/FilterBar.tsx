'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCATIONS, PRICE_FILTERS, VIBE_FILTERS } from '@/data/venuesData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  totalCount: number;
  searchQuery: string;
  // Location
  activeLocation: string;
  onLocationChange: (loc: string) => void;
  // Price
  activePrice: string;
  onPriceChange: (price: string) => void;
  // Vibe
  activeVibe: string;
  onVibeChange: (vibe: string) => void;
  // Mobile view toggle
  mobileView?: 'grid' | 'map';
  onMobileViewChange?: (view: 'grid' | 'map') => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilterBar({
  totalCount,
  searchQuery,
  activeLocation,
  onLocationChange,
  activePrice,
  onPriceChange,
  activeVibe,
  onVibeChange,
  mobileView,
  onMobileViewChange,
}: FilterBarProps) {
  const [showPanel, setShowPanel] = React.useState(false);

  const hasActiveFilters =
    activeLocation !== 'All Areas' || activePrice !== 'All' || activeVibe !== 'all';

  const activeFilterCount =
    (activeLocation !== 'All Areas' ? 1 : 0) +
    (activePrice !== 'All' ? 1 : 0) +
    (activeVibe !== 'all' ? 1 : 0);

  const clearAll = () => {
    onLocationChange('All Areas');
    onPriceChange('All');
    onVibeChange('all');
  };

  return (
    <>
      {/* ── Counts + Refine Toggle ───────────────────────────────── */}
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
              {' '}venues
            </>
          )}
        </p>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
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
              showPanel || hasActiveFilters
                ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40'
                : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20 hover:text-white'
            )}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Refine
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-luxury-gold text-black flex items-center justify-center text-[8px] font-black tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile view toggle */}
          {mobileView && onMobileViewChange && (
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => onMobileViewChange('grid')}
                className={cn(
                  'p-2 rounded-lg border transition-all duration-200',
                  mobileView === 'grid'
                    ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40'
                    : 'bg-transparent text-gray-600 border-white/10'
                )}
                aria-label="Show grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMobileViewChange('map')}
                className={cn(
                  'p-2 rounded-lg border transition-all duration-200',
                  mobileView === 'map'
                    ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40'
                    : 'bg-transparent text-gray-600 border-white/10'
                )}
                aria-label="Show map"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Filter Panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mb-10"
          >
            <div className="bg-white/[0.02] border border-white/8 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Location */}
              <div>
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">
                  Location
                </p>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => onLocationChange(loc)}
                      className={cn(
                        'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-full transition-all duration-200',
                        activeLocation === loc
                          ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                          : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_FILTERS.map((price) => (
                    <button
                      key={price}
                      onClick={() => onPriceChange(price)}
                      className={cn(
                        'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-full transition-all duration-200',
                        activePrice === price
                          ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                          : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                      )}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div>
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">
                  Vibe
                </p>
                <div className="flex flex-wrap gap-2">
                  {VIBE_FILTERS.map((vf) => (
                    <button
                      key={vf.id}
                      onClick={() => onVibeChange(vf.id)}
                      className={cn(
                        'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-full transition-all duration-200',
                        activeVibe === vf.id
                          ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                          : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                      )}
                    >
                      {vf.label}
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
