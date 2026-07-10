import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Dubai Marina: The Complete Neighbourhood Guide | Dubai À La Carte",
  description:
    "Waterfront dining, rooftop bars, marina walks, and yacht clubs — everything you need to know about Dubai's most vibrant waterfront district.",
  keywords: [
    'Dubai Marina guide',
    'Dubai Marina restaurants',
    'Dubai Marina rooftop bars',
    'Dubai Marina Walk',
    'things to do Dubai Marina',
    'Dubai Marina nightlife',
    'Dubai Marina area guide',
    'JBR Dubai guide',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-marina-guide`,
  },
  openGraph: {
    title: "Dubai Marina: The Complete Neighbourhood Guide | Dubai À La Carte",
    description:
      "Waterfront dining, rooftop bars, marina walks, and yacht clubs in Dubai's most vibrant district.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-marina-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai Marina waterfront skyline at night',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dubai Marina: The Complete Neighbourhood Guide',
  description:
    "Waterfront dining, rooftop bars, marina walks, and yacht clubs in Dubai's most vibrant waterfront district.",
  image:
    'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-05-10',
  dateModified: '2024-11-30',
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
    '@id': `${siteUrl}/journal/dubai-marina-guide`,
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
      name: 'Dubai Marina Guide',
      item: `${siteUrl}/journal/dubai-marina-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best area to stay in Dubai Marina?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For hotels, the Address Dubai Marina and Grosvenor House are the premium options at the marina\'s northern end. The Address JBR offers beach access combined with marina proximity. For apartments, the towers directly on the marina walk (Marina Promenade, Princess Tower area) offer the best walking access to restaurants and the water.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Dubai Marina Walk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dubai Marina Walk is the 7km waterfront promenade encircling the man-made marina canal. Lined with over 200 restaurants, cafes, boutiques, and a supermarket, it is one of the most walkable stretches in Dubai. At night, with the towers illuminated and yachts moored along the water, it is one of the city\'s great urban experiences.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Dubai Marina worth visiting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Dubai Marina is the most liveable and socially active neighbourhood in Dubai. The combination of Marina Walk restaurants, JBR beach (a short walk away), rooftop bars, yacht charter access, and a genuine street-level atmosphere makes it the best base for visitors who want flexibility and convenience over pure luxury.',
      },
    },
  ],
}

const marinaHighlights = [
  {
    name: 'Dubai Marina Walk',
    category: 'Promenade',
    description:
      'The 7km waterfront promenade that circles the marina canal is the social heart of the neighbourhood. Over 200 restaurants and cafes line the route — from casual shawarma spots to fine dining with marina views. Evenings here, with the skyscraper towers mirrored in the water and yachts moored alongside, are genuinely spectacular. The walk is at its best after 7pm on weekdays and after 6pm on weekends.',
  },
  {
    name: 'JBR — Jumeirah Beach Residence',
    category: 'Beach & Retail',
    description:
      'Connected to Dubai Marina by a short walkway, JBR is the neighbourhood\'s beach district. The Walk at JBR is a 1.7km open-air retail and dining street running parallel to the beach. The Beach JBR development houses restaurants, cinema, and direct access to the public beach. Zero Gravity beach club and The Westin Mina Seyahi\'s beach offer premium access on the same stretch.',
  },
  {
    name: 'Yacht & Boat Charters',
    category: 'Experiences',
    description:
      'Dubai Marina is the primary departure point for yacht charters in Dubai. Boats ranging from 40-foot leisure cruisers to 100-foot superyachts depart from the marina\'s multiple pontoons. Sunset cocktail cruises (2 hours), full-day Gulf charters, and private party boats all operate here. The combination of Marina skyline views and open Gulf access makes departing from here uniquely dramatic.',
  },
  {
    name: 'Pier 7',
    category: 'Dining',
    description:
      'A unique seven-storey restaurant tower moored at the edge of the marina, each floor housing a different concept: Maya Mexican Kitchen, Asia Asia, Cargo, Atelier M, Gaucho Grill, Blaze (Steakhouse), and Factory (rooftop). The escalating views from each floor make Pier 7 a memorable dining destination — and one of the marina\'s best design features.',
  },
  {
    name: 'Rooftop Bars',
    category: 'Nightlife',
    description:
      'The Marina\'s towers host some of Dubai\'s best rooftop drinking. The LXR Hoteli\'s Bar 42, Barfly by Buddha-Bar at Grosvenor House, and SKYYE Bar at Grosvenor House\'s tower offer the most established settings. JBR\'s public beach also hosts a cluster of outdoor beach bars between the hotel properties that are more casual and accessible.',
  },
  {
    name: 'Dubai Eye (Ain Dubai)',
    category: 'Landmark',
    description:
      'The world\'s largest observation wheel sits on Bluewaters Island, visible from anywhere in the Marina. A 30-minute ride in a private or standard cabin offers views across the full Marina skyline, Palm Jumeirah, and on clear days the entire Gulf coast. Bluewaters Island itself has restaurants and retail worth exploring before or after a ride.',
  },
]

export default function DubaiMarinaGuidePage() {
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
            <span className="text-cipher-white">Dubai Marina Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Area Guide
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            Dubai Marina: The Complete Neighbourhood Guide
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            Dubai Marina is the city's most social neighbourhood — a 3km artificial canal lined
            with skyscrapers, marinas full of yachts, and some of the best waterfront restaurants
            in the region. It is where residents actually live, where visitors come to feel the
            city's pulse, and where the gap between tourist destination and genuine neighbourhood
            is smallest.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=1400&auto=format&fit=crop"
              alt="Dubai Marina waterfront with illuminated skyscrapers at night"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-8 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Dubai Marina's Layout
              </h2>
              <p className="mb-4">
                Dubai Marina was built from scratch in the early 2000s — a man-made canal carved
                from the desert parallel to the Gulf shoreline. The canal runs approximately 3km
                inland from the beach, forming a J-shaped waterway ringed by some of the tallest
                residential towers in the world. The 7km Marina Walk promenade encircles the entire
                water.
              </p>
              <p className="mb-4">
                The neighbourhood connects to JBR (Jumeirah Beach Residence) by a footbridge and
                to Bluewaters Island by a pedestrian walkway across a short bridge near the marina
                mouth. The Dubai Metro Red Line serves the area via Dubai Marina, DAMAC Properties,
                and Jumeirah Lake Towers stations.
              </p>
              <p>
                Practically, the Marina is split between the northern end (where Grosvenor House,
                The Address Dubai Marina, and most major hotel properties sit) and the southern
                end which gives way to JBR's beach. Both ends are walkable from each other in
                20–25 minutes along the promenade.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                Essential Marina Experiences
              </h2>
              <div className="space-y-4">
                {marinaHighlights.map(item => (
                  <div
                    key={item.name}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6 hover:border-cipher-rim2 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-display text-xl text-cipher-white">{item.name}</h3>
                      <span className="text-xs text-cipher-gold uppercase tracking-wider shrink-0">{item.category}</span>
                    </div>
                    <p className="text-cipher-muted text-sm leading-relaxed">{item.description}</p>
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
                Where to Eat in Dubai Marina
              </h2>
              <p className="mb-4">
                The Marina Walk's restaurant selection ranges from casual all-day cafes to
                destination dining. Pier 7's seven-concept tower remains a unique architectural
                and culinary experience. Toro Toro at Grosvenor House is excellent for Latin
                American flavours and an energetic atmosphere. Indego by Vineet (the first
                Michelin-starred Indian chef's Dubai venue) at the same hotel is exceptional
                for refined Indian cuisine.
              </p>
              <p className="mb-4">
                The southern end of the Marina Walk near the cluster of JBR-facing restaurants
                has a more casual beach-adjacent vibe. Catch by Vikram Sunderam and Gaucho Grill
                represent the Marina's best steak options.
              </p>
              <p>
                For dining with the best marina view, secure a waterside table at any of the
                directly waterfront restaurants in the evening — the reflection of the towers in
                the canal at night is genuinely beautiful.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Insider Tips for Dubai Marina
              </h2>
              <ul className="space-y-3 ml-4">
                {[
                  'The Marina Dhow cruise (2–3 hours) is the most underrated way to see the skyline — far more atmospheric than dining ashore',
                  'Weekday mornings on the Marina Walk are quiet and perfect for a long breakfast or coffee with water views',
                  'JBR beach is public and free — the main beach strip between the hotel properties is excellent and less crowded than the Palm',
                  'Parking in the Marina is expensive and scarce; use the Dubai Metro or take a taxi/Careem',
                  'The Marina Mall at the northern end is smaller and less crowded than Mall of Emirates — good for quick shopping',
                  'Sunset from the Ain Dubai (Bluewaters Island) provides the best full Marina skyline photograph',
                  'The Marina\'s water taxi service connects multiple points along the canal — faster than walking and more scenic than a taxi',
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
                    What is the best area to stay in Dubai Marina?
                  </h3>
                  <p>
                    For hotels, The Address Dubai Marina and Grosvenor House are the premium options
                    at the northern end. The Address JBR offers beach access combined with Marina
                    proximity. Apartments on the Marina Walk promenade offer the best walkable access
                    to restaurants and the water.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    What is Dubai Marina Walk?
                  </h3>
                  <p>
                    The 7km waterfront promenade encircling the marina canal, lined with over 200
                    restaurants, cafes, and boutiques. At night with the towers illuminated and
                    yachts moored alongside, it is one of Dubai's great urban experiences.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Is Dubai Marina worth visiting?
                  </h3>
                  <p>
                    Yes — it is the most liveable and socially active neighbourhood in Dubai. The
                    Marina Walk, JBR beach, rooftop bars, yacht charter access, and genuine
                    street-level atmosphere make it the best base for visitors who want flexibility
                    and urban energy over pure resort isolation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Explore Dubai Marina with Our Concierge
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Yacht charters, restaurant reservations, rooftop table bookings, and curated Marina
              itineraries — our team handles every detail so you experience the best of the
              neighbourhood without the logistics.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Plan My Marina Experience
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
