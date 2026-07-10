import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Downtown Dubai: The Complete Area Guide | Dubai À La Carte',
  description:
    "Burj Khalifa views, The Dubai Mall, world-class dining, rooftop bars, and hidden local gems — a local's complete guide to making the most of Downtown Dubai.",
  keywords: [
    'Downtown Dubai guide',
    'Burj Khalifa area',
    'Dubai Mall guide',
    'Downtown Dubai restaurants',
    'Downtown Dubai rooftop bars',
    'Downtown Dubai hotels',
    'what to do Downtown Dubai',
    'Downtown Dubai area guide',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/downtown-dubai-guide`,
  },
  openGraph: {
    title: 'Downtown Dubai: The Complete Area Guide | Dubai À La Carte',
    description:
      "Burj Khalifa views, The Dubai Mall, rooftop bars, and hidden gems — a local's guide to Downtown Dubai.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/downtown-dubai-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534571638-e00c46e7d0f2?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Downtown Dubai Burj Khalifa at night',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Downtown Dubai: The Complete Area Guide',
  description:
    "Burj Khalifa, The Dubai Mall, fine dining, rooftop bars, and hidden gems — a local's guide to Downtown Dubai.",
  image:
    'https://images.unsplash.com/photo-1534571638-e00c46e7d0f2?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-03-01',
  dateModified: '2024-11-20',
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
    '@id': `${siteUrl}/journal/downtown-dubai-guide`,
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
      name: 'Downtown Dubai Guide',
      item: `${siteUrl}/journal/downtown-dubai-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Downtown Dubai worth visiting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Downtown Dubai is the centrepiece of the city, home to the Burj Khalifa, The Dubai Fountain, and The Dubai Mall. Beyond the landmarks, it has some of Dubai\'s best fine dining restaurants, rooftop bars with unmatched views, and a genuinely walkable promenade in Souk Al Bahar. It is essential for any first visit and rewards repeat visitors who explore beyond the main attractions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best time to visit the Burj Khalifa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sunset and the hour after are the most spectacular times to visit At the Top (levels 124/125) or At the Top SKY (level 148). The sky transitions from golden to deep blue while the city illuminates below. Book at least 3–5 days in advance as sunset slots sell out fast. Sunrise visits offer clear skies and fewer crowds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where should I eat in Downtown Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Armani/Ristorante and Hashi inside the Burj Khalifa offer the most prestigious addresses. For rooftop dining with fountain views, try Zuma or Neos at the Address Downtown. For a more local atmosphere, the restaurants lining Souk Al Bahar\'s waterfront promenade offer excellent mezze and Middle Eastern cuisine with Burj Khalifa views.',
      },
    },
  ],
}

const highlights = [
  {
    name: 'Burj Khalifa — At the Top',
    type: 'Landmark & Observation',
    detail:
      'The 828-metre tower anchors Downtown Dubai and the city\'s entire skyline. At the Top (levels 124 & 125) and At the Top SKY (level 148) offer extraordinary 360° views. Book sunset slots 3–5 days in advance. The outdoor terrace at 555 metres on level 148 is the highest observation deck in the world accessible to the public.',
  },
  {
    name: 'The Dubai Fountain',
    type: 'Spectacle',
    detail:
      'The world\'s largest choreographed fountain performs every 30 minutes from 6pm to 11pm and at 1pm and 1:30pm on weekends. Best viewed from the waterfront promenade of Souk Al Bahar or from a restaurant table with a direct fountain sightline. The Abra (traditional boat) ride across the Burj Lake offers the most intimate perspective.',
  },
  {
    name: 'The Dubai Mall',
    type: 'Retail & Entertainment',
    detail:
      'The world\'s largest mall by total area houses 1,200+ retailers, a full-size ice rink, the Dubai Aquarium & Underwater Zoo, an indoor theme park (Kidzania), and more dining options than most city centres. Set aside a full day if you intend to explore properly. The Fashion Avenue wing houses all major luxury houses.',
  },
  {
    name: 'Souk Al Bahar',
    type: 'Dining & Promenade',
    detail:
      'The Arabic-style retail and dining souk connected to The Dubai Mall by bridge offers the best Burj Khalifa and fountain views in Downtown. The waterfront promenade restaurants — Left Bank, Rivington, and the Arabic mezze spots — are excellent for long lunches and evening dining. Far more atmospheric than the mall itself.',
  },
  {
    name: 'DIFC (nearby)',
    type: 'Finance & Fine Dining',
    detail:
      'The Dubai International Financial Centre borders Downtown and hosts the city\'s most sophisticated restaurant cluster — Zuma, Nobu, Cipriani, Coya, and more. The Gate Village walkways are excellent for evening cocktails. Connected to Downtown by a 10-minute taxi ride or the DIFC metro station.',
  },
  {
    name: 'Rooftop Bars',
    type: 'Nightlife',
    detail:
      'Neos at The Address Downtown (63rd floor), Vault at Sofitel Downtown, and the rooftop at W Dubai Downtown all offer unobstructed Burj Khalifa views. Neos is particularly spectacular at night when the tower\'s light show begins. Dress code: smart casual minimum at all venues.',
  },
]

export default function DowntownDubaiGuidePage() {
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
            <span className="text-cipher-white">Downtown Dubai Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Area Guide
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            Downtown Dubai: The Complete Area Guide
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            No neighbourhood in the world announces itself quite like Downtown Dubai. The Burj
            Khalifa pierces the sky at 828 metres. The Dubai Fountain erupts in choreographed
            arcs every evening. Yet beyond the spectacle lies a genuinely liveable, walkable
            neighbourhood — one with some of the city's best restaurants, rooftop bars, and
            cultural moments hiding in plain sight.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1534571638-e00c46e7d0f2?q=80&w=1400&auto=format&fit=crop"
              alt="Downtown Dubai skyline with Burj Khalifa illuminated at night"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-8 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Getting to Downtown Dubai
              </h2>
              <p className="mb-4">
                Downtown Dubai sits at the geographic heart of the city, bounded by Sheikh Zayed
                Road to the west and Doha Street to the east. The Dubai Mall / Burj Khalifa metro
                station on the Red Line connects directly to the area via an air-conditioned
                walkway to The Dubai Mall. From Dubai International Airport, the metro journey
                takes approximately 30 minutes.
              </p>
              <p>
                Taxis and ride-hailing apps (Careem, Uber) are ubiquitous and affordable. Allow
                30–45 minutes from the Marina, 20 minutes from DIFC, and 15 minutes from the
                Airport during off-peak hours. Parking is available under The Dubai Mall and at
                several Street-level car parks, though it fills quickly on weekends and during
                fountain show times.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                The Essential Highlights
              </h2>
              <div className="space-y-4">
                {highlights.map(item => (
                  <div
                    key={item.name}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6 hover:border-cipher-rim2 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl text-cipher-white">{item.name}</h3>
                      <span className="text-xs text-cipher-gold uppercase tracking-wider shrink-0">{item.type}</span>
                    </div>
                    <p className="text-cipher-muted text-sm leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Where to Eat in Downtown Dubai
              </h2>
              <p className="mb-4">
                Downtown Dubai has evolved from a tourist dining destination into a genuine
                fine-dining cluster. The Address Downtown houses some of the city's most
                prestigious hotel restaurants. The Armani Hotel — occupying the lower floors of the
                Burj Khalifa — includes Armani/Ristorante (Italian fine dining) and Armani/Hashi
                (Japanese), both with genuinely excellent kitchens, not just brand cachet.
              </p>
              <p className="mb-4">
                For fountain-view dining at more accessible price points, the restaurants along
                Souk Al Bahar's waterfront promenade — La Cantine du Faubourg, Rivington Grill,
                and the string of Arabic mezze restaurants — offer exceptional atmosphere in the
                evenings when the fountain performs.
              </p>
              <p>
                The Dubai Mall food court is enormous and genuinely good — an underrated lunch
                option when you need quick, varied, affordable food between sightseeing. The
                Eataly on Level 2 is a cut above the usual food court format.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Insider Tips
              </h2>
              <ul className="space-y-3 ml-4">
                {[
                  'Book Burj Khalifa tickets online at least 3–5 days in advance — walk-in tickets cost double and may not be available at peak times',
                  'The best fountain views are free — stand on the Souk Al Bahar waterfront bridge or the Dubai Mall waterfront promenade',
                  'Visit on a weekday morning to experience The Dubai Mall without the weekend crowds — Thursday and Friday evenings are peak times',
                  'The Burj Khalifa light show runs nightly — check the calendar as shows vary in frequency',
                  'Souk Al Bahar restaurants book up for evening slots — reserve 48 hours ahead for weekend fountain-view dining',
                  'The Dubai Aquarium inside The Dubai Mall is impressive — the tunnel walkthrough takes you under 33,000 aquatic animals',
                  'DIFC fine dining is a 10-minute taxi ride away and far superior for serious restaurant experiences',
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
                    Is Downtown Dubai worth visiting?
                  </h3>
                  <p>
                    Yes — it is the centrepiece of modern Dubai, home to the Burj Khalifa, The Dubai
                    Fountain, and some of the city's best dining. Beyond the landmarks, the
                    waterfront promenade at Souk Al Bahar and the DIFC cluster nearby make it
                    essential for any first visit.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    What is the best time to visit the Burj Khalifa?
                  </h3>
                  <p>
                    Sunset and the hour after — the sky transitions from golden to deep blue while
                    the city illuminates below you. Book at least 3–5 days in advance as sunset
                    slots sell out fast. Sunrise visits offer clear skies and fewer crowds.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Where should I eat in Downtown Dubai?
                  </h3>
                  <p>
                    For occasion dining, Armani/Ristorante inside the Burj Khalifa. For fountain
                    views, the Souk Al Bahar waterfront restaurants. For cocktails and panoramas,
                    Neos at The Address Downtown (63rd floor). For serious restaurant experiences,
                    take a 10-minute taxi to DIFC.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Let Us Plan Your Downtown Dubai Day
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Our concierge team handles Burj Khalifa reservations, rooftop table bookings, and
              curated Downtown itineraries — no waitlists, no queues, no wasted time.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Plan My Downtown Visit
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
