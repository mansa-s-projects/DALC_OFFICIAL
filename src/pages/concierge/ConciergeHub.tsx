import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star,
  PhoneCall,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  MessageSquare,
  CalendarCheck,
  Plane,
  Home,
  Car,
  Building2,
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';

// ─── Service Categories ──────────────────────────────────────────────────────

const CONCIERGE_SERVICES = [
  {
    icon: <Plane className="w-6 h-6" />,
    title: 'Travel & Arrivals',
    description: 'Private jet coordination, airport meet & greet, luxury transfers.',
    gradient: 'from-blue-900/60 to-luxury-black',
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: 'Property & Stays',
    description: 'Exclusive villa rentals, hotel access, temporary accommodation.',
    gradient: 'from-stone-800/60 to-luxury-black',
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Transport & Lifestyle',
    description: 'Chauffeur services, yacht charters, curated daily itineraries.',
    gradient: 'from-amber-900/60 to-luxury-black',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Business Support',
    description: 'Meeting rooms, document assistance, introductions and connections.',
    gradient: 'from-zinc-800/60 to-luxury-black',
  },
  {
    icon: <CalendarCheck className="w-6 h-6" />,
    title: 'Events & Reservations',
    description: 'Restaurant bookings, VIP event access, private experiences.',
    gradient: 'from-rose-900/60 to-luxury-black',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Personal Requests',
    description: 'Any personal need handled with total discretion and speed.',
    gradient: 'from-purple-900/60 to-luxury-black',
  },
];

// ─── Stats ───────────────────────────────────────────────────────────────────

const STATS = [
  { value: '< 15 min', label: 'First Response' },
  { value: '24/7', label: 'Availability' },
  { value: '100%', label: 'Discretion Guaranteed' },
  { value: '5★', label: 'Client Satisfaction' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ConciergeHub() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2670&auto=format&fit=crop"
            alt="Luxury concierge Dubai"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/40 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_70%)]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.6em] mb-6">
              Personal Concierge · Dubai
            </p>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
              Your Private<br />
              <span className="text-luxury-gold">Command Centre</span>
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              One message. Done. Our concierge team handles everything — from last-minute
              reservations to complex relocation logistics — with total discretion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request"
                className="px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Make a Request
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+971000000000"
                className="px-10 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-display text-luxury-gold mb-1">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
            What We Handle
          </p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Every Detail. <span className="text-luxury-gold">Every Need.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCIERGE_SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`relative p-8 border border-white/10 hover:border-luxury-gold/40 bg-gradient-to-br ${service.gradient} transition-all duration-500 group cursor-default`}
            >
              <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300 mb-4">
                {service.icon}
              </div>
              <h3 className="text-white font-display text-lg mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-white/[0.02] py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              The Process
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-white mb-16">
              Simple. Fast. Discreet.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'Submit Your Request',
                desc: 'Tell us what you need. No request is too complex or too simple.',
              },
              {
                step: '02',
                icon: <Clock className="w-8 h-8" />,
                title: 'We Respond in 15 Min',
                desc: 'Your dedicated concierge confirms and begins coordination immediately.',
              },
              {
                step: '03',
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Delivered Flawlessly',
                desc: 'Sit back. Every detail is handled with white-glove precision.',
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="text-luxury-gold/20 font-display text-6xl mb-4">{step.step}</div>
                <div className="text-luxury-gold mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-white font-display text-xl mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Signals ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-12">
          {[
            { icon: <Shield className="w-5 h-5" />, label: 'NDA-Protected' },
            { icon: <Star className="w-5 h-5" />, label: 'Platinum Member Access' },
            { icon: <Clock className="w-5 h-5" />, label: '24/7 Availability' },
            { icon: <PhoneCall className="w-5 h-5" />, label: 'Direct Line Access' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-400">
              <div className="text-luxury-gold">{item.icon}</div>
              <span className="text-xs uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Ready to be looked after?
            </h2>
            <p className="text-gray-400 text-base mb-10 leading-relaxed">
              Submit your first request and experience what true personal service means in Dubai.
            </p>
            <Link
              to="/request"
              className="inline-flex items-center gap-3 px-12 py-5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              Make a Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
