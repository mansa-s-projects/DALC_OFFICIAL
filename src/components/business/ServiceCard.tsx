"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, FileText, Building2 } from "lucide-react";
import type { BusinessService } from "../../types/business";
import { SUBCATEGORY_LABELS, SERVICE_TYPE_LABELS } from "../../types/business";

// ─── Image Component with Error Handling ────────────────────────────────────

function ServiceImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <Building2 className="w-16 h-16 text-gray-600" />
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
  service: BusinessService;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const {
    name,
    subcategory,
    service_type,
    price_display,
    price_from,
    price_currency,
    pricing_model,
    duration_description,
    description_short,
    hero_image,
    slug,
    estimated_steps,
    is_featured,
  } = service;

  const priceLabel =
    price_display ??
    (pricing_model === "custom_quote"
      ? "Custom Quote"
      : pricing_model === "hourly"
        ? `${price_currency} ${price_from?.toLocaleString()}/hr`
        : pricing_model === "starting_from"
          ? `From ${price_currency} ${price_from?.toLocaleString()}`
          : `${price_currency} ${price_from?.toLocaleString()}`);

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
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero_image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-luxury-gold/30" />
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
        </div>

        {/* Service type */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
            {SERVICE_TYPE_LABELS[service_type]}
          </span>
        </div>
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
          {duration_description && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-luxury-gold/60" />
              {duration_description}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-luxury-gold/60" />
            {estimated_steps} steps
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
              {pricing_model === "custom_quote" ? "Pricing" : "Starting from"}
            </p>
            <p className="text-luxury-gold font-bold text-base tracking-wide">
              {priceLabel}
            </p>
          </div>

          <Link
            href={`/business/${subcategory}/${slug}`}
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
