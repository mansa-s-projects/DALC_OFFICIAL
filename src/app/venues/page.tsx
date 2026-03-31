'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import VenueHero from '../../components/venues/VenueHero';
import CategoryTabs, { type CategoryTabId } from '../../components/venues/CategoryTabs';
import FilterBar from '../../components/venues/FilterBar';
import VenueGrid from '../../components/venues/VenueGrid';
import VenuesMap from '../../components/venues/VenuesMap';
import {
  VENUE_CATEGORIES,
  getAllVenues,
  locationMatches,
  vibeMatches,
} from '../../data/venuesData';
import { cn } from '../../lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_VISIBLE = 12;

type MobileView = 'grid' | 'map';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenuesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryTabId>('all');
  const [activeLocation, setActiveLocation] = useState('All Areas');
  const [activePrice, setActivePrice] = useState('All');
  const [activeVibe, setActiveVibe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [mobileView, setMobileView] = useState<MobileView>('grid');
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>();

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory, activeLocation, activePrice, activeVibe, searchQuery]);

  // Clear search on category switch
  useEffect(() => {
    setSearchQuery('');
  }, [activeCategory]);

  // ── All venues flat ──────────────────────────────────────────
  const allVenues = useMemo(() => getAllVenues(), []);

  // ── Category tabs with counts ────────────────────────────────
  const tabs = useMemo(
    () => [
      { id: 'all' as CategoryTabId, label: 'All Venues', count: allVenues.length },
      ...VENUE_CATEGORIES.map((c) => ({
        id: c.id as CategoryTabId,
        label: c.title,
        count: c.items.length,
      })),
    ],
    [allVenues]
  );

  // ── Filtered venues ──────────────────────────────────────────
  const filteredVenues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allVenues.filter((v) => {
      if (activeCategory !== 'all' && v.categoryId !== activeCategory) return false;
      if (!locationMatches(v.location, activeLocation)) return false;
      if (activePrice !== 'All' && v.priceRange !== activePrice) return false;
      if (!vibeMatches(v, activeVibe)) return false;
      if (q && !v.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allVenues, activeCategory, activeLocation, activePrice, activeVibe, searchQuery]);

  const visibleVenues = filteredVenues.slice(0, visibleCount);
  const remaining = filteredVenues.length - visibleCount;
  const hasMore = remaining > 0;

  const handleVenueSelect = (venue: typeof filteredVenues[0]) => {
    setSelectedVenueId(venue.id);
    // On mobile, switch to map view when a venue is selected
    if (window.innerWidth < 1024) {
      setMobileView('map');
    }
    // Scroll to map on desktop
    const mapEl = document.getElementById('venues-map');
    if (mapEl && window.innerWidth >= 1024) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <VenueHero onCategorySelect={setActiveCategory} />

      {/* ── Venues Section ─────────────────────────────────────── */}
      <section className="bg-luxury-black py-20 scroll-mt-16" id="venues-grid">
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
              placeholder="Search venues by name…"
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

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-10"
          >
            <CategoryTabs
              tabs={tabs}
              activeTab={activeCategory}
              onChange={setActiveCategory}
            />
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FilterBar
              totalCount={filteredVenues.length}
              searchQuery={searchQuery}
              activeLocation={activeLocation}
              onLocationChange={setActiveLocation}
              activePrice={activePrice}
              onPriceChange={setActivePrice}
              activeVibe={activeVibe}
              onVibeChange={setActiveVibe}
              mobileView={mobileView}
              onMobileViewChange={setMobileView}
            />
          </motion.div>

          {/* ── Main Content: Grid + Map ───────────────────────── */}
          <div className="flex gap-5 mt-8">
            {/* ─ Grid panel (left) ─────────────────────────────── */}
            <div
              className={cn(
                'min-w-0 w-full lg:w-[56%]',
                mobileView === 'map' ? 'hidden lg:block' : 'block',
              )}
            >
              <VenueGrid
                venues={visibleVenues}
                animationKey={`${activeCategory}|${activeLocation}|${activePrice}|${activeVibe}|${searchQuery}`}
                onVenueClick={handleVenueSelect}
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
                    Explore More
                    <span className="text-gray-700 font-normal ml-2 normal-case tracking-normal">
                      · {remaining} more
                    </span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* ─ Map panel (right) ─────────────────────────────── */}
            <div
              id="venues-map"
              className={cn(
                'min-w-0 flex-1 lg:flex-none lg:w-[44%]',
                mobileView === 'grid' ? 'hidden lg:block' : 'block',
              )}
            >
              {/* Sticky map: top = navbar (68px) + filter bar (~54px) + 4px gap */}
              <div className="h-[calc(100svh-130px)] lg:sticky lg:top-[126px] lg:h-[calc(100vh-142px)] min-h-[420px]">
                <VenuesMap
                  venues={filteredVenues}
                  onVenueSelect={handleVenueSelect}
                  selectedVenueId={selectedVenueId}
                />
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          {filteredVenues.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-center mt-20"
            >
              <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
              <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-5 font-medium">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <a
                href={`https://wa.me/971585987600?text=${encodeURIComponent('I need help finding a venue in Dubai')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-transparent hover:bg-luxury-gold hover:text-black border border-white/15 hover:border-luxury-gold text-white font-bold uppercase text-[10px] tracking-widest transition-all duration-300 rounded-lg"
              >
                Speak with a Concierge
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
