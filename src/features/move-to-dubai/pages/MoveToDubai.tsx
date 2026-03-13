import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  FileCheck,
  Calculator,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  Plane,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';

// ─── Feature Cards Configuration ──────────────────────────────────────────────

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Personalised Roadmap',
    description: 'A step-by-step relocation plan tailored to your family size, timeline, and goals.',
  },
  {
    icon: <FileCheck className="w-8 h-8" />,
    title: 'Document Checklist',
    description: 'Track visa applications, attestations, and essential paperwork in one place.',
  },
  {
    icon: <Calculator className="w-8 h-8" />,
    title: 'Cost Estimator',
    description: 'Get realistic budget projections for housing, schools, visas, and lifestyle.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Expert Guidance',
    description: 'Access curated resources and connect with relocation specialists.',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '15,000+', label: 'Successful relocations' },
  { value: '180+', label: 'Countries served' },
  { value: '48h', label: 'Average setup time' },
  { value: '98%', label: 'Client satisfaction' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MoveToDubai() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop"
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-8"
          >
            <Plane className="w-4 h-4 text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
              Relocation Services
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Move to<br />
            <span className="text-luxury-gold">Dubai</span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Your complete guide to relocating to the UAE. From visa planning to finding your 
            perfect home — we make your transition seamless and stress-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/relocation/intake"
              className="px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/relocation/dashboard"
              className="px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              View Dashboard
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
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-luxury-black px-6 py-5 text-center">
              <p className="text-luxury-gold font-display text-2xl md:text-3xl font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Everything You Need to Relocate
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We have helped thousands of individuals and families make Dubai their home. 
            Our comprehensive tools and expert guidance ensure nothing is overlooked.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group p-8 border border-white/10 hover:border-luxury-gold/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-white font-display text-lg mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <div className="relative overflow-hidden border border-white/10 p-10 md:p-16">
          {/* BG */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
                The Process
              </p>
              <h2 className="text-3xl md:text-4xl font-display text-white mb-6">
                How It Works
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Our streamlined process takes you from initial inquiry to settled resident 
                in Dubai. Each step is designed to remove complexity and provide clarity.
              </p>

              <div className="space-y-6">
                {[
                  { step: '01', title: 'Complete Your Profile', desc: 'Tell us about your situation and goals' },
                  { step: '02', title: 'Get Your Roadmap', desc: 'Receive a customised step-by-step plan' },
                  { step: '03', title: 'Track Progress', desc: 'Monitor documents, costs, and milestones' },
                ].map((item, idx) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-luxury-gold font-display text-2xl font-bold">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=1000&auto=format&fit=crop"
                alt="Dubai Marina"
                className="w-full h-80 object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
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
            <Sparkles className="w-8 h-8 text-luxury-gold mx-auto mb-6 opacity-60" />
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Begin Today
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Ready to Make the Move?
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Start your relocation journey today. Complete our intake form and receive 
              your personalised roadmap within minutes.
            </p>
            <Link
              to="/relocation/intake"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
