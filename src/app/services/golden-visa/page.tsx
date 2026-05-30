'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Building2,
  Users,
  Lightbulb,
  GraduationCap,
  Shield,
  Clock,
  Globe,
  Briefcase,
} from 'lucide-react';
import Footer from '@/components/navigation/Footer';

// â”€â”€â”€ Animation helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const BENEFITS = [
  {
    icon: Shield,
    title: 'No Sponsor Required',
    desc: 'Full independence â€” live, work, and travel without any local sponsor or employer.',
  },
  {
    icon: Clock,
    title: '10-Year Validity',
    desc: 'Renewed automatically. Build your life in the UAE without the uncertainty of short-term visas.',
  },
  {
    icon: Users,
    title: 'Family Included',
    desc: 'Spouse, children, and parents can all be included under your Golden Visa sponsorship.',
  },
  {
    icon: Globe,
    title: 'Business Freedom',
    desc: '100% company ownership, global banking access, and the right to operate across the UAE.',
  },
  {
    icon: Briefcase,
    title: 'Multiple Entry',
    desc: 'Unlimited entries to the UAE. No need to renew residency stamps on every trip.',
  },
  {
    icon: Star,
    title: 'Global Prestige',
    desc: "UAE residency enhances your international profile and accelerates banking relationships worldwide.",
  },
];

const CATEGORIES = [
  {
    id: 'investor',
    icon: Building2,
    label: 'Investor',
    description: 'Property or fund investment in the UAE.',
    requirements: [
      'Minimum property investment of AED 2,000,000',
      'Property must be ready (not off-plan) or mortgaged with approved bank',
      'Investment in UAE-approved fund valued at AED 2M+',
      'Clean criminal record',
      'Valid passport (minimum 6 months)',
    ],
  },
  {
    id: 'entrepreneur',
    icon: Lightbulb,
    label: 'Entrepreneur',
    description: 'Founders and business owners with proven track record.',
    requirements: [
      'Existing business with annual revenue of AED 1M+',
      'OR startup approved by an accredited UAE incubator',
      'Business registered in the UAE',
      'Recommendation from Ministry of Economy or approved entity',
      'Valid passport (minimum 6 months)',
    ],
  },
  {
    id: 'talent',
    icon: Star,
    label: 'Exceptional Talent',
    description: 'Artists, scientists, athletes, and specialists.',
    requirements: [
      'Proven excellence in science, arts, culture, or athletics',
      'Endorsed by a relevant UAE ministry or authority',
      'Portfolio / official awards / national-level recognition',
      'Active professionals in specialized fields (doctors, engineers, etc.)',
      'Valid passport (minimum 6 months)',
    ],
  },
  {
    id: 'student',
    icon: GraduationCap,
    label: 'Outstanding Student',
    description: 'Top academic achievers in UAE and abroad.',
    requirements: [
      'GPA of 3.75+ from a UAE university',
      'OR top student in home country applying to UAE university',
      'Enrolled or accepted at an accredited UAE institution',
      'Minimum age: 15 years',
      'Valid passport (minimum 6 months)',
    ],
  },
];

const PROCESS = [
  { num: '01', title: 'Initial Consultation', desc: 'We assess your eligibility and determine the optimal pathway based on your profile and goals.' },
  { num: '02', title: 'Document Collection', desc: 'We provide a precise checklist and assist in sourcing, certifying, and translating all required documents.' },
  { num: '03', title: 'Application Filing', desc: 'Our team submits the complete application to the UAE Federal Authority for Identity and Citizenship.' },
  { num: '04', title: 'Status Tracking', desc: 'We monitor your application in real time and liaise with authorities on your behalf.' },
  { num: '05', title: 'Medical & Biometrics', desc: 'We schedule and accompany you through the required health screening and Emirates ID registration.' },
  { num: '06', title: 'Visa Stamped', desc: 'Your Golden Visa is issued. We deliver your Emirates ID and provide onboarding support for UAE life.' },
];

const PRICING = [
  {
    tier: 'Assisted',
    price: 'AED 8,500',
    description: 'For applicants with straightforward profiles who need guided support.',
    features: [
      'Eligibility assessment',
      'Document checklist',
      'Application review & submission',
      'Status tracking',
      'Email support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    tier: 'Managed',
    price: 'AED 14,500',
    description: 'Fully managed service â€” we handle everything end to end.',
    features: [
      'Everything in Assisted',
      'Full document collection & notarization',
      'In-person accompaniment',
      'Medical appointment booking',
      'Emirates ID registration',
      'Dedicated case manager',
      'Priority response (< 4 hours)',
    ],
    cta: 'Most Popular',
    featured: true,
  },
  {
    tier: 'VIP White Glove',
    price: 'AED 24,000',
    description: 'Ultimate discretion and personal service for high-profile clients.',
    features: [
      'Everything in Managed',
      'Private advisor assigned',
      'Concierge document courier',
      'Family visa included (1 dependent)',
      'Business setup consultation',
      'UAE banking introduction',
      'Aftercare for 12 months',
    ],
    cta: 'Enquire Now',
    featured: false,
  },
];

const FAQS = [
  {
    q: 'How long does the Golden Visa process take?',
    a: 'Typically 4 to 8 weeks from document submission to visa issuance, depending on your category and how quickly documents are gathered. Our managed service can often expedite to 3 weeks.',
  },
  {
    q: 'Can I include my entire family?',
    a: 'Yes. Your spouse, children (of any age if unmarried daughters, sons up to 25), and parents are all eligible for inclusion under your Golden Visa sponsorship.',
  },
  {
    q: 'Do I need to live in the UAE full-time?',
    a: 'No. Unlike standard UAE residency, the Golden Visa does not expire if you spend extended periods outside the UAE. You are not required to return every 6 months.',
  },
  {
    q: 'Can I own 100% of a business with a Golden Visa?',
    a: 'Yes. Golden Visa holders can establish and own 100% of mainland and free zone businesses in the UAE without any local sponsor requirement.',
  },
  {
    q: 'What is the minimum property investment for the investor category?',
    a: 'AED 2,000,000 (approximately USD 545,000). This can be one property or a combination of properties. Mortgaged properties with UAE-approved banks are also eligible.',
  },
  {
    q: 'What happens to my Golden Visa if my property is sold?',
    a: 'If you sell the qualifying property and do not replace it with another qualifying asset within a grace period, your Golden Visa can be cancelled. We advise maintaining the asset or upgrading to another qualifying category.',
  },
  {
    q: 'Is DALC a licensed visa agency?',
    a: 'Yes. DALC operates as an authorised immigration and relocation consultancy in the UAE. Our team includes licensed PRO officers and immigration specialists with 10+ years of in-country experience.',
  },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function GoldenVisaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('investor');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory)!;

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hotels/address-downtown.jpg"
            alt="UAE skyline"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(212,175,55,0.10),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors duration-300 mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Services
            </Link>

            <div className="inline-flex items-center gap-2 px-5 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-8 block">
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em]">
                UAE Immigration · Golden Visa
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Your Path to
              <br />
              <em className="not-italic text-luxury-gold">UAE Residency</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              The UAE Golden Visa grants 10-year renewable residency â€” no employer, no sponsor,
              no limits. We manage the entire process for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27m%20interested%20in%20the%20UAE%20Golden%20Visa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Start My Application
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/services/visas/visa-finder"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Check Eligibility
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ What Is It â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
              What Is It
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              A decade of freedom.<br />
              <span className="text-luxury-gold">Renewable for life.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Introduced by the UAE government in 2019, the Golden Visa is a long-term residency
              programme designed to attract global talent, investors, and visionaries to the Emirates.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Unlike standard UAE residency tied to employment, the Golden Visa is self-sponsored â€”
              it does not expire if you travel abroad, and it can be renewed indefinitely as long as
              the qualifying conditions are maintained.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Over 150,000 Golden Visas have been issued since launch. Join the world's most dynamic
              global community â€” from Dubai.
            </p>
          </motion.div>

          <motion.div {...fade(0.15)} className="relative">
            <div className="border border-white/[0.07] bg-white/[0.02] p-10">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-luxury-gold/60" />
              <div className="absolute top-0 left-0 w-[1px] h-12 bg-luxury-gold/60" />
              <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-luxury-gold/60" />
              <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-luxury-gold/60" />

              <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
                At a Glance
              </p>
              <div className="space-y-5">
                {[
                  { label: 'Validity', value: '10 years (renewable)' },
                  { label: 'Sponsorship', value: 'Self-sponsored' },
                  { label: 'Family included', value: 'Yes â€” spouse, children, parents' },
                  { label: 'Minimum investment', value: 'AED 2,000,000' },
                  { label: 'Processing time', value: '4â€“8 weeks' },
                  { label: 'Exit requirement', value: 'None â€” travel freely' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Benefits â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
              Benefits
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              Why the Golden Visa{' '}
              <span className="text-luxury-gold">changes everything.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={idx} {...fade(idx * 0.07)}>
                  <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                    <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â”€â”€ Eligibility Checker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-14">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
            Eligibility
          </p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Who qualifies?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category selector */}
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left p-5 border transition-all duration-300 flex items-center gap-4 group ${
                    selectedCategory === cat.id
                      ? 'border-luxury-gold/60 bg-luxury-gold/5'
                      : 'border-white/[0.07] hover:border-luxury-gold/30'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${selectedCategory === cat.id ? 'text-luxury-gold' : 'text-gray-600 group-hover:text-luxury-gold/60'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-display text-base transition-colors duration-300 ${selectedCategory === cat.id ? 'text-luxury-gold' : 'text-white'}`}>
                      {cat.label}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Requirements panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
                className="border border-luxury-gold/20 bg-luxury-gold/[0.03] p-8 h-full"
              >
                <div className="flex items-center gap-3 mb-8">
                  {(() => {
                    const Icon = activeCategory.icon;
                    return <Icon className="w-6 h-6 text-luxury-gold" />;
                  })()}
                  <h3 className="font-display text-2xl text-white">{activeCategory.label} Requirements</h3>
                </div>

                <ul className="space-y-4">
                  {activeCategory.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-luxury-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-8 border-t border-white/[0.07]">
                  <p className="text-gray-500 text-xs mb-4">Not sure which category you qualify for?</p>
                  <a
                    href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20check%20my%20Golden%20Visa%20eligibility."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity duration-300"
                  >
                    Speak to an Advisor
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* â”€â”€ Investment Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
              Investment Routes
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              Three paths to residency.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              {
                route: 'Real Estate',
                amount: 'AED 2,000,000+',
                desc: 'Purchase one or more UAE properties with a combined value of AED 2M or more. Off-plan with completed payment or ready properties qualify.',
                features: ['Ready or mortgaged property', 'One or multiple units', 'Portfolio approach accepted'],
              },
              {
                route: 'Business Investment',
                amount: 'AED 10,000,000+',
                desc: 'Invest in a UAE public investment fund or establish a business with a paid capital of AED 10M. The investment must not be a loan.',
                features: ['Investment fund route', 'Business capital route', 'No loan financing'],
              },
              {
                route: 'Exceptional Talent',
                amount: 'By merit',
                desc: 'Demonstrated excellence in science, arts, culture, sport, or innovative fields â€” endorsed by a relevant UAE federal authority.',
                features: ['Government endorsement required', 'No financial requirement', 'Renewable based on activity'],
              },
            ].map((route, idx) => (
              <motion.div key={idx} {...fade(idx * 0.1)} className="bg-luxury-black p-8 md:p-10">
                <p className="text-luxury-gold/60 text-[9px] font-bold uppercase tracking-[0.35em] mb-2">Route {idx + 1}</p>
                <h3 className="font-display text-2xl text-white mb-1">{route.route}</h3>
                <p className="text-luxury-gold text-base font-display mb-6">{route.amount}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{route.desc}</p>
                <ul className="space-y-2">
                  {route.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <Check className="w-3.5 h-3.5 text-luxury-gold/60 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Application Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
            The Process
          </p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Six steps. We handle{' '}
            <span className="text-luxury-gold">every one.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {PROCESS.map((step, idx) => (
            <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8">
              <span className="font-display text-[52px] leading-none text-luxury-gold/12 font-bold block mb-4 select-none">
                {step.num}
              </span>
              <h3 className="font-display text-lg text-white mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
              Our Service Fees
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              Transparent pricing.
              <br />
              <span className="text-luxury-gold">No surprises.</span>
            </h2>
            <p className="text-gray-500 text-sm mt-4">
              Government fees are additional and vary by category. We provide a full cost breakdown during consultation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan, idx) => (
              <motion.div key={idx} {...fade(idx * 0.1)}>
                <div className={`relative h-full border p-8 flex flex-col transition-all duration-300 ${
                  plan.featured
                    ? 'border-luxury-gold/60 bg-luxury-gold/[0.04]'
                    : 'border-white/[0.07] hover:border-luxury-gold/30'
                }`}>
                  {plan.featured && (
                    <div className="absolute -top-px left-0 right-0 h-[1px] bg-luxury-gold" />
                  )}
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-black text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                      Most Popular
                    </div>
                  )}

                  <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.4em] mb-2">{plan.tier}</p>
                  <p className="font-display text-4xl text-white mb-2">{plan.price}</p>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">{plan.description}</p>

                  <ul className="space-y-3 flex-1 mb-10">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27m%20interested%20in%20the%20Golden%20Visa%20service."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.featured
                        ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
                        : 'border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold/10'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-14">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Common questions.
          </h2>
        </motion.div>

        <div className="space-y-px bg-white/[0.05]">
          {FAQS.map((faq, idx) => (
            <motion.div key={idx} {...fade(idx * 0.05)}>
              <div className="bg-luxury-black">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-7 text-left group"
                >
                  <span className="text-white font-display text-lg group-hover:text-luxury-gold transition-colors duration-300 pr-8">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 text-sm leading-relaxed px-7 pb-7">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fade()}>
            <h2 className="text-4xl md:text-6xl font-display text-white mb-8 leading-tight">
              Start Your Golden Visa
              <br />
              <span className="text-luxury-gold">Application Today</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-12">
              Our advisors will assess your eligibility within 24 hours and map the fastest,
              most cost-effective route to UAE residency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20start%20my%20Golden%20Visa%20application."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-5 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                WhatsApp Us Now
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2.5 px-10 py-5 border border-white/20 text-gray-400 text-sm font-bold uppercase tracking-widest hover:border-luxury-gold/40 hover:text-luxury-gold transition-all duration-300"
              >
                All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


