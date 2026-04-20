import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, X, Ship } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import TransportFilters from '../../../components/transport/TransportFilters';
import type { TransportFilters as FilterType, TransportService } from '../types';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Do I need a license to charter a yacht?',
    a: 'No, all our yacht charters come with a professional captain and crew to ensure a safe and relaxing experience.',
  },
  {
    q: 'Is catering included?',
    a: 'Basic refreshments are included. Full catering, live BBQ, and private chefs can be arranged upon request for an additional fee.',
  },
  {
    q: 'Can we bring our own food and beverages?',
    a: 'Yes, you are welcome to bring your own. Most of our yachts are equipped with kitchen facilities and coolers.',
  },
  {
    q: 'What happens if the weather is bad?',
    a: 'Safety is our priority. If the Coast Guard restricts sailing due to weather, we will reschedule your charter or offer a full refund.',
  },
];

// ─── Yachts Data ────────────────────────────────────────────────────────────────
const YACHTS_DATA: TransportService[] = [
  {
    id: 'mock-yacht-1',
    category: 'transport',
    subcategory: 'yachts',
    sub_subcategory: 'day-cruises',
    name: '85ft Majesty Yacht',
    slug: '85ft-majesty-yacht-dubai',
    description_short: 'Luxury yacht charter for up to 30 guests — perfect for celebrations and corporate events.',
    description_long: 'Step aboard this stunning 85-foot Gulf Craft Majesty and experience Dubai from the water. With spacious sun decks, a fully equipped kitchen, and elegant interior spaces, this yacht is ideal for birthday parties, corporate gatherings, or romantic sunset cruises. Professional crew of 4 included.',
    hero_image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe79ba66?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      'Up to 30 guests',
      '4 professional crew members',
      'BBQ grill & full kitchen',
      'Sun deck with jacuzzi',
      'Sound system & TV',
      'Water sports equipment',
    ],
    pricing_model: 'hourly',
    price_from: 3500,
    price_currency: 'AED',
    price_display: 'From AED 3,500/hour',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 30,
    min_booking_hours: 3,
    advance_booking_hours: 24,
    specifications: {
      length_ft: 85,
      cabins: 4,
      crew_size: 4,
      max_guests: 30,
      builder: 'Gulf Craft',
      year_built: 2021,
      beam_ft: 20,
      draft_ft: 5.5,
      cruising_speed: '18 knots',
      range_nm: 450,
    },
    location: 'Dubai',
    area: 'Dubai Marina',
    pickup_locations: ['Dubai Marina', 'Palm Jumeirah', 'JBR'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-yacht-2',
    category: 'transport',
    subcategory: 'yachts',
    sub_subcategory: 'overnight-charters',
    name: '120ft Superyacht — Sovereign',
    slug: '120ft-superyacht-sovereign-dubai',
    description_short: 'Ultimate luxury overnight charter with 5 cabins, spa, and helipad access.',
    description_long: 'The Sovereign is a masterpiece of maritime engineering and luxury design. This 120-foot superyacht features 5 ensuite cabins, a private spa, cinema room, and direct helipad access. Perfect for multi-day cruises to Oman or exclusive overnight stays in Dubai\'s pristine waters. Full crew of 6 plus private chef.',
    hero_image: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?q=80&w=2673&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe79ba66?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '5 luxury ensuite cabins',
      'Private spa & jacuzzi',
      'Cinema room',
      'Helipad access',
      'Private chef included',
      '24-hour butler service',
    ],
    pricing_model: 'daily',
    price_from: 45000,
    price_currency: 'AED',
    price_display: 'From AED 45,000/day',
    availability_type: 'by_request',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 12,
    min_booking_hours: 24,
    advance_booking_hours: 72,
    specifications: {
      length_ft: 120,
      cabins: 5,
      crew_size: 6,
      max_guests: 12,
      builder: 'Benetti',
      year_built: 2020,
      beam_ft: 26,
      draft_ft: 6.5,
      cruising_speed: '14 knots',
      range_nm: 800,
    },
    location: 'Dubai',
    area: 'Palm Jumeirah',
    pickup_locations: ['Palm Jumeirah', 'Dubai Marina', 'World Islands'],
    is_featured: true,
    is_trending: false,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function YachtsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    subcategory: 'yachts',
  });

  const services = useMemo(() => {
    return YACHTS_DATA.filter((yacht) => {
      if (filters.sub_subcategory && yacht.sub_subcategory !== filters.sub_subcategory) return false;
      if (filters.pricing_model && yacht.pricing_model !== filters.pricing_model) return false;
      if (filters.price_min != null && (yacht.price_from == null || yacht.price_from < filters.price_min)) return false;
      if (filters.price_max != null && (yacht.price_from == null || yacht.price_from > filters.price_max)) return false;
      if (filters.availability_type && yacht.availability_type !== filters.availability_type) return false;
      if (filters.capacity_min != null && (yacht.max_capacity == null || yacht.max_capacity < filters.capacity_min)) return false;
      return true;
    });
  }, [filters]);

  const isLoading = false;

  const hasFilters = Boolean(
    filters.sub_subcategory ||
    filters.pricing_model ||
    filters.price_min ||
    filters.price_max ||
    filters.availability_type
  );

  const clearFilters = () => {
    setFilters({ subcategory: 'yachts' });
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2670&auto=format&fit=crop"
            alt="Luxury yachts Dubai"
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
            <span className="text-luxury-gold">Luxury Yachts</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display text-white mb-4">
            Luxury Yachts
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            From intimate day cruisers to magnificent superyachts — 
            experience the Arabian Gulf in extraordinary style.
          </p>
        </motion.div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <TransportFilters
              filters={filters}
              onFilterChange={setFilters}
              subcategory="yachts"
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
                    <span className="text-white font-medium">{services.length}</span> yacht
                    {services.length !== 1 ? 's' : ''} available
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
                <Ship className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No yachts found</p>
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
              Need Assistance?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Our transport concierge is available 24/7
            </h3>
          </div>
          <Link
            href="/contact"
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
