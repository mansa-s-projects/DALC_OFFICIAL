'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Music,
  Anchor,
  Sun,
  Users,
  Camera,
  Star,
  Heart,
  Briefcase,
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const EVENT_TYPES = [
  {
    icon: Heart,
    label: 'Private Dinners',
    desc: 'Intimate dining experiences at Dubai\'s most exclusive venues â€” Burj Al Arab, Nobu, Zuma, and private residences.',
    bg: 'from-rose-900/30',
  },
  {
    icon: Briefcase,
    label: 'Corporate Events',
    desc: 'Product launches, board dinners, team retreats, and conferences â€” executed with precision and presence.',
    bg: 'from-blue-900/30',
  },
  {
    icon: Star,
    label: 'Weddings',
    desc: 'Dubai destination weddings planned end-to-end â€” venue, florals, entertainment, catering, and logistics.',
    bg: 'from-amber-900/30',
  },
  {
    icon: Calendar,
    label: 'Birthday Celebrations',
    desc: 'Milestone birthdays done extravagantly. Custom themes, surprise elements, and luxury hospitality.',
    bg: 'from-purple-900/30',
  },
  {
    icon: Anchor,
    label: 'Yacht Parties',
    desc: 'Superyacht charters for 10 to 200 guests. Catering, DJ, dÃ©cor, and offshore experiences included.',
    bg: 'from-sky-900/30',
  },
  {
    icon: Sun,
    label: 'Desert Experiences',
    desc: 'Private desert camps under the stars â€” Bedouin dining, live music, fire shows, and morning falconry.',
    bg: 'from-orange-900/30',
  },
];

const WHAT_WE_HANDLE = [
  { icon: Calendar, label: 'Venue Sourcing & Booking', desc: 'Access to private venues, rooftops, yachts, desert camps, and iconic Dubai landmarks.' },
  { icon: Users, label: 'Catering & F&B', desc: 'Michelin-starred private chefs, curated menus, sommelier service, and live stations.' },
  { icon: Music, label: 'Entertainment', desc: 'DJs, live bands, cultural performers, celebrity artists, and bespoke entertainment acts.' },
  { icon: Star, label: 'DÃ©cor & Design', desc: 'Custom florals, lighting design, branded installations, and luxury table settings.' },
  { icon: ArrowRight, label: 'Logistics & Transport', desc: 'Guest transfers, valet, airport meet & greet, and on-site event coordination.' },
  { icon: Camera, label: 'Photography & Film', desc: 'Professional event photography and videography. Drone footage and same-day reels.' },
];

const PROCESS = [
  { num: '01', label: 'Brief', desc: 'You share your vision, guest count, date, and budget. We listen and ask the right questions.' },
  { num: '02', label: 'Concept', desc: 'We present a bespoke event concept â€” venue options, mood boards, and initial costing.' },
  { num: '03', label: 'Plan', desc: 'Detailed event plan, supplier confirmations, and a timeline down to the minute.' },
  { num: '04', label: 'Execute', desc: 'Our team is on the ground â€” setup, supplier management, and real-time coordination.' },
  { num: '05', label: 'Celebrate', desc: 'You enjoy every moment. We handle everything so you never lift a finger.' },
];

const TESTIMONIALS = [
  {
    quote: "DALC turned our product launch into something the press talked about for weeks. From the yacht to the rooftop finale â€” every detail was impeccable.",
    author: "James H.",
    title: "CEO, London-based Tech Group",
  },
  {
    quote: "Our anniversary dinner at Burj Al Arab was the most magical evening of our lives. They knew exactly what we wanted before we did.",
    author: "Sophie & Rami",
    title: "Clients, Private Dinner",
  },
  {
    quote: "The desert wedding they organised was beyond imagination. 120 guests flew in from around the world and every single one of them was speechless.",
    author: "Fatima A.",
    title: "Wedding Client, Dubai",
  },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function EventPlanningPage() {
  const [form, setForm] = useState({
    eventType: '',
    date: '',
    guests: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = encodeURIComponent(
      `Hi DALC â€” Event Planning Inquiry\nEvent: ${form.eventType || 'TBD'}\nDate: ${form.date || 'TBD'}\nGuests: ${form.guests || 'TBD'}\nBudget: ${form.budget || 'TBD'}\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDetails: ${form.details}`
    );
    window.open(`https://wa.me/971585987600?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Signature Dining/Private Desert Dinner Experience.png"
            alt="Luxury event Dubai"
            className="w-full h-full object-cover opacity-25"
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
                Dubai Â· Event Planning
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[80px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Extraordinary Events,
              <br />
              <em className="not-italic text-luxury-gold">Flawlessly Executed.</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              From intimate private dinners to epic 500-person yacht parties â€”
              we create unforgettable experiences for Dubai's most discerning clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Plan My Event
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20discuss%20event%20planning%20in%20Dubai."
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

      {/* â”€â”€ Event Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Event Types</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            What we create.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
          {EVENT_TYPES.map((type, idx) => {
            const Icon = type.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className={`relative h-72 bg-gradient-to-br ${type.bg} to-luxury-black border border-white/[0.07] hover:border-luxury-gold/30 p-8 group transition-all duration-500 overflow-hidden flex flex-col justify-end`}>
                  {/* Gold hover line */}
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-luxury-gold/0 group-hover:bg-luxury-gold/60 transition-all duration-500" />
                  <div className="absolute top-6 right-6 text-luxury-gold/20 group-hover:text-luxury-gold/40 transition-colors duration-500">
                    <Icon className="w-12 h-12" />
                  </div>
                  <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">{type.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Gallery placeholder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Work</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Moments we've crafted.</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Desert Wedding', color: 'from-amber-900/50' },
              { label: 'Yacht Party', color: 'from-sky-900/50' },
              { label: 'Corporate Gala', color: 'from-zinc-800/50' },
              { label: 'Private Dinner', color: 'from-rose-900/50' },
              { label: 'Birthday Celebration', color: 'from-purple-900/50' },
              { label: 'Product Launch', color: 'from-blue-900/50' },
              { label: 'Rooftop Event', color: 'from-orange-900/50' },
              { label: 'Intimate Gathering', color: 'from-stone-800/50' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fade(idx * 0.05)}>
                <div className={`h-48 bg-gradient-to-br ${item.color} to-luxury-black border border-white/[0.07] flex items-center justify-center group hover:border-luxury-gold/30 transition-all duration-300`}>
                  <span className="text-gray-600 group-hover:text-gray-400 text-xs font-bold uppercase tracking-widest transition-colors duration-300">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs mt-6 uppercase tracking-widest">
            Full portfolio shared on request via WhatsApp
          </p>
        </div>
      </section>

      {/* â”€â”€ What We Handle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Full Service</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">We handle everything.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHAT_WE_HANDLE.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                  <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-3">{item.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Our Process</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Five steps to unforgettable.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-white/[0.05]">
            {PROCESS.map((step, idx) => (
              <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-7 text-center group">
                <span className="font-display text-[48px] leading-none text-luxury-gold/15 font-bold block mb-4 select-none">{step.num}</span>
                <h3 className="font-display text-lg text-white mb-3">{step.label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Testimonials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-14 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">What clients say.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div key={idx} {...fade(idx * 0.1)}>
              <div className="border border-white/[0.07] hover:border-luxury-gold/20 bg-luxury-black p-8 h-full flex flex-col transition-all duration-300">
                <div className="flex mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                  ))}
                </div>
                <p className="font-display text-lg text-white leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-luxury-gold text-sm font-medium">{t.author}</p>
                  <p className="text-gray-600 text-xs uppercase tracking-wider mt-0.5">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Inquiry Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="inquiry" className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Start Planning</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              Tell us about your event.
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div {...fade()} className="text-center py-20">
              <Check className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
              <p className="font-display text-3xl text-white mb-4">Inquiry Received!</p>
              <p className="text-gray-400">Our events team will contact you on WhatsApp within 4 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Event Type</label>
                <select
                  value={form.eventType}
                  onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                >
                  <option value="">Select event type...</option>
                  <option>Private Dinner</option>
                  <option>Corporate Event</option>
                  <option>Wedding</option>
                  <option>Birthday Celebration</option>
                  <option>Yacht Party</option>
                  <option>Desert Experience</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Preferred Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Guest Count</label>
                <select
                  value={form.guests}
                  onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                >
                  <option value="">Select...</option>
                  <option>1â€“10 guests</option>
                  <option>10â€“30 guests</option>
                  <option>30â€“100 guests</option>
                  <option>100â€“300 guests</option>
                  <option>300+ guests</option>
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Budget Range</label>
                <select
                  value={form.budget}
                  onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                >
                  <option value="">Select range...</option>
                  <option>AED 10K â€“ 30K</option>
                  <option>AED 30K â€“ 100K</option>
                  <option>AED 100K â€“ 500K</option>
                  <option>AED 500K+</option>
                  <option>Discuss openly</option>
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300 placeholder-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+971 ..."
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300 placeholder-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Event Details</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your vision, special requirements, or any inspiration..."
                  value={form.details}
                  onChange={e => setForm(p => ({ ...p, details: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300 placeholder-gray-700 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Send My Event Brief
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

