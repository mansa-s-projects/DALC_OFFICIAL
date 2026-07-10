'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import {
  getDesertSubcategory,
  DESERT_SUBCATEGORIES,
  type DesertProduct,
  type DesertFaq,
} from '../desertData';

interface Props {
  params: Promise<{ category: string; item: string }>;
}

function ProductCard({ product, subcategorySlug }: { product: DesertProduct; subcategorySlug: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col border border-cipher-rim bg-cipher-ink overflow-hidden hover:border-cipher-rim3 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden bg-cipher-void">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cipher-void/80 via-cipher-void/20 to-transparent" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[10px] font-mono uppercase tracking-widest px-2.5 py-1">
            {product.badge}
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {product.durationMinutes < 60 ? (
            <span className="flex items-center gap-1 bg-cipher-void/80 border border-cipher-rim text-cipher-white/70 text-[10px] px-2 py-0.5">
              <Clock className="w-3 h-3" /> 30 min
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-cipher-void/80 border border-cipher-rim text-cipher-white/70 text-[10px] px-2 py-0.5">
              <Clock className="w-3 h-3" /> 1 hour
            </span>
          )}
          {product.seats > 1 && (
            <span className="flex items-center gap-1 bg-cipher-void/80 border border-cipher-rim text-cipher-white/70 text-[10px] px-2 py-0.5">
              <Users className="w-3 h-3" /> {product.seats > 6 ? `up to ${product.seats}` : `${product.seats} seats`}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-display text-cipher-white mb-1.5 leading-snug group-hover:text-cipher-gold transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-cipher-muted text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-cipher-rim">
          <span className="text-cipher-gold font-mono text-base">{product.priceLabel}</span>
          <Link
            href={`/experiences/desertAdventure/${subcategorySlug}/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-cipher-gold text-xs uppercase tracking-widest hover:text-cipher-white transition-colors"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function FaqItem({ faq, index }: { faq: DesertFaq; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-cipher-rim last:border-b-0"
    >
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
    </motion.div>
  );
}

type DurationFilter = 'all' | '30min' | '1hour';

export default function DesertSubcategoryPage({ params }: Props) {
  const { item: subcategorySlug } = use(params);
  const subcategory = getDesertSubcategory(subcategorySlug);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');

  const hasMixed = useMemo(() => {
    if (!subcategory) return false;
    const has30 = subcategory.products.some((p) => p.durationMinutes < 60);
    const has60 = subcategory.products.some((p) => p.durationMinutes >= 60);
    return has30 && has60;
  }, [subcategory]);

  const filteredProducts = useMemo(() => {
    if (!subcategory) return [];
    if (durationFilter === '30min') return subcategory.products.filter((p) => p.durationMinutes < 60);
    if (durationFilter === '1hour') return subcategory.products.filter((p) => p.durationMinutes >= 60);
    return subcategory.products;
  }, [subcategory, durationFilter]);

  if (!subcategory) {
    return (
      <div className="min-h-screen bg-cipher-void text-cipher-white">
        <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
          <p className="text-cipher-muted mb-6">Activity not found.</p>
          <Link href="/experiences/desertAdventure" className="text-cipher-gold text-sm uppercase tracking-widest">
            Back to Desert Adventures
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cipher-void">

      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img
          src={subcategory.image}
          alt={subcategory.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cipher-void via-cipher-void/50 to-cipher-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-cipher-void/60 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
          <nav className="mb-6 flex items-center gap-2 text-xs text-cipher-muted uppercase tracking-widest">
            <Link href="/experiences" className="hover:text-cipher-gold transition-colors">Experiences</Link>
            <span className="opacity-40">/</span>
            <Link href="/experiences/desertAdventure" className="hover:text-cipher-gold transition-colors">Desert Adventures</Link>
            <span className="opacity-40">/</span>
            <span className="text-cipher-gold">{subcategory.title}</span>
          </nav>

          {subcategory.badge && (
            <span className="inline-block self-start mb-3 bg-cipher-gold/15 border border-cipher-gold/40 text-cipher-gold text-[10px] font-mono uppercase tracking-widest px-3 py-1">
              {subcategory.badge}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-display text-cipher-white leading-tight mb-3">
            {subcategory.title}
          </h1>
          <p className="text-cipher-muted max-w-xl text-base leading-relaxed">
            {subcategory.shortDescription}
          </p>
          <p className="mt-3 text-cipher-gold font-mono text-sm">
            From AED {subcategory.fromPrice.toLocaleString()}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Link
            href="/experiences/desertAdventure"
            className="inline-flex items-center gap-2 text-cipher-muted hover:text-cipher-gold transition-colors text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> All Desert Activities
          </Link>

          {hasMixed && (
            <div className="flex items-center gap-2">
              {(['all', '30min', '1hour'] as DurationFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setDurationFilter(f)}
                  className={`text-xs font-mono uppercase tracking-widest px-4 py-2 border transition-all duration-200 ${
                    durationFilter === f
                      ? 'border-cipher-gold bg-cipher-gold/10 text-cipher-gold'
                      : 'border-cipher-rim text-cipher-muted hover:border-cipher-gold/50 hover:text-cipher-white'
                  }`}
                >
                  {f === 'all' ? 'All Durations' : f === '30min' ? '30 Min' : '1 Hour'}
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-20">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} subcategorySlug={subcategorySlug} />
          ))}
        </section>

        <section className="border-t border-cipher-rim pt-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">About This Experience</p>
            <h2 className="text-3xl font-display text-cipher-white mb-6">{subcategory.title} in Dubai</h2>
            <p className="text-cipher-muted leading-relaxed text-base">{subcategory.seoContent}</p>
          </motion.div>
        </section>

        <section className="border-t border-cipher-rim pt-16 mb-20">
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

        <section className="border-t border-cipher-rim pt-16 mb-16">
          <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">Other Desert Activities</p>
          <h2 className="text-2xl font-display text-cipher-white mb-8">Explore More</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESERT_SUBCATEGORIES.filter((s) => s.slug !== subcategorySlug).map((s) => (
              <Link
                key={s.slug}
                href={`/experiences/desertAdventure/${s.slug}`}
                className="group relative h-36 overflow-hidden border border-cipher-rim hover:border-cipher-rim3 transition-all duration-300"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cipher-void/90 to-cipher-void/30" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-cipher-white text-xs font-medium leading-snug group-hover:text-cipher-gold transition-colors">
                    {s.title}
                  </p>
                  <p className="text-cipher-gold font-mono text-xs mt-0.5">From AED {s.fromPrice}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-cipher-rim bg-cipher-gold/[0.025] p-8 md:p-12 text-center">
          <p className="text-cipher-gold text-xs uppercase tracking-[0.4em] mb-3">Need Guidance?</p>
          <h2 className="text-3xl font-display text-cipher-white mb-4">Plan Your Desert Day</h2>
          <p className="text-cipher-muted max-w-xl mx-auto mb-8">
            Not sure which experience to choose? Our concierge team will build a personalised desert itinerary — combining activities, transport, and camp dining into a seamless day.
          </p>
          <Link
            href="/concierge"
            className="inline-flex items-center gap-2 bg-cipher-gold text-cipher-void font-mono text-xs uppercase tracking-widest px-8 py-4 hover:bg-cipher-white transition-colors"
          >
            Talk to Our Concierge <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
