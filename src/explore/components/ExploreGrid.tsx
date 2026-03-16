import { motion } from 'framer-motion';
import { MapPin, AlertCircle, WifiOff } from 'lucide-react';
import LocationCard from './LocationCard';
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
    <div className="grid gap-6 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-2xl border border-[rgba(200,164,107,0.1)] bg-[#111214]"
        />
      ))}
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
          ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 sm:grid-cols-2"
    >
      {locations.map((loc, i) => (
        <LocationCard
          key={loc.id}
          location={loc}
          index={i}
          onClick={onLocationSelect}
        />
      ))}
    </motion.div>
  );
}
