'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import Footer from '../../components/navigation/Footer';
import CarHero from '../../components/cars/CarHero';
import CarTabs, { type CarTabId } from '../../components/cars/CarTabs';
import CarFilters from '../../components/cars/CarFilters';
import CarGrid from '../../components/cars/CarGrid';
import {
  CAR_CATEGORIES,
  getAllCars,
  priceInRange,
} from '../../data/transport/carsData';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 12;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarRentalPage() {
  const [activeTab, setActiveTab] = useState<CarTabId>('all');
  const [activePrice, setActivePrice] = useState('all');
  const [activeFuel, setActiveFuel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeTab, activePrice, activeFuel, searchQuery]);

  // Clear search on tab switch
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  // ── All cars flat ──────────────────────────────────────────
  const allCars = useMemo(() => getAllCars(), []);

  // ── Tabs with counts ───────────────────────────────────────
  const tabs = useMemo(
    () => [
      { id: 'all' as CarTabId, label: 'All Cars', count: allCars.length },
      ...CAR_CATEGORIES.map((c) => ({
        id: c.id as CarTabId,
        label: c.title,
        count: c.items.length,
      })),
    ],
    [allCars]
  );

  // ── Filtered cars ──────────────────────────────────────────
  const filteredCars = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allCars.filter((c) => {
      if (activeTab !== 'all' && c.categoryId !== activeTab) return false;
      if (!priceInRange(c.dailyPrice, activePrice)) return false;
      if (activeFuel !== 'All' && c.fuel !== activeFuel) return false;
      if (q) {
        const haystack = `${c.brand} ${c.model}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allCars, activeTab, activePrice, activeFuel, searchQuery]);

  const visibleCars = filteredCars.slice(0, visibleCount);
  const remaining = filteredCars.length - visibleCount;
  const hasMore = remaining > 0;

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ── Hero ───────────────────────────────────────────── */}
      <CarHero onCategorySelect={setActiveTab} />

      {/* ── Cars Section ───────────────────────────────────── */}
      <section className="bg-luxury-black py-20 scroll-mt-16" id="car-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mb-10"
          >
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand or model…"
              className="w-full bg-transparent border-b border-white/10 focus:border-luxury-gold/40 pl-7 pb-3 text-white text-sm font-light placeholder:text-gray-600 outline-none transition-colors duration-300 caret-luxury-gold"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pb-3"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-10"
          >
            <CarTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CarFilters
              totalCount={filteredCars.length}
              searchQuery={searchQuery}
              activePrice={activePrice}
              onPriceChange={setActivePrice}
              activeFuel={activeFuel}
              onFuelChange={setActiveFuel}
            />
          </motion.div>

          {/* Grid */}
          <CarGrid
            cars={visibleCars}
            animationKey={`${activeTab}|${activePrice}|${activeFuel}|${searchQuery}`}
          />

          {/* Load More */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <div className="h-px w-10 bg-white/8 mx-auto mb-6" />
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="px-10 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-gray-500 hover:text-white font-bold uppercase text-[9px] tracking-widest transition-all duration-300 rounded-lg"
              >
                Show More
                <span className="text-gray-700 font-normal ml-2 normal-case tracking-normal">
                  · {remaining} more
                </span>
              </button>
            </motion.div>
          )}

          {/* Footer CTA */}
          {filteredCars.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-center mt-20"
            >
              <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
              <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-5 font-medium">
                Need a custom rental package?
              </p>
              <a
                href={`https://wa.me/971585987600?text=${encodeURIComponent('I need a custom car rental package in Dubai')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-transparent hover:bg-luxury-gold hover:text-black border border-white/15 hover:border-luxury-gold text-white font-bold uppercase text-[10px] tracking-widest transition-all duration-300 rounded-lg"
              >
                Contact Concierge
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

