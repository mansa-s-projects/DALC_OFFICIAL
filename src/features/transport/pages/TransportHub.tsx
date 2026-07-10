import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Car,
  Plane,
  Ship,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import { useFeaturedTransport } from '../hooks/useTransport';
import type { TransportSubcategory } from '../types';
import { SUBCATEGORY_DESCRIPTIONS } from '../types';

// ─── Category Config ────────────────────────────────────────────────────────────

interface CategoryConfig {
  subcategory: TransportSubcategory;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    subcategory: 'cars',
    label: 'Luxury Cars',
    icon: <Car className="w-7 h-7" />,
    gradient: 'from-amber-900/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'yachts',
    label: 'Super Yachts',
    icon: <Ship className="w-7 h-7" />,
    gradient: 'from-blue-900/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'jets',
    label: 'Private Jets',
    icon: <Plane className="w-7 h-7" />,
    gradient: 'from-zinc-800/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
  },
];

// ─── Stats ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '500+', label: 'Vehicles & Vessels' },
  { value: '24/7', label: 'Concierge Service' },
  { value: '15 min', label: 'Average Response' },
  { value: '100%', label: 'Insured Fleet' },
];

// ─── Features ───────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Instant Booking',
    description: 'Real-time availability with immediate confirmation for most services.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Fully Insured',
    description: 'Comprehensive coverage on all rentals for complete peace of mind.',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Premium Fleet',
    description: 'Only the finest vehicles, yachts, and aircraft in immaculate condition.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Best Price Guarantee',
    description: 'Competitive rates with price matching on equivalent services.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TransportHub() {
  const { data: featured = [], isLoading } = useFeaturedTransport();

  return (
    <div className="min-h-screen bg-luxury-black">

      {/* ── Hero ────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2674&auto=format&fit=crop"
            alt="Luxury transport Dubai"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em] mb-6">
            Dubai À La Carte
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Arrive in<br />
            <span className="text-luxury-gold">Style</span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From supercars to superyachts — experience Dubai\'s finest fleet of luxury transport.
            Professional chauffeurs, experienced crews, and world-class service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/transport/cars"
              className="px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Cars
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/travel"
              className="px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              All Travel Options
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-20 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-luxury-black px-6 py-5 text-center">
              <p className="text-luxury-gold font-display text-2xl md:text-3xl font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Category Cards ───────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Our Fleet
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Choose Your Ride</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.subcategory}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/transport/${cat.subcategory}`}
                className="group relative block h-80 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
              >
                {/* BG Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-display text-2xl mb-2 leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                      {cat.label}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {SUBCATEGORY_DESCRIPTIONS[cat.subcategory]}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-luxury-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Services ────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
              Curated
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-white">Featured Fleet</h2>
          </div>
          <Link
            href="/transport/cars"
            className="text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <div className="text-center py-16 border border-white/10">
            <p className="text-gray-500 italic">Fleet loading soon.</p>
          </div>
        )}
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white">The DALC Difference</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="border border-white/10 bg-white/[0.02] p-6 text-center hover:border-luxury-gold/30 transition-colors duration-300"
            >
              <div className="text-luxury-gold mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-white font-display text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-luxury-gold/20 p-10 md:p-16 text-center"
        >
          {/* BG */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />

          <div className="relative z-10">
            <Star className="w-8 h-8 text-luxury-gold mx-auto mb-6 opacity-60" />
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Bespoke Charters
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Need Something Special?
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              From multi-day yacht charters to international jet bookings, our concierge team 
              can arrange transport experiences tailored to your exact requirements.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              <Star className="w-5 h-5" />
              Request Bespoke Quote
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
