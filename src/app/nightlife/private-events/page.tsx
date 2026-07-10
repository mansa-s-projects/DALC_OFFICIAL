import Image from 'next/image'
import Link from 'next/link'
import { buildNightlifeMetadata } from '@/features/nightlife/lib/metadata'

export const metadata = buildNightlifeMetadata({
  title: 'Private Events Dubai | Yacht Parties, VIP Venues & Celebrations | Dubai À La Carte',
  description:
    'Plan your perfect private event in Dubai — birthday dinners, corporate events, yacht parties, rooftop celebrations, and fully bespoke experiences for groups of any size.',
  path: '/nightlife/private-events',
  keywords: [
    'private events Dubai',
    'event planning Dubai',
    'private party Dubai',
    'yacht party Dubai',
    'birthday Dubai',
    'corporate events Dubai',
    'VIP events Dubai',
  ],
  ogImage:
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
})

const eventTypes = [
  {
    title: 'Corporate Events',
    description:
      'From product launches and client entertainment to team celebrations and board dinners, Dubai offers venues that make any corporate occasion extraordinary. DIFC private dining rooms, full venue buyouts of award-winning restaurants, and exclusive rooftop terraces with Burj Khalifa views are all available through our network.',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    details: ['Venue buyouts from 20 to 2,000 guests', 'Branded event design and AV production', 'Curated menus with renowned Dubai chefs', 'Guest logistics and VIP transfer management'],
  },
  {
    title: 'Birthday Celebrations',
    description:
      'Whether it\'s an intimate rooftop dinner for twelve or a 200-person celebration across a venue buyout, Dubai does birthdays at a scale and quality that cannot be replicated elsewhere. Private beach club cabanas, superyacht parties, and full-restaurant exclusives are our most requested formats.',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    details: ['Rooftop & skyline venue access', 'Custom cake and décor coordination', 'Entertainment: DJ, live music, performers', 'Surprise arrival experiences'],
  },
  {
    title: 'Yacht & Superyacht Parties',
    description:
      'Dubai Marina and the Palm are home to some of the most impressive private charter fleets in the world — from 50-foot leisure cruisers to 200-foot superyachts. A yacht party on the Arabian Gulf, with the Dubai skyline as backdrop and a private chef and DJ aboard, is Dubai nightlife at its most spectacular.',
    image:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
    details: ['Vessels from 50ft to 200ft+ superyachts', 'Private chef, catering & bar service', 'Onboard DJ or live music setup', 'Sunset, evening & overnight itineraries'],
  },
  {
    title: 'Venue Buyouts',
    description:
      'Exclusive use of Dubai\'s most celebrated venues — from Zuma and Coya to rooftop terraces and boutique beach clubs — is possible through our concierge relationships. Full-venue exclusivity transforms any occasion into something truly private and prestigious, with every detail tailored to your specifications.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    details: ['Access to Dubai\'s most in-demand venues', 'Exclusive use from 2 hours to full day', 'Custom menus, branding, and entertainment', 'Red-carpet arrival and guest experience management'],
  },
]

const stats = [
  { value: '500+', label: 'Events Delivered' },
  { value: '48hrs', label: 'Fastest Turnaround' },
  { value: '200+', label: 'Venue Partners' },
  { value: '24/7', label: 'Dedicated Planner' },
]

export default function PrivateEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Private Events Dubai | Yacht Parties, VIP Venues & Celebrations | Dubai À La Carte',
            description:
              'Plan your perfect private event in Dubai — birthday dinners, corporate events, yacht parties, rooftop celebrations, and fully bespoke experiences for groups of any size.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/private-events`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Nightlife',
                  item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Private Events',
                  item: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'}/nightlife/private-events`,
                },
              ],
            },
          }),
        }}
      />

      <div className="min-h-screen bg-cipher-void">
        <section className="relative h-[70vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop"
              alt="Private event Dubai rooftop celebration"
              fill
              unoptimized
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cipher-void via-cipher-void/60 to-cipher-void/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cipher-gold/8 blur-[150px] rounded-full pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-cipher-gold opacity-60" />
              <span className="text-xs tracking-[0.3em] text-cipher-gold uppercase font-body">
                Bespoke Occasions
              </span>
              <div className="h-px w-12 bg-cipher-gold opacity-60" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-cipher-white mb-6 leading-tight">
              Private Events<br />in Dubai
            </h1>
            <p className="text-cipher-muted text-lg font-body leading-relaxed max-w-2xl mx-auto mb-8">
              From intimate rooftop dinners to superyacht celebrations for 200 guests — we design
              and deliver private events that exceed every expectation, across Dubai's most
              extraordinary venues.
            </p>
            <Link
              href="/request"
              className="inline-block px-8 py-4 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-widest"
            >
              Start Planning Your Event
            </Link>
          </div>
        </section>

        <section className="py-16 border-y border-cipher-rim">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-4xl text-cipher-gold mb-1">{stat.value}</p>
                  <p className="text-cipher-muted text-sm font-body uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl text-cipher-white mb-4">
                What We Deliver
              </h2>
              <p className="text-cipher-muted font-body max-w-xl mx-auto">
                Every event format, executed with the same standard of service our concierge
                clients expect for their everyday requests.
              </p>
            </div>

            <div className="space-y-20">
              {eventTypes.map((type, i) => (
                <div
                  key={type.title}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                    i % 2 === 1 ? 'md:[&>*:first-child]:order-last' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={type.image}
                      alt={type.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cipher-void/40 to-transparent" />
                  </div>
                  <div>
                    <h3 className="font-display text-3xl text-cipher-white mb-4">{type.title}</h3>
                    <p className="text-cipher-muted font-body leading-relaxed mb-6">
                      {type.description}
                    </p>
                    <ul className="space-y-2 mb-8">
                      {type.details.map(detail => (
                        <li key={detail} className="flex items-start gap-3 text-cipher-muted font-body text-sm">
                          <span className="text-cipher-gold mt-0.5 shrink-0">—</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/request"
                      className="inline-block px-6 py-3 border border-cipher-gold text-cipher-gold font-body text-sm rounded-lg hover:bg-cipher-gold hover:text-cipher-void transition-all duration-200"
                    >
                      Enquire About {type.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-cipher-card border-y border-cipher-rim">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl text-cipher-white mb-4 text-center">
              How Our Event Planning Works
            </h2>
            <p className="text-cipher-muted font-body text-center mb-12 max-w-xl mx-auto">
              From your first message to the final guest departing, we handle every element.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Brief', desc: 'Share your vision, guest count, budget, and date. A dedicated planner responds within 2 hours.' },
                { step: '02', title: 'Proposal', desc: 'We present 2–3 curated venue and concept options, with full pricing and logistics.' },
                { step: '03', title: 'Design', desc: 'Décor, entertainment, menus, guest experience — every element developed to your approval.' },
                { step: '04', title: 'Deliver', desc: 'We manage the entire event day so you can enjoy it as a guest, not a coordinator.' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <span className="font-display text-4xl text-cipher-gold opacity-60">{item.step}</span>
                  <h3 className="font-display text-lg text-cipher-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-cipher-muted font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-12 bg-cipher-gold opacity-60" />
              <span className="text-xs tracking-[0.3em] text-cipher-gold uppercase font-body">
                Start Today
              </span>
              <div className="h-px w-12 bg-cipher-gold opacity-60" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-cipher-white mb-4">
              Ready to Plan Something Extraordinary?
            </h2>
            <p className="text-cipher-muted font-body leading-relaxed mb-8">
              Tell us about your event — even a rough idea is enough to get started. Our team
              will come back with a personalised proposal within 24 hours.
            </p>
            <Link
              href="/request"
              className="inline-block px-10 py-4 bg-cipher-gold text-cipher-void font-medium font-body rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-widest"
            >
              Request an Event Proposal
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
