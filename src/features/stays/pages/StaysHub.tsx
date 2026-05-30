import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Building2,
  Hotel,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import type { StaysSubcategory } from '../types';
import { SUBCATEGORY_LABELS, SUBCATEGORY_DESCRIPTIONS } from '../types';

// â”€â”€â”€ Category Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface CategoryConfig {
  subcategory: StaysSubcategory;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    subcategory: 'hotels',
    label: SUBCATEGORY_LABELS.hotels,
    icon: <Hotel className="w-7 h-7" />,
    gradient: 'from-amber-900/60 to-luxury-black',
    image: '/images/hotels/atlantis-the-palm.jpg',
  },
  {
    subcategory: 'residences',
    label: SUBCATEGORY_LABELS.residences,
    icon: <Building2 className="w-7 h-7" />,
    gradient: 'from-emerald-900/40 to-luxury-black',
    image: '/images/hotels/address-downtown.jpg',
  },
];

// â”€â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATS = [
  { value: '500+', label: 'Properties' },
  { value: '98%', label: 'Guest Satisfaction' },
  { value: '24/7', label: 'Concierge' },
  { value: 'Best', label: 'Price Guarantee' },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function StaysHub() {

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hotels/armani-hotel-dubai.jpg"
            alt="Dubai skyline"
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
            Dubai Living
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Your Home in<br />
            <span className="text-luxury-gold">Dubai</span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From premium hotels to beachfront villas and furnished residences â€” 
            discover the perfect stay for your Dubai journey, whether for a night or a year.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/travel/hotels"
              className="px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Browse Hotels Worldwide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/stays/residences"
              className="px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Residences
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
          {STATS.map(stat => (
            <div key={stat.label} className="bg-luxury-black px-6 py-5 text-center">
              <p className="text-luxury-gold font-display text-2xl md:text-3xl font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* â”€â”€ Category Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Categories</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Choose Your Stay</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.subcategory}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/travel/${cat.subcategory}`}
                className="group relative block h-80 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
              >
                {/* BG Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
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
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-luxury-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Why Book With Us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-white/10 p-10 md:p-16"
        >
          <div className="text-center mb-12">
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
              The Dubai À La Carte Difference
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-white">Why Book With Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Curated Selection',
                description: 'Every property is personally vetted by our team for quality, location, and service excellence.',
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Local Expertise',
                description: 'Our Dubai-based concierges know every neighborhood and can recommend the perfect area for your stay.',
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: 'Flexible Booking',
                description: 'From one night to long-term leases, we offer flexible terms with transparent pricing and no hidden fees.',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-luxury-gold/70 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-white font-display text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* â”€â”€ Concierge CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              Bespoke Service
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Need Help Finding Your Perfect Stay?
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Our concierge team specializes in matching guests with their ideal properties. 
              Tell us your preferences and we'll curate options just for you.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Contact Concierge
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

