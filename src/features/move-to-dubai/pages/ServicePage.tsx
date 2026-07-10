'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
} from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import LeadCaptureForm from '../components/LeadCaptureForm';
import { FloatingWhatsApp, InlineWhatsApp } from '../components/WhatsAppButton';
import { SERVICES } from '../data/services';
import {
  MOVE_TO_DUBAI_EVENTS,
  initMoveToDubaiAttribution,
  trackMoveToDubaiEvent,
} from '../config/tracking';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicePage() {
  const params = useParams();
  const service = params?.service as string | undefined;
  const data = SERVICES.find((s) => s.slug === service);

  useEffect(() => {
    initMoveToDubaiAttribution();
  }, []);

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-luxury-black">
      <FloatingWhatsApp
        message={data.whatsappText}
        onClick={() =>
          trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_FLOATING_CLICK, {
            source_section: 'floating',
            cta_label: 'whatsapp_floating',
            destination: 'whatsapp',
            service_slug: data.slug,
          })
        }
      />

      {/* ─────────────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/move-to-dubai"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-luxury-gold transition-colors duration-200 text-sm uppercase tracking-widest group mb-12"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
              Move to Dubai
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            {/* Left — title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-luxury-gold/30 bg-luxury-gold/5 mb-8">
                <span className="text-luxury-gold"><data.icon className="w-8 h-8" /></span>
                <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                  {data.heroAccent}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-5">
                {data.label}
              </h1>
              <p className="text-luxury-gold font-display text-xl md:text-2xl italic mb-7">
                {data.tagline}
              </p>
              <p className="text-gray-400 leading-relaxed max-w-lg">
                {data.description}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_START_MOVE_CLICK, {
                      source_section: 'hero',
                      cta_label: 'get_started',
                      destination: '#service-contact',
                      service_slug: data.slug,
                    });
                    document.getElementById('service-contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-[#c9a84c] transition-all duration-300"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
                <InlineWhatsApp
                  label="Chat on WhatsApp"
                  variant="green"
                  message={data.whatsappText}
                  onClick={() =>
                    trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_HERO_CLICK, {
                      source_section: 'hero',
                      cta_label: 'whatsapp_hero',
                      destination: 'whatsapp',
                      service_slug: data.slug,
                    })
                  }
                />
              </div>
            </motion.div>

            {/* Right — quick info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="border border-white/[0.07] bg-white/[0.02] p-8"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-5">
                Timeline
              </p>
              <ol className="space-y-4">
                {data.timeline.map((t, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="shrink-0 w-5 h-5 rounded-full border border-luxury-gold/40 text-luxury-gold text-[10px] flex items-center justify-center font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-luxury-gold text-xs font-bold uppercase tracking-wider">
                        {t.phase}
                      </span>
                      <p className="text-gray-400 text-sm mt-0.5">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          WHO IT'S FOR + WHAT'S INCLUDED
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">

          {/* Who it's for */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-luxury-black p-8 md:p-12"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">
              Who It's For
            </p>
            <ul className="space-y-3.5">
              {data.whoFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-luxury-gold/70 shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="bg-[#0d0d0d] p-8 md:p-12"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">
              What's Included
            </p>
            <ul className="space-y-3.5">
              {data.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-luxury-gold/60" />
                  <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          LEAD CAPTURE + CTA
      ───────────────────────────────────────────────────────────────────── */}
      <section id="service-contact" className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="bg-luxury-black p-8 md:p-14 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-[2px] bg-luxury-gold mb-8" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold mb-4">
                Get Started
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-5 leading-tight">
                Ready to begin?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Send us a message and we'll respond within 2 hours with a clear, 
                personalised plan — no commitment required.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-white/[0.07]">
              <p className="text-xs text-gray-600 uppercase tracking-[0.2em] mb-3">
                Prefer WhatsApp?
              </p>
              <InlineWhatsApp
                message={data.whatsappText}
                label="Chat directly"
                variant="ghost"
                className="text-[11px]"
                onClick={() =>
                  trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_WHATSAPP_CONTACT_CLICK, {
                    source_section: 'contact',
                    cta_label: 'whatsapp_contact',
                    destination: 'whatsapp',
                    service_slug: data.slug,
                  })
                }
              />
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="bg-[#0d0d0d] p-8 md:p-14"
          >
            <LeadCaptureForm
              contextMessage={`I am interested in the ${data.label} service at DALC`}
              leadContext={{
                source_page: `/move-to-dubai/${data.slug}`,
                source_section: 'contact',
                cta_label: 'lead_form_get_started',
                service_slug: data.slug,
                destination: 'whatsapp',
              }}
              onSubmitSuccess={() =>
                trackMoveToDubaiEvent(MOVE_TO_DUBAI_EVENTS.SERVICE_LEAD_FORM_SUBMIT_SUCCESS, {
                  source_section: 'contact',
                  cta_label: 'lead_form_get_started',
                  destination: 'whatsapp',
                  service_slug: data.slug,
                })
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          OTHER SERVICES
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-28">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-8">
          Also Available
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06]">
          {SERVICES.filter((s) => s.slug !== data.slug).map((svc) => (
            <Link
              key={svc.slug}
              href={`/move-to-dubai/${svc.slug}`}
              className="group bg-luxury-black p-6 flex items-center justify-between hover:bg-white/[0.025] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-luxury-gold/50 group-hover:text-luxury-gold transition-colors duration-300">
                  <svc.icon className="w-8 h-8" />
                </span>
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300 font-medium">
                  {svc.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-luxury-gold group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
