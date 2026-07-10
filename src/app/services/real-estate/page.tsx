'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  TrendingUp,
  Shield,
  Users,
  Star,
  Building2,
  MapPin,
  DollarSign,
} from 'lucide-react';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SERVICE_TYPES = [
  {
    icon: Home,
    label: 'Buy',
    desc: 'Apartments, villas, penthouses "” we source the finest properties across Dubai and negotiate on your behalf.',
  },
  {
    icon: MapPin,
    label: 'Rent',
    desc: 'Short or long-term rentals in premium buildings and communities, handled from search to contract.',
  },
  {
    icon: TrendingUp,
    label: 'Invest',
    desc: 'High-yield buy-to-let properties with ROI analysis, tenant sourcing, and ongoing management.',
  },
  {
    icon: Building2,
    label: 'Off-Plan',
    desc: 'Access to pre-launch prices from Dubai\'s top developers "” EMAAR, Nakheel, Aldar, and beyond.',
  },
];

const AREAS = [
  {
    name: 'Downtown Dubai',
    description: 'Home to the Burj Khalifa and Dubai Mall. The most iconic address in the city.',
    priceFrom: 'AED 1.8M',
    yield: '5"“7%',
  },
  {
    name: 'Palm Jumeirah',
    description: 'Dubai\'s iconic palm island. Luxury villas, beach apartments, and unmatched lifestyle.',
    priceFrom: 'AED 3.5M',
    yield: '4"“6%',
  },
  {
    name: 'Dubai Marina',
    description: 'Waterfront living with a vibrant promenade, dining, and direct beach access.',
    priceFrom: 'AED 1.2M',
    yield: '6"“8%',
  },
  {
    name: 'Business Bay',
    description: 'Dubai\'s central business district "” close to Downtown with strong rental demand.',
    priceFrom: 'AED 900K',
    yield: '6"“8%',
  },
  {
    name: 'JBR / JBR Beach',
    description: 'Jumeirah Beach Residence "” a premium beachfront community with hotel-style living.',
    priceFrom: 'AED 1.5M',
    yield: '6"“7%',
  },
  {
    name: 'Emaar Beachfront',
    description: 'New development between Dubai Marina and Palm. Limited supply, high demand.',
    priceFrom: 'AED 2.1M',
    yield: '5"“7%',
  },
];

const WHY_INVEST = [
  { value: '0%', label: 'Capital Gains Tax' },
  { value: '0%', label: 'Rental Income Tax' },
  { value: '6"“10%', label: 'Average Net Yield' },
  { value: 'AED 2M+', label: 'Golden Visa Eligibility' },
];

const OUR_SERVICES = [
  { icon: MapPin, label: 'Property Search', desc: 'We source the best properties matching your criteria from our developer and agent network.' },
  { icon: Shield, label: 'Legal Support', desc: 'Contract review, title deed verification, and DLD registration "” all handled for you.' },
  { icon: DollarSign, label: 'Mortgage Assistance', desc: 'Connections to the best UAE mortgage brokers for residents and non-residents alike.' },
  { icon: Building2, label: 'Property Management', desc: 'Tenant sourcing, rent collection, maintenance "” passive income without the hassle.' },
  { icon: TrendingUp, label: 'Investment Analysis', desc: 'ROI calculations, market comparables, and area trend reports before you commit.' },
  { icon: Users, label: 'Developer Access', desc: 'Early access to off-plan launches and payment plan negotiations with major developers.' },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function RealEstatePage() {
  const [consultForm, setConsultForm] = useState({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone) return;
    const msg = encodeURIComponent(
      `Hi DALC "” I'd like a property consultation.\nInterest: ${consultForm.interest || 'General'}\nName: ${consultForm.name}\nEmail: ${consultForm.email}\nPhone: ${consultForm.phone}`
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
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2940&auto=format&fit=crop"
            alt="Dubai real estate"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,175,55,0.08),transparent_65%)]" />
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
                Dubai · Real Estate
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Find Your Place
              <br />
              <em className="not-italic text-luxury-gold">in Dubai</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Buy, rent, invest, or develop "” we navigate Dubai's property market with unmatched
              access and expert local knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consultation"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27m%20looking%20for%20property%20in%20Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Service Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {SERVICE_TYPES.map((type, idx) => {
            const Icon = type.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8 group hover:bg-white/[0.02] transition-colors duration-300">
                <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">{type.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Why Invest Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-y border-white/[0.07] bg-white/[0.02] py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {WHY_INVEST.map((stat, idx) => (
            <motion.div key={idx} {...fade(idx * 0.1)}>
              <p className="text-4xl font-display text-luxury-gold mb-2">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Why Invest narrative â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Why Dubai</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              The world's most rewarding
              <br />
              <span className="text-luxury-gold">property market.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              Dubai offers net rental yields of 6"“10% "” higher than London, New York, Paris, and Singapore.
              With zero capital gains tax and zero rental income tax, every dirham of return stays with you.
            </p>
            <p className="text-gray-400 leading-relaxed mb-5">
              Properties valued at AED 2 million or more qualify for the UAE Golden Visa, making
              Dubai real estate one of the few investments that combines financial returns with residency rights.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Population growth of 5% per year, mega-infrastructure investment, and a government
              committed to economic diversification make Dubai's property fundamentals uniquely strong.
            </p>
          </motion.div>

          <motion.div {...fade(0.15)}>
            <ul className="space-y-5">
              {[
                'Zero capital gains tax on property sales',
                'Zero rental income tax',
                'Freehold ownership for foreigners in designated areas',
                'DLD-regulated "” fully transparent transactions',
                'Strong currency pegged to USD',
                'Golden Visa eligibility at AED 2M+',
                'World\'s busiest international airport drives demand',
                'Population projected to reach 5.8M by 2040',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-luxury-gold mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Featured Areas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Areas We Specialize In</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Dubai's Finest Locations</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREAS.map((area, idx) => (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-xl text-white group-hover:text-luxury-gold transition-colors duration-300">{area.name}</h3>
                    <span className="text-luxury-gold text-xs font-bold border border-luxury-gold/30 px-2 py-1">{area.yield} yield</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{area.description}</p>
                  <div className="border-t border-white/[0.07] pt-4">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">From</p>
                    <p className="text-luxury-gold font-display text-lg">{area.priceFrom}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Our Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Services</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">End-to-end property service.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OUR_SERVICES.map((svc, idx) => {
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

      {/* â”€â”€ Meet the Team Teaser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fade()}>
            <div className="flex justify-center gap-4 mb-8">
              {[
                { initials: 'AS', name: 'Ahmed S.', title: 'Senior Property Advisor' },
                { initials: 'LR', name: 'Laura R.', title: 'Investment Specialist' },
                { initials: 'MK', name: 'Mohammad K.', title: 'Luxury Residential' },
              ].map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-luxury-gold font-display text-lg">{member.initials}</span>
                  </div>
                  <p className="text-white text-xs font-medium">{member.name}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider">{member.title}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
              ))}
            </div>
            <p className="font-display text-2xl text-white mb-4">
              "Our advisors have collectively closed over AED 800M in Dubai property transactions."
            </p>
            <p className="text-gray-500 text-sm">Combined 25+ years of Dubai real estate expertise.</p>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Consultation CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="consultation" className="max-w-5xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
          <motion.div {...fade()} className="bg-luxury-black p-8 md:p-14">
            <div className="w-10 h-[2px] bg-luxury-gold mb-8" />
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Free Consultation</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">
              Book a Property<br />Consultation
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Tell us your requirements and we'll curate a personalised selection of properties
              with full market analysis within 24 hours.
            </p>
          </motion.div>

          <motion.div {...fade(0.15)} className="bg-[#0d0d0d] p-8 md:p-14">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Check className="w-10 h-10 text-luxury-gold mb-4" />
                <p className="font-display text-2xl text-white mb-2">Consultation Booked!</p>
                <p className="text-gray-500 text-sm">An advisor will reach you on WhatsApp within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">I'm Interested In</label>
                  <select
                    value={consultForm.interest}
                    onChange={e => setConsultForm(p => ({ ...p, interest: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Select...</option>
                    <option>Buying a home</option>
                    <option>Investment / Buy-to-let</option>
                    <option>Off-plan purchase</option>
                    <option>Long-term rental</option>
                    <option>Property management</option>
                  </select>
                </div>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { key: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+971 ...' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={consultForm[field.key as keyof typeof consultForm]}
                      onChange={e => setConsultForm(p => ({ ...p, [field.key]: e.target.value }))}
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

      <Footer />
    </div>
  );
}


