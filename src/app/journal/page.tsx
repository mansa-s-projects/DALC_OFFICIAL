import type { Metadata } from 'next'
import CategoryFilter from './CategoryFilter'

export const metadata: Metadata = {
  title: 'Dubai Lifestyle Journal | Expert Guides & Insider Insights',
  description:
    'Expert guides on Dubai nightlife, luxury experiences, beach clubs, relocation, business setup, and more. Curated by Dubai À La Carte concierge team.',
  keywords: [
    'Dubai guide',
    'Dubai lifestyle',
    'Dubai insider guide',
    'Dubai tips',
    'luxury Dubai',
    'Dubai expat guide',
    'Dubai experiences guide',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal`,
  },
  openGraph: {
    title: 'Dubai Lifestyle Journal | Dubai À La Carte',
    description:
      'Expert guides on Dubai nightlife, luxury experiences, beach clubs, relocation, and more.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal`,
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Dubai skyline',
      },
    ],
  },
}

const articles = [
  {
    slug: 'best-beach-clubs-dubai',
    category: 'Nightlife',
    title: 'The 10 Best Beach Clubs in Dubai (2024)',
    excerpt:
      "From Nikki Beach to Cove Beach — the definitive guide to Dubai's most exclusive beach club scene, with insider tips on bookings, pricing, and what to expect.",
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    href: '/journal/best-beach-clubs-dubai',
  },
  {
    slug: 'dubai-desert-safari-guide',
    category: 'Experiences',
    title: 'Dubai Desert Safari: The Complete Guide',
    excerpt:
      'Everything you need to know about planning the perfect desert safari — private tours vs shared, best operators, timing, and what to bring.',
    image:
      'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=800&auto=format&fit=crop',
    href: '/journal/dubai-desert-safari-guide',
  },
  {
    slug: 'move-to-dubai-guide',
    category: 'Relocation',
    title: 'How to Move to Dubai: The Complete Expat Guide (2024)',
    excerpt:
      'Visa requirements, company setup, property search, schools, banking, and healthcare — everything you need to relocate to Dubai successfully.',
    image:
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
    href: '/journal/move-to-dubai-guide',
  },
  {
    slug: 'dubai-golden-visa-guide',
    category: 'Services',
    title: 'UAE Golden Visa: Complete Guide to the 10-Year Residency',
    excerpt:
      "Who qualifies, how to apply, the investment requirements, processing times, and why the UAE Golden Visa is the world's most sought-after long-term residency.",
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    href: '/journal/dubai-golden-visa-guide',
  },
  {
    slug: 'private-yacht-charter-dubai',
    category: 'Experiences',
    title: 'Private Yacht Charter in Dubai: Everything You Need to Know',
    excerpt:
      'Sunset cruises, full-day charters, party boats, and luxury superyachts — how to choose the right yacht, what it costs, and how to book.',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    href: '/journal/private-yacht-charter-dubai',
  },
  {
    slug: 'downtown-dubai-guide',
    category: 'Area Guide',
    title: 'Downtown Dubai: The Complete Area Guide',
    excerpt:
      "Burj Khalifa views, The Dubai Mall, fine dining, rooftop bars, and hidden gems — a local's guide to making the most of Downtown Dubai.",
    image:
      'https://images.unsplash.com/photo-1534571638-e00c46e7d0f2?q=80&w=800&auto=format&fit=crop',
    href: '/journal/downtown-dubai-guide',
  },
  {
    slug: 'palm-jumeirah-guide',
    category: 'Area Guide',
    title: 'Palm Jumeirah: The Insider Guide to Dubai\'s Iconic Island',
    excerpt:
      'Five-star hotels, private beach clubs, waterfront dining, and residential secrets — the complete guide to living and visiting the Palm.',
    image:
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=800&auto=format&fit=crop',
    href: '/journal/palm-jumeirah-guide',
  },
  {
    slug: 'dubai-marina-guide',
    category: 'Area Guide',
    title: 'Dubai Marina: The Complete Neighbourhood Guide',
    excerpt:
      "Waterfront dining, rooftop bars, marina walks, and yacht clubs — everything you need to know about Dubai's most vibrant waterfront district.",
    image:
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=800&auto=format&fit=crop',
    href: '/journal/dubai-marina-guide',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Dubai À La Carte Journal',
  description:
    'Expert guides, area insights, and insider knowledge for the ultimate Dubai lifestyle.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/journal`,
  publisher: {
    '@type': 'Organization',
    name: 'Dubai À La Carte',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com',
  },
}

export default function JournalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-cipher-void pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-cipher-gold opacity-60" />
              <span className="text-xs tracking-[0.3em] text-cipher-gold uppercase font-body">
                Editorial
              </span>
              <div className="h-px w-16 bg-cipher-gold opacity-60" />
            </div>
            <h1 className="font-display text-6xl md:text-7xl text-cipher-white mb-4 leading-none">
              The Journal
            </h1>
            <p className="text-cipher-muted text-lg font-body max-w-xl mx-auto leading-relaxed">
              Insider knowledge for life in Dubai — curated by our concierge team
            </p>
          </div>

          <CategoryFilter articles={articles} />
        </div>
      </main>
    </>
  )
}
