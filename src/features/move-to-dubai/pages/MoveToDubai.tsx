'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Plane } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import LeadCaptureForm from '../components/LeadCaptureForm';
import { FloatingWhatsApp, InlineWhatsApp } from '../components/WhatsAppButton';
import { SERVICES } from '../data/services';
import { WHY_DALC, PROCESS } from '../config/content';
import {
  MOVE_TO_DUBAI_EVENTS,
  initMoveToDubaiAttribution,
  trackMoveToDubaiEvent,
} from '../config/tracking';

// ─── Component ────────────────────────────────────────────────────────────────

export default function MoveToDubai() {
  useEffect(() => {
    initMoveToDubaiAttribution();
  }, []);

  const scrollToForm = () => {
    trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.LANDING_START_MOVE_CLICK, {
      source_section: 'hero',
      cta_label: 'start_your_move',
      destination: '#contact',
    });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />
      <FloatingWhatsApp
        onClick={() =>
          trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.LANDING_WHATSAPP_FLOATING_CLICK, {
            source_section: 'floating',
            cta_label: 'whatsapp_floating',
            destination: 'whatsapp',
          })
        }
      />

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 1 — HERO
      ───────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-28 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2670&auto=format&fit=crop"
            alt="Dubai skyline"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/60 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(212,175,55,0.08),transparent_65%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-10"
          >
            <Plane className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.35em]">
              Relocation Concierge
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-[82px] font-display text-white leading-[0.95] mb-7 tracking-tight">
            Move to Dubai,
            <br />
            <em className="not-italic text-luxury-gold">Seamlessly.</em>
          </h1>

          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
            From visas to private banking — we handle everything.
            <br className="hidden sm:block" />
            One team, end-to-end, for high-value relocations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-[#c9a84c] transition-all duration-300"
            >
              Start Your Move
              <ArrowRight className="w-4 h-4" />
            </button>

            <InlineWhatsApp
              label="Chat on WhatsApp"
              variant="green"
              message="Hi DALC — I'd like to discuss relocating to Dubai."
              onClick={() =>
                trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.LANDING_WHATSAPP_HERO_CLICK, {
                  source_section: 'hero',
                  cta_label: 'whatsapp_hero',
                  destination: 'whatsapp',
                })
              }
            />
          </div>
        </motion.div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div className="h-8 w-px bg-gradient-to-b from-luxury-gold/40 to-transparent" />
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 2 — SERVICES
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
            What We Handle
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white">
            Four pillars. One move.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
          {SERVICES.map((svc, idx) => (
            <motion.div
              key={svc.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/move-to-dubai/${svc.slug}`}
                className="group relative flex flex-col h-full bg-luxury-black p-8 md:p-10 border-b border-r border-transparent hover:border-luxury-gold/20 transition-all duration-500 overflow-hidden"
              >
                {/* Gold accent line */}
                <div className="absolute left-0 top-0 h-full w-[2px] bg-luxury-gold/0 group-hover:bg-luxury-gold/60 transition-all duration-500" />

                <div className="flex items-start justify-between mb-8">
                  <div className="p-3 border border-white/10 bg-white/[0.03] text-luxury-gold/70 group-hover:text-luxury-gold group-hover:border-luxury-gold/30 transition-all duration-300">
                    <svc.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 group-hover:text-luxury-gold/60 transition-colors duration-300">
                    {svc.heroAccent}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                  {svc.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                  {svc.tagline}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 group-hover:text-luxury-gold transition-colors duration-300">
                  Learn more
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 3 — WHY DALC
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <div className="relative border border-white/[0.07] bg-white/[0.015]">
          {/* Gold corner accent */}
          <div className="absolute top-0 left-0 w-16 h-[1px] bg-luxury-gold/60" />
          <div className="absolute top-0 left-0 w-[1px] h-16 bg-luxury-gold/60" />

          <div className="p-8 md:p-14">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
                Why DALC
              </p>
              <h2 className="text-3xl md:text-4xl font-display text-white">
                How we're different.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {WHY_DALC.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <div className="text-luxury-gold/60 mb-4">{item.icon}</div>
                  <h4 className="text-white font-display text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 4 — PROCESS
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
            The Process
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white">
            Three steps. That's it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
          {PROCESS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.55 }}
              className="bg-luxury-black p-8 md:p-10"
            >
              <span className="font-display text-[56px] leading-none text-luxury-gold/15 font-bold block mb-5 select-none">
                {step.num}
              </span>
              <h3 className="font-display text-xl text-white mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 5 — CTA + LEAD FORM
      ───────────────────────────────────────────────────────────────────── */}
      <section id="contact" className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">

          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-luxury-black p-8 md:p-14"
          >
            {/* Gold accent */}
            <div className="w-10 h-[2px] bg-luxury-gold mb-8" />

            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
              Start Your Move Today
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">
              Ready when<br />you are.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-sm">
              Tell us your situation. We'll reply within 2 hours with a clear plan — no obligation, no pressure.
            </p>

            {/* Concierge fallback */}
            <div className="border-t border-white/[0.07] pt-8">
              <p className="text-gray-600 text-xs uppercase tracking-[0.2em] mb-4">
                Prefer to talk it through first?
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors duration-300 group"
              >
                Speak to Concierge
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#0d0d0d] p-8 md:p-14"
          >
            <LeadCaptureForm
              contextMessage="I am interested in relocating to Dubai and would like to discuss my options"
              leadContext={{
                source_page: '/move-to-dubai',
                source_section: 'contact',
                cta_label: 'lead_form_start_your_move',
                destination: 'whatsapp',
              }}
              onSubmitSuccess={() =>
                trackMoveToDubaiEvent(
                  MOVE_TO_DUBAI_EVENTS.LANDING_LEAD_FORM_SUBMIT_SUCCESS,
                  {
                    source_section: 'contact',
                    cta_label: 'lead_form_start_your_move',
                    destination: 'whatsapp',
                  }
                )
              }
            />

            <div className="mt-6 pt-6 border-t border-white/[0.07] flex items-center justify-center">
              <InlineWhatsApp
                label="Or message us directly"
                variant="ghost"
                message="Hi DALC — I'd like to start the process of relocating to Dubai."
                className="text-[11px]"
                onClick={() =>
                  trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.LANDING_WHATSAPP_CONTACT_CLICK, {
                    source_section: 'contact',
                    cta_label: 'whatsapp_contact',
                    destination: 'whatsapp',
                  })
                }
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
