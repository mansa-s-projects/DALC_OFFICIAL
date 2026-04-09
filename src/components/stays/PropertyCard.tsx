"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Users,
  Bed,
  Bath,
  Star,
  MapPin,
  Waves,
  Umbrella,
} from "lucide-react";
import type { StaysProperty } from "../../types/stays";
import { SUBCATEGORY_LABELS, PRICING_MODEL_LABELS } from "../../types/stays";

// ─── Image Component with Error Handling ────────────────────────────────────

function PropertyImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <Bed className="w-16 h-16 text-gray-600" />
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
        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

interface PropertyCardProps {
  property: StaysProperty;
  index?: number;
}

export default function PropertyCard({
  property,
  index = 0,
}: PropertyCardProps) {
  const {
    id,
    name,
    subcategory,
    slug,
    location,
    area,
    hero_image,
    base_price,
    price_currency,
    price_display,
    pricing_model,
    max_guests,
    bedrooms,
    bathrooms,
    star_rating,
    beachfront,
    private_pool,
    is_featured,
    instant_booking,
  } = property;

  const priceLabel =
    price_display ||
    `${price_currency} ${base_price.toLocaleString()}/${PRICING_MODEL_LABELS[pricing_model].toLowerCase().replace("per ", "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white/[0.03] border border-white/10 hover:border-luxury-gold/40 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-900">
        {hero_image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero_image}
            alt={name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Bed className="w-12 h-12 text-luxury-gold/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-luxury-black/80 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
            {SUBCATEGORY_LABELS[subcategory]}
          </span>
          {is_featured && (
            <span className="px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/50 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
              Featured
            </span>
          )}
        </div>

        {/* Property Features */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {star_rating && (
            <span className="flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-[10px]">
              <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
              {star_rating}
            </span>
          )}
          {beachfront && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/60 text-white text-[10px]">
              <Umbrella className="w-3 h-3" />
              Beach
            </span>
          )}
          {private_pool && (
            <span className="flex items-center gap-1 px-2 py-1 bg-cyan-500/60 text-white text-[10px]">
              <Waves className="w-3 h-3" />
              Pool
            </span>
          )}
        </div>

        {/* Instant Book Badge */}
        {instant_booking && (
          <div className="absolute bottom-4 right-4">
            <span className="px-2 py-1 bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider">
              Instant Book
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3 text-luxury-gold" />
          {area}, {location}
        </div>

        {/* Name */}
        <h3 className="text-white font-display text-lg leading-snug mb-3 group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2">
          {name}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {max_guests} guests
          </span>
          {bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {bedrooms} bd
            </span>
          )}
          {bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {bathrooms} ba
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
              {PRICING_MODEL_LABELS[pricing_model]}
            </p>
            <p className="text-luxury-gold font-bold text-base tracking-wide">
              {priceLabel}
            </p>
          </div>

          <Link
            href={`/stays/${subcategory}/${slug}`}
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
