import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, X, Car } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import TransportFilters from '../../../components/transport/TransportFilters';
import type { TransportFilters as FilterType, TransportService } from '../types';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'What documents do I need to rent a luxury car?',
    a: 'You\'ll need a valid passport, international driving permit (or UAE license), and a credit card for the security deposit. Minimum age is typically 25 for supercars.',
  },
  {
    q: 'Is insurance included?',
    a: 'Yes, comprehensive insurance is included with all our rentals. Options for zero excess are available for an additional fee.',
  },
  {
    q: 'Can I get the car delivered to my hotel?',
    a: 'Absolutely. We offer complimentary delivery and collection within Dubai for rentals of 24 hours or more.',
  },
  {
    q: 'Are chauffeur services available?',
    a: 'Yes, all our luxury sedans include professional chauffeur service. For sports cars, self-drive is standard but chauffeurs can be arranged.',
  },
];

// ─── Cars Data ──────────────────────────────────────────────────────────────────
const CARS_DATA: TransportService[] = [
  {
    id: 'mock-car-1',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'luxury-sedans',
    name: 'Rolls-Royce Ghost',
    slug: 'rolls-royce-ghost-dubai',
    description_short: 'Experience ultimate luxury in the iconic Rolls-Royce Ghost with professional chauffeur.',
    description_long: 'The Rolls-Royce Ghost represents the pinnacle of automotive luxury. With its whisper-quiet cabin, handcrafted leather interior, and effortless performance, this is the perfect choice for weddings, corporate events, or simply experiencing Dubai in unparalleled style. Includes professional chauffeur service.',
    hero_image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2574&auto=format&fit=crop',
    ],
    highlights: [
      'Professional chauffeur included',
      'Starlight headliner',
      'Premium sound system',
      'Rear entertainment',
      'Complimentary refreshments',
    ],
    pricing_model: 'hourly',
    price_from: 1200,
    price_currency: 'AED',
    price_display: 'AED 1,200/hour',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 4,
    min_booking_hours: 4,
    advance_booking_hours: 4,
    specifications: {
      make: 'Rolls-Royce',
      model: 'Ghost',
      year: 2023,
      seats: 4,
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Arctic White',
      engine: '6.75L V12',
      horsepower: '563 hp',
      acceleration_0_100: '4.8s',
      top_speed: '250 km/h',
    },
    location: 'Dubai',
    area: 'Downtown Dubai',
    pickup_locations: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-car-2',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'sports-cars',
    name: 'Lamborghini Huracán EVO',
    slug: 'lamborghini-huracan-evo-dubai',
    description_short: 'Unleash the bull — experience the raw power of the Huracán EVO on Dubai\'s roads.',
    description_long: 'The Lamborghini Huracán EVO delivers an adrenaline-pumping driving experience with its naturally aspirated V10 engine and advanced aerodynamics. Feel the roar of 640 horsepower as you cruise down Sheikh Zayed Road or take a scenic drive to Hatta. Available for self-drive or with instructor.',
    hero_image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2574&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1614200187524-dc411f8f105c?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2670&auto=format&fit=crop',
    ],
    highlights: [
      '640 hp V10 engine',
      '0-100 km/h in 2.9s',
      'All-wheel drive',
      'LDVI supercomputer',
      'Full insurance included',
    ],
    pricing_model: 'daily',
    price_from: 3500,
    price_currency: 'AED',
    price_display: 'From AED 3,500/day',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 2,
    min_booking_hours: 24,
    advance_booking_hours: 12,
    specifications: {
      make: 'Lamborghini',
      model: 'Huracán EVO',
      year: 2023,
      seats: 2,
      transmission: '7-speed DCT',
      fuel: 'Petrol',
      color: 'Verde Mantis',
      engine: '5.2L V10',
      horsepower: '640 hp',
      acceleration_0_100: '2.9s',
      top_speed: '325 km/h',
    },
    location: 'Dubai',
    area: 'Dubai Marina',
    pickup_locations: ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai'],
    is_featured: true,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-car-3',
    category: 'transport',
    subcategory: 'cars',
    sub_subcategory: 'suvs',
    name: 'Range Rover Autobiography',
    slug: 'range-rover-autobiography-dubai',
    description_short: 'Supreme comfort meets off-road capability in the flagship Range Rover.',
    description_long: 'The Range Rover Autobiography offers the perfect blend of luxury and versatility. Whether you\'re attending a business meeting or exploring the desert dunes, this SUV delivers exceptional comfort with its executive rear seats, Meridian sound system, and air suspension.',
    hero_image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?q=80&w=2574&auto=format&fit=crop',
    ],
    highlights: [
      'Executive class rear seats',
      'Terrain Response 2',
      'Panoramic roof',
      'Meridian Signature audio',
      'Air suspension',
    ],
    pricing_model: 'daily',
    price_from: 2200,
    price_currency: 'AED',
    price_display: 'From AED 2,200/day',
    availability_type: 'on_demand',
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    max_capacity: 5,
    min_booking_hours: 24,
    advance_booking_hours: 6,
    specifications: {
      make: 'Land Rover',
      model: 'Range Rover Autobiography',
      year: 2023,
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Santorini Black',
      engine: '4.4L V8',
      horsepower: '530 hp',
      acceleration_0_100: '4.6s',
      top_speed: '250 km/h',
    },
    location: 'Dubai',
    area: 'Business Bay',
    pickup_locations: ['Business Bay', 'Downtown Dubai', 'Dubai Airport'],
    is_featured: false,
    is_trending: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function CarsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    subcategory: 'cars',
  });

  const services = useMemo(() => {
    return CARS_DATA.filter((car) => {
      if (filters.sub_subcategory && car.sub_subcategory !== filters.sub_subcategory) return false;
      if (filters.pricing_model && car.pricing_model !== filters.pricing_model) return false;
      if (filters.price_min != null && (car.price_from == null || car.price_from < filters.price_min)) return false;
      if (filters.price_max != null && (car.price_from == null || car.price_from > filters.price_max)) return false;
      if (filters.availability_type && car.availability_type !== filters.availability_type) return false;
      if (filters.capacity_min != null && (car.max_capacity == null || car.max_capacity < filters.capacity_min)) return false;
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
    setFilters({ subcategory: 'cars' });
  };

  return (
    <div className="min-h-screen bg-luxury-black">

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop"
            alt="Luxury cars Dubai"
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
            <span className="text-luxury-gold">Luxury Cars</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            Luxury Cars
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            From elegant sedans to adrenaline-pumping supercars — 
            experience Dubai\'s roads in extraordinary style.
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
              subcategory="cars"
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
                    <span className="text-white font-medium">{services.length}</span> vehicle
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
                <Car className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No vehicles found</p>
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
