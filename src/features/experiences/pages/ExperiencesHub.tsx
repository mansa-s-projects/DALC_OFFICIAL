"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Wind,
  Mountain,
  Sparkles,
  Ticket,
  Crown,
  Waves,
  Camera,
  UtensilsCrossed,
  ScanEye,
  Flame,
  Anchor,
  Landmark,
  Map,
  Zap,
} from "lucide-react";
import Footer from "../../../components/navigation/Footer";
import { DALC_EXPERIENCE_CATEGORIES } from "../catalog";
import UpcomingEventsStrip from "../components/UpcomingEventsStrip";

interface CategoryMeta {
  seoTitle: string;
  description: string;
  image: string;
  badge: "Most Booked" | "Top Picks" | "Editor's Pick" | null;
  startingFrom: string;
  cta: string;
  urgency: string | null;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "desertAdventure": {
    seoTitle: "Dubai Desert Safari & Dune Buggy Experiences",
    description:
      "Dune buggies, quad bikes, camel rides and sunset safaris — the most iconic side of Dubai.",
    image: "/images/experiences/desertAdventure/hero.jpg",
    badge: "Most Booked",
    startingFrom: "AED 160",
    cta: "Explore Desert",
    urgency: "32 bookings this week",
  },
  "water-activities": {
    seoTitle: "Jet Skiing, Yachts & Water Sports Dubai",
    description:
      "Jet skis, yacht charters, scuba diving and parasailing across Dubai Marina and the Gulf coast.",
    image: "/images/experiences/water-activities/hero.jpg",
    badge: "Most Booked",
    startingFrom: "AED 300",
    cta: "Book Water Sport",
    urgency: "18 booked today",
  },
  "yacht-charter": {
    seoTitle: "Private Yacht Charter Dubai | Luxury Cruises from AED 650/hr",
    description:
      "Private yacht charters from 45ft to 120ft — sunset cruises, party yachts and fishing trips from Dubai Marina.",
    image: "/images/experiences/yachts/hero.jpg",
    badge: "Top Picks",
    startingFrom: "AED 650/hr",
    cta: "Charter Now",
    urgency: null,
  },
  "aerialAdrenaline": {
    seoTitle: "Skydiving, Helicopter Tours & Ziplines Dubai",
    description:
      "Skydive over Palm Jumeirah, fly by helicopter over downtown, or conquer the world's longest zipline.",
    image: "/images/experiences/aerialAdrenaline/hero.jpg",
    badge: "Top Picks",
    startingFrom: "AED 220",
    cta: "Get Airborne",
    urgency: null,
  },
  entertainment: {
    seoTitle: "Theme Parks & Attractions Dubai | Aquaventure, IMG Worlds & More",
    description:
      "Dubai's world-class theme parks, iconic landmarks and entertainment — Aquaventure, IMG Worlds, Museum of the Future.",
    image: "/images/experiences/entertainment/hero.jpg",
    badge: null,
    startingFrom: "AED 25",
    cta: "Explore Parks",
    urgency: null,
  },
  wellness: {
    seoTitle: "Luxury Spa & Beach Club Day Passes Dubai",
    description:
      "5-star spa treatments, infinity pool access and beach club day passes at Dubai's finest resorts.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    badge: null,
    startingFrom: "AED 551",
    cta: "Restore & Relax",
    urgency: null,
  },
  "abu-dhabi-tours": {
    seoTitle: "Abu Dhabi Day Tours from Dubai | Grand Mosque, Ferrari World & More",
    description:
      "Private guided day tours to Abu Dhabi — Sheikh Zayed Grand Mosque, Ferrari World, Warner Bros. and city tours.",
    image: "https://images.unsplash.com/photo-1512366850919-0592b2b3b94d?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    startingFrom: "AED 63",
    cta: "Plan Day Trip",
    urgency: null,
  },
  "oman-tours": {
    seoTitle: "Oman Day Trips from Dubai | Musandam Fjords & Mountain Tours",
    description:
      "Guided day trips from Dubai to Oman's Musandam fjords — dolphin watching, snorkelling, and mountain adventures.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    startingFrom: "AED 450",
    cta: "Explore Oman",
    urgency: null,
  },
  "tickets-and-culture": {
    seoTitle: "Dubai Attractions, Culture & Heritage Tours",
    description:
      "Guided historic tours, archaeological expeditions and curated cultural access across the UAE.",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2000&auto=format&fit=crop",
    badge: null,
    startingFrom: "AED 70",
    cta: "Discover Culture",
    urgency: null,
  },
  "luxury-leisure": {
    seoTitle: "Supercars, Beach Clubs & Luxury Lifestyle Dubai",
    description:
      "Lamborghinis, Ferraris and exclusive day-pass access — the highest tier of Dubai lifestyle.",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1200&auto=format&fit=crop",
    badge: "Editor's Pick",
    startingFrom: "AED 500",
    cta: "Live in Luxury",
    urgency: null,
  },
  "photography-experience": {
    seoTitle: "Desert & Stud Farm Photoshoots Dubai",
    description:
      "Couture dress photoshoots with horses, camels and falcons in the golden desert light.",
    image: "/images/experiences/desertAdventure/hero.jpg",
    badge: null,
    startingFrom: "AED 1,650",
    cta: "Book a Shoot",
    urgency: null,
  },
  "signature-dining": {
    seoTitle: "Private Desert Dinners & Sky Dining Dubai",
    description:
      "Dinner in the Sky at 50m, dhow cruise dinners and open-fire gourmet meals under the stars.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    badge: "Top Picks",
    startingFrom: "AED 330",
    cta: "Reserve a Table",
    urgency: "8 tables left this weekend",
  },
  observation: {
    seoTitle: "Dubai City Views, Observatories & Hidden Gems",
    description:
      "Sky-high observatories, desert lakes, mountain drives and the UAE's most breathtaking viewpoints.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    startingFrom: "AED 70",
    cta: "Explore Views",
    urgency: null,
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "desertAdventure": Mountain,
  "water-activities": Waves,
  "yacht-charter": Anchor,
  "aerialAdrenaline": Wind,
  entertainment: Zap,
  wellness: Sparkles,
  "abu-dhabi-tours": Landmark,
  "oman-tours": Map,
  "tickets-and-culture": Ticket,
  "luxury-leisure": Crown,
  "photography-experience": Camera,
  "signature-dining": UtensilsCrossed,
  observation: ScanEye,
};

const BADGE_STYLES: Record<string, string> = {
  "Most Booked":
    "bg-cipher-gold/15 border-cipher-gold/40 text-cipher-gold",
  "Top Picks":
    "bg-white/[0.08] border-white/20 text-cipher-white",
  "Editor's Pick":
    "bg-cipher-gold/10 border-cipher-gold/30 text-cipher-gold-bright",
};

export default function ExperiencesHub() {
  return (
    <div className="min-h-screen bg-cipher-void">

      <section className="relative min-h-[52vh] flex items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.07),transparent_65%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cipher-gold/[0.025] rounded-full blur-[140px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <p className="text-cipher-gold text-[10px] font-body font-semibold uppercase tracking-[0.5em] mb-5">
            Dubai Experiences
          </p>
          <h1 className="text-4xl md:text-[3.75rem] font-display text-cipher-white mb-5 leading-[1.1] tracking-tight">
            Every Dubai Experience,
            <br />
            <span className="text-cipher-gold">Curated for You</span>
          </h1>
          <p className="text-cipher-muted font-body text-base leading-relaxed max-w-lg mx-auto">
            From skydiving over Palm Jumeirah to private desert dinners under the
            stars — nine categories of handpicked Dubai experiences, bookable on
            demand.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DALC_EXPERIENCE_CATEGORIES.map((category, idx) => {
            const meta = CATEGORY_META[category.slug];
            const Icon = CATEGORY_ICONS[category.slug] || Crown;
            if (!meta) return null;

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/experiences/${category.slug}`}
                  className="group relative flex flex-col h-full overflow-hidden rounded-[3px] border border-cipher-rim bg-cipher-ink hover:border-cipher-rim3 transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                      src={meta.image}
                      alt={meta.seoTitle}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cipher-ink via-cipher-ink/30 to-transparent" />
                    <div className="absolute inset-0 bg-cipher-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
                      {meta.badge ? (
                        <span
                          className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[10px] font-body font-semibold uppercase tracking-[0.18em] backdrop-blur-md ${BADGE_STYLES[meta.badge]}`}
                        >
                          {meta.badge === "Most Booked" && (
                            <Flame className="w-2.5 h-2.5" />
                          )}
                          {meta.badge}
                        </span>
                      ) : (
                        <div />
                      )}
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-cipher-gold/40 group-hover:bg-cipher-gold/10 transition-all duration-400">
                        <Icon className="w-[14px] h-[14px] text-white/60 group-hover:text-cipher-gold transition-colors duration-400" />
                      </div>
                    </div>

                    <div className="absolute bottom-3.5 left-4">
                      <div className="inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-md border border-white/[0.08] rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cipher-gold animate-pulse" />
                        <span className="text-[10px] font-body font-medium text-white/70 tracking-wide">
                          {category.items.length} experiences
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <h2 className="text-lg font-display text-cipher-white group-hover:text-cipher-gold transition-colors duration-300 leading-snug">
                        {meta.seoTitle}
                      </h2>
                    </div>

                    <p className="text-cipher-muted font-body text-[13px] leading-relaxed mb-4 line-clamp-2 flex-1">
                      {meta.description}
                    </p>

                    {meta.urgency && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-body text-amber-400/80 tracking-wide">
                          {meta.urgency}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-cipher-rim mt-auto">
                      <div>
                        <p className="text-[9px] font-body uppercase tracking-[0.3em] text-cipher-dim mb-0.5">
                          from
                        </p>
                        <p className="text-[13px] font-body font-semibold text-cipher-muted">
                          {meta.startingFrom}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-body font-bold text-cipher-gold group-hover:gap-3 transition-all duration-300">
                        {meta.cta}
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cipher-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <UpcomingEventsStrip />

      <Footer />
    </div>
  );
}
