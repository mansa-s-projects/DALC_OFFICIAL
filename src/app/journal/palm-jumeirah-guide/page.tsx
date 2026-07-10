import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Palm Jumeirah: The Insider's Guide to Dubai's Iconic Island | Dubai À La Carte",
  description:
    "Five-star hotels, private beach clubs, waterfront dining, and residential secrets — the complete insider's guide to living and visiting the Palm Jumeirah.",
  keywords: [
    'Palm Jumeirah guide',
    'Palm Jumeirah hotels',
    'Palm Jumeirah restaurants',
    'Palm Jumeirah beach clubs',
    'visiting Palm Jumeirah',
    'Palm Jumeirah area guide',
    'what to do Palm Jumeirah',
    'Palm Jumeirah Dubai',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/palm-jumeirah-guide`,
  },
  openGraph: {
    title: "Palm Jumeirah: The Insider's Guide to Dubai's Iconic Island | Dubai À La Carte",
    description:
      "Five-star hotels, private beach clubs, waterfront dining, and residential secrets on the Palm Jumeirah.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/palm-jumeirah-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Palm Jumeirah aerial view Dubai',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Palm Jumeirah: The Insider's Guide to Dubai's Iconic Island",
  description:
    'Five-star hotels, private beach clubs, waterfront dining, and residential secrets on the Palm Jumeirah.',
  image:
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-04-05',
  dateModified: '2024-11-25',
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
    '@id': `${siteUrl}/journal/palm-jumeirah-guide`,
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
      name: 'Palm Jumeirah Guide',
      item: `${siteUrl}/journal/palm-jumeirah-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best hotel on the Palm Jumeirah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Atlantis, The Palm remains the Palm\'s most iconic resort — famous for Aquaventure waterpark, world-class restaurants (including Nobu and Ossiano), and its unique position at the apex of the frond. For ultra-luxury, Atlantis The Royal opened in 2023 and sets a new standard in the region. The Waldorf Astoria Palm Jumeirah and One&Only The Palm offer more intimate alternatives with refined service.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you get to the Palm Jumeirah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Palm Monorail connects the base of the Palm (at Nakheel Mall) to Atlantis, The Palm at the apex, stopping at The Palm Gateway station near Atlantis. Taxis and ride-hailing apps service all frond addresses. The Palm is also accessible via the Sheikh Zayed Road interchange or the new Palm Jumeirah tunnel beneath the trunk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Palm Jumeirah worth visiting for a day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — a day on the Palm combines some of Dubai\'s best beach club access (Cove Beach, Sofitel Beach Club, Nikki Beach, Club Vista Mare), exceptional waterfront dining with both sea and skyline views, and the world-class Atlantis resort complex. It is one of the most diverse and photogenic areas in the city.',
      },
    },
  ],
}

const palmExperiences = [
  {
    name: 'Atlantis, The Palm',
    category: 'Iconic Resort',
    description:
      'The Palm\'s anchor resort has undergone a dramatic transformation with the opening of Atlantis The Royal next door. The original Atlantis retains its legendary character — Aquaventure waterpark, the Lost Chambers Aquarium, and an extraordinary restaurant lineup including Nobu, Ossiano (an underwater fine dining experience), Seafire Steakhouse, and Bread Street Kitchen by Gordon Ramsay.',
  },
  {
    name: 'Atlantis The Royal',
    category: 'Ultra-Luxury',
    description:
      'Opened January 2023, this tower defines a new tier of Dubai hospitality. The Sky Pool suspended between towers is the visual centrepiece. Restaurants from Robuchon, Jaleo by José Andrés, and Little Venice Cake Company set an exceptional dining standard. Even as a day visitor for brunch or dinner, the architectural experience alone justifies the visit.',
  },
  {
    name: 'Cove Beach',
    category: 'Beach Club',
    description:
      'Situated at the base of the Palm overlooking Ain Dubai and the Bluewaters development, Cove Beach is one of Dubai\'s best beach club experiences — curated music, an infinity pool, excellent food, and genuinely beautiful design. Weekend daybeds book out fast; midweek visits are more relaxed.',
  },
  {
    name: 'Nikki Beach',
    category: 'Beach Club',
    description:
      'The global luxury brand\'s Dubai outpost on Pearl Jumeirah is the Palm area\'s most emblematic high-end beach club. White-draped daybeds, champagne service, a resident DJ soundtrack, and private beachfront on the Persian Gulf. A weekend brunch here is a full social event.',
  },
  {
    name: 'Club Vista Mare',
    category: 'Dining & Beach',
    description:
      'A waterfront dining and beach concept at the tip of the Palm trunk with multiple F&B concepts including Alici (Italian seafood), Boca (Spanish), and Wakame (Asian). The views across the Palm\'s artificial beach to the Dubai skyline are exceptional, particularly at golden hour.',
  },
  {
    name: 'The View at The Palm',
    category: 'Observation',
    description:
      'The observation deck on the 52nd floor of the Palm Tower offers 360° views — the full palm frond layout visible from above, stretching to Downtown Dubai, the Marina, and the Arabian Gulf. Best visited at sunset. Tickets can be purchased online and combined with a visit to the rooftop infinity pool.',
  },
]

export default function PalmJumeirahGuidePage() {
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
            <span className="text-cipher-white">Palm Jumeirah Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Area Guide
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            Palm Jumeirah: The Insider's Guide to Dubai's Iconic Island
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            The Palm Jumeirah is simultaneously Dubai's most recognisable address and its most
            misunderstood. Visitors see it from the air and assume it's primarily residential.
            Residents know it as home to the city's densest concentration of five-star hotels,
            premium beach clubs, and waterfront restaurants — a 560-hectare island that rewards
            exploration at every frond tip.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1400&auto=format&fit=crop"
              alt="Palm Jumeirah island aerial view with Dubai skyline"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-8 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Understanding the Palm's Layout
              </h2>
              <p className="mb-4">
                The Palm Jumeirah is structured like its name suggests: a trunk, a crown, and 17
                fronds extending outward from the trunk into the Arabian Gulf. The trunk connects
                to the mainland via a dual-carriageway road from Al Sufouh and Sheikh Zayed Road,
                and by monorail from the Gateway station at Nakheel Mall.
              </p>
              <p className="mb-4">
                The crescent — the outermost protective arc — is dominated by hotels: Atlantis at
                the eastern end, One&Only The Palm at the western end, Waldorf Astoria, Kempinski,
                and Anantara in between. The fronds are primarily high-end residential villas with
                private beach access. The trunk houses apartments, retail, and Nakheel Mall.
              </p>
              <p>
                Most visitors should focus on the crescent (hotel strip) and the tip of the trunk
                (Club Vista Mare, The Palm Tower). The fronds are residential and have limited
                visitor access.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                Essential Palm Experiences
              </h2>
              <div className="space-y-4">
                {palmExperiences.map(exp => (
                  <div
                    key={exp.name}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6 hover:border-cipher-rim2 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-display text-xl text-cipher-white">{exp.name}</h3>
                      <span className="text-xs text-cipher-gold uppercase tracking-wider shrink-0">{exp.category}</span>
                    </div>
                    <p className="text-cipher-muted text-sm leading-relaxed">{exp.description}</p>
                    <div className="mt-4 pt-4 border-t border-cipher-rim">
                      <Link
                        href="/request"
                        className="text-sm text-cipher-gold hover:underline font-body"
                      >
                        Book with Concierge →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Getting Around the Palm
              </h2>
              <p className="mb-4">
                The Palm Monorail (AED 20 one-way) runs from Nakheel Mall at the base of the trunk
                to Atlantis, The Palm at the apex, with a single intermediate stop at The Palm
                Gateway. It is the most efficient way to reach the crescent from the mainland
                without a car.
              </p>
              <p className="mb-4">
                Taxis and Careem/Uber serve all addresses on the Palm efficiently. The internal
                trunk road is wide and well-signposted. Frond addresses have a specific naming
                convention (e.g., Frond M, Villa 14) that confuses ride-hailing apps — confirm the
                full address with your host before travelling.
              </p>
              <p>
                Walking is pleasant along the crescent hotels' shared boardwalk and at Club Vista
                Mare but impractical across the full Palm due to distances. A bicycle or golf cart
                rental is available at some hotel properties for frond exploration.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Insider Tips
              </h2>
              <ul className="space-y-3 ml-4">
                {[
                  'The best view of the entire Palm is from The View observation deck on the 52nd floor of Palm Tower — not from Atlantis',
                  'Nikki Beach is on Pearl Jumeirah (not technically on the Palm fronds) but is the area\'s most glamorous beach club',
                  'Atlantis The Royal\'s Dinner at Sky is the most exclusive dining experience on the Palm — book 4–6 weeks ahead',
                  'Club Vista Mare offers multiple restaurant concepts in one complex — ideal for groups with varied preferences',
                  'The crescent boardwalk between Atlantis and Anantara is perfect for an early morning or sunset walk',
                  'Frond villas have private beach access — if staying in a villa rental, you have a private beach included',
                  'The Palm Gateway monorail station connects directly to the Dubai Metro Red Line via the Dubai Marina area',
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
                    What is the best hotel on the Palm Jumeirah?
                  </h3>
                  <p>
                    Atlantis The Royal (opened 2023) sets the new ultra-luxury standard. The
                    original Atlantis, The Palm retains its iconic family resort character.
                    One&Only The Palm and the Waldorf Astoria offer more intimate, refined
                    alternatives for guests seeking quieter luxury.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How do you get to the Palm Jumeirah?
                  </h3>
                  <p>
                    The Palm Monorail connects Nakheel Mall (base of trunk) to Atlantis (apex).
                    Taxis and ride-hailing apps service all addresses. Accessible via Sheikh Zayed
                    Road interchange or the new Palm Jumeirah tunnel.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Is the Palm Jumeirah worth visiting for a day?
                  </h3>
                  <p>
                    Yes — combine a beach club (Cove Beach or Nikki Beach), lunch at Club Vista
                    Mare with Gulf views, The View observation deck at sunset, and dinner at Ossiano
                    or Nobu inside Atlantis. One of Dubai's most rewarding full-day itineraries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Plan Your Perfect Palm Jumeirah Day
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Beach club reservations, restaurant bookings, hotel recommendations, and villa
              rentals on the Palm — our concierge team handles every detail.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Plan My Palm Visit
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
