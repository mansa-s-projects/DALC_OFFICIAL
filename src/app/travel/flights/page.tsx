"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, PlaneTakeoff, Globe, Clock, Shield } from "lucide-react";
import Navbar from "../../../components/navigation/Navbar";
import Footer from "../../../components/navigation/Footer";

const FLIGHT_OPTIONS = [
  {
    id: "private-charter",
    title: "Private Charter",
    description:
      "Full aircraft charter for your group. Choose from light jets to ultra-long-range aircraft.",
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop",
    price: "From AED 45,000",
  },
  {
    id: "shared-flights",
    title: "Shared Flights",
    description:
      "Book individual seats on scheduled private flights at a fraction of the cost.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    price: "From AED 5,000",
  },
  {
    id: "helicopter-tours",
    title: "Helicopter Tours",
    description:
      "See Dubai from above with scenic helicopter tours over the city skyline and coastline.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    price: "From AED 1,500",
  },
];

const FAQS = [
  {
    q: "How do I book a private flight?",
    a: "Contact our travel concierge with your preferred dates, destination, and passenger count. We will source the best aircraft options and provide quotes within hours.",
  },
  {
    q: "What airports serve private aviation in Dubai?",
    a: "Dubai International (DXB) Executive Terminal and Al Maktoum International (DWC) are the primary private aviation hubs.",
  },
  {
    q: "Can I bring pets on private flights?",
    a: "Most private operators accommodate pets. Please let us know in advance so we can arrange the appropriate aircraft.",
  },
];

export default function FlightsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2674&auto=format&fit=crop"
            alt="Private aviation Dubai"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-black/70 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-8">
            <Link
              href="/travel"
              className="hover:text-luxury-gold transition-colors"
            >
              Travel
            </Link>
            <span>/</span>
            <span className="text-luxury-gold">Flights</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            Private Aviation
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Commercial and private flights arranged to your schedule. Fly
            anywhere in the world with complete flexibility.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Globe className="w-5 h-5 text-luxury-gold" />,
                label: "Global Reach",
              },
              {
                icon: <Clock className="w-5 h-5 text-luxury-gold" />,
                label: "On Your Schedule",
              },
              {
                icon: <Shield className="w-5 h-5 text-luxury-gold" />,
                label: "Safety First",
              },
              {
                icon: <PlaneTakeoff className="w-5 h-5 text-luxury-gold" />,
                label: "VIP Lounges",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-gray-400 text-xs uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            Options
          </p>
          <h2 className="text-2xl font-display text-white">
            Choose Your Experience
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLIGHT_OPTIONS.map((opt, idx) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href="/request"
                className="group block border border-white/10 hover:border-luxury-gold/50 transition-all duration-300 bg-white/[0.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={opt.image}
                    alt={opt.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-display text-xl mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                    {opt.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    {opt.description}
                  </p>
                  <p className="text-luxury-gold text-sm font-bold">
                    {opt.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
            FAQ
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-white">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-px">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white hover:text-luxury-gold transition-colors duration-300"
              >
                <span className="font-medium text-sm leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`text-luxury-gold transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>
              {openFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5"
                >
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Bespoke Flights
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Need a custom flight arrangement?
            </h3>
          </div>
          <Link
            href="/request"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Enquire Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
