"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Plane,
  ArrowRight,
  Globe,
  Clock,
  Shield,
  Users,
  Gauge,
  ChevronDown,
  X,
} from "lucide-react";
import Footer from "../../../components/navigation/Footer";
import aircraftData from "../../../data/travel/jets/aircraft.json";
import type { Aircraft, JetCategory } from "../../../features/travel/types";
import { JET_CATEGORY_LABELS } from "../../../features/travel/types";

const ALL_AIRCRAFT: Aircraft[] = aircraftData as Aircraft[];

const CATEGORY_ORDER: JetCategory[] = [
  "light",
  "midsize",
  "super-midsize",
  "large",
  "ultra-long-range",
  "vip-airliner",
];

const DESTINATIONS = [
  { name: "London", time: "7h 30m", distance: "5,500 km", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" },
  { name: "Maldives", time: "4h 15m", distance: "3,200 km", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop" },
  { name: "Paris", time: "6h 45m", distance: "5,000 km", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
  { name: "New York", time: "14h 20m", distance: "11,000 km", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop" },
  { name: "Singapore", time: "7h 00m", distance: "5,850 km", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop" },
  { name: "Seychelles", time: "4h 30m", distance: "2,850 km", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800&auto=format&fit=crop" },
];

const FAQS = [
  { q: "How far in advance should I book?", a: "For regional flights, 24–48 hours is sufficient. For international long-haul, allow 3–7 days to secure optimal aircraft and routing." },
  { q: "What airports serve private jets in Dubai?", a: "Private jets use Al Maktoum International (DWC) and the Executive Flight Terminals at Dubai International (DXB)." },
  { q: "Are meals included?", a: "Standard charters include light refreshments. Gourmet catering by top Dubai restaurants can be arranged with advance notice." },
  { q: "How much luggage can I bring?", a: "Light jets accommodate 5–6 bags; ultra-long-range jets handle 15+ large suitcases. Our team advises per aircraft." },
  { q: "Can I bring pets?", a: "Most operators accommodate pets with advance notice. We arrange the appropriate aircraft and documentation." },
];

// ─── Aircraft Card ────────────────────────────────────────────────────────────

function AircraftCard({ aircraft, index }: { aircraft: Aircraft; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="border border-white/10 hover:border-luxury-gold/40 transition-all duration-500 bg-white/[0.02] overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={aircraft.image}
          alt={aircraft.name}
          className="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-[9px] font-bold uppercase tracking-widest px-2 py-1">
          {JET_CATEGORY_LABELS[aircraft.category]}
        </div>
        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-luxury-gold font-bold text-lg">${aircraft.price_from_hour.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">per hour</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{aircraft.manufacturer}</p>
          <h3 className="text-white font-display text-xl leading-snug">{aircraft.name}</h3>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-white/10">
          <div className="text-center">
            <Users className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
            <p className="text-white text-sm font-medium">{aircraft.capacity}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-wide">Pax</p>
          </div>
          <div className="text-center">
            <Globe className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
            <p className="text-white text-sm font-medium">{aircraft.range_km.toLocaleString()}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-wide">km range</p>
          </div>
          <div className="text-center">
            <Gauge className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
            <p className="text-white text-sm font-medium">{aircraft.speed_kmh}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-wide">km/h</p>
          </div>
        </div>

        {/* Ideal for */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4">{aircraft.ideal_for}</p>

        {/* Features toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-luxury-gold text-xs uppercase tracking-widest mb-3 hover:text-white transition-colors"
        >
          Features <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {aircraft.features.map((f) => (
              <span key={f} className="text-[10px] text-gray-400 border border-white/10 px-2 py-0.5 uppercase tracking-wide">
                {f}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/request"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
        >
          Request Charter <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JetsPage() {
  const [activeCategory, setActiveCategory] = useState<JetCategory | "all">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = useMemo(
    () => activeCategory === "all" ? ALL_AIRCRAFT : ALL_AIRCRAFT.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[440px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2674&auto=format&fit=crop"
            alt="Private jet"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-8">
            <Link href="/travel" className="hover:text-luxury-gold transition-colors">Travel</Link>
            <span>/</span>
            <span className="text-luxury-gold">Private Jets</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-4">Private Jets</h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Charter world-class aircraft to anywhere on earth. Light jets to VIP airliners — on your schedule.
          </p>
        </motion.div>
      </section>

      {/* ── Trust Strip ──────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Globe className="w-5 h-5 text-luxury-gold" />, label: "Global Access" },
              { icon: <Clock className="w-5 h-5 text-luxury-gold" />, label: "24/7 Dispatch" },
              { icon: <Shield className="w-5 h-5 text-luxury-gold" />, label: "ARGUS Rated" },
              { icon: <Plane className="w-5 h-5 text-luxury-gold" />, label: "VIP Terminals" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-gray-400 text-xs uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Tabs ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 px-5 py-2 text-xs uppercase tracking-widest border transition-all ${
              activeCategory === "all"
                ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                : "border-white/10 text-gray-400 hover:border-luxury-gold/40 hover:text-gray-200"
            }`}
          >
            All ({ALL_AIRCRAFT.length})
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const count = ALL_AIRCRAFT.filter((a) => a.category === cat).length;
            if (!count) return null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 text-xs uppercase tracking-widest border transition-all ${
                  activeCategory === cat
                    ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                    : "border-white/10 text-gray-400 hover:border-luxury-gold/40 hover:text-gray-200"
                }`}
              >
                {JET_CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Aircraft Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-medium">{filtered.length}</span> aircraft available
          </p>
          {activeCategory !== "all" && (
            <button
              onClick={() => setActiveCategory("all")}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-luxury-gold transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((aircraft, idx) => (
            <AircraftCard key={aircraft.id} aircraft={aircraft} index={idx} />
          ))}
        </div>
      </section>

      {/* ── Popular Destinations ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="mb-8">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">From Dubai</p>
          <h2 className="text-3xl font-display text-white">Popular Destinations</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className="relative h-52 overflow-hidden border border-white/10 group"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-display text-lg">{dest.name}</h4>
                <div className="flex items-center gap-3 text-gray-400 text-xs mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dest.time}</span>
                  <span>{dest.distance}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
        <div className="mb-10 text-center">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">FAQ</p>
          <h2 className="text-3xl font-display text-white">Common Questions</h2>
        </div>

        <div className="space-y-px">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white hover:text-luxury-gold transition-colors duration-300"
              >
                <span className="font-medium text-sm leading-snug">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 pb-5 overflow-hidden"
                >
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">Empty Legs & Special Rates</p>
            <h3 className="text-white font-display text-xl md:text-2xl">Sign up for exclusive jet charter offers</h3>
          </div>
          <Link
            href="/request"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Request Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

