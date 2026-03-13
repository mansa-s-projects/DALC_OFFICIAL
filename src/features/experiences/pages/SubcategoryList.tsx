import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, ArrowRight, Grid3X3, List } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ExperienceCard from '../../../components/experiences/ExperienceCard';
import { useExperiences } from '../hooks/useExperiences';
import type {
  ExperienceSubcategory,
  ServiceType,
  PricingModel,
  ExperienceFilters,
} from '../types';
import {
  SUBCATEGORY_LABELS,
  SUBCATEGORY_DESCRIPTIONS,
  SERVICE_TYPE_LABELS,
  SUB_SUBCATEGORIES,
} from '../types';

// ─── FAQ data per subcategory ─────────────────────────────────────────────────

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  nightlife: [
    {
      q: 'What is the dress code for Dubai nightlife venues?',
      a: 'Most upscale venues require smart casual to elegant attire. Men should wear collared shirts and closed shoes. Beach clubs allow swimwear with cover-ups. Always avoid sportswear, flip-flops, and shorts at high-end clubs.',
    },
    {
      q: 'What time do clubs typically open and close?',
      a: 'Dubai nightlife starts late — most clubs open around 11 PM and continue until 3-4 AM. Happy hours at lounges usually run from 6-9 PM.',
    },
    {
      q: 'Is alcohol served in Dubai clubs?',
      a: 'Yes, alcohol is served in licensed venues including most hotels, clubs, and restaurants. You must be 21+ with valid ID.',
    },
  ],
  adventure: [
    {
      q: 'What is the best time of year for outdoor activities?',
      a: 'October through April offers the most pleasant weather for outdoor adventures. Summer months (May-September) are extremely hot, though indoor activities like skydiving remain available.',
    },
    {
      q: 'Do I need prior experience for activities like skydiving?',
      a: 'Tandem skydiving requires no prior experience — you\'ll be attached to a certified instructor. For solo skydiving, you need a valid license.',
    },
    {
      q: 'Are adventure activities safe in Dubai?',
      a: 'Dubai maintains strict safety standards. All operators are licensed and insured, with professional guides and modern equipment.',
    },
  ],
  dining: [
    {
      q: 'How far in advance should I book fine dining restaurants?',
      a: 'For Michelin-starred and trending restaurants, book 2-4 weeks ahead. Some exclusive chef\'s tables require 1-2 months advance booking.',
    },
    {
      q: 'Are dietary restrictions accommodated?',
      a: 'Most high-end restaurants accommodate dietary requirements with advance notice. Dubai has excellent options for vegetarian, vegan, halal, and gluten-free diets.',
    },
    {
      q: 'Is there a dress code for restaurants?',
      a: 'Fine dining venues typically require smart casual or elegant attire. Beach restaurants and brunches are more relaxed.',
    },
  ],
  water: [
    {
      q: 'What is the water temperature like?',
      a: 'The Arabian Gulf is warm year-round, ranging from 21°C (70°F) in winter to 33°C (91°F) in summer. Wetsuits are rarely needed.',
    },
    {
      q: 'Are water sports available year-round?',
      a: 'Yes, though some operators reduce hours during the hottest months (July-August). Morning sessions are recommended in summer.',
    },
    {
      q: 'Do I need certification for scuba diving?',
      a: 'Introductory dives require no certification. Certified divers should bring their C-card. Advanced dives require appropriate certification levels.',
    },
  ],
  sky: [
    {
      q: 'What happens if weather conditions are poor?',
      a: 'Safety is paramount — activities may be rescheduled or refunded due to high winds, sandstorms, or poor visibility. Morning flights typically have the best conditions.',
    },
    {
      q: 'Is there a weight limit for helicopter tours?',
      a: 'Yes, individual passenger weight limits typically range from 110-136 kg (240-300 lbs) depending on the aircraft. Total group weight is also considered for balance.',
    },
    {
      q: 'Can I take photos during the flight?',
      a: 'Absolutely! Cameras and phones are permitted. For skydiving, professional photo/video packages are available and highly recommended.',
    },
  ],
  wellness: [
    {
      q: 'What should I wear to a spa?',
      a: 'Spas provide robes, slippers, and disposable undergarments. Arrive in comfortable clothing. Avoid jewelry that might interfere with treatments.',
    },
    {
      q: 'How early should I arrive before my appointment?',
      a: 'Arrive 15-30 minutes early to complete paperwork, change, and begin relaxing. Many spas have facilities like saunas and pools to enjoy before your treatment.',
    },
    {
      q: 'Are treatments suitable for pregnant guests?',
      a: 'Many spas offer prenatal treatments. Always inform the spa when booking if you\'re pregnant — some treatments and heat facilities may not be suitable.',
    },
  ],
  culture: [
    {
      q: 'What should I wear for cultural tours?',
      a: 'Modest dress is recommended — shoulders and knees should be covered. Comfortable walking shoes are essential for heritage walks.',
    },
    {
      q: 'Are tours available in languages other than English?',
      a: 'Many operators offer tours in Arabic, French, German, Russian, and Chinese. Private guides can often be arranged in your preferred language.',
    },
    {
      q: 'Can I take photos in mosques and museums?',
      a: 'Photography policies vary. Most museums allow non-flash photography. Mosques typically allow photography but may have restricted areas. Always ask your guide.',
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubcategoryList() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const sub = subcategory as ExperienceSubcategory;

  // Filters state
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [pricingModel, setPricingModel] = useState<PricingModel | ''>('');
  const [subSubcategory, setSubSubcategory] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filters: ExperienceFilters = useMemo(
    () => ({
      subcategory: sub,
      sub_subcategory: subSubcategory || undefined,
      service_type: serviceType || undefined,
      pricing_model: pricingModel || undefined,
      price_max: priceMax !== '' ? Number(priceMax) : undefined,
    }),
    [sub, subSubcategory, serviceType, pricingModel, priceMax]
  );

  const { data: experiences = [], isLoading } = useExperiences(filters);

  const label = SUBCATEGORY_LABELS[sub] ?? sub;
  const description = SUBCATEGORY_DESCRIPTIONS[sub] ?? '';
  const faqs = FAQ_DATA[sub] ?? [];
  const subSubcategories = SUB_SUBCATEGORIES[sub] ?? [];

  const hasFilters = Boolean(serviceType || pricingModel || subSubcategory || priceMax);

  const clearFilters = () => {
    setServiceType('');
    setPricingModel('');
    setSubSubcategory('');
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
            <Link to="/experiences" className="hover:text-luxury-gold transition-colors">Experiences</Link>
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
          <div className="flex items-center gap-3">
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

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-luxury-gold/20 text-luxury-gold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-widest">
            {isLoading ? 'Loading…' : `${experiences.length} experience${experiences.length !== 1 ? 's' : ''}`}
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
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sub-subcategory */}
              {subSubcategories.length > 0 && (
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                    Type
                  </label>
                  <select
                    value={subSubcategory}
                    onChange={e => setSubSubcategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
                  >
                    <option value="">All types</option>
                    {subSubcategories.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}

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
                  Pricing
                </label>
                <select
                  value={pricingModel}
                  onChange={e => setPricingModel(e.target.value as PricingModel | '')}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
                >
                  <option value="">All pricing</option>
                  <option value="per_person">Per Person</option>
                  <option value="per_group">Per Group</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="tiered">Tiered</option>
                  <option value="free">Free</option>
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
                  step={100}
                  placeholder="e.g. 2000"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ── Experience Grid ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {isLoading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : experiences.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {experiences.map((experience, idx) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                index={idx} 
                showSubcategory={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/10">
            <p className="text-gray-400 text-lg mb-2">No experiences found</p>
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
              Looking for something else?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Browse all Dubai experiences
            </h3>
          </div>
          <Link
            to="/experiences"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
