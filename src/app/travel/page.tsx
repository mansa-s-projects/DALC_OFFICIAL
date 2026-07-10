'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { PlaneTakeoff, Hotel, Plane, Car, ArrowRight, Star } from 'lucide-react';
import Footer from '../../components/navigation/Footer';

const TRAVEL_CATEGORIES = [
  {
    id: 'flights',
    title: 'Flights',
    description: 'Search 500+ airlines. Economy to First Class. Commercial & private aviation worldwide.',
    icon: <PlaneTakeoff className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    link: '/travel/flights',
    badge: 'Live Search',
  },
  {
    id: 'hotels',
    title: 'Hotels',
    description: 'World-class hotels across every destination - curated, rated, and bookable in seconds.',
    icon: <Hotel className="w-8 h-8" />,
    image: '/images/travel/hotels/atlantis-the-palm.jpg',
    link: '/travel/hotels',
    badge: 'Curated',
  },
  {
    id: 'jets',
    title: 'Private Jets',
    description: 'Charter ultra-long-range aircraft to anywhere on earth. 24/7 ARGUS-rated operators.',
    icon: <Plane className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop',
    link: '/travel/jets',
    badge: 'On Demand',
  },
  {
    id: 'car-rental',
    title: 'Car Rental',
    description: 'Economy, SUV, luxury and electric vehicles for every drive across Dubai and beyond.',
    icon: <Car className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    link: '/travel/car-rental',
    badge: 'Instant',
  },
];

export default function TravelHub() {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/travel/hotels/armani-hotel-dubai.jpg"
            alt="Dubai Travel"
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
            Dubai A La Carte
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Travel<br />
            <span className="text-luxury-gold">Your Way</span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Flights, hotels, private jets and car rentals - plan every step of your journey in one place.
          </p>
        </motion.div>
      </section>

      {/* Category Grid */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRAVEL_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={cat.link}
                className="group relative block h-[22rem] overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent opacity-90" />

                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="text-luxury-gold/80 group-hover:text-luxury-gold transition-colors duration-300">
                      {cat.icon}
                    </div>
                    {cat.badge && (
                      <span className="bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-display text-4xl mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-gray-300 text-sm font-light leading-relaxed max-w-sm">
                      {cat.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Concierge CTA */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-luxury-gold/20 p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
          <div className="relative z-10">
            <Star className="w-8 h-8 text-luxury-gold mx-auto mb-6 opacity-60" />
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              End-to-End Itineraries
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Let Us Plan Your Journey
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Our travel concierges connect your flights, transfers, hotels, and daily itinerary into one flawless experience.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              Contact Travel Concierge
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}


