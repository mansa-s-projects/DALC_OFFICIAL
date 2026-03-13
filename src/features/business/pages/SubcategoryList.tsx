import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, ArrowRight } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/business/ServiceCard';
import { useBusinessServices } from '../hooks/useBusiness';
import type {
  BusinessSubcategory,
  ServiceType,
  PricingModel,
  BusinessFilters,
} from '../types';
import {
  SUBCATEGORY_LABELS,
  SUBCATEGORY_DESCRIPTIONS,
  SERVICE_TYPE_LABELS,
} from '../types';

// ─── FAQ data per subcategory ─────────────────────────────────────────────────

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  'company-formation': [
    {
      q: 'What is the difference between mainland and free zone?',
      a: 'Mainland companies can trade freely anywhere in the UAE and with the government. Free zone companies enjoy 100% foreign ownership, tax exemptions and simplified setup — but are typically restricted from direct trade on the mainland.',
    },
    {
      q: 'How long does company formation take?',
      a: 'Most free zone setups complete in 3–5 weeks. Mainland DED applications typically take 2–4 weeks depending on the chosen activity.',
    },
    {
      q: 'Can I be the sole shareholder?',
      a: 'Yes. UAE laws now allow 100% foreign ownership for most mainland activities under the Companies Law amendments of 2021, and all free zones permit 100% foreign ownership.',
    },
  ],
  'licensing': [
    {
      q: 'What types of licences are available in Dubai?',
      a: 'Dubai issues Commercial, Professional, Industrial and Tourism licences through DED. Free zones may offer additional specialised categories relevant to their sectors.',
    },
    {
      q: 'Can I have multiple activities on one licence?',
      a: 'Yes, DED allows multiple related activities on a single commercial licence. Fees vary based on the number of activities selected.',
    },
  ],
  'banking': [
    {
      q: 'Which banks operate in the UAE for businesses?',
      a: 'Major options include Emirates NBD, FAB, ADCB, Mashreq, RAKBANK and several international banks. The right bank depends on your business size, industry and expected transaction volume.',
    },
    {
      q: 'How long does account opening take?',
      a: 'Typically 2–6 weeks. Banks conduct thorough KYC reviews. Our introductions significantly speed up the process and reduce rejection risk.',
    },
  ],
  'tax': [
    {
      q: 'Is there corporate tax in the UAE?',
      a: 'Yes. A 9% federal corporate tax applies to profits above AED 375,000 from June 2023. Qualifying free zone entities can benefit from a 0% rate on qualifying income.',
    },
    {
      q: 'When must I register for VAT?',
      a: 'Mandatory VAT registration is required when annual taxable supplies exceed AED 375,000. Voluntary registration is available from AED 187,500.',
    },
  ],
  'residency-investment': [
    {
      q: 'What is the UAE Golden Visa?',
      a: 'A 10-year renewable residency visa granted to investors (AED 2M+ in property or business), entrepreneurs, professionals and exceptional talents.',
    },
    {
      q: 'Do Golden Visa holders need a sponsor?',
      a: 'No. Golden Visa holders are self-sponsored and can sponsor family members including spouse, children and domestic workers.',
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubcategoryList() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const sub = subcategory as BusinessSubcategory;

  // Filters state
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [pricingModel, setPricingModel] = useState<PricingModel | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filters: BusinessFilters = useMemo(
    () => ({
      subcategory: sub,
      service_type: serviceType || undefined,
      pricing_model: pricingModel || undefined,
      price_max: priceMax !== '' ? Number(priceMax) : undefined,
    }),
    [sub, serviceType, pricingModel, priceMax]
  );

  const { data: services = [], isLoading } = useBusinessServices(filters);

  const label = SUBCATEGORY_LABELS[sub] ?? sub;
  const description = SUBCATEGORY_DESCRIPTIONS[sub] ?? '';
  const faqs = FAQ_DATA[sub] ?? [];

  const hasFilters = Boolean(serviceType || pricingModel || priceMax);

  const clearFilters = () => {
    setServiceType('');
    setPricingModel('');
    setPriceMax('');
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[45vh] min-h-[320px] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
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
            <Link to="/business" className="hover:text-luxury-gold transition-colors">Business</Link>
            <span>/</span>
            <span className="text-luxury-gold">{label}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">{label}</h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">{description}</p>
        </motion.div>
      </section>

      {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-luxury-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${
              showFilters || hasFilters
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasFilters && (
              <span className="w-4 h-4 bg-luxury-gold text-luxury-black text-[10px] font-bold rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <p className="text-gray-500 text-xs uppercase tracking-widest">
            {isLoading ? 'Loading…' : `${services.length} service${services.length !== 1 ? 's' : ''}`}
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-luxury-gold transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Service type */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as ServiceType | '')}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
                >
                  <option value="">All types</option>
                  {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map(t => (
                    <option key={t} value={t}>{SERVICE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>

              {/* Pricing model */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  Pricing Model
                </label>
                <select
                  value={pricingModel}
                  onChange={e => setPricingModel(e.target.value as PricingModel | '')}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
                >
                  <option value="">All pricing</option>
                  <option value="fixed">Fixed price</option>
                  <option value="starting_from">Starting from</option>
                  <option value="hourly">Hourly</option>
                  <option value="custom_quote">Custom quote</option>
                </select>
              </div>

              {/* Max price */}
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  Max Price (AED)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="e.g. 20000"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── Service Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/10">
            <p className="text-gray-400 text-lg mb-2">No services found</p>
            <p className="text-gray-600 text-sm mb-6">Try adjusting your filters</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold/10 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 md:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-display text-white">Common Questions</h2>
          </motion.div>

          <div className="space-y-px">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-white hover:text-luxury-gold transition-colors duration-300"
                >
                  <span className="font-medium text-sm leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5"
                  >
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Not sure where to start?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Book a free 30-minute advisor call
            </h3>
          </div>
          <Link
            to="/business/consultation/new"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
