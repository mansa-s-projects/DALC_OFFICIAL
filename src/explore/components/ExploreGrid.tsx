'use client';

import { motion } from 'motion/react';
import { MapPin, AlertCircle, WifiOff, Star, Sparkles } from 'lucide-react';
import LocationCard from './LocationCard';
import FeaturedLocationCard from './FeaturedLocationCard';
import type { ExploreLocation } from '../types';

interface ExploreGridProps {
  locations: ExploreLocation[];
  isLoading: boolean;
  isError: boolean;
  noClient: boolean;
  hasActiveFilters: boolean;
  onLocationSelect: (location: ExploreLocation) => void;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function GridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Featured skeleton */}
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`featured-${i}`}
            className="h-[320px] animate-pulse rounded-2xl border border-[rgba(200,164,107,0.15)] bg-gradient-to-br from-[#111214] via-[#111214] to-[#0d0d0f]"
          >
            <div className="h-[180px] rounded-t-2xl bg-[#1a1a1e]" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 rounded bg-[#1a1a1e]" />
              <div className="h-3 w-full rounded bg-[#1a1a1e]" />
              <div className="h-3 w-2/3 rounded bg-[#1a1a1e]" />
            </div>
          </div>
        ))}
      </div>
      {/* Regular grid skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-2xl border border-[rgba(200,164,107,0.1)] bg-[#111214]"
          >
            <div className="h-[140px] rounded-t-2xl bg-[#1a1a1e]" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-[#1a1a1e]" />
              <div className="h-3 w-full rounded bg-[#1a1a1e]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(200,164,107,0.2)] bg-[rgba(200,164,107,0.06)]">
        <MapPin className="h-6 w-6 text-[#C8A46B]/60" />
      </div>
      <p className="font-display text-xl text-white">
        {hasFilters ? 'No locations match' : 'No locations yet'}
      </p>
      <p className="mt-2 max-w-xs text-sm text-[#B6B6B6]/60">
        {hasFilters
          ? 'Try adjusting your filters to explore more of the UAE.'
          : 'Locations will appear here once they are added.'}
      </p>
    </motion.div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorBlock({ noClient }: { noClient?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5">
        {noClient ? (
          <WifiOff className="h-6 w-6 text-red-400/60" />
        ) : (
          <AlertCircle className="h-6 w-6 text-red-400/60" />
        )}
      </div>
      <p className="font-display text-xl text-white">
        {noClient ? 'No connection' : 'Failed to load'}
      </p>
      <p className="mt-2 max-w-xs text-sm text-[#B6B6B6]/60">
        {noClient
          ? 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
          : 'There was a problem loading locations. Please try again.'}
      </p>
    </motion.div>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
export default function ExploreGrid({
  locations,
  isLoading,
  isError,
  noClient,
  hasActiveFilters,
  onLocationSelect,
}: ExploreGridProps) {
  if (noClient) return <ErrorBlock noClient />;
  if (isLoading) return <GridSkeleton />;
  if (isError) return <ErrorBlock />;
  if (locations.length === 0) return <EmptyState hasFilters={hasActiveFilters} />;

  const featuredLocations = locations.filter((loc) => loc.is_featured);
  const regularLocations = locations.filter((loc) => !loc.is_featured);
  const hiddenGems = regularLocations.filter((loc) => loc.is_hidden_gem);
  const standardLocations = regularLocations.filter((loc) => !loc.is_hidden_gem);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      {/* Featured Locations */}
      {featuredLocations.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Star className="h-4 w-4 fill-[#C8A46B] text-[#C8A46B]" />
            <h2 className="font-display text-lg font-medium tracking-wide text-white">
              Featured Locations
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredLocations.slice(0, 4).map((loc, i) => (
              <FeaturedLocationCard
                key={loc.id}
                location={loc}
                index={i}
                onClick={onLocationSelect}
              />
            ))}
          </div>
        </section>
      )}

      {/* Hidden Gems */}
      {hiddenGems.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#C8A46B]" />
            <h2 className="font-display text-lg font-medium tracking-wide text-white">
              Hidden Gems
            </h2>
            <span className="ml-auto text-xs text-[#B6B6B6]/50">{hiddenGems.length} locations</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hiddenGems.map((loc, i) => (
              <LocationCard
                key={loc.id}
                location={loc}
                index={i}
                onClick={onLocationSelect}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Locations */}
      {standardLocations.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#C8A46B]/60" />
            <h2 className="font-display text-lg font-medium tracking-wide text-white">
              {featuredLocations.length > 0 || hiddenGems.length > 0 ? 'More Places' : 'All Places'}
            </h2>
            <span className="ml-auto text-xs text-[#B6B6B6]/50">{standardLocations.length} locations</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {standardLocations.map((loc, i) => (
              <LocationCard
                key={loc.id}
                location={loc}
                index={i}
                onClick={onLocationSelect}
              />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
