import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, X, Anchor, Waves, Sun } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/transport/ServiceCard';
import TransportFilters from '../../../components/transport/TransportFilters';
import { useTransportServices } from '../hooks/useTransport';
import type { TransportFilters as FilterType } from '../types';

// ─── FAQ Data ───────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'What is included in a yacht charter?',
    a: 'All charters include a professional crew (captain and deckhands), fuel for cruising within Dubai waters, soft drinks, and water sports equipment. Catering, premium beverages, and special decorations can be arranged.',
  },
  {
    q: 'Where do the yachts depart from?',
    a: 'Most yachts depart from Dubai Marina, with alternative pickup available at Palm Jumeirah and JBR. Custom pickup locations can be arranged for longer charters.',
  },
  {
    q: 'Can I bring my own food and drinks?',
    a: 'Yes, you\'re welcome to bring your own catering. Alternatively, we can arrange gourmet catering from top Dubai restaurants with advance notice.',
  },
  {
    q: 'What happens if the weather is bad?',
    a: 'Safety is our priority. In case of severe weather, we\'ll work with you to reschedule your charter. Light rain rarely affects cruising in Dubai\'s protected waters.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function YachtsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    subcategory: 'yachts',
  });

  const { data: services = [], isLoading } = useTransportServices(filters);

  const hasFilters = Boolean(
    filters.sub_subcategory ||
    filters.pricing_model ||
    filters.price_min ||
    filters.price_max ||
    filters.availability_type ||
    filters.capacity_min
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
            alt="Yacht charter Dubai"
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
            <Link to="/transport" className="hover:text-luxury-gold transition-colors">
              Transport
            </Link>
            <span>/</span>
            <span className="text-luxury-gold">Yacht Charter</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            Yacht Charter
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Cruise the Arabian Gulf in style. From intimate day cruises to 
            overnight luxury charters with full crew.
          </p>
        </motion.div>
      </section>

      {/* ── Features Strip ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Waves className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Calm Waters</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sun className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Year-Round</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Anchor className="w-5 h-5 text-luxury-gold" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Multiple Marinas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-luxury-gold text-lg">★</span>
              <span className="text-gray-400 text-xs uppercase tracking-widest">5-Star Crew</span>
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
                <Anchor className="w-12 h-12 text-gray-700 mx-auto mb-4" />
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

      {/* ── Popular Routes ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Popular Routes
          </p>
          <h2 className="text-2xl font-display text-white">Where Will You Cruise?</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Palm Jumeirah', duration: '2-3 hours', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop' },
            { name: 'Burj Al Arab', duration: '3-4 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop' },
            { name: 'Dubai Marina', duration: '1-2 hours', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop' },
            { name: 'The World Islands', duration: '4-6 hours', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop' },
          ].map((route, idx) => (
            <motion.div
              key={route.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative h-48 overflow-hidden border border-white/10 group"
            >
              <img
                src={route.image}
                alt={route.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-display text-lg">{route.name}</h4>
                <p className="text-gray-400 text-xs">{route.duration}</p>
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
              Bespoke Charters
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Planning a special celebration?
            </h3>
          </div>
          <Link
            to="/contact"
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
