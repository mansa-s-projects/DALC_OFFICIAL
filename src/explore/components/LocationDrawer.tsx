'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  X, MapPin, ExternalLink, Gem, Calendar, Star, Clock,
  DollarSign, Sparkles, ChevronRight, Navigation, Share2,
  ChevronLeft, ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import type { ExploreLocation } from '../types';

interface LocationDrawerProps {
  location: ExploreLocation | null;
  onClose: () => void;
}

function PriceTierIndicator({ tier }: { tier: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <DollarSign
          key={i}
          className={`h-3.5 w-3.5 ${i <= tier ? 'text-cipher-gold' : 'text-cipher-faint'}`}
        />
      ))}
    </div>
  );
}

function GalleryCarousel({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${name} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-cipher-deep/60 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 transition-all hover:bg-black/70 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 transition-all hover:bg-black/70 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-4 bg-cipher-gold'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-1">
        <ImageIcon className="h-3 w-3 text-white/70" />
        <span className="text-[10px] text-white/70">{currentIndex + 1}/{images.length}</span>
      </div>
    </div>
  );
}

export default function LocationDrawer({ location, onClose }: LocationDrawerProps) {
  const mapsUrl = location
    ? `https://www.google.com/maps?q=${encodeURIComponent(location.latitude)},${encodeURIComponent(location.longitude)}`
    : '#';

  const mapsDirectionsUrl = location
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.latitude)},${encodeURIComponent(location.longitude)}`
    : '#';

  const allImages = location ? [
    ...(location.hero_image ? [location.hero_image] : []),
    ...(location.gallery_images || [])
  ].filter(Boolean) : [];

  const handleShare = useCallback(async () => {
    if (!location) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: location.name,
          text: location.short_description || `Discover ${location.name} in ${location.emirate}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      console.error('Share failed:', err);
      toast.error('Unable to share link');
    }
  }, [location]);

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
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-cipher-rim3 bg-cipher-deep shadow-[-32px_0_80px_rgba(0,0,0,0.7)]"
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${location.name}`}
          >
            {/* Subtle top glow */}
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-cipher-gold/4 to-transparent" />

            {/* Hero Image or Placeholder */}
            <div className="relative">
              {allImages.length > 0 ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={allImages[0]}
                    alt={location.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cipher-deep via-cipher-deep/30 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    {location.is_featured && (
                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cipher-gold to-cipher-gold-bright px-3 py-1.5 shadow-lg">
                        <Star className="h-3 w-3 fill-cipher-void text-cipher-void" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-cipher-void">Featured</span>
                      </div>
                    )}
                    {location.category && (
                      <span className="ml-auto rounded-md border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90">
                        {location.category}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-cipher-surface via-cipher-card to-cipher-deep">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full border border-cipher-rim2 bg-cipher-gold/5 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-cipher-gold/30" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cipher-deep via-transparent to-transparent" />
                </div>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white/80 transition-all duration-200 hover:bg-black/70 hover:text-white"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-16 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white/80 transition-all duration-200 hover:bg-black/70 hover:text-white"
                aria-label="Share location"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Header section */}
            <div className="relative -mt-12 z-10 px-6 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-cipher-gold">
                {location.area || location.emirate || 'UAE Location'}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight text-cipher-white">
                {location.name}
              </h2>

              {/* Vibe tagline */}
              {location.vibe && (
                <p className="mt-2 text-sm italic text-cipher-gold/70">{location.vibe}</p>
              )}

              {/* Quick stats row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {location.price_tier && <PriceTierIndicator tier={location.price_tier} />}

                {location.best_time && (
                  <span className="flex items-center gap-1.5 text-xs text-cipher-dim">
                    <Clock className="h-3.5 w-3.5" />
                    {location.best_time}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-5 p-6">
              {/* Hidden gem badge */}
              {location.is_hidden_gem && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2.5 rounded-xl border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.08)] px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(139,92,246,0.2)]">
                    <Gem className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#8B5CF6]">Hidden Gem</p>
                    <p className="text-[11px] text-cipher-dim">Off the beaten path</p>
                  </div>
                </motion.div>
              )}

              {/* Tags */}
              {location.tags && location.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {location.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cipher-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {(location.long_description || location.short_description) && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-cipher-dim">
                    About
                  </p>
                  <p className="leading-relaxed text-cipher-muted">
                    {location.long_description || location.short_description}
                  </p>
                </div>
              )}

              {/* Insider Tip */}
              {location.insider_tip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-cipher-rim3 bg-cipher-gold/4 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-cipher-rim2">
                      <Sparkles className="h-3.5 w-3.5 text-cipher-gold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cipher-gold">Insider Tip</p>
                      <p className="mt-1 text-sm leading-relaxed text-cipher-muted">{location.insider_tip}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Opening Hours */}
              {location.opening_hours && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-cipher-dim">
                    Opening Hours
                  </p>
                  <div className="flex items-center gap-2 rounded-xl border border-cipher-rim2 bg-cipher-ink px-4 py-3">
                    <Clock className="h-4 w-4 text-cipher-gold/60" />
                    <span className="text-sm text-cipher-muted">{location.opening_hours}</span>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {allImages.length > 1 && (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-cipher-dim">
                    Gallery
                  </p>
                  <GalleryCarousel images={allImages} name={location.name} />
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-cipher-rim2" />

              {/* Coordinates */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-cipher-dim">
                  Coordinates
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-cipher-rim2 bg-cipher-ink px-4 py-3">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-cipher-gold" />
                  <span className="font-mono text-sm tabular-nums text-cipher-muted">
                    {location.latitude.toFixed(6)},&nbsp;{location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Added date */}
              <div className="flex items-center gap-2 text-xs text-cipher-dim">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Added {format(new Date(location.created_at), 'MMMM d, yyyy')}
                </span>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* CTA buttons */}
              <div className="space-y-3 pt-2">
                {location.booking_url && (
                  <a
                    href={location.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cipher-gold to-cipher-gold-bright px-6 py-4 text-sm font-bold text-cipher-void transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,164,107,0.3)]"
                  >
                    Book Now
                    <ChevronRight className="h-4 w-4" />
                  </a>
                )}

                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-cipher-rim3 bg-cipher-gold/9 px-6 py-3.5 text-sm font-semibold text-cipher-gold transition-all duration-300 hover:border-[rgba(200,164,107,0.6)] hover:bg-[rgba(200,164,107,0.15)] hover:shadow-[0_0_24px_rgba(200,164,107,0.14)]"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/5 px-6 py-3.5 text-sm font-semibold text-cipher-muted transition-all duration-200 hover:border-white/15 hover:text-cipher-white"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
