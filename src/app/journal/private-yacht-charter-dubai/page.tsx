import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Private Yacht Charter Dubai: Complete Guide to Prices & Booking | Dubai À La Carte",
  description:
    "Everything you need to know about chartering a private yacht in Dubai — types of yachts, prices, routes, what's included, and how to book. Sunset cruises to full-day charters.",
  keywords: [
    'private yacht charter Dubai',
    'yacht hire Dubai',
    'yacht charter price Dubai',
    'Dubai yacht rental',
    'sunset cruise Dubai',
    'luxury yacht Dubai',
    'party yacht Dubai',
    'yacht booking Dubai',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/private-yacht-charter-dubai`,
  },
  openGraph: {
    title: 'Private Yacht Charter Dubai: Complete Guide | Dubai À La Carte',
    description:
      "Everything you need to know about chartering a private yacht in Dubai — types, prices, routes, and booking tips.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/private-yacht-charter-dubai`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Private yacht on Dubai waters',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Private Yacht Charter in Dubai: Everything You Need to Know',
  description:
    "Sunset cruises, full-day charters, party boats, and luxury superyachts — how to choose the right yacht, what it costs, and how to book.",
  image:
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-03-01',
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
    '@id': `${siteUrl}/journal/private-yacht-charter-dubai`,
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
      name: 'Private Yacht Charter Dubai',
      item: `${siteUrl}/journal/private-yacht-charter-dubai`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a private yacht charter cost in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prices vary by yacht size and type. A standard 50–60ft motor yacht costs AED 800–1,500 per hour with a 2-hour minimum. An 80ft luxury yacht runs AED 1,500–2,500 per hour. Superyachts (100ft+) range from AED 3,000–8,000 per hour. Full-day charters (8 hours) are typically priced at a flat rate with better value per hour.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in a Dubai yacht charter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most Dubai yacht charters include: a licensed captain and crew, fuel for the agreed route, safety equipment, soft drinks (water, juice, soda), and basic deck furniture (sunloungers, seating). Items that typically cost extra include: food and catering, alcohol, water sports equipment (jet skis, paddle boards), fishing gear, and marine park entry fees.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best time to charter a yacht in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "October to April is the best period for Dubai yacht charters — temperatures are comfortable (22–30°C), seas are calm, and visibility is excellent. The golden hour sunset charter (departing 4:30–5pm) is the most popular experience year-round. Summer charters (May–September) are possible in the early morning or evening but daytime heat can be intense.",
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book a yacht charter in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "For weekday charters, 24–48 hours notice is usually sufficient. For weekend (Friday/Saturday) charters, book at least 3–5 days in advance, especially for the popular sunset slot. For special occasions, holidays, or large group charters, book 1–2 weeks ahead. Our concierge can sometimes arrange same-day charters on weekdays.",
      },
    },
  ],
}

const yachtTypes = [
  {
    type: 'Motor Yacht (40–65ft)',
    capacity: 'Up to 15 guests',
    priceRange: 'AED 800–1,500/hr',
    idealFor: 'Small groups, sunset cruises, birthday parties, couples',
    highlight: 'Most popular choice — great balance of comfort, speed, and value',
  },
  {
    type: 'Luxury Motor Yacht (70–90ft)',
    capacity: 'Up to 30 guests',
    priceRange: 'AED 1,500–2,800/hr',
    idealFor: 'Corporate events, milestone celebrations, larger group outings',
    highlight: 'Multiple decks, proper dining area, premium sound systems',
  },
  {
    type: 'Superyacht (100ft+)',
    capacity: 'Up to 40–50 guests',
    priceRange: 'AED 3,000–8,000/hr',
    idealFor: 'Ultra-luxury charters, high-net-worth groups, exclusive events',
    highlight: 'Full crew, jacuzzi, multiple cabins, helicopter landing pads on some',
  },
  {
    type: 'Catamaran',
    capacity: 'Up to 20 guests',
    priceRange: 'AED 700–1,200/hr',
    idealFor: 'Swimming, snorkelling, relaxed day charters, families',
    highlight: 'More stable platform, wide deck space, excellent for swimming stops',
  },
  {
    type: 'Sailing Yacht',
    capacity: 'Up to 12 guests',
    priceRange: 'AED 600–1,000/hr',
    idealFor: 'Romantic experiences, sailing enthusiasts, serene escapes',
    highlight: 'Quieter, eco-friendly, more intimate experience',
  },
]

const routes = [
  {
    name: 'Dubai Marina to the Palm',
    duration: '2–3 hours',
    highlights: 'Depart from Marina Walk, cruise past JBR beach, circle the Palm Jumeirah, views of Atlantis',
    bestFor: 'Most popular route, covers the city\'s iconic landmarks',
  },
  {
    name: 'Sunset Burj Al Arab Route',
    duration: '2 hours',
    highlights: 'Sail past the iconic Burj Al Arab, views of Jumeirah Beach Hotel, Kite Beach shoreline',
    bestFor: 'Photography, romantic occasions, golden hour light',
  },
  {
    name: 'Dubai Creek & Old Town',
    duration: '3–4 hours',
    highlights: 'Old Dubai skyline, Al Seef heritage waterfront, Deira dhow wharfage, Burj Khalifa backdrop',
    bestFor: 'Culture-curious guests wanting to see old and new Dubai from the water',
  },
  {
    name: 'Full Atlantis View Circuit',
    duration: '4 hours',
    highlights: 'Full Palm Jumeirah circumnavigation, Atlantis hotel view from the sea, swimming stop off the Palm',
    bestFor: 'Full-day half charters, families wanting a swimming stop',
  },
  {
    name: 'World Islands Exploration',
    duration: '3–5 hours',
    highlights: 'Visit the artificial World Islands archipelago, remote anchorage spots, clear water swimming',
    bestFor: 'Adventurous groups wanting off-the-beaten-path Dubai by sea',
  },
]

export default function PrivateYachtCharterDubaiPage() {
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
            <span className="text-cipher-white">Private Yacht Charter Dubai</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Experiences
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            Private Yacht Charter in Dubai: Everything You Need to Know
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            From the glittering Marina to the World Islands, Dubai's waters offer one of the most
            spectacular private charter experiences on the planet. Whether you want a 2-hour sunset
            cruise for two or a full-day superyacht for fifty, this guide covers everything — prices,
            routes, what's included, and how to book without overpaying.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1400&auto=format&fit=crop"
              alt="Private luxury yacht charter in Dubai Marina"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-10 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Why Charter a Yacht in Dubai?</h2>
              <p className="mb-4">
                Dubai's coastline is genuinely spectacular — and the view from the water is
                something most visitors never experience. The city's iconic skyline, the
                palm-shaped island, the world's most luxurious hotels lined up along the shore,
                and the deep blue of the Arabian Gulf all come together in a way that photographs
                simply cannot capture from land.
              </p>
              <p>
                A private yacht charter is also Dubai's most versatile experience. It works as a
                birthday party, corporate event, romantic sunset cruise, family day out, or simply
                an afternoon on the water with friends. The charter is entirely yours — you set
                the route, the music, the pace.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">Types of Yachts Available in Dubai</h2>
              <div className="space-y-4">
                {yachtTypes.map(yacht => (
                  <div
                    key={yacht.type}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-lg text-cipher-white">{yacht.type}</h3>
                      <span className="text-cipher-gold font-mono text-xs shrink-0">{yacht.priceRange}</span>
                    </div>
                    <p className="text-cipher-dim text-xs mb-2">Capacity: {yacht.capacity}</p>
                    <p className="text-cipher-muted text-sm mb-3">{yacht.highlight}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cipher-gold uppercase tracking-wider">Ideal for:</span>
                      <span className="text-xs text-cipher-muted">{yacht.idealFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">Popular Charter Routes in Dubai</h2>
              <div className="space-y-4">
                {routes.map(route => (
                  <div
                    key={route.name}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-base text-cipher-white">{route.name}</h3>
                      <span className="text-cipher-dim text-xs shrink-0">{route.duration}</span>
                    </div>
                    <p className="text-cipher-muted text-sm mb-2">{route.highlights}</p>
                    <p className="text-xs text-cipher-gold">{route.bestFor}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Price Guide</h2>
              <div className="bg-cipher-card border border-cipher-rim rounded-xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cipher-rim">
                      <th className="text-left p-4 text-cipher-white font-display font-normal">Yacht Size</th>
                      <th className="text-right p-4 text-cipher-white font-display font-normal">Hourly Rate</th>
                      <th className="text-right p-4 text-cipher-white font-display font-normal">Min. Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cipher-rim">
                    {[
                      ['40–60ft motor yacht', 'AED 800–1,500', '2 hours'],
                      ['70–80ft luxury yacht', 'AED 1,500–2,500', '3 hours'],
                      ['90–100ft premium yacht', 'AED 2,500–4,000', '3 hours'],
                      ['100ft+ superyacht', 'AED 4,000–8,000+', '4 hours'],
                      ['Catamaran', 'AED 700–1,200', '2 hours'],
                    ].map(([size, rate, min]) => (
                      <tr key={size}>
                        <td className="p-4 text-cipher-muted">{size}</td>
                        <td className="p-4 text-cipher-white text-right font-mono text-xs">{rate}</td>
                        <td className="p-4 text-cipher-dim text-right text-xs">{min}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-cipher-dim text-sm">
                Prices are indicative and vary by operator, season, and day of week. Weekend rates
                (Thursday evening, Friday, Saturday) typically carry a 15–25% premium.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">What's Included (and What's Extra)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cipher-card border border-cipher-rim rounded-xl p-5">
                  <p className="text-xs text-cipher-gold uppercase tracking-wider mb-3">Typically Included</p>
                  <ul className="space-y-2">
                    {[
                      'Licensed captain and crew',
                      'Fuel for agreed route',
                      'Safety equipment',
                      'Soft drinks (water, juice, soda)',
                      'Sunloungers and deck seating',
                      'Bluetooth sound system',
                    ].map(item => (
                      <li key={item} className="text-sm text-cipher-muted flex gap-2">
                        <span className="text-cipher-gold">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cipher-card border border-cipher-rim rounded-xl p-5">
                  <p className="text-xs text-cipher-dim uppercase tracking-wider mb-3">Available as Add-ons</p>
                  <ul className="space-y-2">
                    {[
                      'Food & catering packages',
                      'Alcohol (beer, wine, spirits)',
                      'Jet ski rental (AED 200–400/hr)',
                      'Paddle boards & snorkelling gear',
                      'Fishing equipment',
                      'Dedicated DJ or live music',
                      'Floral arrangements & décor',
                    ].map(item => (
                      <li key={item} className="text-sm text-cipher-muted flex gap-2">
                        <span className="text-cipher-dim">+</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Best Times to Charter</h2>
              <div className="space-y-4">
                {[
                  {
                    time: 'Golden Hour Sunset (4:30–7:30pm)',
                    desc: "Dubai's most iconic charter experience. The city glows amber and gold as the sun drops behind the Marina skyline. Fully booked most weekends — reserve days in advance.",
                  },
                  {
                    time: 'Morning Charter (8–12pm)',
                    desc: 'Calm seas, good light for photography, fewer other boats. Ideal for fishing trips, swimming stops, and families with young children.',
                  },
                  {
                    time: 'Night Charter (7pm onwards)',
                    desc: 'Dubai lit up at night is a different spectacle entirely. Party atmosphere, city lights reflecting on the water. Popular for birthdays and group celebrations.',
                  },
                  {
                    time: 'October to April (Peak Season)',
                    desc: 'Perfect weather (22–30°C), flat seas, excellent visibility. The best period for yacht charters. Book further in advance as demand is highest.',
                  },
                ].map(t => (
                  <div key={t.time} className="flex gap-4">
                    <div className="w-1 bg-cipher-gold-dim rounded-full shrink-0 mt-1" />
                    <div>
                      <p className="text-cipher-white font-medium mb-1">{t.time}</p>
                      <p className="text-cipher-muted text-sm">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">Booking Tips & What to Ask</h2>
              <ul className="space-y-3">
                {[
                  'Always confirm the total price in writing — including fuel, crew gratuity, and any marina fees',
                  'Ask for the yacht\'s DEMA (Dubai Marine Establishment) registration number to verify legitimacy',
                  'Check the exact departure marina — Dubai Marina, JBR, Festival City, and Deira all have yacht berths',
                  'Clarify the food and alcohol policy before booking — not all operators allow outside catering',
                  'Ask whether the crew gratuity is included or expected separately (typically 10–15%)',
                  'Confirm the cancellation and rescheduling policy, especially for weather delays',
                  'For large groups, request the crew-to-guest ratio — you want at least 1 crew per 10 guests',
                ].map(tip => (
                  <li key={tip} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-cipher-rim pt-8">
              <h2 className="font-display text-3xl text-cipher-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How much does a private yacht charter cost in Dubai?
                  </h3>
                  <p>
                    A 50–60ft motor yacht costs AED 800–1,500 per hour. An 80ft luxury yacht runs
                    AED 1,500–2,800 per hour. Superyachts (100ft+) range from AED 3,000–8,000 per
                    hour. Full-day charters offer better per-hour value than short charters.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    What is included in a Dubai yacht charter?
                  </h3>
                  <p>
                    Most charters include the captain and crew, fuel for the agreed route, safety
                    equipment, soft drinks, and deck furniture. Food, alcohol, water sports
                    equipment, and additional entertainment are typically charged as add-ons.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    When is the best time to charter a yacht in Dubai?
                  </h3>
                  <p>
                    October to April offers the best weather — comfortable temperatures (22–30°C)
                    and calm seas. The golden hour sunset slot (departing around 4:30–5pm) is the
                    most popular experience year-round.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How far in advance do I need to book?
                  </h3>
                  <p>
                    Weekday charters can often be arranged with 24–48 hours notice. Weekend sunset
                    slots should be booked 3–5 days ahead. For special occasions, holidays, or large
                    groups, allow 1–2 weeks. Our concierge can sometimes arrange same-day weekday
                    charters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Book Your Private Yacht Charter
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Tell us your group size, preferred date, and occasion — our team finds the perfect
              yacht, negotiates the best rate, and handles everything from departure briefing to
              post-charter catering.
            </p>
            <Link
              href="/experiences/yacht-charter"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Charter a Yacht with Concierge
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
