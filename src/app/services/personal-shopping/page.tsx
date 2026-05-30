'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
  Star,
  Gift,
  Sparkles,
  Users,
  Crown,
} from 'lucide-react';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Users,
    label: 'Personal Stylist Sessions',
    desc: 'A dedicated stylist who learns your taste, body, lifestyle, and social calendar — then builds a wardrobe around you.',
  },
  {
    icon: Crown,
    label: 'Luxury Brand Access',
    desc: 'Relationships with boutiques and brand directors in Dubai, Paris, Milan, and London ensure you access what others cannot.',
  },
  {
    icon: Sparkles,
    label: 'Exclusive Pre-Releases',
    desc: 'Limited editions, capsule drops, and waiting list bypasses for the world\'s most coveted pieces.',
  },
  {
    icon: Gift,
    label: 'Gift Curation',
    desc: 'Corporate gifts, anniversary presents, and occasion-specific curation that make a lasting impression.',
  },
  {
    icon: ShoppingBag,
    label: 'Wardrobe Audit',
    desc: 'A professional review of your current wardrobe with recommendations for what to keep, alter, retire, or acquire.',
  },
  {
    icon: ArrowRight,
    label: 'Concierge Delivery',
    desc: 'White-glove delivery to your home, hotel, or yacht. Anywhere in Dubai. Same day where possible.',
  },
];

const BRANDS = [
  { name: 'Chanel', category: 'Fashion & Beauty' },
  { name: 'Louis Vuitton', category: 'Fashion & Leather' },
  { name: 'Hermès', category: 'Fashion & Silk' },
  { name: 'Cartier', category: 'Jewellery & Watches' },
  { name: 'Rolex', category: 'Watches' },
  { name: 'Bottega Veneta', category: 'Fashion & Leather' },
  { name: 'Patek Philippe', category: 'Fine Watches' },
  { name: 'Dior', category: 'Couture' },
  { name: 'Richard Mille', category: 'Luxury Watches' },
  { name: 'Van Cleef & Arpels', category: 'Fine Jewellery' },
  { name: 'Prada', category: 'Fashion' },
  { name: 'Bvlgari', category: 'Jewellery & Watches' },
];

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Tell Us Your Taste',
    desc: 'A private discovery session — in-person or over WhatsApp — where we learn your style, preferences, occasions, and budget.',
  },
  {
    num: '02',
    title: 'We Source',
    desc: 'Our team contacts boutiques, personal shoppers, and brand VIP departments across the globe to find the perfect pieces.',
  },
  {
    num: '03',
    title: 'You Preview',
    desc: 'We present a curated selection — photos, options, and our recommendations — for your review and final selection.',
  },
  {
    num: '04',
    title: 'We Deliver',
    desc: 'Your selected items arrive beautifully packaged at your door. We handle payment, customs, and courier logistics.',
  },
];

const MEMBERSHIPS = [
  {
    tier: 'Standard',
    price: 'AED 2,500 / month',
    description: 'For clients who want elevated access and occasional support.',
    features: [
      'Monthly styling consultation (1 hour)',
      'Priority brand access',
      'Gift curation service',
      'Same-day delivery in Dubai',
      'Dedicated WhatsApp stylist',
    ],
    featured: false,
  },
  {
    tier: 'Premium',
    price: 'AED 6,500 / month',
    description: 'For clients who shop regularly and demand the best.',
    features: [
      'Unlimited styling consultations',
      'Exclusive pre-release access',
      'Full wardrobe management',
      'International sourcing included',
      'Private shopping appointments',
      'Concierge delivery worldwide',
      'Annual wardrobe audit',
    ],
    featured: true,
  },
  {
    tier: 'VIP',
    price: 'AED 15,000 / month',
    description: 'Complete personal shopping management — nothing is off limits.',
    features: [
      'Everything in Premium',
      'Dedicated stylist available 24/7',
      'Private boutique closures arranged',
      'Fashion week accompaniment',
      'Bespoke & couture sourcing',
      'Jewellery & watch acquisition',
      'Full gift programme management',
    ],
    featured: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PersonalShoppingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = encodeURIComponent(
      `Hi DALC — Personal Shopping Inquiry\nInterest: ${form.interest || 'General'}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`
    );
    window.open(`https://wa.me/971585987600?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black relative overflow-hidden">
      {/* ── Mysterious Overlay ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-center p-12 max-w-xl mx-auto border border-luxury-gold/20 bg-luxury-black/90 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05)_0%,transparent_70%)]" />
          <Crown className="w-10 h-10 text-luxury-gold mx-auto mb-6 relative z-10 opacity-80" />
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4 relative z-10">
            By Invitation Only
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white mb-6 relative z-10">
            Private Sourcing
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 relative z-10 font-light">
            Access to our global personal shopping network and high-jewellery sourcing is currently restricted to existing DALC members and private invites.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border border-luxury-gold/40 text-luxury-gold text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 relative z-10"
          >
            Return to Services
          </Link>
        </motion.div>
      </div>

      {/* ── Blurred, Unclickable Page Content ────────────────────────────── */}
      <div className="pointer-events-none select-none opacity-30 blur-[6px] h-screen overflow-hidden">
        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2874&auto=format&fit=crop"
            alt="Luxury fashion Dubai"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.10),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors duration-300 mb-10">
              <ArrowLeft className="w-3.5 h-3.5" />
              All Services
            </Link>

            <div className="inline-flex items-center gap-2 px-5 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-8 block">
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em]">
                Dubai · Personal Shopping
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[80px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              The World's Finest,
              <br />
              <em className="not-italic text-luxury-gold">Curated for You.</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              From Hermès Birkins to Richard Mille timepieces — our personal shoppers access
              what money alone cannot buy, and deliver it to your door.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20book%20a%20personal%20shopper."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Book a Personal Shopper
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#membership"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                View Memberships
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">What We Offer</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Every dimension of luxury shopping.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                  <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-3">{svc.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Brands ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Access</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Brands we work with.</h2>
            <p className="text-gray-500 text-sm mt-4">
              Relationships built over years with boutique directors and brand VIP programmes.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/[0.05]">
            {BRANDS.map((brand, idx) => (
              <motion.div key={idx} {...fade(idx * 0.04)} className="bg-luxury-black p-6 flex flex-col items-center justify-center text-center group hover:bg-white/[0.02] transition-colors duration-300">
                <div className="w-12 h-12 border border-luxury-gold/20 group-hover:border-luxury-gold/50 flex items-center justify-center mb-3 transition-all duration-300">
                  <span className="text-luxury-gold/60 group-hover:text-luxury-gold text-[10px] font-bold uppercase tracking-wider transition-colors duration-300">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-white text-xs font-medium group-hover:text-luxury-gold transition-colors duration-300">{brand.name}</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">{brand.category}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs mt-6 uppercase tracking-widest">
            And many more — available on request
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Tell us your taste. We do the rest.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
          {HOW_IT_WORKS.map((step, idx) => (
            <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8">
              <span className="font-display text-[52px] leading-none text-luxury-gold/12 font-bold block mb-4 select-none">{step.num}</span>
              <h3 className="font-display text-lg text-white mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Membership Tiers ───────────────────────────────────────────────── */}
      <section id="membership" className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Membership</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              Choose your level of service.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MEMBERSHIPS.map((m, idx) => (
              <motion.div key={idx} {...fade(idx * 0.1)}>
                <div className={`relative h-full border p-8 flex flex-col ${
                  m.featured ? 'border-luxury-gold/60 bg-luxury-gold/[0.04]' : 'border-white/[0.07] hover:border-luxury-gold/30'
                } transition-all duration-300`}>
                  {m.featured && <div className="absolute -top-px left-0 right-0 h-[1px] bg-luxury-gold" />}
                  {m.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-black text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                      Most Popular
                    </div>
                  )}
                  <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.4em] mb-2">{m.tier}</p>
                  <p className="font-display text-3xl text-white mb-2">{m.price}</p>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">{m.description}</p>
                  <ul className="space-y-3 flex-1 mb-10">
                    {m.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27m%20interested%20in%20a%20Personal%20Shopping%20membership."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                      m.featured
                        ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
                        : 'border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold/10'
                    }`}
                  >
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
          <motion.div {...fade()} className="bg-luxury-black p-8 md:p-14">
            <div className="w-10 h-[2px] bg-luxury-gold mb-8" />
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Get in Touch</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">
              Book a Personal<br />Shopper Session
            </h2>
            <p className="text-gray-400 leading-relaxed">
              One conversation is all it takes. Our stylist will learn your world and get to work immediately.
            </p>
          </motion.div>
          <motion.div {...fade(0.15)} className="bg-[#0d0d0d] p-8 md:p-14">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Star className="w-10 h-10 text-luxury-gold mb-4" />
                <p className="font-display text-2xl text-white mb-2">Session Requested!</p>
                <p className="text-gray-500 text-sm">Your personal shopper will reach you on WhatsApp shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">I'm Looking For</label>
                  <select
                    value={form.interest}
                    onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Select...</option>
                    <option>Personal styling</option>
                    <option>Specific item / brand sourcing</option>
                    <option>Gift curation</option>
                    <option>Wardrobe management</option>
                    <option>Membership enquiry</option>
                  </select>
                </div>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                  { key: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+971 ...' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300 placeholder-gray-700"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  Book via WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
      </div>

      <Footer />
    </div>
  );
}

