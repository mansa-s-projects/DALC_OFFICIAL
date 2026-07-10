import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, X, Plane } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import TransportFilters from '../../../components/transport/TransportFilters';
import type { TransportFilters as FilterType, TransportService } from '../types';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How far in advance do I need to book a private jet?',
    a: 'While we can sometimes accommodate flights with as little as 4 hours notice, we recommend booking at least 48 hours in advance to ensure your preferred aircraft is available.',
  },
  {
    q: 'Which airports do you operate from?',
    a: 'We primarily operate from VIP terminals at Al Maktoum International (DWC) and Dubai International (DXB). Global destinations will utilize executive terminals where available.',
  },
  {
    q: 'Is catering included on the flights?',
    a: 'Yes, VIP catering tailored to your preferences is included on all private jet charters.',
  },
  {
    q: 'Are pets allowed on board?',
    a: 'Yes, most of our operators are pet-friendly. Please inform us ahead of time so we can make the necessary arrangements.',
  },
];

// ─── Jets Data ──────────────────────────────────────────────────────────────────
const JETS_DATA: TransportService[] = [
  {
    id: 'mock-jet-1',
    category: 'transport',
    subcategory: 'jets',
    sub_subcategory: 'private-charter',
    name: 'Gulfstream G650',
    slug: 'gulfstream-g650-private-charter',
    description_short: 'Ultra-long-range business jet seating 14 — Dubai to London non-stop.',
    description_long: 'The Gulfstream G650 is the gold standard in business aviation. With a range of 13,000 km and a cabin altitude of just 4,000 feet at cruise, you\'ll arrive refreshed anywhere in the world. Features include a full galley, private stateroom, and high-speed WiFi.',
    hero_image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590073242678-cfea534351a5?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      'Range: 13,000 km',
      '14 passengers',
      'Cruise speed: Mach 0.90',
      'Full stand-up cabin',
      'Private stateroom',
      'Global coverage',
    ],
    pricing_model: 'per_trip',
    price_from: 185000,
    price_currency: 'AED',
    price_display: 'From AED 185,000',
    availability_type: 'by_request',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 14,
    min_booking_hours: 48,
    advance_booking_hours: 48,
    specifications: {
      aircraft_type: 'Ultra Long Range',
      range_km: 13000,
      seats: 14,
      luggage_capacity: '195 cu ft',
      cruising_speed: 'Mach 0.90',
      max_altitude: '51,000 ft',
      year_manufactured: 2022,
      operator: 'ExecuJet Middle East',
    },
    location: 'Dubai',
    area: 'Al Maktoum International',
    pickup_locations: ['Al Maktoum International (DWC)', 'Dubai International (DXB)'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-jet-2',
    category: 'transport',
    subcategory: 'jets',
    sub_subcategory: 'helicopter-tours',
    name: 'Helicopter Tour — Dubai Skyline',
    slug: 'helicopter-tour-dubai-skyline',
    description_short: 'Breathtaking 25-minute helicopter tour over Dubai\'s iconic landmarks.',
    description_long: 'Take to the skies and witness Dubai\'s architectural wonders from above. This 25-minute tour covers the Palm Jumeirah, Burj Al Arab, Burj Khalifa, and the World Islands. Professional pilot with thousands of flight hours ensures a safe and memorable experience.',
    hero_image: 'https://images.unsplash.com/photo-1506467493604-25d7861a67c5?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '25-minute flight',
      '5 passengers max',
      'Professional pilot',
      'Bird\'s eye views',
      'Photo opportunities',
      'Hotel pickup available',
    ],
    pricing_model: 'fixed',
    price_from: 4500,
    price_currency: 'AED',
    price_display: 'AED 4,500 (whole helicopter)',
    availability_type: 'scheduled',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 5,
    min_booking_hours: 4,
    advance_booking_hours: 12,
    specifications: {
      aircraft_type: 'AW139 Helicopter',
      range_km: 500,
      seats: 5,
      luggage_capacity: 'Limited',
      cruising_speed: '165 knots',
      max_altitude: '15,000 ft',
      year_manufactured: 2021,
      operator: 'Falcon Aviation',
    },
    location: 'Dubai',
    area: 'Dubai Helipad',
    pickup_locations: ['Dubai Helipad (Atlantis)', 'Dubai Helipad (Burj Al Arab)'],
    is_featured: false,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function JetsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    subcategory: 'jets',
  });

  const services = useMemo(() => {
    return JETS_DATA.filter((jet) => {
      if (filters.sub_subcategory && jet.sub_subcategory !== filters.sub_subcategory) return false;
      if (filters.pricing_model && jet.pricing_model !== filters.pricing_model) return false;
      if (filters.price_min != null && (jet.price_from == null || jet.price_from < filters.price_min)) return false;
      if (filters.price_max != null && (jet.price_from == null || jet.price_from > filters.price_max)) return false;
      if (filters.availability_type && jet.availability_type !== filters.availability_type) return false;
      if (filters.capacity_min != null && (jet.max_capacity == null || jet.max_capacity < filters.capacity_min)) return false;
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
    setFilters({ subcategory: 'jets' });
  };

  return (
    <div className="min-h-screen bg-luxury-black">

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2670&auto=format&fit=crop"
            alt="Private jets and helicopters Dubai"
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
            <span className="text-luxury-gold">Private Jets & Helicopters</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            Private Aviation
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            From scenic helicopter tours over Dubai to ultra-long-range global business jets — elevate your journey.
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
              Our aviation concierge is available 24/7
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
