import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dubai Desert Safari: The Complete Guide (2024) | Dubai À La Carte',
  description:
    'Plan the perfect desert safari in Dubai — private vs shared tours, best operators, timing, dune bashing, camel riding, Bedouin camps, and what to pack.',
  keywords: [
    'Dubai desert safari',
    'desert safari Dubai guide',
    'private desert safari Dubai',
    'dune bashing Dubai',
    'Bedouin camp Dubai',
    'camel riding Dubai',
    'Dubai safari 2024',
    'best desert safari Dubai',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-desert-safari-guide`,
  },
  openGraph: {
    title: 'Dubai Desert Safari: The Complete Guide (2024) | Dubai À La Carte',
    description:
      'Plan the perfect desert safari in Dubai — private tours, dune bashing, Bedouin camps, and expert timing tips.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/dubai-desert-safari-guide`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai desert safari dunes at sunset',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dubai Desert Safari: The Complete Guide (2024)',
  description:
    'Plan the perfect desert safari in Dubai — private vs shared tours, best operators, timing, dune bashing, camel riding, and Bedouin camps.',
  image:
    'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-02-10',
  dateModified: '2024-11-15',
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
    '@id': `${siteUrl}/journal/dubai-desert-safari-guide`,
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
      name: 'Dubai Desert Safari Guide',
      item: `${siteUrl}/journal/dubai-desert-safari-guide`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best time of year for a desert safari in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'October to April offers the most comfortable temperatures for a desert safari in Dubai, with daytime highs of 20–30°C. Summer safaris (June–August) run but can be extreme, with midday temperatures exceeding 45°C. Evening safaris are viable year-round as temperatures drop significantly after sunset.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a private desert safari cost in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Private desert safaris in Dubai range from AED 800–2,500 per vehicle (4–6 passengers), depending on duration, operator quality, and inclusions. Shared group safaris cost AED 150–350 per person. Premium overnight experiences with luxury camp accommodations can reach AED 1,500–4,000 per couple.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I wear on a desert safari in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wear light, loose, breathable clothing that covers shoulders and knees — respectful of local customs and protective against sand. Closed-toe shoes or sandals that can handle sand are ideal. Bring a light jacket or layer for evening camps as desert temperatures drop sharply after sunset.',
      },
    },
  ],
}

const safariTypes = [
  {
    name: 'Evening Desert Safari',
    duration: '6–7 hours (3:30pm–10pm)',
    price: 'AED 150–350 per person (shared) / AED 800–1,500 per vehicle (private)',
    includes: 'Dune bashing, camel ride, sandboarding, Bedouin camp dinner, cultural show',
    bestFor: 'First-time visitors, families, groups wanting the classic experience',
  },
  {
    name: 'Morning Desert Safari',
    duration: '4–5 hours (6am–11am)',
    price: 'AED 120–250 per person',
    includes: 'Sandboarding, camel ride, quad biking, light breakfast at camp',
    bestFor: 'Those avoiding the evening heat, photography enthusiasts (golden hour light)',
  },
  {
    name: 'Overnight Desert Safari',
    duration: '18+ hours (3:30pm next day 8am)',
    price: 'AED 500–800 per person (shared) / AED 2,000–4,000 per couple (luxury)',
    includes: 'Full evening program + sleeping in traditional or luxury tent + sunrise breakfast',
    bestFor: 'Couples, deep cultural immersion, once-in-a-lifetime experience',
  },
  {
    name: 'Private Full-Day Safari',
    duration: '8–10 hours (flexible)',
    price: 'AED 1,500–3,000 per vehicle',
    includes: 'Personalised itinerary, falconry, fossil hunting, Al Maha or Bab Al Shams options',
    bestFor: 'Luxury seekers, photography tours, families with young children',
  },
]

export default function DubaiDesertSafariGuidePage() {
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
            <span className="text-cipher-white">Desert Safari Guide</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Experiences
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            Dubai Desert Safari: The Complete Guide
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            The Arabian desert stretches beyond Dubai's glittering skyline into one of the world's
            most dramatic landscapes. A desert safari is not merely a tourist excursion — done right,
            it is a visceral encounter with the terrain that shaped this civilisation, best
            experienced with the right operator at the right time of day.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1400&auto=format&fit=crop"
              alt="Golden dunes of the Arabian desert at sunset near Dubai"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-8 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Which Desert Do Dubai Safaris Visit?
              </h2>
              <p className="mb-4">
                Most Dubai desert safaris operate in the Dubai Desert Conservation Reserve (DDCR)
                — a 225km² protected wilderness located approximately 45 minutes from Downtown Dubai.
                The reserve is home to indigenous Arabian oryx, gazelles, and rare plant species.
                Premium operators also run safaris in the Liwa Oasis in Abu Dhabi, home to the
                Rub' al Khali (the Empty Quarter) — the largest continuous sand desert in the world,
                and worth the 3-hour drive for serious adventurers.
              </p>
              <p>
                The DDCR's dunes reach heights of 100–120 metres, providing the signature backdrop
                for dune bashing and the photography-worthy golden-hour shots that define the
                classic Dubai desert experience.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                Types of Desert Safari
              </h2>
              <div className="space-y-4">
                {safariTypes.map(type => (
                  <div
                    key={type.name}
                    className="bg-cipher-card border border-cipher-rim rounded-xl p-6 hover:border-cipher-rim2 transition-colors duration-200"
                  >
                    <h3 className="font-display text-xl text-cipher-white mb-2">{type.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-xs text-cipher-gold uppercase tracking-wider">Duration</span>
                        <p className="text-sm text-cipher-muted mt-1">{type.duration}</p>
                      </div>
                      <div>
                        <span className="text-xs text-cipher-gold uppercase tracking-wider">Price</span>
                        <p className="text-sm text-cipher-muted mt-1">{type.price}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-cipher-gold uppercase tracking-wider">Includes</span>
                      <p className="text-sm text-cipher-muted mt-1">{type.includes}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cipher-gold uppercase tracking-wider">Best for:</span>
                      <span className="text-xs text-cipher-muted">{type.bestFor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                Private vs. Shared Safaris: Which Is Right for You?
              </h2>
              <p className="mb-4">
                Shared group safaris are popular and cost-effective, consolidating 15–30 guests into
                convoys of 4x4 vehicles. They follow fixed schedules and standard itineraries.
                The experience is social, guided, and efficient — but not personalised.
              </p>
              <p className="mb-4">
                Private safaris give you full control over timing, pace, and activities. Your
                driver-guide focuses exclusively on your group, stops for photography as long as you
                need, adjusts the route based on your preferences, and can arrange exclusive
                add-ons like falconry demonstrations or gourmet dining under the stars rather than
                buffet camp meals.
              </p>
              <p>
                For families with young children, couples celebrating an occasion, or guests who
                want an authentic rather than touristic experience, private is always the better
                choice. The price differential — roughly 3–5× more per person — is justified by
                the quality of access and experience.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                What Happens on a Desert Safari
              </h2>
              <ul className="space-y-3 ml-4">
                {[
                  'Hotel pickup in a 4x4 Land Cruiser, typically around 3:00–3:30pm for evening safaris',
                  'Drive to the desert conservation area (approximately 45 minutes)',
                  'Tyre deflation at the desert entrance for optimal dune performance',
                  'Dune bashing — the 4x4 climbs and descends steep dunes at high speed for 45–60 minutes',
                  'Sunset stop at a prominent dune for photography (the most important 20 minutes)',
                  'Camel riding at the camp entrance — traditional photo opportunity',
                  'Bedouin camp arrival: henna art, traditional dress, shisha, Arabic coffee and dates',
                  'Sandboarding on the dunes adjacent to camp',
                  'Buffet dinner with grilled meats, salads, and traditional Arabic mezze',
                  'Cultural entertainment: Tanoura spinning dance, belly dancing, fire show',
                  'Return transfer, arriving at your hotel around 9:30–10pm',
                ].map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                When to Go: Timing Your Desert Safari
              </h2>
              <p className="mb-4">
                <strong className="text-cipher-white">October–April</strong> is peak season.
                Temperatures are ideal: 20–30°C during the day, dropping to 10–18°C after sunset.
                The golden-hour light in November and February is particularly extraordinary for
                photography.
              </p>
              <p className="mb-4">
                <strong className="text-cipher-white">May–September</strong> brings intense heat.
                Morning safaris start at 6am before temperatures peak. Evening safaris remain
                popular despite the heat — the desert at dusk in summer has its own moody,
                shimmering quality — but be prepared for 35–40°C at camp if you visit June–August.
              </p>
              <p>
                Avoid Fridays and Saturdays during peak season if you want fewer crowds at camp,
                or book a private safari which eliminates this concern entirely.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                What to Pack
              </h2>
              <ul className="space-y-2 ml-4">
                {[
                  'Light, loose clothing covering shoulders and knees (respectful of culture, protective against sand)',
                  'Closed-toe shoes — sand gets into open sandals during dune activities',
                  'Light jacket or shawl for evening (desert temperatures drop 10–15°C after sunset)',
                  'Sunscreen SPF 50+, lip balm, and UV sunglasses',
                  'Camera or phone fully charged — the golden-hour light is remarkable',
                  'Small cash for optional tips for your guide and camp entertainers (AED 20–50 is appropriate)',
                  'Medications if prone to motion sickness — dune bashing is intense',
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
                    What is the best time of year for a desert safari in Dubai?
                  </h3>
                  <p>
                    October to April offers the most comfortable temperatures, with daytime highs of
                    20–30°C. Evening safaris are viable year-round as desert temperatures drop
                    significantly after sunset, but summer midday heat (June–August) is extreme.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How much does a private desert safari cost in Dubai?
                  </h3>
                  <p>
                    Private safaris range from AED 800–2,500 per vehicle (4–6 passengers), depending
                    on duration and inclusions. Shared group safaris cost AED 150–350 per person.
                    Luxury overnight camp experiences can reach AED 1,500–4,000 per couple.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    What should I wear on a desert safari?
                  </h3>
                  <p>
                    Light, loose, breathable clothing covering shoulders and knees. Closed-toe
                    shoes or sandals that can handle sand. Bring a light jacket or layer as desert
                    temperatures drop sharply after sunset.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Book a Private Desert Safari
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Our concierge team arranges exclusive private safari experiences — custom itineraries,
              gourmet desert dining, and premium operators trusted by Dubai's most discerning guests.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Request a Private Safari
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
