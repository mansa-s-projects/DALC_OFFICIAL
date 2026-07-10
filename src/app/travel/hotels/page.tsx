"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Calendar,
  Users,
  Star,
  MapPin,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  X,
  Minus,
  Plus,
  Hotel,
  Wifi,
  Waves,
} from "lucide-react";
import Footer from "../../../components/navigation/Footer";
import hotelsData from "../../../data/travel/hotels/hotels.json";
import type { Hotel as HotelType, HotelSearchParams } from "../../../features/travel/types";

const ALL_HOTELS: HotelType[] = hotelsData as HotelType[];

const DESTINATIONS = [
  "All", "Dubai", "London", "Paris", "Tokyo", "Singapore",
  "Maldives", "Venice", "Hong Kong", "New York",
  "Seychelles", "Mauritius",
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < rating ? "text-luxury-gold fill-luxury-gold" : "text-gray-700"}`} />
      ))}
    </div>
  );
}

// ─── Guests Dropdown ──────────────────────────────────────────────────────────

function GuestsDropdown({
  search,
  updateSearch,
}: {
  search: HotelSearchParams;
  updateSearch: (p: Partial<HotelSearchParams>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const rows = [
    { label: "Adults", sub: "Age 18+", key: "adults" as const, min: 1 },
    { label: "Children", sub: "Age 0–17", key: "children" as const, min: 0 },
    { label: "Rooms", sub: "", key: "rooms" as const, min: 1 },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-14 px-4 w-full bg-white/5 border border-white/15 hover:border-luxury-gold/50 transition-colors"
      >
        <Users className="w-4 h-4 text-luxury-gold flex-shrink-0" />
        <span className="text-white text-sm flex-1 text-left whitespace-nowrap">
          {search.adults + search.children} guest{search.adults + search.children !== 1 ? "s" : ""} · {search.rooms} room{search.rooms !== 1 ? "s" : ""}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-[#0f0d0a] border border-white/15 shadow-2xl z-[200] p-5"
          >
            {rows.map(({ label, sub, key, min }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  {sub && <p className="text-gray-500 text-xs">{sub}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateSearch({ [key]: Math.max(min, search[key] - 1) })}
                    disabled={search[key] <= min}
                    className="w-8 h-8 flex items-center justify-center border border-white/20 text-gray-400 hover:border-luxury-gold hover:text-luxury-gold disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-white w-6 text-center text-sm font-medium">{search[key]}</span>
                  <button
                    type="button"
                    onClick={() => updateSearch({ [key]: search[key] + 1 })}
                    className="w-8 h-8 flex items-center justify-center border border-white/20 text-gray-400 hover:border-luxury-gold hover:text-luxury-gold transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full h-10 bg-luxury-gold text-luxury-black text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Hotel Card ───────────────────────────────────────────────────────────────

function HotelCard({ hotel, index }: { hotel: HotelType; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group border border-white/10 hover:border-luxury-gold/40 transition-all duration-500 bg-white/[0.02] overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
        {hotel.badge && (
          <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-black text-[9px] font-bold uppercase tracking-widest px-2 py-1">
            {hotel.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-luxury-black/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5 border border-white/10">
          <span className="text-luxury-gold font-bold text-sm">{hotel.rating}</span>
          <span className="text-gray-400 text-xs">/10</span>
        </div>
      </div>

      <div className="p-5">
        <StarRating rating={hotel.stars} />
        <h3 className="text-white font-display text-lg leading-snug mt-1.5 mb-1 group-hover:text-luxury-gold transition-colors duration-300">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{hotel.city}, {hotel.country}</span>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{hotel.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-[10px] text-gray-500 border border-white/10 px-2 py-0.5 uppercase tracking-wide">{a}</span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-[10px] text-gray-600 px-1 py-0.5">+{hotel.amenities.length - 3}</span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2 pt-3 border-t border-white/10">
          <div>
            <p className="text-gray-500 text-xs">From</p>
            <p className="text-luxury-gold font-bold text-lg leading-tight">{hotel.currency} {hotel.price_from.toLocaleString()}</p>
            <p className="text-gray-600 text-xs">per night</p>
          </div>
          <Link
            href={`/travel/hotels/${hotel.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
          >
            Book <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HotelsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState<HotelSearchParams>({
    destination: "",
    check_in: today,
    check_out: "",
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [starsFilter, setStarsFilter] = useState<number | null>(null);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [activeDestination, setActiveDestination] = useState("All");

  const updateSearch = (patch: Partial<HotelSearchParams>) =>
    setSearch((s) => ({ ...s, ...patch }));

  const filtered = useMemo(() => {
    return ALL_HOTELS.filter((h) => {
      if (starsFilter && h.stars < starsFilter) return false;
      if (priceFilter && h.price_from > priceFilter) return false;
      if (activeDestination !== "All" && h.city !== activeDestination && h.country !== activeDestination) return false;
      if (search.destination) {
        const q = search.destination.toLowerCase();
        if (!h.city.toLowerCase().includes(q) && !h.country.toLowerCase().includes(q) && !h.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [starsFilter, priceFilter, activeDestination, search.destination]);

  const hasFilters = starsFilter !== null || priceFilter !== null;

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ── Hero — no overflow-hidden, no search inside ───────────────────── */}
      <section className="relative h-[52vh] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-c6a4d14d8376?q=80&w=2670&auto=format&fit=crop"
            alt="Hotels"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/50 to-luxury-black" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-6">
            <Link href="/travel" className="hover:text-luxury-gold transition-colors">Travel</Link>
            <span>/</span>
            <span className="text-luxury-gold">Hotels</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-3">Hotels</h1>
          <p className="text-gray-300 text-base max-w-lg mx-auto">
            World-class hotels across every destination. Curated by our luxury travel team.
          </p>
        </motion.div>
      </section>

      {/* ── Search Bar — separate section, no clipping issues ────────────── */}
      <section className="relative z-30 max-w-6xl mx-auto px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0f0d0a] border border-white/15 p-4 shadow-2xl"
          suppressHydrationWarning
        >
          {/* Row 1: destination + dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            {/* Destination */}
            <div className="flex items-center gap-2 h-14 px-4 bg-white/5 border border-white/15 focus-within:border-luxury-gold/50 transition-colors">
              <Search className="w-4 h-4 text-luxury-gold flex-shrink-0" />
              <input
                type="text"
                value={search.destination}
                onChange={(e) => updateSearch({ destination: e.target.value })}
                placeholder="Where are you going?"
                className="w-full bg-transparent text-white placeholder-gray-500 text-sm outline-none"
              />
            </div>

            {/* Check-in */}
            <div className="flex items-center gap-3 h-14 px-4 bg-white/5 border border-white/15 focus-within:border-luxury-gold/50 transition-colors">
              <Calendar className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-3" />
              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-600 leading-none mb-1">Check-in</span>
                <input
                  type="date"
                  value={search.check_in}
                  min={today}
                  onChange={(e) => updateSearch({ check_in: e.target.value })}
                  className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark] leading-none"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex items-center gap-3 h-14 px-4 bg-white/5 border border-white/15 focus-within:border-luxury-gold/50 transition-colors">
              <Calendar className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-3" />
              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-600 leading-none mb-1">Check-out</span>
                <input
                  type="date"
                  value={search.check_out}
                  min={search.check_in || today}
                  onChange={(e) => updateSearch({ check_out: e.target.value })}
                  className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark] leading-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: guests + search button */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="md:col-span-3">
              <GuestsDropdown search={search} updateSearch={updateSearch} />
            </div>
            <button className="h-14 flex items-center justify-center gap-2 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Destination Tabs ──────────────────────────────────────────────────── */}
      <section className="mt-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {DESTINATIONS.map((dest) => (
            <button
              key={dest}
              onClick={() => setActiveDestination(dest)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs uppercase tracking-widest border transition-all duration-200 ${
                activeDestination === dest
                  ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                  : "border-white/10 text-gray-500 hover:border-luxury-gold/30 hover:text-gray-300"
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> properties found
          </p>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={() => { setStarsFilter(null); setPriceFilter(null); }}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 border text-xs uppercase tracking-widest transition-all ${
                filtersOpen || hasFilters
                  ? "border-luxury-gold text-luxury-gold bg-luxury-gold/5"
                  : "border-white/10 text-gray-400 hover:border-luxury-gold/40"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters{hasFilters ? ` (${(starsFilter ? 1 : 0) + (priceFilter ? 1 : 0)})` : ""}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -16, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 224 }}
                exit={{ opacity: 0, x: -16, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-56 border border-white/10 p-5 space-y-6">
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Star Rating</p>
                    <div className="space-y-2">
                      {[5, 4, 3].map((stars) => (
                        <button
                          key={stars}
                          onClick={() => setStarsFilter(starsFilter === stars ? null : stars)}
                          className={`w-full flex items-center gap-2 px-3 py-2 border text-xs transition-all ${
                            starsFilter === stars
                              ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold"
                              : "border-white/10 text-gray-400 hover:border-luxury-gold/30"
                          }`}
                        >
                          <StarRating rating={stars} size="xs" />
                          <span>{stars}+ Stars</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Max Price / Night</p>
                    <div className="space-y-2">
                      {[
                        { label: "Under AED 1,000", val: 1000 },
                        { label: "Under AED 2,000", val: 2000 },
                        { label: "Under AED 4,000", val: 4000 },
                      ].map(({ label, val }) => (
                        <button
                          key={val}
                          onClick={() => setPriceFilter(priceFilter === val ? null : val)}
                          className={`w-full text-left px-3 py-2 border text-xs transition-all ${
                            priceFilter === val
                              ? "border-luxury-gold bg-luxury-gold/10 text-luxury-gold"
                              : "border-white/10 text-gray-400 hover:border-luxury-gold/30"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">Amenities</p>
                    <div className="space-y-2">
                      {[
                        { icon: <Waves className="w-3 h-3" />, label: "Pool" },
                        { icon: <Wifi className="w-3 h-3" />, label: "WiFi" },
                        { icon: <Hotel className="w-3 h-3" />, label: "Spa" },
                      ].map(({ icon, label }) => (
                        <button key={label} className="w-full flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-400 hover:border-luxury-gold/30 text-xs transition-all">
                          <span className="text-luxury-gold">{icon}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((hotel, idx) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-white/10">
                <Hotel className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No hotels match your filters</p>
                <button
                  onClick={() => { setStarsFilter(null); setPriceFilter(null); setActiveDestination("All"); updateSearch({ destination: "" }); }}
                  className="text-luxury-gold text-sm underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">Bespoke Hotel Bookings</p>
            <h3 className="text-white font-display text-xl md:text-2xl">Can't find what you're looking for?</h3>
            <p className="text-gray-500 text-sm mt-1">Our team books any hotel worldwide — often at preferential rates.</p>
          </div>
          <Link
            href="/request"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Contact Concierge <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

