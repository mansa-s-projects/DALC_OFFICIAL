"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, Users, Ruler, Anchor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { YachtItem } from "@/data/yachts/yachtsData";
import {
  getYachtImage,
  getYachtWhatsAppUrl,
} from "@/data/yachts/yachtsData";

// ─── Image Component with Error Handling ────────────────────────────────────

function YachtImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <Anchor className="w-16 h-16 text-gray-600" />
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

// ─── Animation ────────────────────────────────────────────────────────────────

export const yachtCardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface YachtCardProps {
  yacht: YachtItem & { categoryId: string };
}

export default function YachtCard({ yacht }: YachtCardProps) {
  const toggleSaved = useAppStore((s) => s.toggleSavedVenue);
  const savedVenues = useAppStore((s) => s.savedVenues);
  const isSaved = savedVenues.includes(yacht.id);
  const image = getYachtImage(yacht.name);

  const isLargeGroup = yacht.capacity > 25;
  const isPremium = yacht.pricePerHour >= 2000;

  return (
    <motion.div
      variants={yachtCardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-luxury-charcoal border border-white/5 hover:border-luxury-gold/30 transition-all duration-500 hover:shadow-aura"
    >
      {/* ── Image ──────────────────────────────────────────── */}
      <div className="relative h-[220px] overflow-hidden bg-gray-900">
        <YachtImage src={image} alt={yacht.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {yacht.popular && (
            <span className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm text-amber-300 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-amber-500/30 rounded-full">
              Popular
            </span>
          )}
          {yacht.isNew && (
            <span className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-emerald-500/30 rounded-full">
              New
            </span>
          )}
          {isLargeGroup && (
            <span className="flex items-center gap-1 bg-sky-500/20 backdrop-blur-sm text-sky-300 text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-sky-500/30 rounded-full">
              Large Group
            </span>
          )}
          {isPremium && (
            <span className="flex items-center gap-1 bg-luxury-gold/20 backdrop-blur-sm text-luxury-gold text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em] border border-luxury-gold/30 rounded-full">
              Premium
            </span>
          )}
        </div>

        {/* Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(yacht.id);
          }}
          aria-label={isSaved ? "Remove from saved" : "Save yacht"}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300",
            isSaved
              ? "bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40"
              : "bg-black/40 text-white/70 border border-white/15 hover:text-white hover:bg-black/60",
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-luxury-gold")} />
        </button>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name */}
        <h3 className="text-lg font-display text-white font-medium leading-snug">
          {yacht.name}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-3 mt-2">
          {yacht.length !== "–" && (
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Ruler className="w-3 h-3" />
              {yacht.length}
            </span>
          )}
          <span className="flex items-center gap-1 text-gray-500 text-xs">
            <Users className="w-3 h-3" />
            {yacht.capacity} guests
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-4 mb-4">
          <span className="text-luxury-gold text-2xl font-bold tabular-nums">
            {yacht.pricePerHour.toLocaleString()}
          </span>
          <span className="text-gray-600 text-xs uppercase tracking-wider">
            AED / hour
          </span>
        </div>

        {/* CTA */}
        <a
          href={getYachtWhatsAppUrl(yacht.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full py-2.5 bg-white/[0.06] hover:bg-[#25D366] border border-white/10 hover:border-[#25D366] text-white uppercase text-[9px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-lg"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          Book Yacht
        </a>
      </div>
    </motion.div>
  );
}
