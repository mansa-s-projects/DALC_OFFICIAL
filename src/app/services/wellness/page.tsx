'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Zap,
  Moon,
  Sun,
  Users,
  Shield,
  Star,
} from 'lucide-react';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SERVICES = [
  {
    icon: Heart,
    label: 'Luxury Spa & Treatments',
    desc: 'Priority bookings at Dubai\'s most exclusive spas â€” Talise Ottoman, Waldorf Astoria, ESPA at DIFC, and private therapist arrangements.',
  },
  {
    icon: Shield,
    label: 'Private Medical Consultations',
    desc: 'Same-day appointments with Dubai\'s top physicians, specialists, and diagnostics centres. Fully private and confidential.',
  },
  {
    icon: Zap,
    label: 'Fitness & Personal Training',
    desc: 'Elite personal trainers who come to you â€” hotel, villa, or private gym. Customised programmes for every goal.',
  },
  {
    icon: Sun,
    label: 'Nutrition & Diet Planning',
    desc: 'Registered nutritionists who create personalised plans. Meal prep delivery, supplement sourcing, and ongoing coaching.',
  },
  {
    icon: Moon,
    label: 'Mental Wellness',
    desc: 'Discreet access to therapists, mindfulness coaches, and executive wellness programmes. Your wellbeing, protected.',
  },
  {
    icon: Users,
    label: 'Group Wellness Retreats',
    desc: 'Corporate and social group wellness experiences â€” yoga retreats, desert sound baths, and bespoke team wellbeing days.',
  },
];

const PARTNERS = [
  { name: 'Talise Ottoman Spa', location: 'Jumeirah Zabeel Saray', type: 'Spa & Hammam' },
  { name: 'ESPA at The H Hotel', location: 'Sheikh Zayed Road', type: 'Medical Spa' },
  { name: 'Waldorf Astoria Spa', location: 'Palm Jumeirah', type: 'Luxury Spa' },
  { name: 'Dubai London Clinic', location: 'Multiple Locations', type: 'Private Medical' },
  { name: 'Bodyism Dubai', location: 'DIFC', type: 'Elite Fitness' },
  { name: 'ShuiQi Spa', location: 'Atlantis The Palm', type: 'Aqua Wellness' },
];

const PACKAGES = [
  {
    name: 'Day Wellness',
    price: 'From AED 3,500',
    desc: 'A complete day of restorative luxury â€” spa, nutrition, and mindfulness.',
    includes: [
      'Full-day spa access (luxury property)',
      'Signature massage (90 minutes)',
      'Healthy chef-prepared lunch',
      'Mindfulness / breathwork session',
      'Transport to and from venue',
    ],
    featured: false,
  },
  {
    name: 'Weekend Retreat',
    price: 'From AED 12,000',
    desc: 'Two full days of transformative wellness â€” mind, body, and spirit.',
    includes: [
      'Private villa or spa hotel (2 nights)',
      'Daily personal training sessions',
      'Nutritionist-led meal plan',
      'Three therapeutic spa treatments',
      'Private yoga or meditation sessions',
      'Evening wellness workshop',
      'Concierge throughout',
    ],
    featured: true,
  },
  {
    name: 'Monthly Programme',
    price: 'From AED 8,000 / mo',
    desc: 'Ongoing luxury wellness management â€” the lifestyle upgrade that lasts.',
    includes: [
      'Weekly PT sessions (4 per month)',
      '4 premium spa bookings/month',
      'Monthly nutritionist review',
      'Supplement & wellness sourcing',
      'Medical appointment coordination',
      'Weekly check-in with wellness concierge',
    ],
    featured: false,
  },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function WellnessPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = encodeURIComponent(
      `Hi DALC â€” Wellness Inquiry\nInterest: ${form.interest || 'General'}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`
    );
    window.open(`https://wa.me/971585987600?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/beach_clubs/Kyma/image1.jpg"
            alt="Luxury wellness spa Dubai"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,175,55,0.08),transparent_65%)]" />
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
                Dubai · Wellness & Health
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Restore.
              <br />
              Rejuvenate.
              <br />
              <em className="not-italic text-luxury-gold">Thrive.</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Dubai's finest spas, elite trainers, private physicians, and wellness experiences â€”
              curated and delivered through your DALC concierge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20book%20a%20wellness%20experience."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Book an Experience
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#packages"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                View Packages
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Services</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Total wellness. Total discretion.
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

      {/* â”€â”€ Partner Venues â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Partner Venues</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Where we take you.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNERS.map((partner, idx) => (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-7 group transition-all duration-300">
                  <div className="w-10 h-10 border border-luxury-gold/20 group-hover:border-luxury-gold/50 flex items-center justify-center mb-4 transition-all duration-300">
                    <Star className="w-4 h-4 text-luxury-gold/50 group-hover:text-luxury-gold transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-1">{partner.name}</h3>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">{partner.location}</p>
                  <span className="text-luxury-gold/60 text-xs border border-luxury-gold/20 px-2 py-0.5">{partner.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Packages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="packages" className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Packages</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Choose your wellness journey.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, idx) => (
            <motion.div key={idx} {...fade(idx * 0.1)}>
              <div className={`relative h-full border p-8 flex flex-col ${
                pkg.featured ? 'border-luxury-gold/60 bg-luxury-gold/[0.04]' : 'border-white/[0.07] hover:border-luxury-gold/30'
              } transition-all duration-300`}>
                {pkg.featured && <div className="absolute -top-px left-0 right-0 h-[1px] bg-luxury-gold" />}
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-black text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    Most Popular
                  </div>
                )}
                <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.4em] mb-2">{pkg.name}</p>
                <p className="font-display text-3xl text-white mb-2">{pkg.price}</p>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{pkg.desc}</p>
                <ul className="space-y-3 flex-1 mb-10">
                  {pkg.includes.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20book%20a%20wellness%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.featured
                      ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
                      : 'border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold/10'
                  }`}
                >
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ CTA Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
            <motion.div {...fade()} className="bg-luxury-black p-8 md:p-14">
              <div className="w-10 h-[2px] bg-luxury-gold mb-8" />
              <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Begin Your Journey</p>
              <h2 className="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">
                Book a Wellness<br />Experience
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Tell us what you need and we'll curate the perfect wellness experience â€” whether it's
                a single afternoon or an ongoing programme.
              </p>
            </motion.div>
            <motion.div {...fade(0.15)} className="bg-[#0d0d0d] p-8 md:p-14">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Heart className="w-10 h-10 text-luxury-gold mb-4" />
                  <p className="font-display text-2xl text-white mb-2">We'll be in touch!</p>
                  <p className="text-gray-500 text-sm">Our wellness team will contact you on WhatsApp within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">I'm Interested In</label>
                    <select
                      value={form.interest}
                      onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Select...</option>
                      <option>Luxury spa booking</option>
                      <option>Personal training</option>
                      <option>Private medical consultation</option>
                      <option>Nutrition planning</option>
                      <option>Mental wellness</option>
                      <option>Day Wellness package</option>
                      <option>Weekend Retreat</option>
                      <option>Monthly Programme</option>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}


