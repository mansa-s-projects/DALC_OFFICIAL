import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Building2,
  FileText,
  Landmark,
  Receipt,
  Globe,
  ArrowRight,
  CalendarCheck,
  Star,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/business/ServiceCard';
import { useFeaturedBusinessServices } from '../hooks/useBusiness';
import type { BusinessSubcategory } from '../types';
import { SUBCATEGORY_DESCRIPTIONS } from '../types';

// ─── Category Config ──────────────────────────────────────────────────────────

interface CategoryConfig {
  subcategory: BusinessSubcategory;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    subcategory: 'company-formation',
    label: 'Company Formation',
    icon: <Building2 className="w-7 h-7" />,
    gradient: 'from-amber-900/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'licensing',
    label: 'Business Licensing',
    icon: <FileText className="w-7 h-7" />,
    gradient: 'from-zinc-800/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'banking',
    label: 'Banking & Finance',
    icon: <Landmark className="w-7 h-7" />,
    gradient: 'from-blue-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'tax',
    label: 'Tax & Accounting',
    icon: <Receipt className="w-7 h-7" />,
    gradient: 'from-emerald-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'residency-investment',
    label: 'Residency & Investment',
    icon: <Globe className="w-7 h-7" />,
    gradient: 'from-purple-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '3,000+', label: 'Companies formed' },
  { value: '98%', label: 'Approval rate' },
  { value: '15+', label: 'Years in Dubai' },
  { value: '50+', label: 'Free zones covered' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BusinessHub() {
  const { data: featured = [], isLoading } = useFeaturedBusinessServices();

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop"
            alt="Dubai skyline business district"
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
            Dubai Business Services
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Your Business,<br />
            <span className="text-luxury-gold">Established</span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From company formation to Golden Visa — expert guidance for every step of
            building your business presence in the UAE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/business/company-formation"
              className="px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/business/consultation/new"
              className="px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              Free Consultation
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

      {/* ── Category Cards ───────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Services</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Browse by Category</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.subcategory}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/business/${cat.subcategory}`}
                className="group relative block h-60 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
              >
                {/* BG Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-display text-base mb-1 leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                      {cat.label}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {SUBCATEGORY_DESCRIPTIONS[cat.subcategory]}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-luxury-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────────────────────────── */}
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
            <h2 className="text-3xl md:text-4xl font-display text-white">Featured Services</h2>
          </div>
          <Link
            href="/business/company-formation"
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
            {featured.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <div className="text-center py-16 border border-white/10">
            <p className="text-gray-500 italic">Services launching soon.</p>
          </div>
        )}
      </section>

      {/* ── Free Consultation CTA ─────────────────────────────────────────────── */}
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
              Complimentary
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Start with a Free Consultation
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Speak with one of our Dubai business advisors — no commitment, no fees.
              We'll map out the right structure for your goals.
            </p>
            <Link
              href="/business/consultation/new"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              <CalendarCheck className="w-5 h-5" />
              Book Free Session
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
