"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Anchor,
  Wind,
  Mountain,
  Sparkles,
  Ticket,
  Crown,
  Waves,
} from "lucide-react";
import Navbar from "../../../components/navigation/Navbar";
import Footer from "../../../components/navigation/Footer";
import { DALC_EXPERIENCE_CATEGORIES } from "../catalog";
import UpcomingEventsStrip from "../components/UpcomingEventsStrip";

// Premium hero images per category - using reliable Unsplash URLs
const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "desert-adventures":
    "/images/Aristodesert/image1.png",
  "water-activities":
    "/images/water-activities/yamaha-fx-svho.jpg",
  "aerial-and-adrenaline":
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2070&auto=format&fit=crop",
  wellness:
    "/images/beach_clubs/Kyma/image1.jpg",
  "tickets-and-culture":
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070&auto=format&fit=crop",
  "luxury-leisure":
    "/images/dining_entertainment/Billionaire/image1.jpg",
  "photography-experience":
    "/images/Aristodesert/image2.png",
  "signature-dining":
    "/images/Signature Dining/Dinner in the Sky – Dubai.png",
  observation:
    "/images/hotels/address-downtown.jpg",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "desert-adventures": Mountain,
  "water-activities": Waves,
  "aerial-and-adrenaline": Wind,
  wellness: Sparkles,
  "tickets-and-culture": Ticket,
  "luxury-leisure": Crown,
};

const CATEGORY_ACCENTS: Record<string, string> = {
  "desert-adventures": "from-amber-500/30 to-yellow-600/20",
  "water-activities": "from-sky-400/30 to-cyan-500/20",
  "aerial-and-adrenaline": "from-orange-500/30 to-red-600/20",
  wellness: "from-emerald-500/30 to-teal-600/20",
  "tickets-and-culture": "from-purple-500/30 to-pink-600/20",
  "luxury-leisure": "from-luxury-gold/30 to-amber-600/20",
};

export default function ExperiencesHub() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[52vh] flex items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/[0.03] rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.45em] mb-5">
            Experiences
          </p>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-5 leading-tight">
            Curated by Intent
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
            Six pillars of extraordinary. From yacht charters and jet skis on
            the Gulf to the skies above the desert, each category unlocks a
            world of premium bookable moments.
          </p>
        </motion.div>
      </section>

      {/* Category Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DALC_EXPERIENCE_CATEGORIES.map((category, idx) => {
            const Icon = CATEGORY_ICONS[category.slug] || Crown;
            const heroImage = CATEGORY_HERO_IMAGES[category.slug];
            const accentGradient =
              CATEGORY_ACCENTS[category.slug] ||
              "from-luxury-gold/30 to-amber-600/20";

            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link
                  href={`/experiences/${category.slug}`}
                  className="group relative block h-full overflow-hidden rounded-sm border border-white/[0.08] bg-[#0D0D0F] hover:border-luxury-gold/40 transition-all duration-500"
                >
                  {/* Hero Image */}
                  <div className="relative h-52 overflow-hidden">
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5" />
                    )}
                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />

                    {/* Accent color shimmer on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay`}
                    />

                    {/* Icon badge */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-luxury-gold/40 group-hover:bg-luxury-gold/10 transition-all duration-400">
                      <Icon className="w-4 h-4 text-white/70 group-hover:text-luxury-gold transition-colors duration-400" />
                    </div>

                    {/* Item count pill */}
                    <div className="absolute bottom-4 left-5">
                      <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
                        <span className="text-[11px] font-medium text-white/80 tracking-wide">
                          {category.items.length}{" "}
                          {category.items.length === 1
                            ? "experience"
                            : "experiences"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category label */}
                    <p className="text-luxury-gold/70 text-[10px] uppercase tracking-[0.35em] mb-2 font-medium">
                      Category
                    </p>

                    {/* Title */}
                    <h2 className="text-xl font-display text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                      {category.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                      {category.description}
                    </p>

                    {/* CTA Row */}
                    <div className="flex items-center justify-between">
                      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent mr-4" />
                      <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-luxury-gold group-hover:gap-3 transition-all duration-300">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom border glow on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <UpcomingEventsStrip />

      <Footer />
    </div>
  );
}

