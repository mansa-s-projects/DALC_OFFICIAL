import { AnimatePresence, motion } from 'motion/react';
import { X, MapPin, ExternalLink, Gem, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { ExploreLocation } from '../types';

interface LocationDrawerProps {
  location: ExploreLocation | null;
  onClose: () => void;
}

export default function LocationDrawer({ location, onClose }: LocationDrawerProps) {
  const mapsUrl = location
    ? `https://www.google.com/maps?q=${encodeURIComponent(location.latitude)},${encodeURIComponent(location.longitude)}`
    : '#';

  const mapsDirectionsUrl = location
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.latitude)},${encodeURIComponent(location.longitude)}`
    : '#';

  return (
    <AnimatePresence>
      {location && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.9 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[rgba(200,164,107,0.18)] bg-[#111214] shadow-[-32px_0_80px_rgba(0,0,0,0.7)]"
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${location.name}`}
          >
            {/* Subtle top glow */}
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-[rgba(200,164,107,0.04)] to-transparent" />

            {/* Header */}
            <div className="relative flex items-start justify-between border-b border-[rgba(200,164,107,0.12)] p-6">
              <div className="flex-1 pr-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#C8A46B]">
                  {location.emirate ?? 'UAE Location'}
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight text-white">
                  {location.name}
                </h2>
                {location.category && (
                  <span className="mt-2 inline-block rounded-md border border-white/8 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#B6B6B6]/70">
                    {location.category}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(200,164,107,0.2)] text-[#B6B6B6] transition-all duration-200 hover:border-[rgba(200,164,107,0.55)] hover:bg-[rgba(200,164,107,0.07)] hover:text-white"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
              {/* Hidden gem badge */}
              {location.is_hidden_gem && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2.5 rounded-xl border border-[rgba(200,164,107,0.28)] bg-[rgba(200,164,107,0.06)] px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(200,164,107,0.15)]">
                    <Gem className="h-3.5 w-3.5 text-[#C8A46B]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#C8A46B]">Hidden Gem</p>
                    <p className="text-[11px] text-[#B6B6B6]/60">Off the beaten path</p>
                  </div>
                </motion.div>
              )}

              {/* Description */}
              {location.short_description && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[#B6B6B6]/55">
                    About
                  </p>
                  <p className="leading-relaxed text-[#B6B6B6]">{location.short_description}</p>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-[rgba(200,164,107,0.1)]" />

              {/* Coordinates */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[#B6B6B6]/55">
                  Coordinates
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-[rgba(200,164,107,0.15)] bg-[#0B0B0C] px-4 py-3">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-[#C8A46B]" />
                  <span className="font-mono text-sm tabular-nums text-[#B6B6B6]">
                    {location.latitude.toFixed(6)},&nbsp;{location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Added date */}
              <div className="flex items-center gap-2 text-xs text-[#B6B6B6]/40">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Added {format(new Date(location.created_at), 'MMMM d, yyyy')}
                </span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* CTA buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[rgba(200,164,107,0.35)] bg-[rgba(200,164,107,0.09)] px-6 py-3.5 text-sm font-semibold text-[#C8A46B] transition-all duration-300 hover:border-[rgba(200,164,107,0.6)] hover:bg-[rgba(200,164,107,0.15)] hover:shadow-[0_0_24px_rgba(200,164,107,0.14)]"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>

                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#B6B6B6] transition-all duration-200 hover:border-white/15 hover:text-white"
                >
                  Get Directions
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
