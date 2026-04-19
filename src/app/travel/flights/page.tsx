"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  Calendar,
  Users,
  ChevronDown,
  Search,
  Clock,
  Globe,
  Shield,
  ArrowRight,
  X,
  Minus,
  Plus,
} from "lucide-react";
import Footer from "../../../components/navigation/Footer";
import airportsData from "../../../data/travel/flights/airports.json";
import type { Airport, FlightSearchParams, CabinClass, FlightType } from "../../../features/travel/types";
import { CABIN_CLASS_LABELS } from "../../../features/travel/types";

const AIRPORTS: Airport[] = airportsData as Airport[];

const POPULAR_ROUTES = [
  {
    from: "Dubai",
    from_code: "DXB",
    to: "London",
    to_code: "LHR",
    duration: "7h 30m",
    price_from: "AED 2,890",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
  },
  {
    from: "Dubai",
    from_code: "DXB",
    to: "Paris",
    to_code: "CDG",
    duration: "7h 10m",
    price_from: "AED 3,100",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
  },
  {
    from: "Dubai",
    from_code: "DXB",
    to: "New York",
    to_code: "JFK",
    duration: "14h 20m",
    price_from: "AED 5,400",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop",
  },
  {
    from: "Dubai",
    from_code: "DXB",
    to: "Maldives",
    to_code: "MLE",
    duration: "4h 05m",
    price_from: "AED 1,650",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop",
  },
  {
    from: "Dubai",
    from_code: "DXB",
    to: "Singapore",
    to_code: "SIN",
    duration: "7h 00m",
    price_from: "AED 2,750",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop",
  },
  {
    from: "Dubai",
    from_code: "DXB",
    to: "Tokyo",
    to_code: "NRT",
    duration: "9h 30m",
    price_from: "AED 3,800",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop",
  },
];

// ─── Airport Combobox ─────────────────────────────────────────────────────────

function AirportInput({
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  value: Airport | null;
  onChange: (a: Airport) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 1
    ? AIRPORTS.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.code.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : AIRPORTS.slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 focus-within:border-luxury-gold/60 transition-colors">
        <Icon className="w-4 h-4 text-luxury-gold flex-shrink-0" />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent text-white placeholder-gray-500 text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); onChange({ code: "", name: "", city: "", country: "", country_code: "", region: "" }); }}
            className="text-gray-600 hover:text-gray-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#111009] border border-white/10 shadow-2xl max-h-64 overflow-y-auto"
          >
            {filtered.map((airport) => (
              <button
                key={airport.code}
                onClick={() => {
                  onChange(airport);
                  setQuery(`${airport.city} (${airport.code})`);
                  setOpen(false);
                }}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors"
              >
                <span className="text-luxury-gold font-mono text-sm font-bold w-10 flex-shrink-0 mt-0.5">
                  {airport.code}
                </span>
                <div>
                  <p className="text-white text-sm leading-snug">{airport.city}</p>
                  <p className="text-gray-500 text-xs">{airport.name} · {airport.country}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Passenger Selector ───────────────────────────────────────────────────────

function PassengerSelector({
  params,
  onChange,
}: {
  params: FlightSearchParams;
  onChange: (p: Partial<FlightSearchParams>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const total = params.adults + params.children + params.infants;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const Row = ({
    label,
    sub,
    value,
    onInc,
    onDec,
    min,
  }: {
    label: string;
    sub: string;
    value: number;
    onInc: () => void;
    onDec: () => void;
    min: number;
  }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white text-sm">{label}</p>
        <p className="text-gray-500 text-xs">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={value <= min}
          className="w-7 h-7 flex items-center justify-center border border-white/20 text-gray-400 hover:border-luxury-gold/60 hover:text-luxury-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-white w-5 text-center text-sm">{value}</span>
        <button
          onClick={onInc}
          className="w-7 h-7 flex items-center justify-center border border-white/20 text-gray-400 hover:border-luxury-gold/60 hover:text-luxury-gold transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-luxury-gold/40 transition-colors w-full"
      >
        <Users className="w-4 h-4 text-luxury-gold flex-shrink-0" />
        <span className="text-white text-sm flex-1 text-left">
          {total} Passenger{total !== 1 ? "s" : ""}
        </span>
        <span className="text-gray-500 text-xs">{CABIN_CLASS_LABELS[params.cabin_class]}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#111009] border border-white/10 shadow-2xl p-4 min-w-[280px]"
          >
            <Row
              label="Adults" sub="Age 12+"
              value={params.adults}
              onInc={() => onChange({ adults: params.adults + 1 })}
              onDec={() => onChange({ adults: Math.max(1, params.adults - 1) })}
              min={1}
            />
            <Row
              label="Children" sub="Age 2–11"
              value={params.children}
              onInc={() => onChange({ children: params.children + 1 })}
              onDec={() => onChange({ children: Math.max(0, params.children - 1) })}
              min={0}
            />
            <Row
              label="Infants" sub="Under 2"
              value={params.infants}
              onInc={() => onChange({ infants: params.infants + 1 })}
              onDec={() => onChange({ infants: Math.max(0, params.infants - 1) })}
              min={0}
            />

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Cabin Class</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(CABIN_CLASS_LABELS) as [CabinClass, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => onChange({ cabin_class: key })}
                    className={`px-3 py-2 text-xs border transition-all ${
                      params.cabin_class === key
                        ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                        : "border-white/10 text-gray-400 hover:border-luxury-gold/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-luxury-gold text-luxury-black text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FlightsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [params, setParams] = useState<FlightSearchParams>({
    type: "round_trip",
    origin: null,
    destination: null,
    depart_date: today,
    return_date: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabin_class: "economy",
  });

  const [searched, setSearched] = useState(false);

  const update = (patch: Partial<FlightSearchParams>) =>
    setParams((p) => ({ ...p, ...patch }));

  const swapRoutes = () =>
    update({ origin: params.destination, destination: params.origin });

  const canSearch = Boolean(params.origin?.code && params.destination?.code && params.depart_date);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-end pt-24 pb-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
            alt="Flights"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/40 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center mb-8"
        >
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-6">
            <Link href="/travel" className="hover:text-luxury-gold transition-colors">Travel</Link>
            <span>/</span>
            <span className="text-luxury-gold">Flights</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-3">Flights</h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            Search millions of flights. Compare prices. Book in seconds.
          </p>
        </motion.div>

        {/* ── Search Box ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-20 w-full max-w-6xl mx-auto px-4"
        >
          <div className="bg-luxury-black/95 border border-white/10 p-6 backdrop-blur-md">
            {/* Flight type tabs */}
            <div className="flex gap-1 mb-6">
              {(["round_trip", "one_way"] as FlightType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ type: t })}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-all ${
                    params.type === t
                      ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t === "round_trip" ? "Round Trip" : "One Way"}
                </button>
              ))}
            </div>

            {/* Route row */}
            <div className="flex flex-col md:flex-row gap-2 mb-3">
              <AirportInput
                value={params.origin}
                onChange={(a) => update({ origin: a })}
                placeholder="Where from?"
                icon={PlaneTakeoff}
              />

              <button
                onClick={swapRoutes}
                className="self-center md:self-auto flex-shrink-0 p-2.5 border border-white/10 text-gray-500 hover:border-luxury-gold/40 hover:text-luxury-gold transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <AirportInput
                value={params.destination}
                onChange={(a) => update({ destination: a })}
                placeholder="Where to?"
                icon={PlaneLanding}
              />

              {/* Dates */}
              <div className="flex gap-2 flex-1">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 focus-within:border-luxury-gold/60 transition-colors flex-1">
                  <Calendar className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                  <input
                    type="date"
                    value={params.depart_date}
                    min={today}
                    onChange={(e) => update({ depart_date: e.target.value })}
                    className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
                  />
                </div>
                {params.type === "round_trip" && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 focus-within:border-luxury-gold/60 transition-colors flex-1">
                    <Calendar className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                    <input
                      type="date"
                      value={params.return_date}
                      min={params.depart_date || today}
                      onChange={(e) => update({ return_date: e.target.value })}
                      placeholder="Return"
                      className="bg-transparent text-white text-sm outline-none w-full [color-scheme:dark]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Passengers + Search */}
            <div className="flex gap-2">
              <div className="flex-1 max-w-xs">
                <PassengerSelector params={params} onChange={update} />
              </div>
              <button
                onClick={() => { if (canSearch) setSearched(true); }}
                disabled={!canSearch}
                className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Search className="w-4 h-4" />
                Search Flights
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Search Results ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {searched && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 py-12"
          >
            <div className="border border-luxury-gold/20 p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
              <PlaneTakeoff className="w-10 h-10 text-luxury-gold mx-auto mb-4 opacity-60" />
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Searching</p>
              <h3 className="text-white font-display text-2xl md:text-3xl mb-3">
                {params.origin?.city} → {params.destination?.city}
              </h3>
              <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                Live flight search via Travelpayouts, Booking.com and partner airlines is being integrated.
                Our concierge team can book any flight for you right now.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
              >
                Book via Concierge <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Trust Strip ──────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02] mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Globe className="w-5 h-5 text-luxury-gold" />, label: "190+ Countries" },
              { icon: <Clock className="w-5 h-5 text-luxury-gold" />, label: "Real-Time Prices" },
              { icon: <Shield className="w-5 h-5 text-luxury-gold" />, label: "Secure Booking" },
              { icon: <PlaneTakeoff className="w-5 h-5 text-luxury-gold" />, label: "500+ Airlines" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-gray-400 text-xs uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Routes ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-10">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">From Dubai</p>
          <h2 className="text-3xl font-display text-white">Popular Routes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_ROUTES.map((route, idx) => (
            <motion.div
              key={`${route.from_code}-${route.to_code}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
            >
              <button
                onClick={() => {
                  const origin = AIRPORTS.find((a) => a.code === route.from_code) ?? null;
                  const destination = AIRPORTS.find((a) => a.code === route.to_code) ?? null;
                  update({ origin, destination });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group w-full relative h-56 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500 text-left"
              >
                <img
                  src={route.image}
                  alt={route.to}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-luxury-gold/70 group-hover:text-luxury-gold transition-colors">
                    <span className="font-mono text-xs font-bold">{route.from_code}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-mono text-xs font-bold">{route.to_code}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-display text-xl mb-1 group-hover:text-luxury-gold transition-colors">
                      {route.to}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {route.duration}
                      </span>
                      <span className="text-luxury-gold text-sm font-bold">{route.price_from}</span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Concierge CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Need Complex Routing?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Our travel concierge books any flight worldwide
            </h3>
          </div>
          <Link
            href="/request"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Enquire Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

