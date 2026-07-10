import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { SlidersHorizontal, ChevronDown, X, ArrowRight } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import ServiceCard from '../../../components/business/ServiceCard';
import { MOCK_SERVICES } from '../../../lib/business';
import type {
  BusinessSubcategory,
  ServiceType,
  BusinessFilters,
} from '../types';
import {
  SUBCATEGORY_LABELS,
  SUBCATEGORY_DESCRIPTIONS,
  SERVICE_TYPE_LABELS,
} from '../types';

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  'company-formation': [
    {
      q: 'What is the difference between mainland and free zone?',
      a: 'Mainland companies can trade freely anywhere in the UAE and with the government. Free zone companies enjoy 100% foreign ownership, tax exemptions and simplified setup - but are typically restricted from direct trade on the mainland.',
    },
    {
      q: 'How long does company formation take?',
      a: 'Most free zone setups complete in 3-5 weeks. Mainland DED applications typically take 2-4 weeks depending on the chosen activity.',
    },
    {
      q: 'Can I be the sole shareholder?',
      a: 'Yes. UAE laws now allow 100% foreign ownership for most mainland activities, and all free zones permit 100% foreign ownership.',
    },
  ],
  licensing: [
    {
      q: 'What types of licences are available in Dubai?',
      a: 'Dubai issues Commercial, Professional, Industrial and Tourism licences through DED. Free zones may offer additional specialised categories relevant to their sectors.',
    },
    {
      q: 'Can I have multiple activities on one licence?',
      a: 'Yes, DED allows multiple related activities on a single commercial licence. The best structure depends on your activity mix and target market.',
    },
  ],
  banking: [
    {
      q: 'Which banks operate in the UAE for businesses?',
      a: 'Major options include Emirates NBD, FAB, ADCB, Mashreq, RAKBANK and several international banks. The right bank depends on your business size, industry and expected transaction volume.',
    },
    {
      q: 'How long does account opening take?',
      a: 'Typically 2-6 weeks. Banks conduct thorough KYC reviews. Our introductions significantly speed up the process and reduce rejection risk.',
    },
  ],
  tax: [
    {
      q: 'Is there corporate tax in the UAE?',
      a: 'Yes. A 9% federal corporate tax applies to profits above AED 375,000. Qualifying free zone entities can benefit from a 0% rate on qualifying income.',
    },
    {
      q: 'When must I register for VAT?',
      a: 'Mandatory VAT registration is required when annual taxable supplies exceed AED 375,000. Voluntary registration is available from AED 187,500.',
    },
  ],
  'residency-investment': [
    {
      q: 'What is the UAE Golden Visa?',
      a: 'A 10-year renewable residency visa granted to investors, entrepreneurs, professionals and exceptional talents who meet the current qualifying criteria.',
    },
    {
      q: 'Do Golden Visa holders need a sponsor?',
      a: 'No. Golden Visa holders are self-sponsored and can sponsor family members including spouse, children and domestic workers.',
    },
  ],
};

export default function SubcategoryList() {
  const params = useParams();
  const subcategory = params?.subcategory as string;
  const sub = subcategory as BusinessSubcategory;

  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filters: BusinessFilters = useMemo(
    () => ({
      subcategory: sub,
      service_type: serviceType || undefined,
    }),
    [sub, serviceType]
  );

  const services = useMemo(() => {
    return MOCK_SERVICES.filter((svc) => {
      if (svc.subcategory !== sub) return false;
      if (filters.service_type && svc.service_type !== filters.service_type) return false;
      return true;
    });
  }, [filters.service_type, sub]);

  const isLoading = false;
  const label = SUBCATEGORY_LABELS[sub] ?? sub;
  const description = SUBCATEGORY_DESCRIPTIONS[sub] ?? '';
  const faqs = FAQ_DATA[sub] ?? [];
  const hasFilters = Boolean(serviceType);

  const clearFilters = () => {
    setServiceType('');
  };

  return (
    <div className="min-h-screen bg-luxury-black">

      <section className="relative flex h-[45vh] min-h-[320px] flex-col items-center justify-center overflow-hidden px-4 pt-20 text-center">
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
          <nav className="mb-8 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-gray-500">
            <Link href="/business" className="transition-colors hover:text-luxury-gold">Business</Link>
            <span>/</span>
            <span className="text-luxury-gold">{label}</span>
          </nav>
          <h1 className="mb-4 text-4xl font-display text-white md:text-6xl">{label}</h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-400">{description}</p>
        </motion.div>
      </section>

      <section className="sticky top-[72px] z-30 border-b border-white/10 bg-luxury-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-8">
          <button
            onClick={() => setShowFilters((f) => !f)}
            className={`flex items-center gap-2 border px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
              showFilters || hasFilters
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-luxury-black">
                !
              </span>
            )}
          </button>

          <p className="text-xs uppercase tracking-widest text-gray-500">
            {isLoading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''}`}
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-luxury-gold"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:px-8 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-widest text-gray-500">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType | '')}
                  className="w-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-luxury-gold/50"
                >
                  <option value="">All types</option>
                  {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((t) => (
                    <option key={t} value={t}>{SERVICE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-gray-400">
                  We focus on route fit, approvals, and documentation strategy instead of headline pricing.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 py-24 text-center">
            <p className="mb-2 text-lg text-gray-400">No services found</p>
            <p className="mb-6 text-sm text-gray-600">Try adjusting your filters</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="border border-luxury-gold/30 px-6 py-2 text-xs uppercase tracking-widest text-luxury-gold transition-colors hover:bg-luxury-gold/10"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold">FAQ</p>
            <h2 className="text-2xl font-display text-white md:text-3xl">Common Questions</h2>
          </motion.div>

          <div className="space-y-px">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-white transition-colors duration-300 hover:text-luxury-gold"
                >
                  <span className="text-sm font-medium leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-luxury-gold transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }} className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border border-luxury-gold/20 p-8 md:flex-row md:p-12">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-luxury-gold">Not sure where to start?</p>
            <h3 className="text-xl font-display text-white md:text-2xl">Book a free 30-minute advisor call</h3>
          </div>
          <Link
            href="/business/consultation/new"
            className="flex flex-shrink-0 items-center gap-2 bg-luxury-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-luxury-black transition-all duration-300 hover:bg-luxury-gold/90"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}