'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Clock,
  Shield,
  Building2,
  Globe,
  Award,
  FileText,
  Landmark,
  Users,
  CheckCircle2,
  Phone,
  Calendar,
  TrendingUp,
  Star,
} from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProcessStep {
  n: number;
  title: string;
  desc: string;
}

interface FormationOption {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  priceFrom: number;
  timeline: string;
  authority: string;
  badge?: string;
  features: string[];
  steps: ProcessStep[];
  blogTitle: string;
  blogContent: string[];
  documents: string[];
  comparativeNote: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ComparisonRow {
  feature: string;
  dmcc: string | boolean;
  mainland: string | boolean;
  offshore: string | boolean;
}

// ─── Formation Options Data ───────────────────────────────────────────────────

const FORMATION_OPTIONS: FormationOption[] = [
  {
    id: 'dmcc',
    slug: 'dmcc-free-zone-company-setup',
    name: 'DMCC Free Zone Company',
    tagline: "World's #1-ranked free zone for global trade",
    headline: 'Establish Your Global Business Hub in DMCC',
    description:
      'The Dubai Multi Commodities Centre (DMCC) is the world\'s most prestigious free zone — home to over 22,000 member companies across 600+ permitted activities. Operating from Jumeirah Lakes Towers, DMCC delivers 100% foreign ownership, a near-zero tax burden on qualifying income, and a prestige JLT address recognised across international banking and investment communities. Whether you are setting up a commodity trading house, a fintech consultancy, or a regional holding structure, DMCC provides both operational substance and undeniable credibility.',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'DMCC Jumeirah Lakes Towers Dubai skyline at dusk',
    priceFrom: 15000,
    timeline: '3–5 business weeks',
    authority: 'DMCC Authority',
    badge: 'Most Popular',
    features: [
      '100% foreign ownership guaranteed',
      '0% personal income tax',
      '0% corporate tax on qualifying income',
      '600+ permitted business activities',
      'Prestigious JLT business address',
      'Free repatriation of capital and profits',
      'Flexi-desk to full-floor office options',
      'Resident visa allocations per licence',
    ],
    steps: [
      {
        n: 1,
        title: 'Activity & Structure Advisory',
        desc: 'We map your business model to the correct DMCC activity codes and optimal shareholder structure',
      },
      {
        n: 2,
        title: 'Trade Name Reservation',
        desc: 'Company name verified and reserved via DMCC Member Portal within 1–2 working days',
      },
      {
        n: 3,
        title: 'Document Preparation',
        desc: 'Memorandum of Association, shareholder resolutions and all corporate documents compiled by our legal team',
      },
      {
        n: 4,
        title: 'Licence Application',
        desc: 'Full application submitted through the DMCC online portal with all supporting documents',
      },
      {
        n: 5,
        title: 'Office Registration',
        desc: 'DMCC Flexi-Desk, serviced office or physical space registered as official registered address',
      },
      {
        n: 6,
        title: 'Licence & Share Certificates',
        desc: 'Trade licence collected, share certificates issued, and Emirates ID process initiated for visa holders',
      },
    ],
    blogTitle: 'How to Start a Company in DMCC Free Zone — Complete 2026 Guide',
    blogContent: [
      'Setting up in the DMCC free zone is one of the most straightforward paths to establishing a credible, tax-efficient business presence in the UAE. DMCC — formally the Dubai Multi Commodities Centre — has been ranked the world\'s top free zone by the Financial Times for consecutive years, reflecting both the quality of its regulatory framework and the depth of its member business community.',
      'For entrepreneurs and global companies targeting commodity trade, professional services, technology, or financial advisory, DMCC provides a unique value proposition: full foreign ownership, a zero-rate personal tax environment, and operational premises within one of Dubai\'s most connected business districts. The jurisdiction\'s international standing facilitates banking approvals and client onboarding with minimal friction — a critical practical advantage often overlooked in comparison exercises.',
      'The typical DMCC formation journey — from initial consultation to receiving your trade licence — takes three to five business weeks when documentation is in order. Key costs include government fees (currently around AED 8,500 for most activity types), our service package (from AED 15,000 all-in for a standard single-activity licence), and office space. Visa allocations range from one per Flexi-Desk to eight-plus visas for larger physical offices.',
    ],
    documents: [
      'Passport copy (all shareholders)',
      'UAE entry visa copy',
      'Brief business plan or activity description',
      'No-objection letter (if currently employed in UAE)',
    ],
    comparativeNote:
      'Best for international trade, commodities, consulting, fintech, and regional holding. Limited direct mainland trading without a local distributor.',
  },
  {
    id: 'mainland',
    slug: 'dubai-mainland-llc-formation',
    name: 'Dubai Mainland LLC',
    tagline: 'Unrestricted UAE market access — trade anywhere',
    headline: 'Operate Freely Across the UAE with a DED Mainland Licence',
    description:
      'A Dubai Mainland Limited Liability Company, registered with the Department of Economy and Tourism, grants you the unrestricted right to trade anywhere in the UAE — including direct sales to retail consumers, federal government contracts, and public sector tenders. Following the landmark 2021 FDI reforms, most commercial and professional activities now permit 100% foreign shareholding on the mainland, removing the historical Emirati partner requirement that once made free zone structures more attractive for foreign investors.',
    image:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Dubai downtown skyline Burj Khalifa business district',
    priceFrom: 12000,
    timeline: '2–4 business weeks',
    authority: 'DED — Dubai Economy & Tourism',
    badge: 'Best for UAE Market Access',
    features: [
      'Trade freely across all 7 UAE Emirates',
      '100% foreign ownership (most activities)',
      'Eligible for government tenders and contracts',
      'No employee headcount restrictions',
      'DED licence strongly preferred by UAE banks',
      'Multiple activity categories on one licence',
      'Real estate, retail, and F&B eligible',
      'Strongest operational credibility in UAE market',
    ],
    steps: [
      {
        n: 1,
        title: 'Activity Mapping & Pre-Approval',
        desc: 'Business activities confirmed with DED pre-approval and initial trade name submission',
      },
      {
        n: 2,
        title: 'Trade Name Registration',
        desc: 'Trade name reviewed against DED registry and reserved within 1–3 working days',
      },
      {
        n: 3,
        title: 'MOA Drafting & Notarisation',
        desc: 'Memorandum of Association drafted, reviewed by all shareholders, and notarised at Dubai Courts',
      },
      {
        n: 4,
        title: 'Initial Approval',
        desc: 'DED initial approval obtained; local service agent appointed where required for specific activities',
      },
      {
        n: 5,
        title: 'Commercial Licence Issuance',
        desc: 'All fees paid, tenancy contract Ejari-registered, and commercial DED licence collected',
      },
    ],
    blogTitle: 'Mainland LLC vs Free Zone UAE — A Definitive 2026 Comparison',
    blogContent: [
      'The mainland vs free zone decision is the most consequential structural choice an entrepreneur makes when setting up in the UAE. The right answer depends entirely on your business model, target clients, and growth roadmap — and there is no universal answer.',
      'Mainland companies, regulated by the Department of Economy and Tourism, carry no restrictions on where they can operate or whom they can sell to within the UAE. A mainland food manufacturing company can supply supermarkets, hotels, and government canteens without intermediaries. A mainland legal consultancy can represent clients before all UAE courts and regulatory authorities. This unrestricted market access comes with the requirement for a physical commercial office and — for certain activities — compliance with minimum share-capital thresholds.',
      'Free zone companies offer superior tax efficiency and incorporation speed but are structurally limited to operating within their free zone perimeter or internationally. Selling directly to mainland UAE consumers or bidding on government tenders requires either a mainland entity or a formal mainland distributor relationship — adding cost and complexity. For most businesses with a domestic UAE customer base, a DED mainland LLC is the more commercially versatile long-term foundation.',
    ],
    documents: [
      'Passport copies (all shareholders)',
      'Emirates ID (if UAE resident)',
      'Tenancy contract for office space',
      'No-objection letter from sponsor (if on employment visa)',
    ],
    comparativeNote:
      'Best for consumer-facing businesses, retail, F&B, construction, real estate, and any business pursuing government contracts.',
  },
  {
    id: 'offshore',
    slug: 'uae-offshore-company-formation',
    name: 'UAE Offshore Company',
    tagline: 'Asset protection and cross-border holding structures',
    headline: 'Structure Your Holdings and Protect Assets Offshore',
    description:
      'A UAE offshore company — incorporated in JAFZA, RAK ICC, or ADGM — provides an internationally recognised legal wrapper for holding assets, intellectual property, real estate, or equity in operating companies. Offshore entities cannot conduct direct business within the UAE or hire local employees, but are widely used for family wealth structuring, business group holding, IP ownership, and cross-border asset management. Low formation costs and minimal maintenance obligations make the offshore structure a cost-effective foundation for sophisticated arrangements.',
    image:
      'https://images.unsplash.com/photo-1582974869695-b74fe42c5f7f?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'DIFC Dubai International Financial Centre financial towers',
    priceFrom: 8500,
    timeline: '2–3 business weeks',
    authority: 'JAFZA / RAK ICC / ADGM',
    features: [
      'No minimum share capital requirement',
      'Full confidentiality — no public share register',
      'Hold UAE real estate as corporate asset (JAFZA)',
      'No annual audit requirement (RAK ICC)',
      'Multiple shareholder jurisdictions accepted',
      'Recognised in 170+ treaty countries',
      'Very low annual maintenance costs',
    ],
    steps: [
      { n: 1, title: 'Jurisdiction Selection', desc: 'Advise on JAFZA vs RAK ICC vs ADGM based on intended use, asset type and banking requirements' },
      { n: 2, title: 'Application Preparation', desc: 'Corporate documents prepared, shareholder KYC and declarations completed' },
      { n: 3, title: 'Authority Submission', desc: 'Application submitted to chosen authority with required supporting documents' },
      { n: 4, title: 'Certificate of Incorporation', desc: 'Certificate of Incorporation issued, M&AA registered and apostilled' },
      { n: 5, title: 'Post-Incorporation Services', desc: 'Share certificates issued, registered agent arrangement confirmed, bank introduction co-ordinated' },
    ],
    blogTitle: 'UAE Offshore Companies Explained — JAFZA vs RAK ICC in 2026',
    blogContent: [
      'UAE offshore companies occupy a distinct legal category from both mainland and free zone entities. They cannot hold a UAE trade licence, cannot hire staff locally, and cannot generate income from domestic UAE operations. What they can do — powerfully — is serve as a vehicle for holding, structuring, and protecting assets across borders in a politically stable, internationally recognised jurisdiction.',
      'JAFZA offshore (Jebel Ali Free Zone Authority) is the most widely accepted UAE offshore jurisdiction for international banking and investment purposes. A JAFZA offshore company can hold UAE real estate directly on its title deed — a significant structural advantage for high-net-worth families investing in Dubai property. RAK ICC offers faster incorporation and lower fees, making it popular for pure holding and IP-ownership structures where immediate banking integration is not required.',
      'Common use cases include holding shares in UAE operating companies, owning intellectual property licensed to trading entities, structuring real estate assets within a family office framework, and inter-company financing arrangements. Your DALC advisor will assess your specific situation and recommend the optimal offshore jurisdiction and structure.',
    ],
    documents: [
      'Certified passport copies (all shareholders and directors)',
      'Proof of residential address (utility bill or bank statement)',
      'Source of funds declaration',
      'Corporate documents if shareholder is a company',
    ],
    comparativeNote:
      'Best for holding structures, IP ownership, real estate investment, cross-border asset management, and family office arrangements.',
  },
  {
    id: 'branch',
    slug: 'uae-branch-office-registration',
    name: 'Branch Office Registration',
    tagline: 'Extend your global company into Dubai',
    headline: "Register Your International Company's UAE Branch",
    description:
      'A foreign branch office allows an established overseas company to conduct licensed commercial activities in the UAE under its existing corporate identity — without creating a new legal entity. The branch is a legal extension of the parent company, which remains fully liable for UAE activities, and operates under a DED or relevant free zone licence. This structure is preferred by multinational professional service firms, consulting groups, and technology companies seeking a client-service presence in Dubai while maintaining unified brand and legal identity.',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Dubai corporate office tower branch registration',
    priceFrom: 10000,
    timeline: '4–6 business weeks',
    authority: 'DED / Ministry of Economy',
    features: [
      'Operate under your global company name and brand',
      'No separate UAE legal entity required',
      'Parent company retains full ownership and control',
      'DED licence for mainland branch offices',
      'UAE Ministry of Economy federal approval',
      'Access to UAE market under established brand',
      'Suitable for professional services and consulting',
    ],
    steps: [
      { n: 1, title: 'Eligibility Review', desc: 'Parent company eligibility confirmed and activity compatibility with UAE DED requirements verified' },
      { n: 2, title: 'Ministry of Economy Approval', desc: 'Application submitted to the UAE Ministry of Economy for authorisation to operate in the UAE' },
      { n: 3, title: 'Document Legalisation', desc: 'Parent company constitutional documents apostilled and attested through UAE Embassy in country of origin, then counter-attested by MOFA UAE' },
      { n: 4, title: 'DED Registration', desc: 'Branch registered with DED, trade name approved, activity categories confirmed' },
      { n: 5, title: 'Licence Issuance', desc: 'DED branch licence collected, office space registered, and operations can commence' },
    ],
    blogTitle: 'How to Register a Foreign Branch Office in Dubai — Complete Guide',
    blogContent: [
      'For established foreign companies seeking a UAE presence without creating a separate legal entity, the branch office route offers the cleanest structural solution. Rather than incorporating a new company, the parent entity extends its legal personality into the UAE — keeping corporate governance unified and ownership undivided.',
      'The branch registration process runs through two authorities: the UAE Ministry of Economy (federal approval for the foreign company to legally operate domestically) and the Department of Economy and Tourism (for the actual DED trade licence). Combined, these approvals typically take four to six weeks when documentation is properly prepared and legalised.',
      'A non-negotiable requirement is thorough document legalisation: the parent company\'s Certificate of Incorporation, Memorandum and Articles of Association, board resolutions, and shareholder declarations must be apostilled in the parent\'s jurisdiction, attested by the UAE Embassy in that country, then counter-attested by the UAE Ministry of Foreign Affairs. This legalisation chain adds lead time but cannot be bypassed. Your DALC advisor will manage this entire process on your behalf.',
    ],
    documents: [
      'Certificate of Incorporation (apostilled + embassy attested)',
      'Memorandum and Articles of Association (apostilled + attested)',
      'Board resolution authorising UAE branch establishment',
      'Power of attorney to UAE manager or representative',
      'Audited financial statements (most recent 12 months)',
    ],
    comparativeNote:
      'Best for foreign professional service firms, consultancies, and multinationals maintaining a single global legal identity.',
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    q: 'Can a foreigner own 100% of a company in Dubai?',
    a: "Yes. Following the UAE's 2021 Commercial Companies Law amendments, foreigners can own 100% of most mainland LLC activities without an Emirati local partner. All UAE free zones have always permitted 100% foreign ownership. Certain restricted sectors (oil and gas, telecoms, defence) maintain specific ownership limitations.",
  },
  {
    q: 'What is the minimum capital requirement to register a company in Dubai?',
    a: 'There is no statutory minimum share capital for most free zone formations or mainland DED LLCs. Specific regulated sectors — banking, insurance, investment management — carry their own capital thresholds set by the relevant regulator (Central Bank, SCA, or DFSA). Your DALC advisor will confirm requirements specific to your activity.',
  },
  {
    q: 'What is the difference between a mainland and free zone company in the UAE?',
    a: 'Mainland companies (DED-licensed) can trade freely across all UAE Emirates, contract with government entities, and sell directly to retail consumers. Free zone companies enjoy superior tax efficiency and faster setup but are generally restricted to trading within the free zone perimeter or internationally. Selling directly to mainland UAE consumers requires a local distributor relationship or a separate mainland entity.',
  },
  {
    q: 'How long does company formation take in Dubai?',
    a: 'Free zone formations typically complete in 2–5 business weeks. Mainland DED LLCs take 2–4 weeks. Branch office registrations, which require Ministry of Economy approval and international document legalisation, typically take 4–6 weeks. All timelines assume documents are provided promptly and in full.',
  },
  {
    q: 'What are the ongoing annual costs after company formation in Dubai?',
    a: 'Ongoing annual costs include licence renewal fees (typically AED 5,000–15,000 depending on jurisdiction and activity type), registered office costs, and visa renewals every 2–3 years. Corporate tax filings, accounting, and VAT returns are additional. Most free zones bundle renewal fees with office packages, making total annual maintenance more predictable.',
  },
  {
    q: 'Do I need a physical office to register a company in Dubai?',
    a: 'Mainland DED licences require a physical tenancy contract registered on EJARI. Most UAE free zones — including DMCC — offer Flexi-Desk or Shared Desk options as a cost-effective alternative to dedicated office space. A Flexi-Desk arrangement satisfies office requirements for licence issuance and supports initial resident visa allocations.',
  },
  {
    q: 'Which is the best free zone for trading companies in Dubai?',
    a: "DMCC (Dubai Multi Commodities Centre) in JLT is consistently ranked the world's top free zone and is particularly suited to commodity trading, fintech, and professional services. JAFZA (Jebel Ali) is preferred for import/export and logistics businesses given its port proximity. DIFC is the choice for financial services and investment funds. The right jurisdiction depends on your industry, banking profile, and visa requirements.",
  },
  {
    q: 'Is there corporate tax in the UAE and how does it affect my Dubai company?',
    a: 'The UAE introduced a 9% federal corporate tax in June 2023, applicable to taxable profits above AED 375,000. Qualifying free zone entities may benefit from a 0% rate on qualifying income, provided they meet substance requirements and maintain Qualifying Free Zone Person status. All businesses with annual revenue above AED 375,000 must register with the Federal Tax Authority.',
  },
];

// ─── Comparison Table Data ────────────────────────────────────────────────────

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'Foreign ownership', dmcc: '100%', mainland: '100% (most activities)', offshore: '100%' },
  { feature: 'UAE market access', dmcc: 'Free zone only', mainland: 'Unrestricted', offshore: false },
  { feature: 'Government contracts', dmcc: false, mainland: true, offshore: false },
  { feature: 'Physical office required', dmcc: 'Flexi-desk accepted', mainland: 'Ejari required', offshore: false },
  { feature: 'Resident visa eligibility', dmcc: true, mainland: true, offshore: false },
  { feature: 'Corporate tax (9%)', dmcc: '0% qualifying income', mainland: 'Applies above AED 375k', offshore: 'Not applicable' },
  { feature: 'Typical setup cost', dmcc: 'From AED 15,000', mainland: 'From AED 12,000', offshore: 'From AED 8,500' },
  { feature: 'Setup timeline', dmcc: '3–5 weeks', mainland: '2–4 weeks', offshore: '2–3 weeks' },
];

// ─── Stat items ───────────────────────────────────────────────────────────────

const STATS = [
  { value: '500+', label: 'Companies formed', icon: Building2 },
  { value: '15+', label: 'UAE free zones covered', icon: Globe },
  { value: '100%', label: 'Foreign ownership', icon: Shield },
  { value: '48h', label: 'Fast-track available', icon: TrendingUp },
];

// ─── Authority Badges ─────────────────────────────────────────────────────────

const AUTHORITIES = [
  { name: 'DMCC Authority', sub: 'World #1 Free Zone' },
  { name: 'DED Dubai', sub: 'Dept of Economy & Tourism' },
  { name: 'JAFZA', sub: 'Jebel Ali Free Zone' },
  { name: 'RAK ICC', sub: 'Intl Corporate Centre' },
  { name: 'ICA', sub: 'Federal Identity & Citizenship' },
  { name: 'FTA', sub: 'Federal Tax Authority' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompanyFormationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cipher-void font-body">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cipher-void via-cipher-void/80 to-cipher-void" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,168,76,0.08),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cipher-gold/20 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <nav className="mb-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cipher-dim">
            <Link href="/business" className="transition-colors hover:text-cipher-gold">
              Business
            </Link>
            <span>/</span>
            <span className="text-cipher-gold">Company Formation</span>
          </nav>

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
            Dubai Business Setup
          </p>

          <h1 className="mb-6 font-display text-5xl leading-tight text-cipher-white md:text-7xl">
            Start Your Company
            <br />
            <span className="text-cipher-gold">in Dubai</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-cipher-muted md:text-lg">
            Expert-guided company formation for entrepreneurs, investors, and global businesses.
            From DMCC free zone to mainland LLC — 100% foreign ownership, handled end-to-end by our
            licensed advisors.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/business/consultation/new"
              className="flex items-center gap-2 bg-cipher-gold px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-cipher-void transition-all duration-300 hover:bg-cipher-gold-bright"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#compare"
              className="flex items-center gap-2 border border-cipher-rim3 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-cipher-muted transition-all duration-300 hover:border-cipher-gold/40 hover:text-cipher-white"
            >
              Compare Options
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <section className="border-y border-cipher-rim bg-cipher-ink">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-cipher-rim md:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <Icon className="mb-1 h-5 w-5 text-cipher-gold/60" />
              <span className="font-display text-3xl text-cipher-gold">{value}</span>
              <span className="text-[11px] uppercase tracking-widest text-cipher-dim">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formation Cards ──────────────────────────────────────────────── */}
      <section id="compare" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
            Formation Options
          </p>
          <h2 className="font-display text-3xl text-cipher-white md:text-5xl">
            Choose Your Structure
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-cipher-gold/30" />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FORMATION_OPTIONS.map((opt, idx) => (
            <motion.article
              key={opt.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative overflow-hidden border border-cipher-rim2 bg-cipher-card transition-all duration-500 hover:border-cipher-gold/30"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-cipher-surface">
                <img
                  src={opt.image}
                  alt={opt.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cipher-card via-cipher-card/40 to-transparent" />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {opt.badge && (
                    <span className="border border-cipher-gold/50 bg-cipher-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cipher-gold">
                      {opt.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                  <span className="border border-cipher-rim3 bg-cipher-void/80 px-3 py-1.5 text-xs font-semibold text-cipher-white backdrop-blur-sm">
                    From AED {opt.priceFrom.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl text-cipher-white transition-colors duration-300 group-hover:text-cipher-gold md:text-2xl">
                    {opt.name}
                  </h3>
                </div>

                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-cipher-gold/70">
                  {opt.tagline}
                </p>

                <p className="mb-6 text-sm leading-relaxed text-cipher-muted">
                  {opt.description}
                </p>

                {/* Meta row */}
                <div className="mb-6 flex flex-wrap gap-4 text-xs text-cipher-dim">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cipher-gold/50" />
                    {opt.timeline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5 text-cipher-gold/50" />
                    {opt.authority}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-cipher-gold/50" />
                    {opt.steps.length} steps
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {opt.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-cipher-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cipher-gold" />
                      {f}
                    </li>
                  ))}
                  {opt.features.length > 5 && (
                    <li className="text-sm text-cipher-dim pl-6">
                      +{opt.features.length - 5} more benefits
                    </li>
                  )}
                </ul>

                {/* Toggle process button */}
                <button
                  onClick={() =>
                    setActiveSection(activeSection === opt.id ? null : opt.id)
                  }
                  className="mb-4 flex w-full items-center justify-between border border-cipher-rim2 px-4 py-3 text-left text-xs uppercase tracking-widest text-cipher-dim transition-all duration-300 hover:border-cipher-gold/30 hover:text-cipher-muted"
                >
                  <span>View {opt.steps.length}-step process</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-cipher-gold/60 transition-transform duration-300 ${
                      activeSection === opt.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeSection === opt.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="mb-4 overflow-hidden"
                    >
                      <ol className="space-y-3 border border-cipher-rim bg-cipher-surface p-4">
                        {opt.steps.map((step) => (
                          <li key={step.n} className="flex gap-3">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cipher-gold/15 text-[10px] font-bold text-cipher-gold">
                              {step.n}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-cipher-white">{step.title}</p>
                              <p className="text-xs leading-relaxed text-cipher-dim">{step.desc}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <Link
                  href={`/business/company-formation/${opt.slug}`}
                  className="flex items-center justify-center gap-2 border border-cipher-gold/30 px-5 py-3 text-xs font-bold uppercase tracking-widest text-cipher-gold transition-all duration-300 hover:bg-cipher-gold hover:text-cipher-void"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────────── */}
      <section className="border-y border-cipher-rim bg-cipher-ink">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
              Side by Side
            </p>
            <h2 className="font-display text-3xl text-cipher-white md:text-4xl">
              Mainland vs Free Zone vs Offshore
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-cipher-gold/30" />
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-cipher-rim px-5 py-4 text-left text-[10px] uppercase tracking-widest text-cipher-dim" />
                  <th className="border border-cipher-rim bg-cipher-gold/8 px-5 py-4 text-center text-[10px] uppercase tracking-widest text-cipher-gold">
                    DMCC Free Zone
                  </th>
                  <th className="border border-cipher-rim px-5 py-4 text-center text-[10px] uppercase tracking-widest text-cipher-muted">
                    Mainland LLC
                  </th>
                  <th className="border border-cipher-rim px-5 py-4 text-center text-[10px] uppercase tracking-widest text-cipher-muted">
                    Offshore
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={idx % 2 === 0 ? 'bg-cipher-void' : 'bg-cipher-surface/30'}
                  >
                    <td className="border border-cipher-rim px-5 py-3.5 text-xs text-cipher-muted">
                      {row.feature}
                    </td>
                    {(
                      [
                        { val: row.dmcc, gold: true },
                        { val: row.mainland, gold: false },
                        { val: row.offshore, gold: false },
                      ] as { val: string | boolean; gold: boolean }[]
                    ).map(({ val, gold }, ci) => (
                      <td
                        key={ci}
                        className={`border border-cipher-rim px-5 py-3.5 text-center text-xs ${
                          gold ? 'bg-cipher-gold/5' : ''
                        }`}
                      >
                        {typeof val === 'boolean' ? (
                          val ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-cipher-gold" />
                          ) : (
                            <span className="text-cipher-dim/40">—</span>
                          )
                        ) : (
                          <span className={gold ? 'text-cipher-gold' : 'text-cipher-muted'}>
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Mini Blog: DMCC ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
            Expert Guide
          </p>
          <h2 className="mb-6 font-display text-2xl text-cipher-white md:text-4xl">
            {FORMATION_OPTIONS[0].blogTitle}
          </h2>
          <div className="h-px w-16 bg-cipher-gold/30 mb-8" />

          <div className="space-y-5">
            {FORMATION_OPTIONS[0].blogContent.map((para, i) => (
              <p key={i} className="leading-relaxed text-cipher-muted">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 border border-cipher-rim2 bg-cipher-surface p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cipher-gold">
              Documents Required — DMCC Formation
            </p>
            <ul className="space-y-2">
              {FORMATION_OPTIONS[0].documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2.5 text-sm text-cipher-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cipher-gold" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/business/company-formation/dmcc-free-zone-company-setup"
              className="flex items-center gap-2 border border-cipher-gold/30 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-cipher-gold transition-all hover:bg-cipher-gold hover:text-cipher-void"
            >
              Start DMCC Setup <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/business/consultation/new"
              className="flex items-center gap-2 border border-cipher-rim2 px-6 py-2.5 text-xs uppercase tracking-widest text-cipher-dim transition-all hover:border-cipher-rim3 hover:text-cipher-muted"
            >
              Ask an Advisor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Mini Blog: Mainland ──────────────────────────────────────────── */}
      <section className="border-t border-cipher-rim bg-cipher-ink">
        <div className="mx-auto max-w-4xl px-4 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
              Expert Guide
            </p>
            <h2 className="mb-6 font-display text-2xl text-cipher-white md:text-4xl">
              {FORMATION_OPTIONS[1].blogTitle}
            </h2>
            <div className="h-px w-16 bg-cipher-gold/30 mb-8" />

            <div className="space-y-5">
              {FORMATION_OPTIONS[1].blogContent.map((para, i) => (
                <p key={i} className="leading-relaxed text-cipher-muted">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-10 border border-cipher-rim2 bg-cipher-card p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cipher-gold">
                Documents Required — Mainland LLC
              </p>
              <ul className="space-y-2">
                {FORMATION_OPTIONS[1].documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5 text-sm text-cipher-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cipher-gold" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/business/company-formation/dubai-mainland-llc-formation"
                className="flex items-center gap-2 border border-cipher-gold/30 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-cipher-gold transition-all hover:bg-cipher-gold hover:text-cipher-void"
              >
                Start Mainland LLC <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/business/consultation/new"
                className="flex items-center gap-2 border border-cipher-rim2 px-6 py-2.5 text-xs uppercase tracking-widest text-cipher-dim transition-all hover:border-cipher-rim3 hover:text-cipher-muted"
              >
                Compare with Free Zone
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Signals — Authority Badges ────────────────────────────── */}
      <section className="border-b border-cipher-rim">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
          <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-dim">
            Licensed and Regulated By
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {AUTHORITIES.map((auth) => (
              <div
                key={auth.name}
                className="flex flex-col items-center gap-1.5 border border-cipher-rim p-4 text-center"
              >
                <Award className="h-5 w-5 text-cipher-gold/50" />
                <p className="text-xs font-semibold text-cipher-muted">{auth.name}</p>
                <p className="text-[10px] text-cipher-dim">{auth.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
            Common Questions
          </p>
          <h2 className="font-display text-3xl text-cipher-white md:text-4xl">
            Company Formation FAQ
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-cipher-gold/30" />
        </motion.div>

        <div className="space-y-px">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-cipher-rim2">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 hover:text-cipher-gold"
              >
                <span className="text-sm font-medium leading-snug text-cipher-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-cipher-gold transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-cipher-muted">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-cipher-rim bg-cipher-ink">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-cipher-gold/20 p-8 md:p-14"
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-cipher-gold">
                  Ready to Begin?
                </p>
                <h3 className="mb-3 font-display text-2xl text-cipher-white md:text-3xl">
                  Book Your Free 30-Minute Strategy Call
                </h3>
                <p className="max-w-lg text-sm leading-relaxed text-cipher-muted">
                  Speak with a licensed UAE business setup advisor. We will identify the right
                  structure for your goals, provide a fixed-fee proposal, and get your company
                  incorporated with zero surprises.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    'No obligation consultation',
                    'Fixed transparent fees',
                    'Licensed DMCC & DED advisors',
                    'End-to-end managed service',
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-cipher-dim">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cipher-gold/60" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-shrink-0">
                <Link
                  href="/business/consultation/new"
                  className="flex items-center justify-center gap-2 bg-cipher-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-cipher-void transition-all duration-300 hover:bg-cipher-gold-bright"
                >
                  <Calendar className="h-4 w-4" />
                  Book Free Call
                </Link>
                <Link
                  href="/concierge"
                  className="flex items-center justify-center gap-2 border border-cipher-rim3 px-8 py-3.5 text-sm uppercase tracking-widest text-cipher-muted transition-all duration-300 hover:border-cipher-gold/30 hover:text-cipher-white"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp Advisor
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
