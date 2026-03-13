import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, MapPin, Star, TrendingUp } from 'lucide-react';
import type { ExperienceService } from '../../types/experiences';
import {
  SUBCATEGORY_LABELS,
  SERVICE_TYPE_LABELS,
  PRICING_MODEL_LABELS,
} from '../../types/experiences';

interface ExperienceCardProps {
  experience: ExperienceService;
  index?: number;
  showSubcategory?: boolean;
}

export default function ExperienceCard({
  experience,
  index = 0,
  showSubcategory = true,
}: ExperienceCardProps) {
  const {
    name,
    subcategory,
    service_type,
    price_display,
    price_from,
    price_currency,
    pricing_model,
    duration_minutes,
    description_short,
    hero_image,
    slug,
    location,
    area,
    max_capacity,
    is_featured,
    is_trending,
    trending_score,
  } = experience;

  const priceLabel =
    price_display ??
    (pricing_model === 'free'
      ? 'Free'
      : pricing_model === 'tiered' && price_from
      ? `From ${price_currency} ${price_from.toLocaleString()}`
      : price_from
      ? `${price_currency} ${price_from.toLocaleString()}`
      : 'Contact for pricing');

  const durationLabel = duration_minutes
    ? duration_minutes >= 60
      ? `${Math.floor(duration_minutes / 60)}h ${duration_minutes % 60 > 0 ? `${duration_minutes % 60}m` : ''}`
      : `${duration_minutes} min`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white/[0.03] border border-white/10 hover:border-luxury-gold/40 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {hero_image ? (
          <img
            src={hero_image}
            alt={name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-luxury-gold/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {showSubcategory && (
            <span className="px-2 py-1 bg-luxury-black/80 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
              {SUBCATEGORY_LABELS[subcategory]}
            </span>
          )}
          {is_trending && (
            <span className="flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {is_featured && !is_trending && (
            <span className="flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Service type */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
            {SERVICE_TYPE_LABELS[service_type]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        {(location || area) && (
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-luxury-gold/60" />
            {area ? `${area}, ${location}` : location}
          </p>
        )}

        <h3 className="text-white font-display text-lg leading-snug mb-2 group-hover:text-luxury-gold transition-colors duration-300">
          {name}
        </h3>

        {description_short && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {description_short}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
          {durationLabel && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-luxury-gold/60" />
              {durationLabel}
            </span>
          )}
          {max_capacity && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-luxury-gold/60" />
              Up to {max_capacity}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
              {pricing_model === 'free' ? 'Price' : 'From'}
            </p>
            <p className="text-luxury-gold font-bold text-base tracking-wide">
              {priceLabel}
            </p>
          </div>

          <Link
            to={`/experiences/${subcategory}/${slug}`}
            className="flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
          >
            View
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
