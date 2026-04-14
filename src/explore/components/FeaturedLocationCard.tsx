'use client';

import { motion } from 'motion/react';
import { Gem, MapPin, ArrowUpRight, Star, Clock, DollarSign, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { ExploreLocation } from '../types';

interface FeaturedLocationCardProps {
  location: ExploreLocation;
  index: number;
  onClick: (location: ExploreLocation) => void;
}

function PriceTierIndicator({ tier }: { tier: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <DollarSign
          key={i}
          className={`h-3 w-3 ${i <= tier ? 'text-[#C8A46B]' : 'text-[#B6B6B6]/20'}`}
        />
      ))}
    </div>
  );
}

export default function FeaturedLocationCard({ location, index, onClick }: FeaturedLocationCardProps) {
  const heroImage = location.hero_image;
  const hasValidImage = heroImage && !heroImage.includes('placeholder');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(location);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(location)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(200,164,107,0.2)] bg-gradient-to-br from-[#111214] via-[#111214] to-[#0f100f] transition-all duration-300 hover:border-[rgba(200,164,107,0.6)] hover:shadow-[0_12px_48px_-12px_rgba(200,164,107,0.28)]"
      aria-label={`View featured location ${location.name}`}
    >
      {/* Image Section - Larger for featured */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111214] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111214]/60 via-transparent to-transparent z-10" />
        
        {hasValidImage ? (
          <Image
            src={heroImage}
            alt={location.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a28] via-[#151520] to-[#111118]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border border-[rgba(200,164,107,0.2)] bg-[rgba(200,164,107,0.05)] flex items-center justify-center">
                  <MapPin className="h-9 w-9 text-[#C8A46B]/30" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(200,164,107,0.1) 0%, transparent 50%)'
            }} />
          </div>
        )}

        {/* Featured badge - prominent */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C8A46B] to-[#E0C87F] px-3 py-1.5 shadow-lg">
          <Star className="h-3.5 w-3.5 fill-[#0a0800] text-[#0a0800]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a0800]">
            Featured
          </span>
        </div>

        {/* Category and Hidden gem badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {location.category && (
            <span className="rounded-md border border-white/15 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/90">
              {location.category}
            </span>
          )}
          
          {location.is_hidden_gem && (
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(200,164,107,0.5)] bg-black/60 backdrop-blur-md px-2.5 py-1">
              <Gem className="h-3 w-3 text-[#C8A46B]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#C8A46B]">
                Hidden Gem
              </span>
            </div>
          )}
        </div>

        {/* Bottom gradient overlay content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold leading-tight text-white drop-shadow-lg transition-colors duration-300 group-hover:text-[#C8A46B]">
                {location.name}
              </h3>
              {location.vibe && (
                <p className="mt-1 text-sm italic text-[#C8A46B]/80 drop-shadow">{location.vibe}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        {/* Description */}
        {location.short_description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#B6B6B6]/85">
            {location.short_description}
          </p>
        )}

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {location.tags.slice(0, 4).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-[#B6B6B6]/70 transition-colors group-hover:border-[rgba(200,164,107,0.2)] group-hover:text-[#B6B6B6]"
              >
                {tag}
              </span>
            ))}
            {location.tags.length > 4 && (
              <span className="text-[10px] text-[#B6B6B6]/50">+{location.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Insider tip preview */}
        {location.insider_tip && (
          <div className="mt-4 rounded-lg border border-[rgba(200,164,107,0.15)] bg-[rgba(200,164,107,0.03)] px-3 py-2">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#C8A46B]" />
              <p className="line-clamp-1 text-xs italic text-[#C8A46B]/70">
                {location.insider_tip}
              </p>
            </div>
          </div>
        )}

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 mt-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-[#B6B6B6]/60">
              <MapPin className="h-3.5 w-3.5" />
              {location.area || location.emirate || 'UAE'}
            </span>

            {location.price_tier && <PriceTierIndicator tier={location.price_tier} />}

            {location.best_time && (
              <span className="hidden md:flex items-center gap-1.5 text-[11px] text-[#B6B6B6]/45">
                <Clock className="h-3 w-3" />
                {location.best_time}
              </span>
            )}
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(200,164,107,0.25)] text-[#C8A46B]/50 transition-all duration-300 group-hover:border-[#C8A46B] group-hover:bg-[rgba(200,164,107,0.12)] group-hover:text-[#C8A46B]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-bl from-[rgba(200,164,107,0.08)] to-transparent" />
      </div>

      {/* Animated bottom gold line */}
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#C8A46B] via-[#C8A46B]/70 to-transparent transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
}
