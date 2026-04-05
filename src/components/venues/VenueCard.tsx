'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Heart, TrendingUp, Sparkles, Navigation, ExternalLink, X, Map as MapIcon, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { VenueItem } from '@/data/venues/venuesData';
import { getVenueImage, getWhatsAppUrl, getGoogleMapsUrl, getAppleMapsUrl, getWazeUrl } from '@/data/venues/venuesData';

// ─── Image Component with Error Handling ────────────────────────────────────

function VenueImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <ImageOff className="w-16 h-16 text-gray-600" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

// ─── WhatsApp Icon ────────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Map Modal ────────────────────────────────────────────────────────────────

interface MapModalProps {
  venue: VenueItem;
  isOpen: boolean;
  onClose: () => void;
}

function MapModal({ venue, isOpen, onClose }: MapModalProps) {
  if (!venue.coordinates) return null;

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608!2d${venue.coordinates.lng}!3d${venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA4JzI4LjAiTiA1NcKwMTYnMzkuNiJF!5e0!3m2!1sen!2sae!4v1`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="bg-luxury-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-display text-white">{venue.name}</h3>
                  <p className="text-xs text-gray-500">{venue.location}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Map Embed */}
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[30%]"
                />
              </div>

              {/* Navigation Options */}
              <div className="p-4 grid grid-cols-3 gap-3">
                <a
                  href={getGoogleMapsUrl(venue.name, venue.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-luxury-gold/30 rounded-xl transition-all"
                >
                  <MapIcon className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Google</span>
                </a>
                <a
                  href={getAppleMapsUrl(venue.name, venue.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-luxury-gold/30 rounded-xl transition-all"
                >
                  <Navigation className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Apple</span>
                </a>
                <a
                  href={getWazeUrl(venue.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-luxury-gold/30 rounded-xl transition-all"
                >
                  <ExternalLink className="w-5 h-5 text-luxury-gold" />
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Waze</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── SEO Description Tooltip ──────────────────────────────────────────────────

function SeoTooltip({ description }: { description: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering interactive state until mounted
  if (!mounted) {
    return (
      <span className="text-[9px] text-luxury-gold/70 uppercase tracking-wider underline decoration-luxury-gold/30">
        About
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-[9px] text-luxury-gold/70 hover:text-luxury-gold uppercase tracking-wider underline decoration-luxury-gold/30 hover:decoration-luxury-gold transition-all"
      >
        About
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-luxury-charcoal border border-white/10 rounded-xl shadow-2xl z-20"
          >
            <div className="absolute bottom-[-5px] left-4 w-2 h-2 bg-luxury-charcoal border-b border-r border-white/10 rotate-45" />
            <p className="text-[11px] text-gray-300 leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Animation Variants ───────────────────────────────────────────────────────

export const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface VenueCardProps {
  venue: VenueItem;
  categoryId: string;
  onClick?: () => void;
}

export default function VenueCard({ venue, categoryId, onClick }: VenueCardProps) {
  const toggleSaved = useAppStore((s) => s.toggleSavedVenue);
  const savedVenues = useAppStore((s) => s.savedVenues);
  const isSaved = savedVenues.includes(venue.id);
  const image = getVenueImage(venue.id, categoryId);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const hasCoordinates = Boolean(venue.coordinates);

  return (
    <>
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={onClick}
        className={cn(
          "group relative h-[460px] w-full rounded-2xl overflow-hidden bg-luxury-charcoal border border-white/5 hover:border-luxury-gold/30 transition-all duration-500 hover:shadow-aura",
          onClick && "cursor-pointer"
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-900">
          <VenueImage src={image} alt={`${venue.name} — ${venue.location}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 opacity-95" />
        </div>

        {/* Top: Badges + Heart */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
          <div className="flex gap-2 flex-wrap">
            {venue.trending && (
              <span className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm text-amber-300 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-amber-500/30 rounded-full">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
            {venue.isNew && (
              <span className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-emerald-500/30 rounded-full">
                <Sparkles className="w-3 h-3" />
                New
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(venue.id);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save venue'}
            className={cn(
              'p-2 rounded-full backdrop-blur-sm transition-all duration-300',
              isSaved
                ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40'
                : 'bg-black/40 text-white/70 border border-white/15 hover:text-white hover:bg-black/60'
            )}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-luxury-gold')} />
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300 group-hover:-translate-y-1">
          {/* Price Range */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.25em]">
              {venue.tags[0]}
            </p>
            <div className="flex gap-0.5 text-luxury-gold text-xs">
              {venue.priceRange.split('').map((_, i) => (
                <span key={i}>$</span>
              ))}
              {[...Array(4 - venue.priceRange.length)].map((_, i) => (
                <span key={i} className="text-gray-700">$</span>
              ))}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-display text-white font-medium leading-snug mb-1">
            {venue.name}
          </h3>

          {/* Location with Take Me There */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              {venue.location}
            </div>
            {hasCoordinates && (
              <button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center gap-1 text-[9px] text-luxury-gold hover:text-white uppercase tracking-wider transition-colors"
              >
                <Navigation className="w-3 h-3" />
                Take Me There
              </button>
            )}
          </div>

          {/* Vibe + Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[9px] font-semibold uppercase tracking-wide bg-white/8 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
              {venue.vibe}
            </span>
            {venue.tags.slice(1, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold uppercase tracking-wide bg-white/5 text-gray-500 border border-white/8 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* SEO Description */}
          {venue.seoDescription && (
            <div className="mb-3">
              <SeoTooltip description={venue.seoDescription} />
            </div>
          )}

          {/* Action Buttons — appear on hover */}
          <div className="overflow-hidden">
            <div className="transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pt-2 space-y-2">
              {/* Take Me There - Primary Action */}
              {hasCoordinates && (
                <button
                  onClick={() => setIsMapOpen(true)}
                  className="w-full py-2.5 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 hover:border-luxury-gold/50 uppercase text-[9px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-lg"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Take Me There
                </button>
              )}
              
              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppUrl(venue.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white uppercase text-[9px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-lg"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Modal */}
      <MapModal venue={venue} isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </>
  );
}
