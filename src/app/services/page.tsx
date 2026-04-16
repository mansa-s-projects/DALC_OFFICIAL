'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  FileText,
  Star,
  Building2,
  Home,
  Shield,
  Plane,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

// â”€â”€â”€ Services catalogue â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SERVICES = [
  {
    icon: FileText,
    label: 'Visa Services',
    description: 'UAE visas, residency permits, and document processing for every nationality.',
    href: '/services/visas',
    accent: 'from-blue-900/40 to-luxury-black',
    tag: 'Residency',
  },
  {
    icon: Star,
    label: 'Golden Visa UAE',
    description: '10-year renewable residency for investors, entrepreneurs, and exceptional talent.',
    href: '/services/golden-visa',
    accent: 'from-amber-900/40 to-luxury-black',
    tag: 'Premium',
  },
  {
    icon: Building2,
    label: 'Business Setup',
    description: 'Mainland, Free Zone, and Offshore company formation â€” fully handled.',
    href: '/services/business-setup',
    accent: 'from-zinc-800/40 to-luxury-black',
    tag: 'Corporate',
  },
  {
    icon: Home,
    label: 'Real Estate',
    description: 'Buy, rent, invest, or manage property with expert guidance across Dubai.',
    href: '/services/real-estate',
    accent: 'from-stone-800/40 to-luxury-black',
    tag: 'Property',
  },
  {
    icon: Plane,
    label: 'Personal Concierge',
    description: 'Your private command centre â€” any request, any time, with total discretion.',
    href: '/request',
    accent: 'from-rose-900/40 to-luxury-black',
    tag: 'Lifestyle',
  },
  {
    icon: MapPin,
    label: 'Relocation',
    description: 'End-to-end relocation management â€” visas, home, banking, and beyond.',
    href: '/move-to-dubai',
    accent: 'from-sky-900/40 to-luxury-black',
    tag: 'Moving',
  },
  {
    icon: Calendar,
    label: 'Event Planning',
    description: 'Private dinners, yacht parties, weddings, and corporate events â€” flawlessly executed.',
    href: '/services/event-planning',
    accent: 'from-purple-900/40 to-luxury-black',
    tag: 'Events',
  },
  {
    icon: ShoppingBag,
    label: 'Personal Shopping',
    description: 'Exclusive access to luxury brands, pre-releases, and bespoke gift curation.',
    href: '/services/personal-shopping',
    accent: 'from-pink-900/40 to-luxury-black',
    tag: 'Luxury',
  },
  {
    icon: Heart,
    label: 'Wellness & Health',
    description: 'Spa bookings, private medical consultations, nutrition, and fitness concierge.',
    href: '/services/wellness',
    accent: 'from-emerald-900/40 to-luxury-black',
    tag: 'Wellbeing',
  },
  {
    icon: Shield,
    label: 'VIP Security',
    description: 'Discreet personal protection, secure transport, and residential security.',
    href: '/services/vip-security',
    accent: 'from-neutral-800/40 to-luxury-black',
    tag: 'Protection',
  },
];

// â”€â”€â”€ Fade helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ServicesHub() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hotels/address-downtown.jpg"
            alt="Dubai skyline luxury"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.08),transparent_65%)]" />
        </div>

        {/* Geometric accent lines */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-40 w-px bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent hidden lg:block" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-40 w-px bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent hidden lg:block" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-10">
              <span className="w-1 h-1 rounded-full bg-luxury-gold" />
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em]">
                Dubai Ã€ La Carte â€” Services
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[88px] font-display text-white leading-[0.92] mb-8 tracking-tight">
              Every Service.
              <br />
              <em className="not-italic text-luxury-gold">One Destination.</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              From Golden Visa to private security â€” DALC delivers every facet of Dubai life
              through a single, white-glove concierge experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20discuss%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Speak to an Advisor
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Personal Concierge
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="h-8 w-px bg-gradient-to-b from-luxury-gold/40 to-transparent" />
        </div>
      </section>

      {/* â”€â”€ Services Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade(0)} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Everything Dubai requires.{' '}
            <span className="text-luxury-gold">We deliver.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.href} {...fade(idx * 0.06)}>
                <Link
                  href={service.href}
                  className={`group relative flex flex-col h-full bg-luxury-black p-8 md:p-10 bg-gradient-to-br ${service.accent} hover:bg-gradient-to-br hover:from-luxury-charcoal hover:to-luxury-black transition-all duration-500 overflow-hidden`}
                >
                  {/* Gold hover line */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-luxury-gold/0 group-hover:bg-luxury-gold/60 transition-all duration-500" />

                  {/* Tag */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 border border-white/10 bg-white/[0.03] text-luxury-gold/70 group-hover:text-luxury-gold group-hover:border-luxury-gold/30 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600 group-hover:text-luxury-gold/60 transition-colors duration-300 border border-white/[0.07] px-2 py-1">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    {service.label}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                    {service.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 group-hover:text-luxury-gold transition-colors duration-300">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Why DALC strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-y border-white/[0.07] bg-white/[0.02] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: '10+', label: 'Years in Dubai' },
            { value: '2,400+', label: 'Clients Served' },
            { value: '24/7', label: 'Availability' },
            { value: '100%', label: 'Discretion' },
          ].map((stat, idx) => (
            <motion.div key={idx} {...fade(idx * 0.1)}>
              <p className="text-4xl font-display text-luxury-gold mb-2">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fade()}>
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-6">
              Begin Today
            </p>
            <h2 className="text-4xl md:text-6xl font-display text-white mb-8 leading-tight">
              Your life in Dubai,{' '}
              <span className="text-luxury-gold">curated.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-xl mx-auto">
              Tell us what you need. Our advisors respond within 15 minutes with a clear, no-obligation plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20discuss%20a%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                WhatsApp Us Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-5 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Submit a Request
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

