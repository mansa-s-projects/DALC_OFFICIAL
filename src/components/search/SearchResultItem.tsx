"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { SearchResult } from "@/features/search";
import { SEARCH_RESULT_TYPE_LABELS } from "@/features/search";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  venue: "#C9A84C",
  experience: "#7EB8A0",
  transport: "#8BA4D4",
  business: "#C4917D",
  stay: "#B89AD4",
};

const TYPE_LABELS: Record<string, string> = {
  transport: 'Travel',
};

interface SearchResultItemProps {
  result: SearchResult;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SearchResultItem({
  result,
  isActive,
  onClick,
}: SearchResultItemProps) {
  const accentColor = typeColors[result.type] || "#C9A84C";

  return (
    <Link
      href={result.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-cipher-gold/8 border border-cipher-gold/15"
          : "hover:bg-cipher-surface border border-transparent",
      )}
    >
      {/* Image */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-cipher-card">
        {result.image ? (
          <img
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg" style={{ color: accentColor }}>
              {result.title.charAt(0)}
            </span>
          </div>
        )}
        <div
          className="absolute top-0 left-0 w-full h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4
            className="text-sm font-medium truncate"
            style={{
              color: "rgba(245,237,216,0.95)",
              fontFamily: "var(--font-body)",
            }}
          >
            {result.title}
          </h4>
          {result.score && result.score >= 8 && (
            <Star className="w-3 h-3 flex-shrink-0 fill-cipher-gold text-cipher-gold" />
          )}
        </div>
        {result.subtitle && (
          <p
            className="text-xs truncate"
            style={{
              color: "rgba(212,195,150,0.50)",
              fontFamily: "var(--font-body)",
            }}
          >
            {result.subtitle}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span
            className="text-[9px] uppercase tracking-widest font-medium px-1.5 py-0.5 rounded"
            style={{
              color: accentColor,
              background: `${accentColor}12`,
              fontFamily: "var(--font-mono)",
            }}
          >
            {TYPE_LABELS[result.type] || SEARCH_RESULT_TYPE_LABELS[result.type]}
          </span>
          {result.area && (
            <span
              className="flex items-center gap-1 text-[10px]"
              style={{
                color: "rgba(212,195,150,0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <MapPin className="w-2.5 h-2.5" />
              {result.area}
            </span>
          )}
          {result.price_tier != null && (
            <span
              className="text-[10px] tracking-wider"
              style={{
                color: "rgba(201,168,76,0.60)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {"$".repeat(
                Math.max(1, Math.min(4, Math.round(result.price_tier))),
              )}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <svg
        className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity"
        style={{ color: "rgba(245,237,216,0.95)" }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
