"use client";

import React, { useState, useMemo } from "react";
import Navbar from "../../../components/navigation/Navbar";
import Footer from "../../../components/navigation/Footer";
import EditorialCard from "../../../components/cards/EditorialCard";
import { useVenues } from "../hooks/useVenues";
import { Category } from "../../../types";
import { motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import Script from "next/script";

type SortOption = "recommended" | "trending" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Top Picks",
  trending: "Trending",
  "price-asc": "Price ↑",
  "price-desc": "Price ↓",
};

const CATEGORY_CONFIG: Record<
  string,
  { label: string; hero: string; tagline: string; description: string; seoText: string }
> = {
  "beach-clubs": {
    label: "Beach Clubs",
    hero: "/images/beach_clubs/Verde_Beach/image1.jpg",
    tagline: "Sun, Sand & Sanctuary",
    description:
      "From bohemian shores of Palm West Beach to the high-octane energy of J1.",
    seoText:
      "Dubai's beach clubs combine Côte d'Azur glamour with Gulf sunsets, offering a rare daylife culture that transitions seamlessly into intimate evening experiences. From Nikki Beach's celebrity-studded terraces to Zero Gravity's cliff-edge pools, each club represents a distinct universe built for the discerning patron.",
  },
  restaurants: {
    label: "Restaurants",
    hero: "/images/restaurants/Bagatelle/image1.jpg",
    tagline: "Culinary Excellence",
    description:
      "From Michelin-starred chefs to rooftop dining with skyline views.",
    seoText:
      "Dubai's fine dining scene sets a global benchmark, drawing world-class chefs to create destination restaurants that rival Paris, Tokyo, and New York. The city's unique position as a crossroads of culture means its culinary landscape is genuinely diverse — from the molecular gastronomy of avant-garde tasting menus to centuries-old Emirati recipes reimagined with modern technique.",
  },
  nightlife: {
    label: "Nightlife",
    hero: "/images/nightclubs/Soho_Garden/image1.jpg",
    tagline: "After Dark Excellence",
    description: "From DIFC rooftop bars to beachfront superclubs in JBR.",
    seoText:
      "Dubai's nightlife circuit has evolved into one of the most diverse scenes globally. From underground electronics in converted villas to stadium-scale productions on JBR Beach, the city caters to every after-dark preference with an intensity matched only by Ibiza or Miami at their peak.",
  },
  "night-clubs": {
    label: "Night Clubs",
    hero: "/images/nightclubs/Iris/image1.jpg",
    tagline: "The After Dark Elite",
    description: "VIP table service, international DJs, and late-night access.",
    seoText:
      "Dubai's club landscape offers world-class experiences with resident and international DJs, indoor-outdoor hybrid spaces, and meticulously managed table service at peak hours. Venues like Soho Garden and WHITE Dubai have earned global recognition for production quality that rivals Las Vegas residencies.",
  },
  "dining-entertainment": {
    label: "Dining & Entertainment",
    hero: "/images/dining_entertainment/Black_Tap/image1.jpg",
    tagline: "Beyond the Table",
    description: "Where gastronomy meets spectacle.",
    seoText:
      "Dubai's dining entertainment venues blur the line between restaurant and theatre, combining culinary mastery with live performance, immersive design, and theatrical tableside service. These experiences transform a meal into an event — complete with live musicians, aerial performers, and productions staged around the guest.",
  },
  dining: {
    label: "Fine Dining",
    hero: "/images/restaurants/Bagatelle/image1.jpg",
    tagline: "Culinary Mastery",
    description:
      "Chef-driven concepts and tasting menus in a city built for superlatives.",
    seoText:
      "Dubai's fine dining landscape has matured into a world destination, with chefs earning global recognition for blending Middle Eastern heritage with modern technique. Multi-course tasting menus with paired wine flights and dedicated sommelier service are standard, not exceptional.",
  },
  experiences: {
    label: "Experiences",
    hero: "/images/beach_clubs/Verde_Beach/image1.jpg",
    tagline: "Beyond the Ordinary",
    description:
      "Curated adventures designed for those who demand the exceptional.",
    seoText:
      "From desert sunrise safaris to private yacht charters beneath the Burj Al Arab, Dubai's experience landscape offers curated encounters that transform travel into transformation. Each experience is designed to exceed the superlative expectations of global travelers who have seen it all.",
  },
  wellness: {
    label: "Wellness",
    hero: "/images/beach_clubs/Verde_Beach/image1.jpg",
    tagline: "Restore & Elevate",
    description: "World-class spas, holistic retreats, and performance wellness.",
    seoText:
      "Dubai's wellness industry operates at the intersection of ancient practice and clinical precision. From hammam rituals adapted for modern sensibilities to biohacking performance centres in business districts, the city offers urban sanctuaries and desert retreats designed for deep restoration.",
  },
};

const PER_PAGE = 12;

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const config = CATEGORY_CONFIG[category] ?? {
    label: category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    hero: "/images/restaurants/Bagatelle/image1.jpg",
    tagline: "Curated Selection",
    description: "The finest venues in Dubai, curated for you.",
    seoText: `Discover the best ${category.replace(/-/g, " ")} venues in Dubai, personally curated by our concierge team.`,
  };

  const [sort, setSort] = useState<SortOption>("recommended");
  const [activePriceTiers, setActivePriceTiers] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data: venues = [], isLoading } = useVenues({
    category: category as Category,
  });

  const filtered = useMemo(() => {
    let v = [...venues];
    if (activePriceTiers.length > 0) {
      v = v.filter((venue) => activePriceTiers.includes(venue.price_tier));
    }
    if (sort === "trending") {
      v.sort((a, b) => (b.trending_score ?? 0) - (a.trending_score ?? 0));
    } else if (sort === "price-asc") {
      v.sort((a, b) => a.price_tier - b.price_tier);
    } else if (sort === "price-desc") {
      v.sort((a, b) => b.price_tier - a.price_tier);
    } else {
      v.sort((a, b) => (b.recommend_score ?? 0) - (a.recommend_score ?? 0));
    }
    return v;
  }, [venues, sort, activePriceTiers]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = paged.length < filtered.length;

  const togglePriceTier = (tier: number) => {
    setActivePriceTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
    setPage(1);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.label} in Dubai`,
    description: config.description,
    numberOfItems: filtered.length,
    itemListElement: paged.slice(0, 10).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristAttraction",
        name: v.name,
        description: v.description_short,
        address: {
          "@type": "PostalAddress",
          addressLocality: v.area,
          addressCountry: "AE",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={config.hero}
            alt={config.label}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-luxury-black/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-3xl px-4"
        >
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-5">
            {config.tagline}
          </p>
          <h1 className="text-6xl md:text-8xl font-display text-white mb-6 leading-none">
            {config.label}
          </h1>
          <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            {config.description}
          </p>
        </motion.div>
      </section>

      {/* Filter + Sort Bar */}
      <section className="sticky top-0 z-40 bg-luxury-black/95 backdrop-blur-md border-b border-white/5 py-4 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            {[1, 2, 3, 4].map((tier) => (
              <button
                key={tier}
                onClick={() => togglePriceTier(tier)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border rounded-sm ${
                  activePriceTiers.includes(tier)
                    ? "bg-luxury-gold text-black border-luxury-gold"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-luxury-gold/40 hover:text-white"
                }`}
              >
                {"$".repeat(tier)}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {(
              ["recommended", "trending", "price-asc", "price-desc"] as SortOption[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSort(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border rounded-sm ${
                  sort === s
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Grid */}
      <section className="pb-24 pt-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/5 mb-4" />
                <div className="h-4 bg-white/5 w-3/4 mb-2" />
                <div className="h-3 bg-white/5 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-12 flex items-center justify-between">
              <span className="text-gray-500 text-xs uppercase tracking-widest">
                {filtered.length} venue{filtered.length !== 1 ? "s" : ""} curated
              </span>
              {activePriceTiers.length > 0 && (
                <button
                  onClick={() => setActivePriceTiers([])}
                  className="text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {paged.map((venue, index) => (
                <EditorialCard
                  key={venue.id}
                  venue={venue}
                  index={index % PER_PAGE}
                />
              ))}
            </div>

            {paged.length === 0 && (
              <div className="text-center py-32 border-t border-white/10 mt-4">
                <p className="text-gray-500 italic text-lg font-display">
                  No venues match your filters
                </p>
                <button
                  onClick={() => setActivePriceTiers([])}
                  className="mt-4 text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-20">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-12 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                >
                  Load {Math.min(PER_PAGE, filtered.length - paged.length)} more
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* SEO Editorial Text */}
      <section className="border-t border-white/5 py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <p className="text-gray-500 text-sm leading-relaxed font-light">
          {config.seoText}
        </p>
      </section>

      <Footer />
    </div>
  );
}
