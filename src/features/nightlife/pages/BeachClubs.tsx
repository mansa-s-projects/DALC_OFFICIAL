"use client";

import React, { useState, useCallback } from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Waves, Clock, ChevronDown, Navigation2, BookOpen, Sparkles, Sun, Music } from 'lucide-react';

interface BeachClub {
  id: string;
  name: string;
  folder: string;
  image: string;
  location: string;
  area: string;
  vibe: string;
  price_tier: number;
  tagline: string;
  description: string;
  highlights: string[];
  hours: string;
  dress_code: string;
  best_for: string;
  map_query: string;
  trending?: boolean;
  featured?: boolean;
  has_secondary_image?: boolean;
}

const BEACH_CLUBS: BeachClub[] = [
  {
    id: '1', name: 'Nikki Beach', folder: 'Nikki_Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', location: 'Pearl Jumeirah', area: 'Jumeirah',
    vibe: 'Iconic', price_tier: 4,
    tagline: 'The world\'s most famous beach club comes to Dubai',
    description: 'The globally celebrated Nikki Beach brand brings its legendary formula of sun, sand, and sophisticated socialising to Pearl Jumeirah. With a white-on-white aesthetic, world-class DJ programming, and a menu that spans from morning yoga brunches to sunset cocktail sessions, Nikki Beach Dubai is pure escapism.',
    highlights: ['☀️ Iconic White-on-white aesthetic', '🎵 World-class DJ programming', '🥂 All-day champagne service', '🌊 Direct Pearl Jumeirah beachfront'],
    hours: '9am – 12am', dress_code: 'Beach Chic', best_for: 'Full-day beach luxury, parties',
    map_query: 'Nikki Beach Dubai Pearl Jumeirah', featured: true, trending: true,
  },
  {
    id: '2', name: 'Drift Beach', folder: 'Drift_Beach', image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?q=80&w=1200&auto=format&fit=crop', location: 'One&Only Royal Mirage', area: 'Dubai Marina',
    vibe: 'Chilled Luxury', price_tier: 4,
    tagline: 'One&Only\'s barefoot luxury on the Arabian Gulf',
    description: 'Drift Beach at the One&Only Royal Mirage is where barefoot luxury meets the golden sands of Dubai Marina. Private cabanas, butler-served cocktails, and a menu crafted with resort-level care — this is the art of doing nothing in extreme style.',
    highlights: ['🏖️ Private beachfront cabanas', '🍹 Butler cocktail service', '🌅 World-class sunset views', '🏊 Exclusive pool access'],
    hours: '10am – 8pm', dress_code: 'Beach Elegant', best_for: 'Quiet luxury, couples',
    map_query: 'Drift Beach One Only Royal Mirage Dubai', featured: true,
  },
  {
    id: '3', name: 'Gigi', folder: 'Gigi', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', location: 'SLS Dubai Hotel', area: 'Business Bay',
    vibe: 'Italian Riviera', price_tier: 3,
    tagline: 'La dolce vita meets Dubai\'s skyline',
    description: 'GIGI brings the dolce vita of the Italian Riviera to the heart of Business Bay. Perched above SLS Dubai with extraordinary Burj Khalifa views, Gigi\'s signature blue-and-white Riviera aesthetic, fresh Italian food, and all-day DJ sessions make it one of Dubai\'s most Instagram-worthy escapes.',
    highlights: ['🇮🇹 Italian Riviera aesthetic', '🏙️ Burj Khalifa panoramic views', '🎵 All-day DJ sessions', '🍋 Fresh Italian-inspired menu'],
    hours: '10am – 2am', dress_code: 'Riviera Chic', best_for: 'Instagram moments, social crowd',
    map_query: 'Gigi Rigatoni Dubai SLS Hotel', trending: true,
  },
  {
    id: '4', name: 'Gitano', folder: 'Gitano', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop', location: 'Four Seasons Resort', area: 'Jumeirah',
    vibe: 'Bohemian Garden', price_tier: 4,
    tagline: 'Tulum\'s jungle magic reimagined in Dubai',
    description: 'Gitano transports the mystical bohemian energy of Tulum\'s jungle to the Four Seasons Resort Jumeirah. Lush tropical foliage, hand-carved wooden bars, mezcal rituals, and a menu celebrating Mexican soul food — all under the Dubai sun.',
    highlights: ['🌿 Lush jungle-garden setting', '🦋 Mezcal & cocktail rituals', '🌮 Mexican soul food menu', '🎵 Tribal DJ soundtrack'],
    hours: '12pm – 2am', dress_code: 'Boho Chic', best_for: 'Alternative crowd, bohemian vibes',
    map_query: 'Gitano Dubai Four Seasons Jumeirah', featured: true,
  },
  {
    id: '5', name: 'Terra Solis', folder: 'Terra_Solis', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop', location: 'Jebel Ali Desert', area: 'Jebel Ali',
    vibe: 'Desert Festival', price_tier: 3,
    tagline: 'Where the desert becomes a beach club',
    description: 'Terra Solis is unlike anything else in Dubai — a Burning Man-inspired desert destination in Jebel Ali where art installations, pool parties, and electronic music collide under an open desert sky. It\'s not just a beach club; it\'s an experience for the soul.',
    highlights: ['🏜️ Desert art installation landscape', '🎆 Electronic music festivals', '🌌 Stargazing pool parties', '🎭 Boutique glamping available'],
    hours: '12pm – 3am (event nights)', dress_code: 'Festival / Creative', best_for: 'Festival lovers, alternative crowd',
    map_query: 'Terra Solis Dubai Jebel Ali', trending: true,
  },
  {
    id: '6', name: 'Verde Beach', folder: 'Verde_Beach', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop', location: 'Eden The Palm', area: 'Palm Jumeirah',
    vibe: 'Organic Oasis', price_tier: 3,
    tagline: 'Sustainable luxury on Palm Jumeirah\'s shore',
    description: 'Verde Beach brings its signature organic philosophy to the Palm — a sun-drenched escape where sustainability meets luxury. Fresh cold-pressed juices, whole-food beach bites, and a zero-waste ethos delivered in a setting of breathtaking natural beauty.',
    highlights: ['🌿 Eco-luxury philosophy', '🥤 Cold-pressed juice programs', '🌊 Palm Jumeirah beachfront', '🧘 Yoga & wellness sessions'],
    hours: '10am – 10pm', dress_code: 'Natural Chic', best_for: 'Wellness crowd, healthy living',
    map_query: 'Verde Beach Palm Jumeirah Dubai',
  },
  {
    id: '7', name: 'Baoli', folder: 'Baoli', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', location: 'Caesars Palace Bluewaters', area: 'Bluewaters Island',
    vibe: 'Mediterranean Luxe', price_tier: 4,
    tagline: 'Cannes comes to Bluewaters Island',
    description: 'Baoli arrives in Dubai from its legendary Cannes location, bringing the Côte d\'Azur glamour that made it famous worldwide. At Caesars Palace Bluewaters, that legendary Mediterranean formula — sunbeds, rosé, DJ sets, and impeccable service — delivers the ultimate daylight fantasy.',
    highlights: ['🇫🇷 Direct from Cannes original', '🥂 Rosé & champagne all day', '🎵 International DJs residency', '🌊 Bluewaters Island waterfront'],
    hours: '10am – 2am', dress_code: 'St. Tropez Chic', best_for: 'Glamour crowd, party afternoons',
    map_query: 'Baoli Dubai Caesars Palace Bluewaters', featured: true, trending: true,
  },
  {
    id: '8', name: 'Kyma', folder: 'Kyma', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop', location: 'W Dubai - The Palm', area: 'Palm Jumeirah',
    vibe: 'Greek Island', price_tier: 3,
    tagline: 'Mykonos energy on the Palm',
    description: 'Kyma channels the white-washed cliffs and azure waters of Mykonos at W Dubai - The Palm. Expect a menu packed with fresh Greek mezze, chargrilled seafood, and ouzo-based cocktails — all consumed to the soundtrack of Cycladic-inspired DJ sets.',
    highlights: ['🏛️ Mykonos-inspired design', '🦞 Fresh Greek seafood daily', '🥗 Authentic mezze selections', '🎵 Greek Island DJ programming'],
    hours: '11am – 11pm', dress_code: 'Mediterranean Chic', best_for: 'Greek food lovers, daytime parties',
    map_query: 'Kyma Beach Club W Dubai The Palm',
  },
  {
    id: '9', name: 'Nobu by the Beach', folder: 'Nobu_by_the_beach', image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop', location: 'Atlantis The Palm', area: 'Palm Jumeirah',
    vibe: 'Culinary Beach', price_tier: 4,
    tagline: 'Nobu\'s legendary cuisine, toes in the sand',
    description: 'Nobu by the Beach brings Chef Matsuhisa\'s world-famous Japanese-Peruvian cuisine from glittering dining room to the beachfront. Imagine sipping on yuzu cocktails and eating black cod miso with the Arabian Gulf at your feet — an entirely different way to experience a Michelin-pedigree kitchen.',
    highlights: ['⭐ Michelin-pedigree beach dining', '🐟 Black Cod Miso on the sand', '🌊 Atlantis private beachfront', '🍹 Yuzu & Japanese cocktails'],
    hours: '11am – 9pm', dress_code: 'Smart Beach', best_for: 'Culinary beach experiences',
    map_query: 'Nobu by the Beach Atlantis Dubai', trending: true,
  },
  {
    id: '10', name: 'Maison de la Plage', folder: 'Maison_De_La_Plage', image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?q=80&w=1200&auto=format&fit=crop', location: 'One&Only One Za\'abeel', area: 'Za\'abeel',
    vibe: 'French Couture', price_tier: 4,
    tagline: 'A French maison at Dubai\'s most futuristic address',
    description: 'Maison de la Plage redefines what a beach club can be at One&Only One Za\'abeel — Dubai\'s most architecturally daring hotel. French Riviera cuisine, Hermès-level attention to detail, and views across the city skyline make this the epitome of couture beach culture.',
    highlights: ['🏛️ One&Only One Za\'abeel address', '🇫🇷 French Riviera cuisine', '🌆 City skyline panorama', '🥐 Artisan pastry & brunch'],
    hours: '7am – 12am', dress_code: 'Haute Beach', best_for: 'Ultimate luxury seekers',
    map_query: 'Maison de la Plage One Za\'abeel Dubai', featured: true,
  },
  {
    id: '11', name: 'Lucky Fish', folder: 'Lucky_Fish', image: 'https://images.unsplash.com/photo-1560184611-ff3e53f00e8f?q=80&w=1200&auto=format&fit=crop', location: 'Bluewaters Island', area: 'Bluewaters Island',
    vibe: 'Maximalist', price_tier: 3,
    tagline: 'Dubai\'s most colourful beach party',
    description: 'Lucky Fish is Bluewaters Island\'s most exuberant party-beach destination. Think maximalist décor bursting with colour, a menu of fresh seafood served with abandon, and a party atmosphere that cranks up as the sun goes down over the Dubai Eye.',
    highlights: ['🌈 Maximalist colourful décor', '🐠 Fresh seafood at its finest', '🎡 Dubai Eye backdrop', '🎶 Vibrant weekend DJ parties'],
    hours: '11am – 2am', dress_code: 'Vibrant & Fun', best_for: 'Colourful parties, seafood lovers',
    map_query: 'Lucky Fish Beach Club Bluewaters Dubai', trending: true,
  },
  {
    id: '12', name: 'BCH', folder: 'BCH', image: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f5d?q=80&w=1200&auto=format&fit=crop', location: 'Address Beach Resort', area: 'JBR',
    vibe: 'Sky Pool', price_tier: 3,
    tagline: 'Dubai\'s highest infinity pool experience',
    description: 'BCH at Address Beach Resort JBR features the highest infinity pool in the world. Perched 77 storeys above the Arabian Gulf, the pool terrace, beach club, and restaurant offer unmatched panoramas. It\'s not just a beach club — it\'s a feat of engineering turned luxury escape.',
    highlights: ['🏊 World\'s highest infinity pool', '🌅 77-storey panoramic views', '🏖️ JBR beachfront access', '☀️ Full-day sun terrace'],
    hours: '10am – 12am', dress_code: 'Smart Beach', best_for: 'Bucket-list views, photography',
    map_query: 'BCH Beach Club Address Beach Resort JBR Dubai',
  },
  {
    id: '13', name: 'Playa', folder: 'Playa', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop', location: 'The Palm Tower', area: 'Palm Jumeirah',
    vibe: 'Tropical Ibiza', price_tier: 3,
    tagline: 'Ibiza tropicana at the top of Palm Tower',
    description: 'Playa at The Palm Tower brings the hedonistic energy of Ibiza to the very top of the Palm. Rooftop lagoon pool, international DJs, and a Latin-infused menu combine for an experience that has rapidly become one of the Palm\'s most coveted day-party destinations.',
    highlights: ['🌴 Rooftop lagoon pool', '💃 Ibiza-inspired day parties', '🎵 Resident international DJs', '🌺 Latin-fusion cocktail menu'],
    hours: '10am – 2am', dress_code: 'Tropical Party', best_for: 'Day parties, Ibiza lovers',
    map_query: 'Playa Beach Club Palm Tower Dubai', trending: true,
  },
  {
    id: '14', name: 'Ina', folder: 'Ina', image: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?q=80&w=1200&auto=format&fit=crop', location: 'FIVE Palm Jumeirah', area: 'Palm Jumeirah',
    vibe: 'Boho Tropical', price_tier: 3,
    tagline: 'Barefoot bohemian luxury on the Palm',
    description: 'Ina is FIVE Palm\'s most intimate beach offering — a barefoot boho escape serving fresh Asian-inspired bites and natural cocktails in a setting of driftwood textures and tropical greenery. The name says it all: sophisticated, natural, and utterly free.',
    highlights: ['🌿 Natural driftwood aesthetic', '🥥 Asian-inspired beach nibbles', '🍃 Botanical cocktail program', '🌊 FIVE Palm beachfront'],
    hours: '11am – 10pm', dress_code: 'Boho Natural', best_for: 'Relaxed escapism, wellness crowd',
    map_query: 'Ina Beach Club FIVE Palm Dubai',
  },
  {
    id: '15', name: 'CasaBlanca Beach', folder: 'CasaBlanca_Beach', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop', location: 'Jumeirah Zabeel Saray', area: 'Palm Jumeirah',
    vibe: 'Moroccan Splendour', price_tier: 3,
    tagline: 'Moroccan exoticism on Palm Jumeirah\'s crescent',
    description: 'CasaBlanca Beach evokes the romantic mystery of Casablanca\'s golden-age Moorish architecture. Ornate lanterns, Moroccan-tiled mosaics, hand-hammered copper, and a menu celebrating North African flavours make this Palm Jumeirah\'s most exotic escape.',
    highlights: ['🕌 Moorish architectural details', '🪔 Ornate lanterns & copper', '🫖 Moroccan mint tea rituals', '🌊 Crescent Palm beachfront'],
    hours: '11am – 11pm', dress_code: 'Moroccan Chic', best_for: 'Couples, cultural dining',
    map_query: 'CasaBlanca Beach Club Jumeirah Zabeel Saray Dubai',
  },
  {
    id: '16', name: 'Casa Amor', folder: 'Casa_Amor', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1200&auto=format&fit=crop', location: 'Vida Beach Resort', area: 'Umm Suqeim',
    vibe: 'Spanish Flair', price_tier: 2,
    tagline: 'Spanish passion meets Arabian sunset',
    description: 'Casa Amor at Vida Beach Resort Umm Suqeim is a warm Spanish beach bar with flamenco energy, tapas served generously, and a rosé list to rival the Costa Brava. The Burj Al Arab watches over every sunset as Spanish guitars set the late-afternoon mood.',
    highlights: ['🇪🇸 Authentic Spanish tapas menu', '🌹 Burj Al Arab sunset backdrop', '🎸 Spanish guitar evenings', '🍷 Spanish bodega rosé & wine'],
    hours: '12pm – 12am', dress_code: 'Relaxed Smart', best_for: 'Spanish dining, sunset crowd',
    map_query: 'Casa Amor Beach Club Vida Beach Resort Dubai',
  },
  {
    id: '17', name: 'Sakhalin', folder: 'Sakhalin', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop', location: 'Atlantis The Royal', area: 'Palm Jumeirah',
    vibe: 'Avant-Garde', price_tier: 4,
    tagline: 'The Royal\'s most enigmatic poolside address',
    description: 'Sakhalin at Atlantis The Royal is the mysterious, art-forward pool and beach experience of Dubai\'s most iconic hotel. Sculptural sun loungers, enigmatic artwork, and a Japanese-Slavic inspired menu converge in one of the Palm\'s most talked-about venues.',
    highlights: ['🏛️ Atlantis The Royal exclusivity', '🎨 Art installation environment', '🍱 Japanese-Slavic fusion menu', '🌊 Infinite pool with Gulf views'],
    hours: '10am – 10pm', dress_code: 'Avant-Garde Chic', best_for: 'Art lovers, high fashion crowd',
    map_query: 'Sakhalin Beach Club Atlantis The Royal Dubai', trending: true,
  },
  {
    id: '18', name: 'Surf', folder: 'Surf', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=1200&auto=format&fit=crop', location: 'Kite Beach', area: 'Umm Suqeim',
    vibe: 'Active Beach', price_tier: 1,
    tagline: 'Dubai\'s coolest kitesurfing hangout',
    description: 'Surf at Kite Beach is where Dubai\'s active, sun-loving crowd converges. Steps from the kite surfing action, this casual beach café serves up hearty açaï bowls, cold-brew coffee, loaded sandwiches, and cold beers — all with salty hair, bare feet, and zero pretension.',
    highlights: ['🏄 Kite Beach sports energy', '🥣 Açaï bowls & healthy eats', '☕ Speciality cold brew coffee', '🌊 Directly beachside'],
    hours: '7am – 10pm', dress_code: 'Casual Beach', best_for: 'Active crowd, casual hangouts',
    map_query: 'Surf Beach Cafe Kite Beach Dubai',
  },
  {
    id: '19', name: 'African Queen', folder: 'African_Queen', image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1200&auto=format&fit=crop', location: 'La Mer', area: 'La Mer',
    vibe: 'African Luxe', price_tier: 2,
    tagline: 'Safari-chic meets the Arabian Sea',
    description: 'African Queen brings the romance of an East African safari to La Mer\'s cosmopolitan beachfront. Think raw timber, brass lanterns, zebra-print accessories, and a menu celebrating the bold flavours of the African continent in a setting that\'s equal parts wild and refined.',
    highlights: ['🦓 Safari-inspired décor', '🌍 African-inspired menu', '🪔 Brass lantern evenings', '🌊 La Mer beachfront spot'],
    hours: '12pm – 1am', dress_code: 'Safari Chic', best_for: 'Unique experiences, thematic dining',
    map_query: 'African Queen Restaurant La Mer Dubai',
  },
  {
    id: '20', name: 'Gallery 7:40', folder: 'Gallery_7_40', image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop', location: 'JA Ocean View Hotel', area: 'JBR',
    vibe: 'Sunset Art', price_tier: 2,
    tagline: 'Art gallery meets sundowner paradise',
    description: 'Gallery 7:40 is named for Dubai\'s golden hour — the magical 7:40pm sunset that paints the Arabian Gulf in fire. Part beach bar, part art gallery, this JBR favourite curates rotating exhibitions alongside a thoughtful drinks list and light Mediterranean bites.',
    highlights: ['🎨 Rotating art gallery exhibitions', '🌅 Named for Dubai\'s perfect sunset', '🍸 Artisan sundowner cocktails', '🏖️ JBR beachfront access'],
    hours: '4pm – 1am', dress_code: 'Casual Artistic', best_for: 'Sunset watching, art crowd',
    map_query: 'Gallery 7:40 JBR Dubai', has_secondary_image: false,
  },
  {
    id: '21', name: 'Ninive Beach', folder: 'Ninive_Beach', image: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?q=80&w=1200&auto=format&fit=crop', location: 'Anantara World Islands', area: 'World Islands',
    vibe: 'Secluded Oasis', price_tier: 4,
    tagline: 'The world\'s most exclusive beach, literally',
    description: 'Ninive Beach on the World Islands is about as secluded as Dubai gets. Accessible only by speedboat, this exclusive beach club delivers Mediterranean cuisine, free-form pools, and absolute privacy on the shores of a man-made island. The ultimate flex.',
    highlights: ['🚤 Speedboat access only', '🏝️ World Islands location', '🌊 Truly private beach', '🥂 Mediterranean gourmet menu'],
    hours: '10am – 8pm', dress_code: 'Luxe Beach', best_for: 'Maximum exclusivity, privacy',
    map_query: 'Ninive Beach Club World Islands Dubai', featured: true,
  },
  {
    id: '22', name: 'Maison Revka', folder: 'Maison_Revka', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', location: 'Palm West Beach', area: 'Palm Jumeirah',
    vibe: 'French Pastoral', price_tier: 3,
    tagline: 'A Provençal house on Palm West Beach',
    description: 'Maison Revka brings the lavender-and-linen spirit of Provence to Palm West Beach. Imagine wicker sun loungers, raw linen parasols, chilled pétanque in the afternoon, and a menu of Provençal rosé and Mediterranean sharing plates as the sun melts into the Gulf.',
    highlights: ['🌾 Provençal pastoral aesthetic', '🍷 All-day Provence rosé menu', '🎯 Pétanque & beach games', '🌊 Palm West Beach waterfront'],
    hours: '10am – 11pm', dress_code: 'French Casual', best_for: 'Relaxed French dining, couples',
    map_query: 'Maison Revka Palm West Beach Dubai', trending: true,
  },
];

const AREAS = ['All', 'Palm Jumeirah', 'JBR', 'Jumeirah', 'Dubai Marina', 'Bluewaters Island', 'Business Bay', 'Za\'abeel', 'La Mer', 'Umm Suqeim', 'Jebel Ali', 'World Islands'];
const VIBES = ['All', 'Iconic', 'Chilled Luxury', 'Italian Riviera', 'Bohemian Garden', 'Desert Festival', 'French Couture', 'Tropical Ibiza', 'Greek Island', 'Avant-Garde'];

type ModalType = 'blog' | 'menu' | null;

export default function BeachClubs() {
  const [activeArea, setActiveArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalClub, setModalClub] = useState<BeachClub | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const filtered = React.useMemo(() => {
    return BEACH_CLUBS.filter(c => {
      const matchesArea = activeArea === 'All' || c.area === activeArea;
      const matchesSearch = searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vibe.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesArea && matchesSearch;
    });
  }, [activeArea, searchQuery]);

  const featured = BEACH_CLUBS.filter(c => c.featured);

  const openModal = useCallback((club: BeachClub, type: ModalType) => {
    setModalClub(club);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    setModalClub(null);
    setModalType(null);
  }, []);

  const priceTierLabel = (tier: number) => '◆'.repeat(tier);

  return (
    <div className="min-h-screen bg-[#080706] text-[#F5EDD8]">
      <Navbar />

      {/* ── CINEMATIC HERO ── */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
            alt="Dubai Beach Clubs"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? 'opacity-50' : 'opacity-0'}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080706]/60 via-transparent to-[#080706]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080706]/50 via-transparent to-[#080706]/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.5em]">Luxury Daylife & Sunset</span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>

          <h1 className="font-['Cormorant_Garamond'] text-7xl md:text-9xl font-light text-[#F5EDD8] mb-6 leading-none tracking-tight">
            Beach Clubs
          </h1>

          <p className="text-[#F5EDD8]/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From the bohemian shores of Palm West Beach to the high-octane energy of Bluewaters Island. Dubai's finest sun-soaked luxury, curated for you.
          </p>

          <div className="flex items-center gap-4 justify-center text-[#F5EDD8]/40 text-sm flex-wrap">
            <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-[#C9A84C]" />{BEACH_CLUBS.length} Beach Clubs</span>
            <span className="text-[#F5EDD8]/20">·</span>
            <span className="flex items-center gap-1.5"><Waves className="w-4 h-4 text-[#C9A84C]" />Concierge Curated</span>
            <span className="text-[#F5EDD8]/20">·</span>
            <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-[#C9A84C]" />DJ Powered</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-6 h-6 text-[#C9A84C] animate-bounce" />
        </motion.div>
      </section>

      {/* ── FEATURED STRIP ── */}
      <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#F5EDD8]/10" />
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.4em]">Editor's Picks</span>
          <div className="h-px flex-1 bg-[#F5EDD8]/10" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featured.map((c, i) => (
            <motion.div
              key={c.id + '-featured'}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: '2/3' }}
              onClick={() => openModal(c, 'blog')}
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="bg-[#C9A84C] text-[#080706] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Editor's Pick
                </span>
              </div>
              {c.trending && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#F5EDD8]/10 backdrop-blur-sm border border-[#F5EDD8]/20 text-[#F5EDD8] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    🔥
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-[#C9A84C] text-[9px] font-semibold uppercase tracking-widest mb-1">{c.vibe}</div>
                <div className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">{c.name}</div>
                <div className="text-white/40 text-[10px] flex items-center gap-1 mt-1">
                  <MapPin className="w-2.5 h-2.5" />{c.area}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-[72px] z-30 bg-[#080706]/90 backdrop-blur-xl border-b border-[#F5EDD8]/5 py-4 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-shrink-0">
              <input
                type="text"
                placeholder="Search beach clubs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 rounded-full px-5 py-2.5 text-sm text-[#F5EDD8] placeholder-[#F5EDD8]/30 outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Palm Jumeirah', 'JBR', 'Jumeirah', 'Bluewaters Island', 'Umm Suqeim', 'La Mer'].map(area => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeArea === area
                      ? 'bg-[#C9A84C] text-[#080706]'
                      : 'bg-[#F5EDD8]/5 text-[#F5EDD8]/60 hover:bg-[#F5EDD8]/10 border border-[#F5EDD8]/10'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="text-[#F5EDD8]/30 text-xs font-medium ml-auto hidden md:block">
              {filtered.length} venues
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN GRID ── */}
      <section className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((club, index) => (
            <BeachClubCard
              key={club.id}
              club={club}
              index={index}
              priceTierLabel={priceTierLabel}
              onBlog={() => openModal(club, 'blog')}
              onMenu={() => openModal(club, 'menu')}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32">
            <div className="text-[#F5EDD8]/20 text-6xl mb-4">🏖️</div>
            <p className="text-[#F5EDD8]/40 text-lg italic">No beach clubs match your filters.</p>
          </div>
        )}
      </section>

      <Footer />

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modalClub && modalType === 'blog' && (
          <BlogModal club={modalClub} onClose={closeModal} priceTierLabel={priceTierLabel} onMenuOpen={() => setModalType('menu')} />
        )}
        {modalClub && modalType === 'menu' && (
          <MenuModal club={modalClub} onClose={closeModal} onBlogOpen={() => setModalType('blog')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BeachClubCard({ club: c, index, priceTierLabel, onBlog, onMenu }: {
  club: BeachClub;
  index: number;
  priceTierLabel: (tier: number) => string;
  onBlog: () => void;
  onMenu: () => void;
}) {
  const [img2Error, setImg2Error] = useState(false);
  const hasSecondaryImage = c.has_secondary_image !== false;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map_query)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl mb-5" style={{ aspectRatio: '4/3' }}>
        <img
          src={c.image}
          alt={c.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-transparent to-transparent" />

        {c.trending && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#C9A84C] text-[#080706] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Trending
            </span>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={e => { e.stopPropagation(); onMenu(); }}
            className="bg-[#080706]/80 backdrop-blur-sm text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border border-[#C9A84C]/30 hover:bg-[#C9A84C] hover:text-[#080706] transition-all duration-200 flex items-center gap-1.5"
          >
            <BookOpen className="w-3 h-3" /> Menu
          </button>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="bg-[#080706]/80 backdrop-blur-sm text-[#F5EDD8] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border border-[#F5EDD8]/20 hover:bg-[#F5EDD8] hover:text-[#080706] transition-all duration-200 flex items-center gap-1.5"
          >
            <Navigation2 className="w-3 h-3" /> Take Me There
          </a>
        </div>
      </div>

      <div className="px-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-widest mb-1">{c.vibe}</div>
            <h3
              className="font-['Cormorant_Garamond'] text-2xl text-[#F5EDD8] cursor-pointer hover:text-[#C9A84C] transition-colors leading-tight"
              onClick={onBlog}
            >
              {c.name}
            </h3>
          </div>
          <span className="text-[#C9A84C] text-xs font-mono mt-1 shrink-0 ml-3">{priceTierLabel(c.price_tier)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#F5EDD8]/40 text-xs mb-3">
          <MapPin className="w-3 h-3 text-[#C9A84C]" />
          <span>{c.location}</span>
          <span className="text-[#F5EDD8]/20">·</span>
          <span className="text-[#F5EDD8]/30">{c.area}</span>
        </div>

        <p className="text-[#F5EDD8]/55 text-sm leading-relaxed mb-4 line-clamp-2">{c.tagline}</p>

        <div className="flex items-center gap-2 pt-3 border-t border-[#F5EDD8]/5">
          <div className="flex items-center gap-1.5 text-[#F5EDD8]/35 text-xs">
            <Clock className="w-3 h-3" />
            <span>{c.hours}</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={onBlog}
            className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wider hover:text-[#F5EDD8] transition-colors"
          >
            Read More →
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function BlogModal({ club: c, onClose, priceTierLabel, onMenuOpen }: {
  club: BeachClub;
  onClose: () => void;
  priceTierLabel: (tier: number) => string;
  onMenuOpen: () => void;
}) {
  const hasSecondaryImage = c.has_secondary_image !== false;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map_query)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#080706]/85 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative bg-[#0f0d0b] border border-[#F5EDD8]/8 rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="relative h-72 overflow-hidden rounded-t-3xl">
          <img
            src={c.image}
            alt={c.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0d0b]/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#080706]/60 backdrop-blur-sm text-[#F5EDD8]/60 hover:text-[#F5EDD8] w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-[#F5EDD8]/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-1">{c.vibe} · {c.area}</div>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white">{c.name}</h2>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {c.location}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#F5EDD8]/60 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {c.hours}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#C9A84C] text-xs px-3 py-1.5 rounded-full font-mono">
              {priceTierLabel(c.price_tier)}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#F5EDD8]/60 text-xs px-3 py-1.5 rounded-full">
              👙 {c.dress_code}
            </span>
          </div>

          <p className="text-[#F5EDD8]/80 leading-relaxed mb-6 text-base">{c.description}</p>

          <div className="bg-[#C9A84C]/5 border-l-2 border-[#C9A84C] rounded-r-xl p-5 mb-6">
            <div className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3">What To Expect</div>
            <ul className="space-y-2">
              {c.highlights.map((h, i) => (
                <li key={i} className="text-[#F5EDD8]/70 text-sm">{h}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-[#F5EDD8]/40 text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Best for: <span className="text-[#F5EDD8]/70">{c.best_for}</span></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#C9A84C] hover:bg-[#d4b562] text-[#080706] font-bold text-sm uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            >
              <Navigation2 className="w-4 h-4" />
              Take Me There
            </a>
            <button
              onClick={onMenuOpen}
              className="flex-1 bg-transparent border border-[#C9A84C]/30 hover:border-[#C9A84C] text-[#C9A84C] font-bold text-sm uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#C9A84C]/5"
            >
              <BookOpen className="w-4 h-4" />
              View Menu
            </button>
            <a
              href="/concierge/request"
              className="flex-1 bg-transparent border border-[#F5EDD8]/10 hover:border-[#F5EDD8]/30 text-[#F5EDD8]/60 hover:text-[#F5EDD8] font-bold text-sm uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              Reserve via Concierge
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const BEACH_MENU_DATA: Record<string, { sections: { title: string; items: { name: string; desc: string; price: string }[] }[] }> = {
  'African Queen': { sections: [
    { title: 'Small Plates', items: [
      { name: 'Peri-Peri Prawns', desc: 'Mozambican spiced tiger prawns, charred lemon, peri-peri butter', price: 'AED 115' },
      { name: 'Boerewors Bites', desc: 'South African sausage skewers, chakalaka relish, flatbread', price: 'AED 85' },
      { name: 'Bobotie Croquettes', desc: 'Cape Malay spiced minced beef, apricot jam dip', price: 'AED 75' },
    ]},
    { title: 'Safari Mains', items: [
      { name: 'Nyama Choma Ribeye', desc: 'East African dry-rubbed ribeye, roasted plantain, chimichurri', price: 'AED 265' },
      { name: 'Coastal Swahili Curry', desc: 'Tiger prawns & fish, coconut-tamarind broth, basmati rice', price: 'AED 185' },
      { name: 'Jerk Chicken Platter', desc: 'Slow-marinated half chicken, grilled corn, African slaw', price: 'AED 155' },
    ]},
    { title: 'Sundowner Drinks', items: [
      { name: 'Safari Sunset', desc: 'Amarula cream liqueur, passion fruit, ginger beer', price: 'AED 80' },
      { name: 'Kenyan Dawa', desc: 'Honey, vodka, lime — the iconic East African cocktail', price: 'AED 75' },
      { name: 'Cape Town Bellini', desc: 'Cape wine rosé, white peach purée, elderflower', price: 'AED 70' },
    ]},
    { title: 'Desserts', items: [
      { name: 'Malva Pudding', desc: 'Classic Cape Malay sponge, apricot caramel, cream', price: 'AED 60' },
      { name: 'Pineapple Sorbet', desc: 'Fresh pineapple, Angostura bitters, toasted coconut', price: 'AED 50' },
    ]},
  ]},
  'Nikki Beach': { sections: [
    { title: 'Light Bites', items: [
      { name: 'Tuna Tataki', desc: 'Seared yellowfin, ponzu, sesame, micro herbs', price: 'AED 125' },
      { name: 'Burrata & Watermelon', desc: 'Fresh burrata, seedless watermelon, basil oil, sea salt', price: 'AED 95' },
    ]},
    { title: 'Mains', items: [
      { name: 'Lobster Linguine', desc: 'Half Maine lobster, cherry tomato, bisque butter', price: 'AED 285' },
      { name: 'Beach Club Burger', desc: 'Wagyu patty, truffle mayo, aged cheddar, brioche', price: 'AED 145' },
      { name: 'Mediterranean Branzino', desc: 'Whole sea bass, lemon, capers, herb oil', price: 'AED 195' },
    ]},
    { title: 'Cocktails', items: [
      { name: 'Nikki Spritz', desc: 'Aperol, prosecco, blood orange, mint', price: 'AED 85' },
      { name: 'White Sangria', desc: 'Albariño, lychee, cucumber, elderflower', price: 'AED 80' },
    ]},
    { title: 'Desserts', items: [
      { name: 'Pavlova Tropicale', desc: 'Meringue, mango, passion fruit, coconut cream', price: 'AED 65' },
    ]},
  ]},
  'Gitano': { sections: [
    { title: 'Antojitos', items: [
      { name: 'Guacamole de Mesa', desc: 'Tableside prepared, seasonal toppings, totopos', price: 'AED 85' },
      { name: 'Taco de Pibil', desc: 'Slow-cooked cochinita pibil, pickled onion, habanero', price: 'AED 95' },
    ]},
    { title: 'Platos Fuertes', items: [
      { name: 'Carne Asada', desc: 'Wagyu skirt steak, salsa verde, roasted corn', price: 'AED 225' },
      { name: 'Pescado a la Plancha', desc: 'Grilled catch of the day, mole negro, plantain', price: 'AED 175' },
    ]},
    { title: 'Mezcalería', items: [
      { name: 'Jungle Bird', desc: 'Mezcal, Campari, pineapple, lime', price: 'AED 90' },
      { name: 'Paloma Gitana', desc: 'Tequila, grapefruit, sea salt, agave', price: 'AED 80' },
    ]},
    { title: 'Postres', items: [
      { name: 'Churros & Chocolate', desc: 'Crispy churros, dark chocolate de leche dip', price: 'AED 60' },
    ]},
  ]},
};

function getBeachMenuData(name: string, vibe: string, priceTier: number) {
  if (BEACH_MENU_DATA[name]) return BEACH_MENU_DATA[name].sections;
  const p = (base: number) => `AED ${base + priceTier * 25}`;
  const v = vibe.toLowerCase();
  if (v.includes('italian') || v.includes('riviera')) return [
    { title: 'Antipasti', items: [{ name: 'Caprese Classica', desc: 'Buffalo mozzarella, heirloom tomato, basil', price: p(85) }, { name: 'Burrata & Prosciutto', desc: '24-month San Daniele, stracciatella', price: p(95) }] },
    { title: 'Piatti', items: [{ name: 'Tagliolini al Granchio', desc: 'Fresh pasta, Dungeness crab, bottarga', price: p(175) }, { name: 'Branzino alla Griglia', desc: 'Whole sea bass, lemon, herbs', price: p(185) }] },
    { title: 'Drinks', items: [{ name: 'Aperol Spritz', desc: 'Aperol, prosecco, orange, soda', price: p(65) }, { name: 'Limoncello Sour', desc: 'Limoncello, lemon, egg white', price: p(70) }] },
    { title: 'Dolci', items: [{ name: 'Panna Cotta', desc: 'Vanilla, strawberry compote', price: p(55) }] },
  ];
  if (v.includes('french') || v.includes('riviera') || v.includes('provence') || v.includes('couture')) return [
    { title: 'Entrées', items: [{ name: 'Plateau de Fruits de Mer', desc: 'Oysters, crab, prawns, sea urchin', price: p(245) }, { name: 'Steak Tartare', desc: 'Beef tartare, Dijon, cornichons, quail egg', price: p(115) }] },
    { title: 'Plats', items: [{ name: 'Sole Meunière', desc: 'Dover sole, brown butter, capers, lemon', price: p(195) }, { name: 'Poulet Rôti', desc: 'Free-range chicken, fines herbes, pommes', price: p(155) }] },
    { title: 'Vins & Cocktails', items: [{ name: 'Kir Royale', desc: 'Cassis, champagne, lemon zest', price: p(75) }, { name: 'Rosé du Midi', desc: 'Provence rosé, glass pour', price: p(65) }] },
    { title: 'Desserts', items: [{ name: 'Crème Brûlée', desc: 'Vanilla custard, caramelised sugar', price: p(60) }] },
  ];
  if (v.includes('greek') || v.includes('mediterranean')) return [
    { title: 'Mezze', items: [{ name: 'Taramosalata & Pita', desc: 'House smoked roe dip, warm pita', price: p(65) }, { name: 'Grilled Octopus', desc: 'Charred tentacles, caper vinaigrette', price: p(125) }] },
    { title: 'Mains', items: [{ name: 'Whole Seabream', desc: 'Grilled, lemon olive oil, oregano', price: p(185) }, { name: 'Lamb Souvlaki', desc: 'Marinated lamb skewers, tzatziki, flatbread', price: p(155) }] },
    { title: 'Drinks', items: [{ name: 'Aperol Spritz', desc: 'Aperol, prosecco, orange', price: p(65) }, { name: 'Ouzo Lemonade', desc: 'Ouzo, fresh lemon, sparkling water', price: p(60) }] },
    { title: 'Sweets', items: [{ name: 'Baklava', desc: 'Honey-walnut pastry, vanilla ice cream', price: p(55) }] },
  ];
  if (v.includes('japanese') || v.includes('culinary')) return [
    { title: 'Starters', items: [{ name: 'Edamame', desc: 'Sea salt, sesame oil', price: p(45) }, { name: 'Tuna Tataki', desc: 'Seared tuna, ponzu, ginger', price: p(125) }] },
    { title: 'Mains', items: [{ name: 'Black Cod Miso', desc: 'Chilean sea bass, den miso', price: p(195) }, { name: 'Wagyu Gyoza', desc: 'Pan-seared wagyu dumplings, truffle ponzu', price: p(145) }] },
    { title: 'Cocktails', items: [{ name: 'Yuzu Margarita', desc: 'Tequila, yuzu, sea salt rim', price: p(80) }] },
    { title: 'Desserts', items: [{ name: 'Matcha Lava Cake', desc: 'Warm matcha centre, vanilla ice cream', price: p(65) }] },
  ];
  return [
    { title: 'Beachside Bites', items: [{ name: 'Mezze Platter', desc: 'Selection of dips, flatbread, crudités', price: p(85) }, { name: 'Grilled Prawns', desc: 'Garlic butter, lemon, herbs', price: p(125) }] },
    { title: 'Mains', items: [{ name: 'Catch of the Day', desc: 'Grilled fresh fish, seasonal sides', price: p(175) }, { name: 'Beach Club Burger', desc: 'Wagyu beef, aged cheddar, truffle mayo', price: p(145) }] },
    { title: 'Cocktails', items: [{ name: 'Signature Spritz', desc: 'House spirit, citrus, sparkling water', price: p(75) }, { name: 'Tropical Punch', desc: 'Fresh tropical fruits, rum, mint', price: p(70) }] },
    { title: 'Desserts', items: [{ name: 'Sorbet Trio', desc: 'Seasonal fruit sorbets', price: p(55) }] },
  ];
}

function MenuModal({ club: c, onClose, onBlogOpen }: {
  club: BeachClub;
  onClose: () => void;
  onBlogOpen: () => void;
}) {
  const sections = getBeachMenuData(c.name, c.vibe, c.price_tier);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#080706]/90 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative bg-[#0f0d0b] border border-[#F5EDD8]/8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F5EDD8]/8">
          <div>
            <div className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest mb-1">{c.vibe}</div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#F5EDD8]">{c.name} — Menu</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBlogOpen} className="text-[#F5EDD8]/40 hover:text-[#C9A84C] text-xs font-semibold uppercase tracking-wider transition-colors">← Back</button>
            <button onClick={onClose} className="bg-[#F5EDD8]/5 text-[#F5EDD8]/60 hover:text-[#F5EDD8] w-9 h-9 rounded-full flex items-center justify-center transition-colors ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-2 pb-2 border-b border-[#F5EDD8]/5">
          <div className="flex items-center gap-3 py-3">
            <div className="h-px flex-1 bg-[#C9A84C]/20" />
            <span className="text-[#C9A84C]/60 text-[10px] font-bold uppercase tracking-[0.4em]">Curated Selection</span>
            <div className="h-px flex-1 bg-[#C9A84C]/20" />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-['Cormorant_Garamond'] text-lg text-[#C9A84C] italic">{section.title}</span>
                <div className="h-px flex-1 bg-[#F5EDD8]/8" />
              </div>
              <div className="space-y-4">
                {section.items.map((item, ii) => (
                  <div key={ii} className="flex items-start justify-between gap-4 group">
                    <div className="flex-1 min-w-0">
                      <span className="text-[#F5EDD8] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors duration-200">{item.name}</span>
                      <p className="text-[#F5EDD8]/40 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-[#C9A84C] text-sm font-mono shrink-0 mt-0.5">{item.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="pt-4 border-t border-[#F5EDD8]/5">
            <p className="text-[#F5EDD8]/20 text-[11px] text-center leading-relaxed">
              Menu is subject to seasonal changes · All prices include VAT · Allergen information available on request
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map_query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#C9A84C] hover:bg-[#d4b562] text-[#080706] font-bold text-sm uppercase tracking-widest py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Navigation2 className="w-4 h-4" />
            Take Me There
          </a>
          <a
            href="/concierge/request"
            className="flex-1 bg-transparent border border-[#F5EDD8]/10 hover:border-[#C9A84C]/30 text-[#F5EDD8]/60 hover:text-[#C9A84C] font-bold text-sm uppercase tracking-widest py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
          >
            Reserve via Concierge
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}