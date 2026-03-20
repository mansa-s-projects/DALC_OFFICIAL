'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, X, Plane, Globe, Clock, Shield } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import TransportFilters from '../../../components/transport/TransportFilters';
import { useTransportServices } from '../../../features/transport/hooks/useTransport';
import type { TransportFilters as FilterType } from '../../../features/transport/types';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How far in advance should I book a private jet?',
    a: 'For domestic and regional flights, 24-48 hours is usually sufficient. For international long-haul, we recommend 3-7 days to secure optimal aircraft and routing.',
  },
  {
    q: 'What airports can private jets use in Dubai?',
    a: 'Private jets primarily use Al Maktoum International (DWC) and the Executive Flight Terminals at Dubai International (DXB). We also arrange access to smaller airports for certain aircraft types.',
  },
  {
    q: 'Are meals included on private jet charters?',
    a: 'Standard charters include light refreshments. Gourmet catering can be arranged with advance notice — anything from simple sandwiches to Michelin-starred multi-course meals.',
  },
  {
    q: 'How much luggage can I bring?',
    a: 'Luggage capacity varies by aircraft. Light jets accommodate 5-6 bags, while ultra-long-range jets can handle 15+ large suitcases. We\'ll advise on the best aircraft for your needs.',
  },
];

// ─── Popular Destinations ───────────────────────────────────────────────────────

const DESTINATIONS = [
  { name: 'London', time: '7h 30m', distance: '5,500 km', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' },
  { name: 'Maldives', time: '4h 15m', distance: '3,200 km', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop' },
  { name: 'Paris', time: '6h 45m', distance: '5,000 km', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mumbai', time: '3h 30m', distance: '1,900 km', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=800&auto=format&fit=crop' },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function JetsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    subcategory: 'jets',
  });

  const { data: services = [], isLoading } = useTransportServices(filters);

  const hasFilters = Boolean(
    filters.sub_subcategory ||
    filters.pricing_model ||
    filters.price_min ||
    filters.price_max ||
    filters.availability_type
  );

  const clearFilters = () => {
    setFilters({ subcategory: 'jets' });
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
            alt="Private jet Dubai"
            className="w-full h-full object-cover opacity-30"
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
            <Link href="/transport" className="hover:text-luxury-gold transition-colors">
              Transport
            </Link>
            <span>/</span>
            <span className="text-luxury-gold">Private Jets</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            Private Jets
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Charter world-class aircraft for business or leisure. 
            Seamless travel from Dubai to anywhere in the world.
          </p>
        </motion.div>
      </section>

      {/* ── Features Strip ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Global Access</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">24/7 Dispatch</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">ARGUS Rated</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Plane className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">VIP Terminals</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <TransportFilters
              filters={filters}
              onFilterChange={setFilters}
              subcategory="jets"
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    <span className="text-white font-medium">{services.length}</span> aircraft
                    {services.length !== 1 ? '' : ''} available
                  </>
                )}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-luxury-gold transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-80 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <ServiceCard key={service.id} service={service} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-white/10">
                <Plane className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No aircraft found</p>
                <p className="text-gray-600 text-sm mb-6">Try adjusting your filters</p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold/10 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Popular Destinations ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            From Dubai
          </p>
          <h2 className="text-2xl font-display text-white">Popular Destinations</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative h-56 overflow-hidden border border-white/10 group"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-display text-lg">{dest.name}</h4>
                <div className="flex items-center gap-3 text-gray-400 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dest.time}
                  </span>
                  <span>{dest.distance}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            FAQ
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-white">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-px">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white hover:text-luxury-gold transition-colors duration-300"
              >
                <span className="font-medium text-sm leading-snug">{faq.q}</span>
                <span className={`text-luxury-gold transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5"
                >
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Empty Legs & Special Rates
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Sign up for exclusive jet charter offers
            </h3>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Subscribe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
