"use client";

import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { Venue } from "../../../types";
import { motion, AnimatePresence } from "motion/react";

interface VenueFAQProps {
  venue: Venue;
  onBook: () => void;
}

export default function VenueFAQ({ venue, onBook }: VenueFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I make a reservation?",
      a: `Our concierge team will personally secure your ${venue.name} experience. Confirm your date, party size, and any special requests — we handle the rest.`,
      cta: true,
    },
    {
      q: "What is the dress code?",
      a: venue.dress_code || "Smart casual. We recommend checking with concierge for special event nights.",
      cta: false,
    },
    {
      q: "What are the opening hours?",
      a: venue.opening_hours || "Please contact our concierge for the latest operating schedule.",
      cta: false,
    },
    {
      q: "What is the cancellation policy?",
      a: venue.booking_policy || "24 hours notice is required for cancellations. Late cancellations may incur a fee.",
      cta: false,
    },
    {
      q: `Who is ${venue.name} best suited for?`,
      a: venue.who_its_for || "Perfect for special occasions, intimate dinners, and curated social experiences in Dubai.",
      cta: false,
    },
    {
      q: `What makes ${venue.name} unique?`,
      a: venue.insider_tip || venue.description_short || "An exceptional Dubai experience curated for the discerning guest.",
      cta: false,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20 mb-4"
    >
      <h2 className="text-2xl font-display text-white mb-8 tracking-wide">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/8 rounded-sm overflow-hidden bg-white/[0.02] hover:border-white/15 transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left group"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors pr-4">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {faq.a}
                    </p>
                    {faq.cta && (
                      <button
                        onClick={onBook}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors border border-luxury-gold/30 hover:border-white/40 px-4 py-2.5 rounded-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Request Reservation
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
