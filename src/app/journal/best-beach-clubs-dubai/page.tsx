import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The 10 Best Beach Clubs in Dubai (2024) | Dubai À La Carte',
  description:
    "The definitive guide to Dubai's best beach clubs — Nikki Beach, Cove Beach, Zero Gravity, Drift Beach, and more. Insider tips on bookings, pricing, daybeds, and access.",
  keywords: [
    'best beach clubs Dubai',
    'Dubai beach clubs 2024',
    'Nikki Beach Dubai',
    'Cove Beach Dubai',
    'Zero Gravity Dubai',
    'beach club Dubai booking',
    'day pass Dubai beach club',
    'Dubai beach day',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/best-beach-clubs-dubai`,
  },
  openGraph: {
    title: 'The 10 Best Beach Clubs in Dubai (2024) | Dubai À La Carte',
    description:
      "The definitive guide to Dubai's best beach clubs — insider tips on bookings, pricing, daybeds, and access.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal/best-beach-clubs-dubai`,
    type: 'article',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai beach club',
      },
    ],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The 10 Best Beach Clubs in Dubai (2024)',
  description:
    "The definitive guide to Dubai's best beach clubs — Nikki Beach, Cove Beach, Zero Gravity, Drift Beach, and more.",
  image:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  datePublished: '2024-01-15',
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
    '@id': `${siteUrl}/journal/best-beach-clubs-dubai`,
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
      name: 'Best Beach Clubs Dubai',
      item: `${siteUrl}/journal/best-beach-clubs-dubai`,
    },
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a beach club day pass cost in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Day pass prices in Dubai beach clubs range from AED 150 at casual spots to AED 600–1,200 at premium venues like Cove Beach or Nikki Beach. Most passes come with a food and beverage minimum that you spend on the day rather than a flat entry fee.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to book a beach club daybed in advance in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — especially on Fridays, Saturdays, and public holidays. The best daybeds and cabanas at popular venues like Cove Beach, Nikki Beach, and Zero Gravity book out days in advance. Weekend daybeds at top-tier clubs should be booked at least 48–72 hours ahead. Our concierge team can secure last-minute access at sold-out venues.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the dress code at Dubai beach clubs?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Beachwear is appropriate at most Dubai beach clubs — swimwear, cover-ups, and light summer clothing. However, some clubs (particularly those inside hotels) require you to be fully covered in common indoor areas. Smart casual is the norm for evening transitions at clubs like Drift Beach. Always avoid overly revealing attire when entering or exiting the venue through hotel lobbies.',
      },
    },
  ],
}

const beachClubs = [
  {
    name: 'Cove Beach',
    location: 'Caesars Palace, Bluewaters Island',
    tier: '$$$',
    highlights:
      'Stunning views of Ain Dubai, infinity pool, curated music programming, excellent Mediterranean-influenced food menu.',
    bestFor: 'Style-conscious daytime socialising and sunset sessions',
  },
  {
    name: 'Nikki Beach',
    location: 'Pearl Jumeirah',
    tier: '$$$$',
    highlights:
      'The iconic global brand. White-draped daybeds, champagne brunches, DJ-driven atmosphere, private beachfront with Persian Gulf views.',
    bestFor: 'Luxury daybeds, celebrations, and weekend brunch vibes',
  },
  {
    name: 'Zero Gravity',
    location: 'Al Sufouh Beach (near Dubai Marina)',
    tier: '$$$',
    highlights:
      'Largest beach club footprint in Dubai. Two pools, a main stage for international DJs, stunning open-sky views. A true party destination.',
    bestFor: 'High-energy days, live DJ events, and group bookings',
  },
  {
    name: 'Drift Beach Dubai',
    location: 'One&Only Royal Mirage, Jumeirah',
    tier: '$$$$',
    highlights:
      'Understated luxury in a hotel setting. Pristine 1km private beach, elegant poolside cabanas, exceptional service. A more refined alternative to the louder clubs.',
    bestFor: 'Couples, hotel guests seeking exclusivity, quiet luxury days',
  },
  {
    name: 'Club Vista Mare',
    location: 'Palm Jumeirah (Club Vista Mare)',
    tier: '$$$',
    highlights:
      'Multiple F&B concepts under one roof. Lazy beach vibe with good pool and sea access, upscale dining options, and a lively terrace atmosphere.',
    bestFor: 'Variety seekers — mix of dining, pool, and beach in one venue',
  },
  {
    name: 'Sofitel The Palm Beach Club',
    location: 'Sofitel Dubai The Palm, Palm Jumeirah',
    tier: '$$$',
    highlights:
      'French Riviera-inspired aesthetic. Three pools, private beach, stylish food service, and impeccable hotel-grade hospitality.',
    bestFor: 'A sophisticated resort day without the full hotel price tag',
  },
  {
    name: 'JA Beach Club',
    location: 'JA Lake Hotels, Jebel Ali',
    tier: '$$',
    highlights:
      'More affordable than Palm or Marina alternatives without sacrificing quality. Large private beach, watersports, multiple pools, and excellent family facilities.',
    bestFor: 'Families, groups on a budget, and watersports enthusiasts',
  },
  {
    name: 'ShuiQi Spa & Beach',
    location: 'Atlantis The Palm, Palm Jumeirah',
    tier: '$$$$',
    highlights:
      'Access to the iconic Atlantis beach with the full resort experience behind you. Award-winning spa, luxury daybeds, and private beach sections.',
    bestFor: 'Full-day resort escapism and spa combinations',
  },
  {
    name: 'The Westin Dubai Beach',
    location: 'Westin Dubai Mina Seyahi, Al Sufouh',
    tier: '$$$',
    highlights:
      'Long private beach stretch, multiple dining options, two pools. A calmer alternative to Zero Gravity next door. Excellent for those who want quality without the loud party atmosphere.',
    bestFor: 'Relaxed beach days, couples, and business travellers unwinding',
  },
  {
    name: 'Address Beach Resort',
    location: 'JBR, Jumeirah Beach Residence',
    tier: '$$$$',
    highlights:
      "The world's highest infinity pool at 77 floors up. Combine a rooftop pool session with private beach access below. Unmatched skyline views and impeccable Address Hotels service.",
    bestFor: 'Rooftop pool views, architecture lovers, and luxury seekers',
  },
]

export default function BestBeachClubsDubaiPage() {
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
            <span className="text-cipher-white">Best Beach Clubs Dubai</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-cipher-gold uppercase font-body">
              Nightlife
            </span>
            <span className="text-cipher-dim text-xs font-body">· Updated 2024</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-cipher-white leading-tight mb-6">
            The 10 Best Beach Clubs in Dubai (2024)
          </h1>

          <p className="text-xl text-cipher-muted font-body leading-relaxed mb-8 border-l-2 border-cipher-gold pl-4">
            Dubai has elevated the beach club to an art form. From champagne-soaked daybeds on the
            Palm to infinity pools suspended above the Arabian Gulf, these are the venues that define
            the city's daytime social scene — and they fill up fast.
          </p>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop"
              alt="Dubai beach club with turquoise water and luxury daybeds"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-8 text-cipher-muted font-body leading-relaxed">
            <div>
              <h2 className="font-display text-3xl text-cipher-white mb-4">
                What to Look for in a Dubai Beach Club
              </h2>
              <p className="mb-4">
                Not all beach clubs are equal. Before booking, consider these key factors:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  'Minimum spend vs. door entry fee — most top clubs use a food-and-beverage minimum',
                  'Daybed vs. sunlounger vs. cabana — the difference can be AED 200–2,000 in minimum spend',
                  'Music policy — some clubs are calm and ambient, others host international DJs',
                  'Pool access vs. beach access — confirm both are included in your pass',
                  'Timing — morning arrivals get first choice of loungers; afternoon arrivals often find the best spots gone',
                ].map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cipher-gold mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                The 10 Best Beach Clubs in Dubai
              </h2>

              {beachClubs.map((club, i) => (
                <div
                  key={club.name}
                  className="bg-cipher-card border border-cipher-rim rounded-xl p-6 hover:border-cipher-rim2 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cipher-gold-trace border border-cipher-gold-dim flex items-center justify-center text-cipher-gold text-sm font-display shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-display text-xl text-cipher-white">{club.name}</h3>
                    </div>
                    <span className="text-cipher-gold text-sm font-mono shrink-0">{club.tier}</span>
                  </div>
                  <p className="text-cipher-dim text-sm mb-3 font-body">{club.location}</p>
                  <p className="text-cipher-muted mb-3">{club.highlights}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cipher-gold uppercase tracking-wider">Best for:</span>
                    <span className="text-xs text-cipher-muted">{club.bestFor}</span>
                  </div>
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

            <div className="border-t border-cipher-rim pt-8">
              <h2 className="font-display text-3xl text-cipher-white mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    How much does a beach club day pass cost in Dubai?
                  </h3>
                  <p>
                    Day pass prices range from AED 150 at casual spots to AED 600–1,200 at premium
                    venues like Cove Beach or Nikki Beach. Most passes come as a food and beverage
                    minimum — you spend the amount on food and drinks during your visit rather than
                    paying a flat door entry fee.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    Do I need to book a beach club daybed in advance?
                  </h3>
                  <p>
                    Yes — especially on Fridays, Saturdays, and public holidays. The best daybeds
                    and cabanas at popular venues book out days in advance. Weekend daybeds at
                    top-tier clubs should be reserved at least 48–72 hours ahead. Our concierge team
                    can secure last-minute access at sold-out venues.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg text-cipher-white mb-2">
                    What is the dress code at Dubai beach clubs?
                  </h3>
                  <p>
                    Beachwear is appropriate poolside and on the beach — swimwear, cover-ups, and
                    light summer clothing. Some clubs require you to be fully covered in indoor hotel
                    areas. Smart casual applies for evening transitions. Always avoid overly
                    revealing attire when entering through hotel lobbies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-cipher-card2 border border-cipher-rim rounded-xl text-center">
            <p className="font-display text-2xl text-cipher-white mb-2">
              Need VIP Access? We Handle Everything.
            </p>
            <p className="text-cipher-muted font-body mb-6">
              Our concierge team secures daybeds, cabanas, and VIP tables at sold-out venues — even
              on the same day. No stress, no waitlists.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity"
            >
              Request Beach Club Access
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
