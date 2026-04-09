"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Users, Clock, Gauge } from "lucide-react";
import type {
  TransportService,
  TransportSubcategory,
} from "../../types/transport";
import {
  SUBCATEGORY_LABELS,
  PRICING_MODEL_LABELS,
} from "../../types/transport";

// ─── Image Component with Error Handling ────────────────────────────────────

function TransportImage({
  src,
  alt,
  fallbackIcon,
}: {
  src: string;
  alt: string;
  fallbackIcon?: React.ReactNode;
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        {fallbackIcon || <span className="text-4xl text-gray-600">🚗</span>}
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
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>
  );
}

interface ServiceCardProps {
  service: TransportService;
  index?: number;
}

const SUBCATEGORY_ICONS: Record<TransportSubcategory, React.ReactNode> = {
  cars: <Gauge className="w-3.5 h-3.5" />,
  yachts: <span className="text-[10px]">⚓</span>,
  jets: <span className="text-[10px]">✈</span>,
};

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const {
    name,
    subcategory,
    sub_subcategory,
    price_display,
    price_from,
    price_currency,
    pricing_model,
    description_short,
    hero_image,
    slug,
    max_capacity,
    min_booking_hours,
    is_featured,
    is_trending,
    specifications,
  } = service;

  const priceLabel =
    price_display ??
    (pricing_model === "custom"
      ? "Custom Quote"
      : pricing_model === "hourly"
        ? `${price_currency} ${price_from?.toLocaleString()}/hr`
        : pricing_model === "daily"
          ? `${price_currency} ${price_from?.toLocaleString()}/day`
          : `${price_currency} ${price_from?.toLocaleString()}`);

  // Get key spec based on subcategory
  const getKeySpec = () => {
    const specs = specifications as Record<string, unknown>;
    if (subcategory === "cars") {
      return specs["horsepower"] ? `${specs["horsepower"]}` : null;
    }
    if (subcategory === "yachts") {
      return specs["length_ft"] ? `${specs["length_ft"]} ft` : null;
    }
    if (subcategory === "jets") {
      const rangeKm = specs["range_km"];
      return typeof rangeKm === "number"
        ? `${(rangeKm / 1000).toFixed(0)}k km`
        : null;
    }
    return null;
  };

  const keySpec = getKeySpec();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white/[0.03] border border-white/10 hover:border-luxury-gold/40 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {hero_image ? (
          <TransportImage
            src={hero_image}
            alt={name}
            fallbackIcon={SUBCATEGORY_ICONS[subcategory]}
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <div className="text-luxury-gold/30 text-4xl">
              {SUBCATEGORY_ICONS[subcategory]}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />

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
          {is_trending && !is_featured && (
            <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
              Trending
            </span>
          )}
        </div>

        {/* Sub-subcategory */}
        {sub_subcategory && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
              {sub_subcategory.replace(/-/g, " ")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
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
          {max_capacity && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-luxury-gold/60" />
              {max_capacity} {max_capacity === 1 ? "guest" : "guests"}
            </span>
          )}
          {min_booking_hours && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-luxury-gold/60" />
              Min {min_booking_hours}h
            </span>
          )}
          {keySpec && (
            <span className="flex items-center gap-1.5 text-luxury-gold/70">
              {SUBCATEGORY_ICONS[subcategory]}
              {keySpec}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
              {pricing_model === "custom" ? "Pricing" : "From"}
            </p>
            <p className="text-luxury-gold font-bold text-base tracking-wide">
              {priceLabel}
            </p>
          </div>

          <Link
            href={`/transport/${subcategory}/${slug}`}
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
