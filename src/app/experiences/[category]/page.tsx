import type { Metadata } from 'next';
import SubcategoryList from '@/features/experiences/pages/SubcategoryList';
import { getExperienceCategory } from '@/features/experiences/catalog';

const CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  'desert-adventures': {
    title: 'Desert Adventures Dubai | Dune Buggies, ATVs & Safari | Dubai À La Carte',
    description: 'Book desert adventures in Dubai — dune buggies, quad bikes, desert safaris and camel rides in the Lahbab Red Sand Dunes. From AED 160.',
    keywords: ['desert adventures dubai', 'dune buggy dubai', 'quad biking dubai', 'desert safari dubai', 'camel riding dubai'],
  },
  'water-activities': {
    title: 'Water Activities Dubai | Jet Ski, Flyboard & Water Sports | Dubai À La Carte',
    description: 'Book water sports in Dubai — jet skis, flyboarding, wakeboarding, scuba diving and parasailing along the JBR coastline. From AED 250.',
    keywords: ['water activities dubai', 'jet ski dubai', 'flyboard dubai', 'water sports dubai', 'wakeboarding dubai'],
  },
  'yacht-charter': {
    title: 'Yacht Charter Dubai | Private Luxury Cruises from AED 650/hr | Dubai À La Carte',
    description: 'Private yacht charters in Dubai from 45ft to 120ft. Sunset cruises, party yachts, fishing trips and luxury charters from Dubai Marina. Instant booking.',
    keywords: ['yacht charter dubai', 'private yacht dubai', 'luxury yacht dubai', 'sunset cruise dubai', 'boat hire dubai'],
  },
  'aerial-and-adrenaline': {
    title: 'Skydiving, Helicopter Tours & Adrenaline Experiences Dubai | Dubai À La Carte',
    description: 'Skydive over Palm Jumeirah, take a helicopter tour of Downtown Dubai, or conquer the world\'s longest zipline in Jebel Jais. From AED 220.',
    keywords: ['skydiving dubai', 'helicopter tour dubai', 'zipline dubai', 'hot air balloon dubai', 'seaplane dubai'],
  },
  entertainment: {
    title: 'Theme Parks & Entertainment Dubai | Aquaventure, IMG Worlds & More | Dubai À La Carte',
    description: 'Book tickets to Dubai\'s world-class theme parks and attractions — Aquaventure, IMG Worlds, Museum of the Future, Global Village and more.',
    keywords: ['theme parks dubai', 'aquaventure dubai', 'img worlds dubai', 'museum of the future', 'global village dubai'],
  },
  wellness: {
    title: 'Luxury Spa & Wellness Dubai | 5-Star Treatments & Beach Clubs | Dubai À La Carte',
    description: 'Luxury spa treatments, beach club day passes and wellness experiences at Dubai\'s finest 5-star resorts. Book online from AED 551.',
    keywords: ['luxury spa dubai', 'beach club dubai', 'wellness dubai', 'spa day dubai', 'hammam dubai'],
  },
  'abu-dhabi-tours': {
    title: 'Abu Dhabi Day Tours from Dubai | Sheikh Zayed Mosque, Ferrari World | Dubai À La Carte',
    description: 'Private guided day tours from Dubai to Abu Dhabi — Sheikh Zayed Grand Mosque, Ferrari World, Warner Bros. and city tours. From AED 63.',
    keywords: ['abu dhabi tour from dubai', 'sheikh zayed mosque tour', 'ferrari world abu dhabi', 'abu dhabi day trip', 'warner bros world abu dhabi'],
  },
  'oman-tours': {
    title: 'Oman Day Trips from Dubai | Musandam Fjords, Dolphin Watching | Dubai À La Carte',
    description: 'Guided day trips from Dubai to Oman\'s Musandam fjords — dolphin watching, snorkelling, boat cruises and mountain adventures. From AED 450.',
    keywords: ['musandam day trip dubai', 'oman tour from dubai', 'khasab tour', 'musandam cruise', 'dolphin watching oman'],
  },
  'tickets-and-culture': {
    title: 'Dubai Culture, Heritage Tours & Attractions | Dubai À La Carte',
    description: 'Curated cultural experiences across the UAE — guided historic tours, archaeological sites, art galleries and iconic landmarks. From AED 70.',
    keywords: ['dubai culture tours', 'heritage tour dubai', 'cultural experience dubai', 'al fahidi dubai', 'uae archaeological sites'],
  },
  'luxury-leisure': {
    title: 'Supercars, Beach Clubs & Luxury Lifestyle Dubai | Dubai À La Carte',
    description: 'Dubai\'s premium lifestyle experiences — Lamborghinis, Ferraris, beach club access and exclusive day passes for the ultimate luxury day.',
    keywords: ['supercar rental dubai', 'luxury lifestyle dubai', 'beach club dubai', 'exotic car dubai', 'vip dubai experience'],
  },
  'photography-experience': {
    title: 'Desert Photoshoot Dubai | Dress Photography with Horses & Camels | Dubai À La Carte',
    description: 'Couture dress photoshoots in the Dubai desert and stud farm with horses, camels and falcons. Solo, couple and group bookings from AED 1,650.',
    keywords: ['desert photoshoot dubai', 'flying dress dubai', 'photography experience dubai', 'horse photoshoot dubai', 'desert photography dubai'],
  },
  'signature-dining': {
    title: 'Private Dining Experiences Dubai | Sky Dining & Desert Dinners | Dubai À La Carte',
    description: 'Exclusive dining experiences in Dubai — Dinner in the Sky at 50m, private desert dinners, dhow cruise dinners and ember-grilled gourmet meals.',
    keywords: ['private dinner dubai', 'dinner in the sky dubai', 'desert dinner dubai', 'dhow cruise dinner', 'gourmet dining dubai'],
  },
  observation: {
    title: 'Dubai Viewpoints & Observatories | Sky Views, Desert Lakes & Hidden Gems | Dubai À La Carte',
    description: 'Dubai\'s most spectacular viewpoints — Sky Views Observatory, desert lakes, Jebel Jais mountain drives and the UAE\'s best-kept secrets.',
    keywords: ['dubai observatory', 'sky views dubai', 'al qudra lakes', 'hatta dam', 'best views dubai'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  const cat = getExperienceCategory(category);

  const title = seo?.title ?? `${cat?.title ?? 'Experiences'} Dubai | Dubai À La Carte`;
  const description = seo?.description ?? cat?.description ?? 'Curated luxury experiences in Dubai. Book online with Dubai À La Carte.';
  const keywords = seo?.keywords ?? ['dubai experiences', 'luxury dubai', 'book dubai activities'];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://dubaialacharte.com/experiences/${category}` },
    openGraph: {
      title,
      description,
      url: `https://dubaialacharte.com/experiences/${category}`,
      siteName: 'Dubai À La Carte',
      type: 'website',
    },
  };
}

export default async function ExperiencesCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo?.title ?? `${category} Dubai`,
    description: seo?.description ?? '',
    url: `https://dubaialacharte.com/experiences/${category}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dubaialacharte.com' },
        { '@type': 'ListItem', position: 2, name: 'Experiences', item: 'https://dubaialacharte.com/experiences' },
        { '@type': 'ListItem', position: 3, name: seo?.title?.split('|')[0]?.trim() ?? category, item: `https://dubaialacharte.com/experiences/${category}` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubcategoryList params={params} />
    </>
  );
}
