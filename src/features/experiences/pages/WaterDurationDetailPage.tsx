'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, MapPin, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import { getWaterModel, getWaterProduct, type WaterFaq } from '../waterData';

interface Props {
  params: Promise<{ category: string; item: string; slug: string }>;
}

function FaqItem({ faq, index }: { faq: WaterFaq; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-cipher-rim last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-cipher-white font-medium text-sm leading-snug pr-2">{faq.q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-cipher-gold shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cipher-gold shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <p className="text-cipher-muted text-sm leading-relaxed pb-5">{faq.a}</p>
      )}
    </div>
  );
}

export default function WaterDurationDetailPage({ params }: Props) {
  const { item: modelSlug, slug: durationSlug } = use(params);
  const model = getWaterModel(modelSlug);
  const product = model ? getWaterProduct(modelSlug, durationSlug) : undefined;

  if (!model || !product) {
    return (
      <div className="min-h-screen bg-cipher-void text-cipher-white">
        <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
          <p className="text-cipher-muted mb-6">Experience not found.</p>
          <Link href="/experiences/water-activities" className="text-cipher-gold text-sm uppercase tracking-widest">
            Back to Water Activities
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const durationLabel =
    product.durationMinutes < 60
      ? `${product.durationMinutes} min`
      : `${Math.round(product.durationMinutes / 60)} ${product.durationMinutes === 60 ? 'hour' : 'hours'}`;

  const included =
    model.group === 'jet-car'
      ? ['Life jacket included', 'Safety orientation included', 'No licence required', 'Equipment provided']
      : ['Life jacket included', 'Safety briefing included', 'Fuel included', 'Equipment provided'];

  return (
    <div className="min-h-screen bg-cipher-void">

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <nav className="mb-8 flex items-center gap-2 text-xs text-cipher-muted uppercase tracking-widest">
          <Link href="/experiences" className="hover:text-cipher-gold transition-colors">Experiences</Link>
          <span className="opacity-40">/</span>
          <Link href="/experiences/water-activities" className="hover:text-cipher-gold transition-colors">Water Activities</Link>
          <span className="opacity-40">/</span>
          <Link href={`/experiences/water-activities/${modelSlug}`} className="hover:text-cipher-gold transition-colors">{model.title}</Link>
          <span className="opacity-40">/</span>
          <span className="text-cipher-gold">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[10px] font-mono uppercase tracking-widest px-3 py-1">
                {product.badge}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <Link
              href={`/experiences/water-activities/${modelSlug}`}
              className="inline-flex items-center gap-2 text-cipher-muted hover:text-cipher-gold transition-colors text-xs uppercase tracking-widest mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> {model.title}
            </Link>

            <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-2">
              {model.group === 'jet-car' ? 'Jet Car' : 'Jet Ski'} Session
            </p>
            <h1 className="text-3xl md:text-4xl font-display text-cipher-white leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-cipher-muted text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="flex items-center gap-1.5 bg-cipher-void border border-cipher-rim text-cipher-white/70 text-xs px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-cipher-gold" /> {durationLabel}
              </span>
              <span className="flex items-center gap-1.5 bg-cipher-void border border-cipher-rim text-cipher-white/70 text-xs px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-cipher-gold" /> {model.location}
              </span>
              {model.ageMin > 0 && (
                <span className="bg-cipher-void border border-cipher-rim text-cipher-white/70 text-xs px-3 py-1.5">
                  {model.ageMin}+ years
                </span>
              )}
            </div>

            <div className="border border-cipher-rim bg-cipher-gold/[0.025] p-6 mb-8">
              <div className="flex items-end gap-3 mb-5">
                <span className="text-4xl font-mono text-cipher-white">
                  AED {product.priceAED.toLocaleString()}
                </span>
                <span className="text-cipher-muted text-sm mb-1">per session</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-cipher-muted mb-0.5">Duration</p>
                  <p className="text-cipher-white font-mono">{durationLabel}</p>
                </div>
                <div>
                  <p className="text-cipher-muted mb-0.5">Location</p>
                  <p className="text-cipher-white font-mono">{model.location}</p>
                </div>
                <div>
                  <p className="text-cipher-muted mb-0.5">Model</p>
                  <p className="text-cipher-white font-mono">{model.title}</p>
                </div>
                <div>
                  <p className="text-cipher-muted mb-0.5">Min Age</p>
                  <p className="text-cipher-white font-mono">{model.ageMin}+ years</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/971000000000?text=Hi, I'd like to book the ${product.title} on the ${model.title} at ${model.location}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-mono text-xs uppercase tracking-widest px-6 py-4 hover:bg-[#22c55e] transition-colors mb-4"
            >
              <MessageCircle className="w-4 h-4" /> Book via WhatsApp
            </a>
            <p className="text-center text-cipher-muted text-xs mb-2">or</p>
            <Link
              href="/concierge"
              className="inline-flex items-center justify-center gap-2 border border-cipher-gold text-cipher-gold font-mono text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-cipher-gold hover:text-cipher-void transition-colors"
            >
              Request via Concierge <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <section className="border-t border-cipher-rim mt-20 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-4">What's Included</p>
            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-cipher-muted text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cipher-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {model.faq.length > 0 && (
            <div>
              <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-4">FAQ</p>
              <div className="divide-y divide-cipher-rim border border-cipher-rim px-5">
                {model.faq.slice(0, 4).map((item, i) => (
                  <FaqItem key={i} faq={item} index={i} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
