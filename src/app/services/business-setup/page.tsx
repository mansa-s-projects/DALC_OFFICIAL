'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Building2,
  Globe,
  Shield,
  TrendingUp,
  Zap,
  Users,
  FileText,
  CreditCard,
  Briefcase,
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WHY_DUBAI = [
  { icon: TrendingUp, title: '0% Corporate Tax', desc: 'No corporate tax on most businesses. UAE free zones offer 0% tax for up to 50 years.' },
  { icon: Globe, title: 'Strategic Location', desc: 'At the crossroads of Europe, Asia, and Africa â€” Dubai is the world\'s most connected business hub.' },
  { icon: Zap, title: 'World-Class Infrastructure', desc: 'The UAE ranks #1 globally for ease of doing business. First-world systems with emerging-market growth.' },
  { icon: Shield, title: 'Asset Protection', desc: '100% foreign ownership permitted. No forced local partnership. Your business, your rules.' },
  { icon: Users, title: 'Global Talent Pool', desc: 'Access 200+ nationalities in one city. The UAE\'s open visa policies bring the world\'s best to your door.' },
  { icon: CreditCard, title: 'Banking Excellence', desc: 'World-class banking, multi-currency accounts, and access to international capital markets.' },
];

const BUSINESS_TYPES = [
  {
    id: 'mainland',
    label: 'Mainland',
    icon: Building2,
    tagline: 'Full UAE market access',
    description: 'A mainland license allows you to operate anywhere in the UAE and with UAE government entities. Ideal for businesses targeting the local market or requiring physical offices across emirate boundaries.',
    pros: ['Full UAE market access', 'Trade with government entities', 'No restriction on office location', '100% foreign ownership available'],
    cons: ['Slightly higher setup cost', 'Local office address required'],
    ideal: 'Retail, consulting, professional services, hospitality',
    timeframe: '2â€“4 weeks',
    cost: 'From AED 15,000',
  },
  {
    id: 'freezone',
    label: 'Free Zone',
    icon: Zap,
    tagline: '0% tax, 100% ownership',
    description: 'Free zones are special economic areas offering tax exemptions, 100% foreign ownership, and streamlined administration. Over 45 free zones serve different industry verticals.',
    pros: ['0% corporate and income tax', '100% repatriation of profits', 'No import/export duties', 'Dedicated free zone visas'],
    cons: ['Cannot trade directly with UAE market (without local distributor)', 'Must operate from designated zone'],
    ideal: 'Tech, media, finance, trading, logistics, e-commerce',
    timeframe: '1â€“3 weeks',
    cost: 'From AED 12,000',
  },
  {
    id: 'offshore',
    label: 'Offshore',
    icon: Globe,
    tagline: 'Global structuring',
    description: 'UAE offshore companies (JAFZA, RAK ICC) are ideal for international holding structures, asset protection, and global trading. No UAE office required.',
    pros: ['Asset and wealth protection', 'International tax efficiency', 'Confidential ownership', 'No physical office required'],
    cons: ['Cannot conduct business within UAE directly', 'Cannot obtain UAE visas'],
    ideal: 'Holding companies, IP ownership, international trading',
    timeframe: '5â€“10 days',
    cost: 'From AED 8,000',
  },
];

const FREE_ZONES = [
  { name: 'DIFC', full: 'Dubai International Financial Centre', focus: 'Finance & Professional Services' },
  { name: 'DMCC', full: 'Dubai Multi Commodities Centre', focus: 'Commodities, Trading, Crypto' },
  { name: 'DIC', full: 'Dubai Internet City', focus: 'Technology & Innovation' },
  { name: 'DAFZA', full: 'Dubai Airport Free Zone', focus: 'Aviation & Logistics' },
  { name: 'JAFZA', full: 'Jebel Ali Free Zone', focus: 'Manufacturing & Trade' },
  { name: 'DWTC', full: 'Dubai World Trade Centre', focus: 'Events & Business' },
  { name: 'DHCC', full: 'Dubai Healthcare City', focus: 'Healthcare & Wellness' },
  { name: 'RAKEZ', full: 'Ras Al Khaimah Economic Zone', focus: 'SMEs & Startups' },
];

const OUR_SERVICES = [
  { icon: FileText, label: 'License Application', desc: 'We handle all paperwork, approvals, and submissions for your business license.' },
  { icon: Users, label: 'Visa Processing', desc: 'Investor, employment, and family visas for you and your team.' },
  { icon: CreditCard, label: 'Bank Account Opening', desc: 'We introduce you to the right banking partner and guide you through compliance.' },
  { icon: Briefcase, label: 'PRO Services', desc: 'Ongoing government liaison â€” renewals, attestations, and official document handling.' },
  { icon: Building2, label: 'Office Solutions', desc: 'Flexi-desk, private office, or virtual address â€” we find the right workspace.' },
  { icon: Shield, label: 'Legal & Compliance', desc: 'Commercial lease review, MOA drafting, and regulatory compliance guidance.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Consultation', desc: 'We assess your business model, target market, and goals to recommend the optimal structure.' },
  { num: '02', title: 'Entity Selection', desc: 'Choose from Mainland, Free Zone, or Offshore based on your needs and budget.' },
  { num: '03', title: 'Name Reservation', desc: 'We reserve your company name with the relevant authority and check trademark conflicts.' },
  { num: '04', title: 'Document Submission', desc: 'We prepare and submit all required documents including MOA, shareholder agreements, and activity forms.' },
  { num: '05', title: 'License Issuance', desc: 'Your trade license is issued. We handle any additional approvals from sector-specific ministries.' },
  { num: '06', title: 'Banking & Setup', desc: 'Corporate bank account opened, visas processed, and your team can start operating.' },
];

const FAQS = [
  { q: 'Can a foreigner own 100% of a UAE business?', a: 'Yes. The 2021 Commercial Companies Law amendment allows 100% foreign ownership in most mainland activities. Free zones have always permitted 100% foreign ownership.' },
  { q: 'What is the difference between mainland and free zone?', a: 'Mainland companies can trade freely across the UAE including with government entities. Free zone companies operate within a designated zone and may need a local distributor for UAE market access, but benefit from tax exemptions.' },
  { q: 'How long does business setup take?', a: 'Free zone setups typically take 1â€“3 weeks. Mainland setups take 2â€“4 weeks. Regulated activities (financial services, healthcare) may take longer due to additional ministry approvals.' },
  { q: 'Do I need a physical office?', a: 'It depends on the license type and free zone. Many free zones offer flexi-desk or virtual office options, which significantly reduce costs. Some mainland activities require a physical commercial lease.' },
  { q: 'What business activities can I conduct?', a: 'The UAE offers over 2,000 licensed activities. From e-commerce and consulting to manufacturing and financial services. We\'ll help you select the correct activity codes to match your business.' },
  { q: 'Do you handle the banking as well?', a: 'Yes. Corporate bank account opening is one of the most complex steps for new companies. We have established relationships with major UAE banks and guide you through the compliance and KYC process.' },
];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function BusinessSetupPage() {
  const [selectedType, setSelectedType] = useState<string>('freezone');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ companyType: '', name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const activeType = BUSINESS_TYPES.find(t => t.id === selectedType)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    const msg = encodeURIComponent(
      `Hi DALC â€” I'm interested in business setup.\nCompany type: ${formData.companyType || 'TBD'}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`
    );
    window.open(`https://wa.me/971585987600?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hotels/address-downtown.jpg"
            alt="Dubai business district"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-luxury-black/50 to-luxury-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(212,175,55,0.08),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors duration-300 mb-10">
              <ArrowLeft className="w-3.5 h-3.5" />
              All Services
            </Link>

            <div className="inline-flex items-center gap-2 px-5 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-8 block">
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em]">
                UAE Â· Business Setup
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] font-display text-white leading-[0.92] mb-7 tracking-tight">
              Build Your Business
              <br />
              <em className="not-italic text-luxury-gold">in Dubai</em>
            </h1>

            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Zero tax. 100% ownership. World-class infrastructure.
              We handle company formation from incorporation to your first bank statement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/971585987600?text=Hi%20DALC%20%E2%80%94%20I%27d%20like%20to%20set%20up%20a%20business%20in%20Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Start My Company
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#compare"
                className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Compare Options
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Why Dubai â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Why Dubai</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">
              The world's most business-friendly city.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_DUBAI.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={idx} {...fade(idx * 0.07)}>
                  <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                    <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg text-white mb-3">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â”€â”€ Business Type Comparison â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="compare" className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-14">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Business Types</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">
            Mainland. Free Zone. Offshore.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Type selector */}
          <div className="space-y-3">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left p-5 border transition-all duration-300 flex items-center gap-4 group ${
                    selectedType === type.id
                      ? 'border-luxury-gold/60 bg-luxury-gold/5'
                      : 'border-white/[0.07] hover:border-luxury-gold/30'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${selectedType === type.id ? 'text-luxury-gold' : 'text-gray-600 group-hover:text-luxury-gold/60'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-display text-base transition-colors duration-300 ${selectedType === type.id ? 'text-luxury-gold' : 'text-white'}`}>{type.label}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{type.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35 }}
                className="border border-luxury-gold/20 bg-luxury-gold/[0.03] p-8 h-full"
              >
                <h3 className="font-display text-2xl text-white mb-2">{activeType.label} Company</h3>
                <p className="text-luxury-gold text-sm font-medium mb-6">{activeType.tagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{activeType.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-luxury-gold text-[10px] uppercase tracking-widest mb-3">Advantages</p>
                    <ul className="space-y-2">
                      {activeType.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-3.5 h-3.5 text-luxury-gold mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Limitations</p>
                    <ul className="space-y-2">
                      {activeType.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-center leading-none text-gray-600">â€”</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 border-t border-white/[0.07] pt-6">
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Ideal For</p>
                    <p className="text-gray-300 text-sm">{activeType.ideal}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Timeframe</p>
                    <p className="text-gray-300 text-sm">{activeType.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Gov. Fees From</p>
                    <p className="text-luxury-gold text-sm font-medium">{activeType.cost}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* â”€â”€ Popular Free Zones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14 text-center">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">Free Zones</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Popular Free Zones We Work With</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.05]">
            {FREE_ZONES.map((zone, idx) => (
              <motion.div key={idx} {...fade(idx * 0.05)} className="bg-luxury-black p-6 group hover:bg-white/[0.02] transition-colors duration-300">
                <p className="text-luxury-gold font-display text-xl mb-1">{zone.name}</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-2">{zone.full}</p>
                <p className="text-gray-500 text-xs">{zone.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Our Services â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">What We Handle</p>
          <h2 className="text-3xl md:text-5xl font-display text-white">Our Services</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OUR_SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div key={idx} {...fade(idx * 0.07)}>
                <div className="border border-white/[0.07] hover:border-luxury-gold/30 bg-luxury-black p-8 transition-all duration-500 group h-full">
                  <div className="text-luxury-gold/60 group-hover:text-luxury-gold transition-colors duration-300 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-3">{svc.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-16">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">The Process</p>
            <h2 className="text-3xl md:text-5xl font-display text-white">Six steps to launch.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div key={idx} {...fade(idx * 0.08)} className="bg-luxury-black p-8">
                <span className="font-display text-[52px] leading-none text-luxury-gold/12 font-bold block mb-4 select-none">{step.num}</span>
                <h3 className="font-display text-lg text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="border-t border-white/[0.07] bg-white/[0.015] py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div {...fade()} className="mb-14">
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-display text-white">Common questions.</h2>
          </motion.div>
          <div className="space-y-px bg-white/[0.05]">
            {FAQS.map((faq, idx) => (
              <motion.div key={idx} {...fade(idx * 0.05)}>
                <div className="bg-luxury-black">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-7 text-left group"
                  >
                    <span className="text-white font-display text-lg group-hover:text-luxury-gold transition-colors duration-300 pr-8">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-luxury-gold flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
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
                        <p className="text-gray-400 text-sm leading-relaxed px-7 pb-7">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.06]">
          <motion.div {...fade()} className="bg-luxury-black p-8 md:p-14">
            <div className="w-10 h-[2px] bg-luxury-gold mb-8" />
            <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Get Started Today</p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6 leading-tight">
              Your Dubai business<br />starts here.
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Tell us about your company idea. We'll reply within 2 hours with a clear setup plan and cost estimate.
            </p>
          </motion.div>

          <motion.div {...fade(0.15)} className="bg-[#0d0d0d] p-8 md:p-14">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Check className="w-10 h-10 text-luxury-gold mb-4" />
                <p className="font-display text-2xl text-white mb-2">We'll be in touch!</p>
                <p className="text-gray-500 text-sm">An advisor will contact you within 2 hours on WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">Company Type</label>
                  <select
                    value={formData.companyType}
                    onChange={e => setFormData(p => ({ ...p, companyType: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Select type...</option>
                    <option value="Mainland">Mainland</option>
                    <option value="Free Zone">Free Zone</option>
                    <option value="Offshore">Offshore</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>
                </div>
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { key: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+971 ...' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-gray-500 text-xs uppercase tracking-widest mb-2 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.1] text-white p-3.5 text-sm focus:border-luxury-gold/60 focus:outline-none transition-colors duration-300 placeholder-gray-700"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  Send via WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

