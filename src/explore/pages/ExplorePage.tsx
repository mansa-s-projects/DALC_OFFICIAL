import { useState, useCallback } from 'react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import ExploreHero from '../components/ExploreHero';
import CollectionStrip from '../components/CollectionStrip';
import ExploreFilters from '../components/ExploreFilters';
import ExploreGrid from '../components/ExploreGrid';
import ExploreMap from '../components/ExploreMap';
import LocationDrawer from '../components/LocationDrawer';
import { useExploreLocations } from '../hooks/useExploreLocations';
import { useFilteredLocations } from '../hooks/useFilteredLocations';
import type { ExploreFilterState, ExploreLocation } from '../types';
import { DEFAULT_FILTERS } from '../types';

type MobileView = 'grid' | 'map';

export default function ExplorePage() {
  const [filters, setFilters] = useState<ExploreFilterState>(DEFAULT_FILTERS);
  const [selectedLocation, setSelectedLocation] = useState<ExploreLocation | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('grid');

  const { data, isLoading, isError } = useExploreLocations();
  const filteredLocations = useFilteredLocations(data, filters);

  const hasActiveFilters =
    filters.emirate !== 'All Emirates' ||
    filters.category !== 'All Categories' ||
    filters.hiddenGems !== 'all' ||
    filters.search.trim() !== '';

  const handleLocationSelect = useCallback((loc: ExploreLocation) => {
    setSelectedLocation(loc);
  }, []);

  const handleCollectionSelect = useCallback((patch: Partial<ExploreFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0C]">
      <Navbar />

      <ExploreHero />

      <CollectionStrip onCollectionSelect={handleCollectionSelect} />

      {/* ── Filters (anchor for "Start Exploring" CTA) ────────────────── */}
      <div id="explore-filters">
        <ExploreFilters
          filters={filters}
          onChange={setFilters}
          totalCount={data?.length ?? 0}
          filteredCount={filteredLocations.length}
          mobileView={mobileView}
          onMobileViewChange={setMobileView}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 sm:px-6 py-6">
        <div className="flex gap-5">

          {/* ─ Grid panel (left) ─────────────────────────────────────────── */}
          <div
            className={cn(
              'min-w-0 w-full lg:w-[56%]',
              mobileView === 'map' ? 'hidden lg:block' : 'block',
            )}
          >
            <ExploreGrid
              locations={filteredLocations}
              isLoading={isLoading}
              isError={isError}
              noClient={!supabase}
              hasActiveFilters={hasActiveFilters}
              onLocationSelect={handleLocationSelect}
            />

            {/* Footer below grid on desktop */}
            <div className="mt-16 hidden lg:block">
              <Footer />
            </div>
          </div>

          {/* ─ Map panel (right, anchor for "View Map" CTA) ──────────────── */}
          <div
            id="explore-map"
            className={cn(
              'min-w-0 flex-1 lg:flex-none lg:w-[44%]',
              mobileView === 'grid' ? 'hidden lg:block' : 'block',
            )}
          >
            {/* Sticky map: top = navbar (68px) + filter bar (~54px) + 4px gap */}
            <div className="h-[calc(100svh-130px)] lg:sticky lg:top-[126px] lg:h-[calc(100vh-142px)] min-h-[420px]">
              <ExploreMap
                locations={filteredLocations}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>

        {/* Footer on mobile (below map or grid depending on view) */}
        <div className="mt-12 lg:hidden">
          <Footer />
        </div>
      </main>

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <LocationDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}
