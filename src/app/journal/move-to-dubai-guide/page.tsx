import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Move to Dubai: The Complete Expat Guide 2024 | Dubai À La Carte',
  description:
    'Everything you need to know about moving to Dubai — visas, company setup, property, schools, banking, healthcare, and lifestyle. The most complete Dubai relocation guide available.',
  keywords: [
    'move to Dubai',
    'moving to Dubai guide',
    'Dubai expat guide',
    'relocating to Dubai',
    'Dubai relocation 2024',
    'live in Dubai',
    'Dubai visa options',
    'Dubai cost of living',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/move-to-dubai-guide`,
  },
  openGraph: {
    title: 'How to Move to Dubai: The Complete Expat Guide 2024 | Dubai À La Carte',
    description:
      'Everything you need to know about moving to Dubai — visas, company setup, property, schools, banking, healthcare, and lifestyle.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/move-to-dubai-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai skyline at dusk',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Move to Dubai: The Complete Expat Guide 2024',
  description:
    'Everything you need to know about moving to Dubai — visas, company setup, property, schools, banking, healthcare, and lifestyle.',
  image:
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-01-20',
  dateModified: '2024-11-01',
  author: {
    '@type': 'Organization',
    name: 'Dubai À La Carte Editorial',
    url: siteUrl,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dubai À La Carte',
    url: siteUrl,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${siteUrl}/journal/move-to-dubai-guide`,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Journal', item: `${siteUrl}/journal` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Move to Dubai Guide',
      item: `${siteUrl}/journal/move-to-dubai-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I move to Dubai without a job offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Dubai offers several visa routes that do not require a local employer: the Dubai Freelancer Permit, the UAE Golden Visa (for investors and qualified professionals), and the Green Visa (for skilled employees and self-employed individuals). Each has its own eligibility criteria and financial requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cost of living in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The cost of living in Dubai varies significantly based on lifestyle. A single professional can live comfortably on AED 10,000–15,000 per month (approx. USD 2,700–4,000), including rent. A family of four typically requires AED 25,000–45,000 per month depending on school fees, accommodation type, and lifestyle choices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to live in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Dubai consistently ranks among the world's safest cities. Crime rates are extremely low, and the city has a strong rule of law. Women, families, and solo travellers all report high levels of personal safety. The UAE government maintains zero tolerance for serious criminal offences.",
      },
    },
  ],
}

const expatareas = [
  {
    area: 'Downtown Dubai',
    vibe: 'Urban luxury',
    avgRent: 'AED 130,000–250,000/yr (2BR)',
    bestFor: 'Professionals who want to be at the heart of the city',
  },
  {
    area: 'Dubai Marina',
    vibe: 'Waterfront, vibrant',
    avgRent: 'AED 100,000–200,000/yr (2BR)',
    bestFor: 'Young professionals, social lifestyles, walkability',
  },
  {
    area: 'JBR (Jumeirah Beach Residence)',
    vibe: 'Beach lifestyle',
    avgRent: 'AED 110,000–220,000/yr (2BR)',
    bestFor: 'Couples and families who want beach-walking access',
  },
  {
    area: 'Palm Jumeirah',
    vibe: 'Exclusive island living',
    avgRent: 'AED 200,000–600,000/yr (3–4BR villa)',
    bestFor: 'Families, high-net-worth individuals, privacy seekers',
  },
  {
    area: 'Business Bay',
    vibe: 'Urban, central, modern',
    avgRent: 'AED 85,000–160,000/yr (2BR)',
    bestFor: 'Business owners, professionals commuting to DIFC',
  },
  {
    area: 'JLT (Jumeirah Lake Towers)',
    vibe: 'Affordable urban living',
    avgRent: 'AED 70,000–130,000/yr (2BR)',
    bestFor: 'Budget-conscious professionals, freelancers',
  },
  {
    area: 'Arabian Ranches',
    vibe: 'Suburban, family-first',
    avgRent: 'AED 160,000–280,000/yr (3–4BR villa)',
    bestFor: 'Families with children, those seeking quiet suburban life',
  },
  {
    area: 'Mirdif',
    vibe: 'Local, community-feel',
    avgRent: 'AED 80,000–150,000/yr (3BR villa)',
    bestFor: 'Families wanting space at lower cost, near airport',
  },
]

export default function MoveToDubaiGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="min-h-screen bg-cipher-void pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-cipher-muted mb-8 font-body">
            <Link href="/" className="hover:text-cipher-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-cipher-white transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-cipher-white">Move to Dubai Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Relocation
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            How to Move to Dubai: The Complete Expat Guide (2024)
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            Over 3.5 million expats have made Dubai their home — and for good reason. Zero income
            tax, world-class infrastructure, year-round sunshine, and a central position between
            Europe, Asia, and Africa make it the world's most practical luxury base. This is the
            guide we wish we had before moving.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1400&auto=format&fit=crop"
              alt="Dubai skyline at dusk — move to Dubai guide"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-10 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Why Move to Dubai?</h2>
              <ul className="space-y-3">
                {[
                  '0% personal income tax on salaries, business income, and investment returns',
                  'Safety — consistently ranked among the 5 safest cities globally',
                  'Strategic location — within 8 hours flight of 80% of the world\'s population',
                  'World-class healthcare, education, and infrastructure',
                  'A cosmopolitan, English-speaking city with 200+ nationalities',
                  'Year-round sunshine, beaches, and outdoor lifestyle',
                  'Strong rental yields for property investors (5–9% net)',
                  'Business-friendly environment with minimal red tape in free zones',
                ].map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Visa Options for Moving to Dubai</h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Employment Visa',
                    desc: 'The most common route. Your UAE employer sponsors your residency visa and work permit. Valid for 2–3 years and renewable. Tied to your employer — if you change jobs, you\'ll need a new visa.',
                  },
                  {
                    title: 'Investor / Entrepreneur Visa',
                    desc: 'For those starting or owning a business in the UAE. Free zone companies can self-sponsor. Mainland companies require a local service agent or partner in some activities. Valid for 2–3 years.',
                  },
                  {
                    title: 'Freelancer / Freelance Permit',
                    desc: 'Issued through free zones like TECOM, Fujairah Creative City, or IFZA. Allows self-employed individuals to work legally in the UAE. Costs vary between AED 7,500–20,000 per year including visa.',
                  },
                  {
                    title: 'UAE Green Visa',
                    desc: 'A 5-year self-sponsored residency for skilled employees earning AED 15,000+ per month, qualified freelancers, and investors. No employer sponsorship required. A strong mid-tier option between standard employment visa and the Golden Visa.',
                  },
                  {
                    title: 'UAE Golden Visa (10-Year)',
                    desc: 'Self-sponsored, 10-year renewable residency for real estate investors (AED 2M+), entrepreneurs, exceptional professionals, and outstanding students. The ultimate long-term residency for high-net-worth individuals.',
                    link: '/journal/dubai-golden-visa-guide',
                    linkText: 'Read the full Golden Visa guide →',
                  },
                ].map(visa => (
                  <div key={visa.title} className="bg-cipher-card border border-cipher-rim rounded-xl p-5">
                    <h3 className="font-display text-lg text-cipher-white mb-2">{visa.title}</h3>
                    <p className="text-cipher-muted text-sm">{visa.desc}</p>
                    {visa.link && (
                      <Link href={visa.link} className="inline-block mt-3 text-sm text-cipher-gold hover:underline">
                        {visa.linkText}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Setting Up a Business in Dubai</h2>
              <p className="mb-4">
                Dubai offers two business structures: free zone companies and mainland (LLC) companies.
                Your choice determines where you can operate and with whom.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    type: 'Free Zone Company',
                    pros: ['100% foreign ownership', 'No corporate tax on qualifying income (0–9%)', 'Simple setup (1–3 weeks)', 'Self-sponsored visa included'],
                    cons: ['Cannot trade directly with UAE mainland clients without a local agent', 'Must operate within free zone jurisdiction'],
                  },
                  {
                    type: 'Mainland (LLC) Company',
                    pros: ['Trade freely across the UAE mainland', 'No restrictions on clients or markets', 'Physical office in any location'],
                    cons: ['9% corporate tax on profits over AED 375,000', 'More complex compliance requirements', 'Some activities require a local service agent'],
                  },
                ].map(biz => (
                  <div key={biz.type} className="bg-cipher-card border border-cipher-rim rounded-xl p-5">
                    <h3 className="font-display text-base text-cipher-white mb-3">{biz.type}</h3>
                    <p className="text-xs text-cipher-gold uppercase tracking-wider mb-2">Advantages</p>
                    <ul className="space-y-1 mb-3">
                      {biz.pros.map(p => <li key={p} className="text-xs text-cipher-muted flex gap-2"><span className="text-cipher-gold">+</span>{p}</li>)}
                    </ul>
                    <p className="text-xs text-cipher-dim uppercase tracking-wider mb-2">Considerations</p>
                    <ul className="space-y-1">
                      {biz.cons.map(c => <li key={c} className="text-xs text-cipher-muted flex gap-2"><span className="text-cipher-dim">—</span>{c}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Finding a Home in Dubai</h2>
              <p className="mb-4">
                Dubai's rental market is dynamic. Most leases are annual, paid via 1–4 post-dated
                cheques. Popular property portals include Bayut, Property Finder, and Dubizzle. RERA
                (Real Estate Regulatory Agency) governs all transactions and provides dispute
                resolution.
              </p>
              <p className="mb-6">
                Buying property is open to expatriates in designated freehold areas — including
                Downtown Dubai, Palm Jumeirah, Dubai Marina, JBR, Business Bay, and many others. No
                restriction on foreign ownership in freehold zones.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-cipher-card border border-cipher-rim rounded-xl overflow-hidden">
                  <thead>
                    <tr className="border-b border-cipher-rim">
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Area</th>
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Vibe</th>
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Avg Rent</th>
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cipher-rim">
                    {expatareas.map(a => (
                      <tr key={a.area}>
                        <td className="p-4 text-cipher-white font-medium text-xs">{a.area}</td>
                        <td className="p-4 text-cipher-muted text-xs">{a.vibe}</td>
                        <td className="p-4 text-cipher-muted text-xs font-mono">{a.avgRent}</td>
                        <td className="p-4 text-cipher-muted text-xs">{a.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Banking in Dubai</h2>
              <p className="mb-4">
                Opening a UAE bank account requires your Emirates ID, residence visa, and proof of
                address. Most banks offer same-day account activation once you have your Emirates ID.
                Major UAE banks include:
              </p>
              <ul className="space-y-2">
                {[
                  'Emirates NBD — largest UAE bank, excellent digital banking',
                  'Abu Dhabi Commercial Bank (ADCB) — strong expat services',
                  'Mashreq Bank — known for fast account opening',
                  'HSBC UAE — preferred by internationally mobile expats',
                  'RAK Bank — popular with small business owners',
                  'First Abu Dhabi Bank (FAB) — strong private banking services',
                ].map(bank => (
                  <li key={bank} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{bank}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Healthcare in Dubai</h2>
              <p className="mb-4">
                Health insurance is mandatory for all Dubai residents — your employer typically
                provides it under an employment visa. Self-sponsored visa holders must arrange their
                own insurance to complete the residency visa process.
              </p>
              <p>
                Dubai has an excellent private healthcare system. Top facilities include Cleveland
                Clinic Abu Dhabi, Mediclinic, King's College Hospital Dubai, and American Hospital
                Dubai. Public hospitals (Dubai Health Authority) are available but generally used
                by lower-income workers. Most expats use private healthcare.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Schools & Education</h2>
              <p className="mb-4">
                Dubai has over 200 international schools following British, American, IB, Indian
                (CBSE), and French curriculum. School fees range from AED 20,000 to AED 90,000+
                per year depending on curriculum and school tier.
              </p>
              <p className="mb-3">Top-rated school operators include:</p>
              <ul className="space-y-2">
                {[
                  'GEMS Education — largest private school operator in Dubai (multiple curricula)',
                  'Taaleem — operates 10 schools including Jumeirah English Speaking School',
                  'Foremarke School (BSB) — outstanding British curriculum, Nad Al Sheba',
                  'JESS (Jumeirah English Speaking School) — British curriculum, Arabian Ranches',
                  'Dubai American Academy — strong US curriculum option',
                  'Repton School Dubai — British boarding school model in a day school',
                ].map(school => (
                  <li key={school} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{school}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Monthly Cost of Living in Dubai</h2>
              <div className="bg-cipher-card border border-cipher-rim rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cipher-rim">
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Category</th>
                      <th className="text-right p-4 text-cipher-white font-display font-normal">Single (AED/mo)</th>
                      <th className="text-right p-4 text-cipher-white font-display font-normal">Family of 4 (AED/mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cipher-rim">
                    {[
                      ['Rent (2BR apartment)', '7,000–15,000', '12,000–25,000'],
                      ['Groceries', '800–1,500', '2,000–4,000'],
                      ['Dining out', '1,000–3,000', '3,000–8,000'],
                      ['Transport (fuel/taxi)', '400–1,200', '1,000–2,500'],
                      ['Utilities (DEWA + internet)', '400–800', '800–1,500'],
                      ['Health insurance', '200–600', '1,000–3,000'],
                      ['School fees (private)', 'N/A', '3,000–8,000'],
                    ].map(([cat, single, family]) => (
                      <tr key={cat}>
                        <td className="p-4 text-cipher-muted">{cat}</td>
                        <td className="p-4 text-cipher-white text-right font-mono text-xs">{single}</td>
                        <td className="p-4 text-cipher-white text-right font-mono text-xs">{family}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-cipher-rim pt-8">
              <h2 className="font-display text-3xl text-cipher-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">Can I move to Dubai without a job offer?</h3>
                  <p>Yes. The Dubai Freelancer Permit, UAE Green Visa, and UAE Golden Visa all allow self-sponsored residency without a local employer. Each has its own financial and eligibility requirements.</p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">What is the cost of living in Dubai?</h3>
                  <p>A single professional can live comfortably on AED 10,000–15,000 per month. A family of four typically requires AED 25,000–45,000 per month, with school fees being the largest variable cost.</p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">Is it safe to live in Dubai?</h3>
                  <p>Dubai consistently ranks among the world's 5 safest cities. Crime rates are extremely low and the city has a strong rule of law. Women, families, and solo travellers all report very high levels of personal safety.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Let Our Team Handle Your Entire Relocation
            </p>
            <p className="text-cipher-muted font-body mb-6">
              From visa applications and company setup to school enrollment, property search, and
              bank account opening — our concierge team manages every step of your Dubai move.
            </p>
            <Link
              href="/move-to-dubai"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Your Dubai Relocation
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
