import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'UAE Golden Visa Guide 2024 | Complete Requirements & Application | Dubai À La Carte',
  description:
    'Complete guide to the UAE Golden Visa — who qualifies, investment requirements, processing times, costs, and how to apply. 10-year renewable UAE residency for investors and professionals.',
  keywords: [
    'UAE golden visa',
    'golden visa UAE requirements',
    'UAE golden visa 2024',
    'Dubai golden visa',
    'UAE investor visa',
    'UAE 10 year residency',
    'golden visa cost UAE',
    'how to get UAE golden visa',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-golden-visa-guide`,
  },
  openGraph: {
    title: 'UAE Golden Visa Guide 2024 | Dubai À La Carte',
    description:
      'Complete guide to the UAE Golden Visa — who qualifies, investment requirements, and how to apply for 10-year residency.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-golden-visa-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai skyline golden visa guide',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'UAE Golden Visa: The Complete Guide to 10-Year UAE Residency',
  description:
    'Complete guide to the UAE Golden Visa — who qualifies, investment requirements, processing times, costs, and how to apply.',
  image:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-02-01',
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
    '@id': `${siteUrl}/journal/dubai-golden-visa-guide`,
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
      name: 'UAE Golden Visa Guide',
      item: `${siteUrl}/journal/dubai-golden-visa-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does the UAE Golden Visa cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The total cost of the UAE Golden Visa varies by emirate and applicant category. Typical costs range from AED 3,000 to AED 6,000 in government fees, plus medical testing (AED 300–700), Emirates ID (AED 300–1,070), and professional service fees if using an agent. Real estate investors must invest a minimum of AED 2 million in property.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the UAE Golden Visa application take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Processing times typically range from 2 to 6 weeks once all documents are submitted correctly. Investors with real estate in Dubai usually experience faster processing through the Dubai Land Department. Incomplete applications or document issues can extend the timeline significantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I include my family in my UAE Golden Visa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Golden Visa holders can sponsor their spouse, children of any age (including adult children), and parents. Domestic workers can also be sponsored under the Golden Visa. Sponsored family members receive residency for the same duration as the primary visa holder.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to live in the UAE to maintain my Golden Visa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike standard UAE residency visas which become invalid if you stay outside the UAE for 6 consecutive months, the Golden Visa does not have this restriction. You can travel freely and maintain your UAE Golden Visa status without mandatory periods of residency in the country.',
      },
    },
  ],
}

export default function DubaiGoldenVisaGuidePage() {
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
            <span className="text-cipher-white">UAE Golden Visa Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Services
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            UAE Golden Visa: The Complete Guide to 10-Year UAE Residency
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            The UAE Golden Visa grants investors, entrepreneurs, skilled professionals, and
            exceptional students a 10-year, self-sponsored residency in the Emirates — renewable
            indefinitely. No local sponsor required. No renewal every 2–3 years. No restrictions
            on time spent outside the country.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop"
              alt="Dubai skyline — UAE Golden Visa guide"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-10 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">What is the UAE Golden Visa?</h2>
              <p className="mb-4">
                Introduced in 2019 and significantly expanded in 2022, the UAE Golden Visa is a
                long-term residency program designed to attract and retain top talent, investors,
                and entrepreneurs. Unlike standard employment visas, the Golden Visa is
                self-sponsored — meaning you don't need an employer or local citizen to act as your
                visa guarantor.
              </p>
              <p>
                The visa is valid for 10 years and is renewable. It covers the visa holder, their
                immediate family (spouse, children, parents), and domestic staff. It is issued at
                the federal level and is valid across all seven UAE emirates.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">Who Qualifies for the UAE Golden Visa?</h2>

              <div className="space-y-6">
                {[
                  {
                    title: 'Real Estate Investors',
                    content:
                      'Own property in the UAE worth a minimum of AED 2 million (approximately USD 545,000). The property must be fully paid — mortgaged properties are eligible only if the paid portion exceeds AED 2 million. Multiple properties can be combined to reach the threshold.',
                  },
                  {
                    title: 'Financial & Fund Investors',
                    content:
                      'Deposit a minimum of AED 2 million in an approved UAE investment fund, or establish a company with AED 2 million in paid-up capital, or be a partner in an existing UAE company contributing at least AED 2 million.',
                  },
                  {
                    title: 'Entrepreneurs',
                    content:
                      "Own or co-own a startup approved by a UAE business incubator, or have an existing UAE company generating annual revenue of AED 1 million or more. First-time entrepreneurs can apply with the backing of an accredited UAE incubator or accelerator.",
                  },
                  {
                    title: 'Talented Professionals',
                    content:
                      'Specialists in science, technology, engineering, arts, medicine, and other priority fields. Applicants must hold relevant academic credentials, have a professional track record, and receive a nomination from a relevant UAE government entity or approved cultural/scientific institution.',
                  },
                  {
                    title: 'Outstanding Students',
                    content:
                      'Secondary school and university graduates with a GPA of 3.75 or higher, or those who have graduated from one of the top 100 global universities. Applicants must apply within two years of graduation.',
                  },
                  {
                    title: 'Humanitarian Pioneers & Frontline Workers',
                    content:
                      'Individuals who have made exceptional contributions in humanitarian work, including frontline healthcare workers recognized during the COVID-19 pandemic. This category is nomination-based through relevant UAE authorities.',
                  },
                ].map(cat => (
                  <div
                    key={cat.title}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6"
                  >
                    <h3 className="font-display text-lg text-cipher-white mb-2">{cat.title}</h3>
                    <p className="text-cipher-muted">{cat.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Benefits of the UAE Golden Visa
              </h2>
              <ul className="space-y-3">
                {[
                  '10-year renewable residency — no employer or local sponsor required',
                  'Sponsor your spouse, children (including adult children), parents, and domestic workers',
                  'No restriction on time spent outside the UAE — your visa remains valid',
                  'Multiple-entry 6-month visit permit issued during processing',
                  'Access to UAE banking, business licensing, and property ownership',
                  'Eligible for UAE health insurance and education systems',
                  'Positions you as a UAE tax resident (0% personal income tax)',
                  'No minimum stay requirement to maintain residency status',
                ].map(benefit => (
                  <li key={benefit} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Application Process — Step by Step
              </h2>
              <ol className="space-y-4">
                {[
                  {
                    step: 'Determine your eligibility category',
                    detail:
                      'Identify whether you qualify as an investor, entrepreneur, professional, or student. Each category has different documentation requirements.',
                  },
                  {
                    step: 'Gather your documents',
                    detail:
                      'Passport copy, existing UAE visa (if applicable), passport-sized photos, proof of qualification (property title deed, business registration, degree certificates, etc.), and a clean criminal record from your home country.',
                  },
                  {
                    step: 'Submit your application via ICA or Dubai Land Department',
                    detail:
                      "Real estate investors can apply through the Dubai Land Department's Golden Visa service. All other categories apply through the Federal Authority for Identity, Citizenship, Customs & Port Security (ICA) portal or via registered typing centres.",
                  },
                  {
                    step: 'Receive your entry permit',
                    detail:
                      "Once approved, you'll receive a 6-month multiple-entry entry permit, allowing you to enter the UAE and complete the residency stamping process.",
                  },
                  {
                    step: 'Complete medical testing and Emirates ID',
                    detail:
                      'Undergo a medical fitness test at an approved UAE health centre. Register for your Emirates ID biometrics at an ICA-approved typing centre.',
                  },
                  {
                    step: 'Receive your Golden Visa residency stamp',
                    detail:
                      'Your passport receives the 10-year UAE Golden Visa stamp, and your Emirates ID is issued with the same validity. You are now a UAE long-term resident.',
                  },
                ].map((item, i) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-cipher-gold-trace border border-cipher-gold-dim flex items-center justify-center text-cipher-gold text-sm font-display shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-cipher-white font-medium mb-1">{item.step}</p>
                      <p className="text-cipher-muted">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Costs & Government Fees
              </h2>
              <div className="bg-cipher-card border border-cipher-rim rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cipher-rim">
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Item</th>
                      <th className="text-right p-4 text-cipher-white font-display font-normal">Approx. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cipher-rim">
                    {[
                      ['Entry permit application fee', 'AED 1,000–2,000'],
                      ['Residency stamping fee', 'AED 1,000–2,000'],
                      ['Emirates ID', 'AED 300–1,070 (10-year)'],
                      ['Medical fitness test', 'AED 300–700'],
                      ['Typing centre / processing', 'AED 150–300'],
                      ['Property valuation (real estate investors)', 'AED 2,000–4,000'],
                    ].map(([item, cost]) => (
                      <tr key={item}>
                        <td className="p-4 text-cipher-muted">{item}</td>
                        <td className="p-4 text-cipher-white text-right font-mono text-xs">{cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-cipher-dim text-sm mt-3">
                Fees are set by UAE government authorities and subject to change. Professional service
                fees apply if using an approved agent or PRO service.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Processing Timeline</h2>
              <p className="mb-4">
                Processing times vary by category and completeness of documentation, but typical
                timelines are:
              </p>
              <ul className="space-y-2">
                {[
                  'Real estate investors via Dubai Land Department: 5–10 business days',
                  'ICA online applications (professionals, entrepreneurs): 2–4 weeks',
                  'Student category applications: 3–5 weeks',
                  'Embassy-referred or complex cases: up to 6 weeks',
                ].map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-cipher-rim pt-8">
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How much does the UAE Golden Visa cost?
                  </h3>
                  <p>
                    Government fees range from AED 3,000 to AED 6,000 in total, covering the entry
                    permit, residency stamp, Emirates ID, and medical test. Real estate investors
                    must invest a minimum of AED 2 million in qualifying property, separate from
                    government processing fees.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How long does the application take?
                  </h3>
                  <p>
                    Typically 2 to 6 weeks once all documents are correctly submitted. Real estate
                    investors using the Dubai Land Department pathway often experience faster
                    processing. Incomplete applications significantly extend the timeline.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Can I include my family in my Golden Visa?
                  </h3>
                  <p>
                    Yes. Holders can sponsor their spouse, children of any age, parents, and domestic
                    workers. Sponsored family members receive residency for the same 10-year duration
                    as the primary visa holder.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Do I need to live in the UAE to keep my Golden Visa?
                  </h3>
                  <p>
                    No. Unlike standard UAE residence visas (which lapse after 6 months outside the
                    country), the Golden Visa has no mandatory minimum stay requirement. You can live
                    and travel freely while maintaining your UAE long-term residency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Apply with Expert Guidance
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Our team manages your entire UAE Golden Visa application — from document preparation to
              final stamping. We handle all government portals, typing centres, and follow-ups so you
              don't have to.
            </p>
            <Link
              href="/services/golden-visa"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Your Golden Visa Application
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
