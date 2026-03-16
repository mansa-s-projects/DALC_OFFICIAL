import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useSubmitConciergeRequest } from '../../features/concierge/hooks/useConcierge';

export default function Flights() {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    returnDate: '',
    passengers: '1',
    flightClass: 'Economy',
  });
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitConciergeRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit.mutateAsync({
      request_type: 'travel_arrival',
      urgency: 'standard',
      title: `Flight Inquiry: ${form.from} → ${form.to}`,
      description: `Passengers: ${form.passengers} | Class: ${form.flightClass} | Departure: ${form.date}${form.returnDate ? ' | Return: ' + form.returnDate : ''}`,
      preferred_date: form.date,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[55vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
            alt="Flights"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <h2 className="text-luxury-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6">
            Travel Planning
          </h2>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-tight">
            Flights
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Commercial routes or private charter — our travel desk handles every detail
            so you arrive in style.
          </p>
        </motion.div>
      </section>

      {/* Options */}
      <section className="pb-24 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Commercial Flights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-white/[0.02] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center">
                <Plane className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">Commercial</p>
                <h2 className="text-xl font-display text-white">Book a Flight</h2>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="w-12 h-12 text-luxury-gold mb-4" />
                <h3 className="text-xl font-display text-white mb-2">Request Submitted</h3>
                <p className="text-gray-400 text-sm">
                  Our travel desk will contact you within 24 hours with flight options.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">From</label>
                    <input
                      required
                      value={form.from}
                      onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                      placeholder="City or airport"
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">To</label>
                    <input
                      required
                      value={form.to}
                      onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                      placeholder="City or airport"
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Departure</label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Return (optional)</label>
                    <input
                      type="date"
                      value={form.returnDate}
                      onChange={e => setForm(p => ({ ...p, returnDate: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Passengers</label>
                    <select
                      value={form.passengers}
                      onChange={e => setForm(p => ({ ...p, passengers: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n} className="bg-luxury-black">
                          {n} {n === 1 ? 'Passenger' : 'Passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Class</label>
                    <select
                      value={form.flightClass}
                      onChange={e => setForm(p => ({ ...p, flightClass: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold/50 text-white px-4 py-3 text-sm outline-none transition-colors"
                    >
                      {['Economy', 'Business', 'First Class'].map(c => (
                        <option key={c} value={c} className="bg-luxury-black">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submit.isPending}
                  className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submit.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <>Request Flight Options <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Private Charter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden border border-luxury-gold/20"
          >
            <img
              src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2574&auto=format&fit=crop"
              alt="Private Charter"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10 p-8 flex flex-col h-full min-h-[420px] justify-between">
              <div>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] mb-2">Private</p>
                <h2 className="text-2xl font-display text-white mb-4">Charter a Private Jet</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Non-stop, on your schedule. Select from a curated fleet of light jets,
                  super-mids, and ultra-long-range aircraft. Your journey, your terms.
                </p>
                <ul className="space-y-2">
                  {[
                    'Flexible departure times',
                    'Standing fleet in Dubai',
                    'Global routing',
                    'Concierge on-board setup',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                      <span className="w-1 h-1 bg-luxury-gold rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/transport/jets"
                className="inline-flex items-center gap-3 px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 mt-8 self-start"
              >
                Browse Jets
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
