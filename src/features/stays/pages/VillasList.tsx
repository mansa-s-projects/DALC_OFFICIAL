"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Users,
  Clock,
  Car,
  Utensils,
  Waves,
  Zap,
} from "lucide-react";
import Navbar from "../../../components/navigation/Navbar";
import Footer from "../../../components/navigation/Footer";

const IMAGES = [
  "/images/desert-adventures/Aristodesert/Screenshot 2026-04-14 200016.png",
  "/images/desert-adventures/Aristodesert/Screenshot 2026-04-14 200034.png",
  "/images/desert-adventures/Aristodesert/Screenshot 2026-04-14 200046.png",
];

const EXPERIENCES = [
  {
    icon: <Waves className="w-6 h-6" />,
    title: "Private Villa & Pool",
    desc: "Recently refurbished luxury villa in the heart of the desert. Private pool, terrace, and sundowners included.",
    price: "From AED 1,750",
    detail: "5 hours · max 6 guests",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Buggy & Quad Rides",
    desc: "Take command of the latest Can-Am Mavericks and Polaris RZRs, engineered to conquer the legendary red sands of Al Badayer.",
    price: "From AED 300",
    detail: "30 min sessions",
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: "Desert Dining",
    desc: "Gourmet meals, specialty coffee, grilled marshmallows by the campfire, and star-lit dining experiences where every bite tells a story.",
    price: "From AED 60",
    detail: "Full menu available",
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: "Sandboarding",
    desc: "Glide down the majestic deep crimson dunes of Al Badayer — one of the UAE's most iconic desert landscapes.",
    price: "Included",
    detail: "With desert break",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Football Arena",
    desc: "Professional 5-a-side pitch with lighting for exhilarating night games. Perfect for groups and team building.",
    price: "AED 200",
    detail: "1.5 hour session",
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: "Chauffeur Transfer",
    desc: "Door-to-door round trip from Dubai or Sharjah to the Al Badayer estate, fully arranged by our team.",
    price: "AED 400",
    detail: "Round trip",
  },
];

const MENU = {
  starters: [
    { name: "Moroccan Salad", price: 25 },
    { name: "Bruschetta", price: 30 },
    { name: "Chakchouka", price: 40 },
    { name: "Caesar Salad", price: 50 },
  ],
  plates: [
    { name: "Pasta Alfredo with Chicken & Mushroom", price: 60 },
    { name: "Tuna Pasta", price: 60 },
    { name: "Couscous & Tajine", price: null, note: "24h advance booking required" },
  ],
  bbq: [
    { name: "Aristo Burger — Beef or Chicken + Fries", price: 60 },
    { name: "Baguette", price: 70, note: "24h advance booking required" },
    { name: "Aristo Formula 3", price: 100 },
    { name: "Aristo Formula 2", price: 150 },
    { name: "Aristo Formula 1 — Marinated Steak + 2 Lambchops", price: 200 },
  ],
  desserts: [
    { name: "Msemen with Honey", price: 20 },
    { name: "Fruit Platter", price: 70, note: "Min. 2 persons" },
  ],
  beverages: [
    { name: "Soft Drinks", price: "10–20" },
    { name: "Mocktails", price: 25 },
    { name: "Coffee / Tea", price: "10–15" },
  ],
};

const PRICING = [
  { label: "Private Villa + Pool", detail: "5 hours · max 6 guests", price: "AED 1,750" },
  { label: "Overnight Villa Stay", detail: "Includes breakfast", price: "AED 2,200", highlight: true },
  { label: "Pool Access", detail: "Per session", price: "AED 100" },
  { label: "Desert Break", detail: "Desert experience", price: "AED 150" },
  { label: "BBQ in Desert", detail: "Full setup included", price: "AED 500" },
  { label: "Football (1h30)", detail: "Floodlit arena", price: "AED 200" },
  { label: "Chauffeur Transfer", detail: "Round trip Dubai/Sharjah", price: "AED 400" },
  { label: "Quad Bike — 30 min", detail: "From", price: "AED 300" },
  { label: "Buggy — 30 min", detail: "Can-Am / Polaris", price: "AED 1,200" },
];

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 h-[420px]">
        <div
          className="col-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => { setActive(0); setLightbox(true); }}
        >
          <img src={IMAGES[0]} alt="Aristo Desert Villa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="flex flex-col gap-2">
          {IMAGES.slice(1).map((img, i) => (
            <div key={i} className="flex-1 relative overflow-hidden cursor-pointer group"
              onClick={() => { setActive(i + 1); setLightbox(true); }}
            >
              <img src={img} alt={`Villa interior ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          >
            <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white/60 hover:text-white">
              <X className="w-7 h-7" />
            </button>
            <button onClick={() => setActive((a) => (a - 1 + IMAGES.length) % IMAGES.length)} className="absolute left-6 text-white/60 hover:text-white p-2">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={() => setActive((a) => (a + 1) % IMAGES.length)} className="absolute right-6 text-white/60 hover:text-white p-2">
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.img key={active} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
              src={IMAGES[active]} alt="Villa" className="max-w-5xl max-h-[85vh] w-full object-contain"
            />
            <div className="absolute bottom-6 flex gap-2">
              {IMAGES.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-luxury-gold" : "w-1.5 bg-white/30"}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VillasList() {
  const [menuTab, setMenuTab] = useState<"starters" | "plates" | "bbq" | "desserts" | "beverages">("bbq");

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] flex flex-col items-center justify-center pt-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2676&auto=format&fit=crop"
            alt="Al Badayer desert"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 via-luxury-black/30 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-3xl mx-auto px-4"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em] mb-6">
            VIP Desert Experience · Private Pools, Dining & Sunsets
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-5 leading-tight">
            Aristo Desert
          </h1>
          <p className="text-gray-300 text-xl font-light mb-4">
            Where Adventure Meets Oasis
          </p>
          <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto mb-10">
            Step into the iconic Al Badayer desert, a landscape renowned for its majestic, deep crimson sands and rolling dunes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="tel:+971585856867"
              className="flex items-center gap-2 px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
            >
              <Phone className="w-4 h-4" /> Book Now
            </Link>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              Al Badayer · Sharjah, UAE
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-16">
        <Gallery />
      </section>

      {/* ── Experiences ──────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Experiences</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">What's Included</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className="border border-white/10 hover:border-luxury-gold/30 transition-all duration-300 bg-white/[0.02] p-6"
            >
              <span className="text-luxury-gold mb-4 block">{exp.icon}</span>
              <h3 className="text-white font-display text-lg mb-2">{exp.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{exp.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-luxury-gold font-bold text-sm">{exp.price}</span>
                <span className="text-gray-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{exp.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Transparent Pricing</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Activity Rates</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRICING.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-4 px-5 py-4 border transition-all ${
                item.highlight
                  ? "border-luxury-gold/40 bg-luxury-gold/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${item.highlight ? "text-luxury-gold" : "text-white"}`}>{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.detail}</p>
              </div>
              <p className={`font-bold text-sm flex-shrink-0 ${item.highlight ? "text-luxury-gold" : "text-white"}`}>{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Menu ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Food & Beverages</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Desert Menu</h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none mb-8 pb-2">
          {(["bbq", "starters", "plates", "desserts", "beverages"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMenuTab(tab)}
              className={`flex-shrink-0 px-5 py-2 text-xs uppercase tracking-widest border transition-all ${
                menuTab === tab
                  ? "border-luxury-gold text-luxury-gold bg-luxury-gold/10"
                  : "border-white/10 text-gray-500 hover:border-luxury-gold/30 hover:text-gray-300"
              }`}
            >
              {tab === "bbq" ? "BBQ" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="border border-white/10 divide-y divide-white/5">
          {MENU[menuTab].map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-6 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-white text-sm">{item.name}</p>
                {"note" in item && item.note && (
                  <p className="text-gray-600 text-xs mt-0.5">{item.note}</p>
                )}
              </div>
              <p className="text-luxury-gold font-bold text-sm flex-shrink-0">
                {item.price !== null ? `AED ${item.price}` : "On request"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Book CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-luxury-gold/20 p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_70%)]" />
          <div className="relative z-10">
            <Star className="w-7 h-7 text-luxury-gold mx-auto mb-5 opacity-60" />
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">Reserve Your Experience</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-4">Ready for the Desert?</h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto mb-10">
              Contact Aristo Desert directly to book your private villa, activities, and dining — our concierge handles the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="tel:+971585856867"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
              >
                <Phone className="w-4 h-4" /> +971 585 856 867
              </Link>
              <Link
                href="mailto:info@aristodesert.ae"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all"
              >
                <Mail className="w-4 h-4" /> info@aristodesert.ae
              </Link>
              <Link
                href="/request"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-gray-300 text-sm font-bold uppercase tracking-widest hover:border-luxury-gold/30 hover:text-luxury-gold transition-all"
              >
                Book via Concierge <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-600 text-xs mt-6">
              <MapPin className="w-3 h-3 inline mr-1" />Al Badayer · Sharjah, UAE · @aristo.desert
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
