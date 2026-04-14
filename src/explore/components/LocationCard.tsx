'use client';

import { motion } from 'motion/react';
import { Gem, MapPin, ArrowUpRight, Star, Clock, DollarSign } from 'lucide-react';
import Image from 'next/image';
import type { ExploreLocation } from '../types';

interface LocationCardProps {
  location: ExploreLocation;
  index: number;
  onClick: (location: ExploreLocation) => void;
}

const PLACEHOLDER_IMAGES = [
  '/images/explore/placeholder-1.jpg',
  '/images/explore/placeholder-2.jpg',
  '/images/explore/placeholder-3.jpg',
];

function getPlaceholderImage(id: string): string {
  const hash = id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  return PLACEHOLDER_IMAGES[Math.abs(hash) % PLACEHOLDER_IMAGES.length];
}

function PriceTierIndicator({ tier }: { tier: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <DollarSign
          key={i}
          className={`h-2.5 w-2.5 ${i <= tier ? 'text-[#C8A46B]' : 'text-[#B6B6B6]/20'}`}
        />
      ))}
    </div>
  );
}

export default function LocationCard({ location, index, onClick }: LocationCardProps) {
  const heroImage = location.hero_image || getPlaceholderImage(location.id);
  const hasValidImage = Boolean(heroImage);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.42), ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(location)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(200,164,107,0.15)] bg-[#111214] transition-all duration-300 hover:border-[rgba(200,164,107,0.5)] hover:shadow-[0_8px_40px_-8px_rgba(200,164,107,0.22)]"
      aria-label={`View details for ${location.name}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111214] via-transparent to-transparent z-10" />
        
        {hasValidImage ? (
          <Image
            src={heroImage}
            alt={location.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] via-[#151520] to-[#111118]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border border-[rgba(200,164,107,0.15)] bg-[rgba(200,164,107,0.05)] flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-[#C8A46B]/30" />
                </div>
                <div className="absolute inset-0 animate-pulse rounded-full border border-[rgba(200,164,107,0.1)]" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A46B]/20 to-transparent" />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between">
          {/* Category pill */}
          {location.category && (
            <span className="rounded-md border border-white/10 bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90">
              {location.category}
            </span>
          )}

          {/* Hidden gem badge */}
          {location.is_hidden_gem && (
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(200,164,107,0.4)] bg-black/50 backdrop-blur-sm px-2.5 py-1">
              <Gem className="h-3 w-3 text-[#C8A46B]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C8A46B]">
                Hidden Gem
              </span>
            </div>
          )}
        </div>

        {/* Featured badge */}
        {location.is_featured && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-full bg-[#C8A46B] px-2 py-0.5">
            <Star className="h-2.5 w-2.5 fill-[#0a0800] text-[#0a0800]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0a0800]">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name */}
        <h3 className="font-display text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#C8A46B]">
          {location.name}
        </h3>

        {/* Vibe/Tagline */}
        {location.vibe && (
          <p className="mt-1 text-xs italic text-[#C8A46B]/70">{location.vibe}</p>
        )}

        {/* Short description */}
        {location.short_description && (
          <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#B6B6B6]/80">
            {location.short_description}
          </p>
        )}

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {location.tags.slice(0, 3).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="rounded-md border border-white/[0.08] bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#B6B6B6]/70"
              >
                {tag}
              </span>
            ))}
            {location.tags.length > 3 && (
              <span className="text-[10px] text-[#B6B6B6]/50">+{location.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-3">
            {/* Location */}
            <span className="flex items-center gap-1 text-xs text-[#B6B6B6]/55">
              <MapPin className="h-3 w-3" />
              {location.area || location.emirate || 'UAE'}
            </span>

            {/* Price tier */}
            {location.price_tier && <PriceTierIndicator tier={location.price_tier} />}

            {/* Best time */}
            {location.best_time && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-[#B6B6B6]/40">
                <Clock className="h-2.5 w-2.5" />
                {location.best_time.split(' ').slice(0, 2).join(' ')}
              </span>
            )}
          </div>

          {/* Arrow caret */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(200,164,107,0.2)] text-[#C8A46B]/40 transition-all duration-300 group-hover:border-[rgba(200,164,107,0.6)] group-hover:bg-[rgba(200,164,107,0.08)] group-hover:text-[#C8A46B]">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Animated bottom gold line */}
      <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-[#C8A46B] via-[#C8A46B]/60 to-transparent transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
}
