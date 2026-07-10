'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  MapPin,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { getDesertProduct, getDesertSubcategory, type DesertFaq } from '../desertData';

interface Props {
  params: Promise<{ category: string; item: string; slug: string }>;
}

function FaqItem({ faq, index }: { faq: DesertFaq; index: number }) {
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

export default function DesertProductDetailPage({ params }: Props) {
  const { item: subcategorySlug, slug: productSlug } = use(params);
  const subcategory = getDesertSubcategory(subcategorySlug);
  const product = getDesertProduct(subcategorySlug, productSlug);

  if (!product || !subcategory) {
    return (
      <div className="min-h-screen bg-cipher-void text-cipher-white">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
          <p className="text-cipher-muted mb-6">Experience not found.</p>
          <Link
            href="/experiences/desertAdventure"
            className="text-cipher-gold text-sm uppercase tracking-widest"
          >
            Back to Desert Adventures
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const duration =
    product.durationMinutes < 60
      ? '30 minutes'
      : product.durationMinutes < 120
      ? '1 hour'
      : `${Math.round(product.durationMinutes / 60)} hours`;

  return (
    <div className="min-h-screen bg-cipher-void">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <nav className="flex items-center gap-2 text-xs text-cipher-muted uppercase tracking-widest mb-8">
          <Link href="/experiences" className="hover:text-cipher-gold transition-colors">
            Experiences
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/experiences/desertAdventure" className="hover:text-cipher-gold transition-colors">
            Desert Adventures
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href={`/experiences/desertAdventure/${subcategorySlug}`}
            className="hover:text-cipher-gold transition-colors"
          >
            {subcategory.title}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-cipher-gold truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cipher-void/60 to-transparent" />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[10px] font-mono uppercase tracking-widest px-3 py-1.5">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-cipher-muted text-xs border border-cipher-rim px-3 py-2">
                <Clock className="w-3.5 h-3.5 text-cipher-gold" /> {duration}
              </span>
              {product.seats > 1 && (
                <span className="flex items-center gap-1.5 text-cipher-muted text-xs border border-cipher-rim px-3 py-2">
                  <Users className="w-3.5 h-3.5 text-cipher-gold" />{' '}
                  {product.seats > 6 ? `Groups up to ${product.seats}` : `Up to ${product.seats} seats`}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-cipher-muted text-xs border border-cipher-rim px-3 py-2">
                <MapPin className="w-3.5 h-3.5 text-cipher-gold" /> Lahbab Desert, Dubai
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <Link
              href={`/experiences/desertAdventure/${subcategorySlug}`}
              className="inline-flex items-center gap-2 text-cipher-muted hover:text-cipher-gold transition-colors text-xs uppercase tracking-widest mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {subcategory.title}
            </Link>

            <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">
              {subcategory.title}
            </p>
            <h1 className="text-3xl md:text-4xl font-display text-cipher-white leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-cipher-muted leading-relaxed mb-8">{product.description}</p>

            <div className="border border-cipher-rim bg-cipher-gold/[0.025] p-6 mb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-cipher-muted text-xs uppercase tracking-widest mb-1">Price</p>
                  <p className="text-cipher-gold font-mono text-2xl">{product.priceLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-cipher-muted text-xs uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-cipher-white font-mono text-sm">{duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-cipher-ink border border-cipher-rim p-3">
                  <p className="text-cipher-muted text-[10px] uppercase tracking-widest mb-1">Location</p>
                  <p className="text-cipher-white text-sm">Lahbab Desert</p>
                </div>
                <div className="bg-cipher-ink border border-cipher-rim p-3">
                  <p className="text-cipher-muted text-[10px] uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-cipher-white text-sm">Daily, all year</p>
                </div>
              </div>

              <a
                href="https://wa.me/971000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-cipher-gold text-cipher-void font-mono text-xs uppercase tracking-widest py-4 hover:bg-cipher-white transition-colors mb-3"
              >
                <MessageCircle className="w-4 h-4" /> Book via WhatsApp
              </a>
              <Link
                href="/concierge"
                className="flex items-center justify-center gap-2 w-full border border-cipher-gold text-cipher-gold font-mono text-xs uppercase tracking-widest py-4 hover:bg-cipher-gold/10 transition-colors"
              >
                Request Concierge Booking <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ul className="space-y-2">
              {['Safety briefing included', 'All safety equipment provided', 'Guide accompaniment', 'Private desert track'].map(
                (inc) => (
                  <li key={inc} className="flex items-center gap-2 text-cipher-muted text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cipher-gold shrink-0" />
                    {inc}
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>

        {subcategory.faq.length > 0 && (
          <section className="border-t border-cipher-rim pt-16 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">FAQ</p>
              <h2 className="text-3xl font-display text-cipher-white mb-8">Common Questions</h2>
              <div className="divide-y divide-cipher-rim border border-cipher-rim px-6">
                {subcategory.faq.map((item, i) => (
                  <FaqItem key={i} faq={item} index={i} />
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
