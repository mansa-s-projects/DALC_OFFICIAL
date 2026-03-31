'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Car, ArrowRight, Zap, Users } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import {
  CAR_CATEGORIES,
  getCarImage,
  type CarItem,
} from '../../../data/carsData';

const RENTAL_CATEGORIES = CAR_CATEGORIES;

// ─── Car Card ─────────────────────────────────────────────────────────────────

function CarCard({ car, categoryId, index }: { car: CarItem; categoryId: string; index: number }) {
  const image = getCarImage(car.id, categoryId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        href={`/travel/car-rental/${car.id}`}
        className="group block border border-white/10 hover:border-luxury-gold/50 transition-all duration-300 bg-white/[0.02]"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
          {car.popular && (
            <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
              Popular
            </span>
          )}
          {car.isNew && (
            <span className="absolute top-3 left-3 bg-white text-luxury-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-white font-display text-lg leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                {car.brand} {car.model}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">{car.year}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-luxury-gold font-bold text-lg">{car.dailyPrice} AED</p>
              <p className="text-gray-600 text-xs">/ day</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-xs">
            {car.fuel === 'Electric' ? (
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-luxury-gold" /> Electric
              </span>
            ) : (
              <span>{car.fuel}</span>
            )}
            {car.seats && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {car.seats} seats
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-luxury-gold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
              View details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CarRentalPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCategories = activeCategory === 'all'
    ? RENTAL_CATEGORIES
    : RENTAL_CATEGORIES.filter((c) => c.id === activeCategory);

  const totalCount = RENTAL_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[45vh] min-h-[360px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2670&auto=format&fit=crop"
            alt="Car rental Dubai"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-black/70 to-luxury-black" />
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
            <span className="text-luxury-gold">Car Rental</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">Car Rental</h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            From economy to luxury, business, sport, and electric options for every drive in Dubai.
          </p>
        </motion.div>
      </section>

      {/* ── Filter Tabs ──────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-5 py-2 text-xs uppercase tracking-widest border transition-all duration-200 ${
              activeCategory === 'all'
                ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10'
                : 'border-white/10 text-gray-400 hover:border-luxury-gold/40 hover:text-luxury-gold'
            }`}
          >
            All ({totalCount})
          </button>
          {RENTAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 text-xs uppercase tracking-widest border transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10'
                  : 'border-white/10 text-gray-400 hover:border-luxury-gold/40 hover:text-luxury-gold'
              }`}
            >
              {cat.title} ({cat.items.length})
            </button>
          ))}
        </div>
      </section>

      {/* ── Car Grid ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="mb-16 last:mb-0">
            <div className="flex items-center gap-4 mb-8">
              <Car className="w-5 h-5 text-luxury-gold" />
              <h2 className="text-white font-display text-2xl">{cat.title}</h2>
              <span className="text-gray-600 text-sm">({cat.items.length} vehicles)</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cat.items.map((car, idx) => (
                <CarCard key={car.id} car={car} categoryId={cat.id} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">Need Assistance?</p>
            <h3 className="text-white font-display text-xl md:text-2xl">Our transport concierge is available 24/7</h3>
          </div>
          <Link
            href="/request"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
