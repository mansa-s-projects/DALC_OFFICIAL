// ─── Venue Data — Dubai À La Carte ────────────────────────────────────────────
// Canonical dataset for the /venues page. All categories, enriched metadata.

export interface VenueItem {
  id: string;
  name: string;
  location: string;
  tags: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  vibe: string;
  trending?: boolean;
  isNew?: boolean;
  coordinates?: { lat: number; lng: number };
  seoDescription?: string;
}

export interface VenueCategory {
  id: 'restaurants' | 'beach-clubs' | 'night-clubs' | 'dining-entertainment';
  title: string;
  items: VenueItem[];
}

// ─── Coordinates Database ─────────────────────────────────────────────────────
// Precise coordinates for "Take Me There" map integration

export const VENUE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Restaurants
  'bagatelle': { lat: 25.2115, lng: 55.2744 },
  'verde': { lat: 25.2108, lng: 55.2746 },
  'coucou': { lat: 25.1412, lng: 55.1854 },
  'amazonico': { lat: 25.2170, lng: 55.2795 },
  'il-gattopardo': { lat: 25.2168, lng: 55.2793 },
  'bar-de-pres': { lat: 25.2165, lng: 55.2791 },
  '1920': { lat: 25.2172, lng: 55.2798 },
  'nahate': { lat: 25.2163, lng: 55.2789 },
  'nobu': { lat: 25.1310, lng: 55.1185 },
  'ling-ling': { lat: 25.1322, lng: 55.1210 },
  'la-mar': { lat: 25.1320, lng: 55.1208 },
  'hakkasan': { lat: 25.1308, lng: 55.1183 },
  'mambaella': { lat: 25.2085, lng: 55.2755 },
  'woohoo': { lat: 25.2087, lng: 55.2757 },
  'ram-and-roll': { lat: 25.2089, lng: 55.2759 },
  'tang': { lat: 25.1943, lng: 55.2778 },
  'nazcaa': { lat: 25.1945, lng: 55.2780 },
  'krasota': { lat: 25.1947, lng: 55.2782 },
  'salvaje': { lat: 25.1949, lng: 55.2784 },
  'villa-coconut': { lat: 25.2160, lng: 55.2786 },
  'shanghai-me': { lat: 25.2158, lng: 55.2784 },
  'gal': { lat: 25.1951, lng: 55.2786 },
  'urla': { lat: 25.1953, lng: 55.2788 },
  'coya': { lat: 25.2106, lng: 55.2744 },
  'amelia': { lat: 25.1955, lng: 55.2790 },
  'ce-la-vi': { lat: 25.1957, lng: 55.2792 },
  'sushi-samba': { lat: 25.1410, lng: 55.1852 },
  'la-nina': { lat: 25.2162, lng: 55.2788 },
  'opa': { lat: 25.2113, lng: 55.2742 },
  'clap': { lat: 25.2155, lng: 55.2782 },
  'sexy-fish': { lat: 25.2153, lng: 55.2780 },
  'nammos': { lat: 25.2104, lng: 55.2742 },
  'jumeirah': { lat: 25.2048, lng: 55.2708 },
  'tattu': { lat: 25.0770, lng: 55.1334 },

  // Beach Clubs
  'verde-beach': { lat: 25.1420, lng: 55.1860 },
  'african-queen': { lat: 25.2145, lng: 55.2765 },
  'sakhalin': { lat: 25.2147, lng: 55.2767 },
  'gigi-beach': { lat: 25.2149, lng: 55.2769 },
  'baoli-beach': { lat: 25.2151, lng: 55.2771 },
  'ina-beach': { lat: 25.2153, lng: 55.2773 },
  'maison-revka': { lat: 25.1960, lng: 55.2640 },
  'nikki-beach': { lat: 25.2315, lng: 55.2610 },
  'nobu-beach': { lat: 25.1325, lng: 55.1215 },
  'casablanca-beach': { lat: 25.1315, lng: 55.1190 },
  'drift-beach': { lat: 25.0775, lng: 55.1340 },
  'playa': { lat: 25.1405, lng: 55.1845 },
  'terra-solis': { lat: 24.8073, lng: 55.1122 },
  'surf-beach': { lat: 25.1400, lng: 55.1840 },
  'gitano': { lat: 25.2143, lng: 55.2763 },
  'bch-club': { lat: 25.1395, lng: 55.1835 },
  'kyma': { lat: 25.1415, lng: 55.1857 },
  'casa-amor': { lat: 25.2110, lng: 55.2730 },
  'ninive-beach': { lat: 25.2155, lng: 55.2775 },
  'maison-de-la-plage': { lat: 25.1425, lng: 55.1865 },
  'lucky-fish': { lat: 25.1398, lng: 55.1838 },
  'gallery-740': { lat: 25.1402, lng: 55.1842 },
  'o-beach': { lat: 25.0765, lng: 55.1325 },
  'zetta-pool': { lat: 25.0755, lng: 55.1315 },

  // Night Clubs
  'iris': { lat: 25.1510, lng: 55.3005 },
  'epik': { lat: 25.1515, lng: 55.3010 },
  'nyx': { lat: 25.2175, lng: 55.2800 },
  'ly-la': { lat: 25.2178, lng: 55.2803 },
  'paraiso-rooftop': { lat: 25.2168, lng: 55.2793 },
  'blume-lounge': { lat: 25.1940, lng: 55.2775 },
  'shanghai-me-nc': { lat: 25.2158, lng: 55.2784 },
  'rasputine': { lat: 25.2160, lng: 55.2786 },
  'avenue': { lat: 25.2080, lng: 55.2760 },
  'ora': { lat: 25.1865, lng: 55.2645 },
  'secret-room': { lat: 25.1942, lng: 55.2777 },
  'socialista': { lat: 25.2172, lng: 55.2797 },
  'soho-garden': { lat: 25.1518, lng: 55.3013 },
  'code': { lat: 25.1520, lng: 55.3015 },
  'babylon-nc': { lat: 25.2164, lng: 55.2789 },
  'litt': { lat: 25.1958, lng: 55.2788 },
  'ongaku': { lat: 25.2150, lng: 55.2775 },

  // Dining & Entertainment
  'adaline': { lat: 25.2174, lng: 55.2799 },
  'aretha': { lat: 25.1418, lng: 55.1860 },
  'dream': { lat: 25.0772, lng: 55.1332 },
  'gatsby': { lat: 25.1408, lng: 55.1850 },
  'theater': { lat: 25.2116, lng: 55.2745 },
  'billionaire': { lat: 25.1944, lng: 55.2776 },
  'babylon-de': { lat: 25.2166, lng: 55.2791 },
};

// ─── SEO Descriptions Generator ───────────────────────────────────────────────
// Powerful, keyword-rich descriptions for each venue

export const VENUE_SEO_DESCRIPTIONS: Record<string, string> = {
  // Restaurants
  'bagatelle': 'Experience the ultimate French-Mediterranean dining at Bagatelle Dubai. World-class cuisine, electric atmosphere, and unforgettable nights in the heart of Fairmont Sheikh Zayed Road.',
  'verde': 'Discover Verde at Four Seasons Dubai — where Italian sophistication meets Mediterranean charm. An elegant garden dining experience with impeccable service and stunning ambiance.',
  'coucou': 'Escape to CouCou Palm Jumeirah, a French seaside haven offering exquisite seafood and rosé sunsets. The ultimate beachfront dining destination for the discerning palate.',
  'amazonico': 'Journey through the Amazon at Amazonico DIFC — a rainforest-inspired culinary adventure blending Latin and Asian flavors. Dubai most vibrant tropical dining experience.',
  'il-gattopardo': 'Savor authentic Italian luxury at Il Gattopardo DIFC. Timeless elegance, exceptional pasta, and an intimate setting perfect for business dinners and romantic evenings.',
  'bar-de-pres': 'Indulge in French-Japanese fusion at Bar de Prés DIFC. Craft cocktails meet innovative cuisine in this intimate, design-forward dining sanctuary.',
  '1920': 'Step into the secret world of 1920 DIFC — Dubai premier speakeasy experience. Prohibition-era glamour, artisan cocktails, and an air of mystery await.',
  'nahate': 'Experience premium Japanese dining at Nahate DIFC. Impeccable omakase, rare sake selections, and a serene atmosphere for the ultimate culinary journey.',
  'nobu': 'Dine at the legendary Nobu Atlantis The Palm. World-renowned Japanese-Peruvian fusion, celebrity chef cuisine, and an iconic Dubai dining destination.',
  'ling-ling': 'Ascend to Ling Ling at Atlantis The Royal — vibrant Asian dining with panoramic views. A high-energy destination where cuisine meets nightlife in spectacular fashion.',
  'la-mar': 'Discover La Mar at Atlantis The Royal — Gastón Acurio celebrated Peruvian cuisine with stunning oceanfront views. Authentic flavors, ceviche mastery, and waterfront elegance.',
  'hakkasan': 'Experience award-winning Cantonese cuisine at Hakkasan Atlantis The Palm. Michelin-recognized dining, exceptional dim sum, and an atmosphere of modern sophistication.',
  'mambaella': 'Enjoy playful Italian dining at Mambaella Kempinski Hotel. Contemporary flavors, creative presentations, and a lively atmosphere perfect for social gatherings.',
  'woohoo': 'Dive into energetic Asian dining at Woohoo Kempinski Hotel. Bold flavors, vibrant décor, and an unforgettable fun-first approach to luxury dining.',
  'ram-and-roll': 'Savor premium grill mastery at Ram & Roll Kempinski Hotel. Exceptional meats, artisanal preparations, and a contemporary BBQ experience like no other.',
  'tang': 'Explore trendy Asian fusion at Tang Downtown Dubai. Innovative dishes, stylish ambiance, and a dining experience that captures the pulse of modern Dubai.',
  'nazcaa': 'Discover contemporary Peruvian excellence at Nazcaa Downtown. Artful presentations, bold flavors, and a sophisticated setting for memorable dining moments.',
  'krasota': 'Enter the world of Krasota Downtown — where dining meets immersive art. A theatrical culinary journey blending gastronomy with visual storytelling.',
  'salvaje': 'Feel the Latin energy at Salvaje Downtown Dubai. Lively nights, bold flavors, and a vibrant atmosphere that brings the spirit of Latin America to life.',
  'villa-coconut': 'Relax at Villa Coconut DIFC — Mediterranean charm meets casual elegance. Fresh flavors, laid-back vibes, and an escape from the city hustle.',
  'shanghai-me': 'Experience upscale Chinese chic at Shanghai Me DIFC. Sophisticated dim sum, elegant décor, and a refined atmosphere for discerning diners.',
  'gal': 'Discover trendy waterfront dining at Gal Downtown Dubai. Mediterranean flavors, stunning views, and a social atmosphere perfect for long leisurely meals.',
  'urla': 'Experience rustic Mediterranean charm at Urla Downtown. Authentic Turkish cuisine, warm hospitality, and flavors that transport you to the Aegean coast.',
  'coya': 'Immerse in premium Peruvian dining at Coya Four Seasons. Pisco mastery, ceviche artistry, and a vibrant Latin atmosphere in an elegant setting.',
  'amelia': 'Ascend to rooftop elegance at Amelia Downtown Dubai. European sophistication, stunning skyline views, and an atmosphere of refined celebration.',
  'ce-la-vi': 'Dine among the clouds at Ce La Vi Downtown. Asian-fusion cuisine, breathtaking skyline views, and the ultimate sky-high dining experience.',
  'sushi-samba': 'Experience fusion excellence at Sushi Samba Palm Jumeirah. Japanese-Brazilian-Peruvian cuisine with iconic skyline views and vibrant energy.',
  'la-nina': 'Feel the vibrant Latin spirit at La Niña DIFC. Bold flavors, lively atmosphere, and a dining experience that celebrates the joy of Latin culture.',
  'opa': 'Join the lively Greek party at Opa Fairmont SZR. Plate-breaking traditions, energetic entertainment, and authentic Mediterranean hospitality.',
  'clap': 'Discover modern Japanese chic at Clap DIFC. Contemporary cuisine, stylish design, and a sophisticated atmosphere for the modern diner.',
  'sexy-fish': 'Dive into glamorous seafood at Sexy Fish DIFC. Stunning design, exceptional Asian seafood, and an atmosphere of underwater wonder.',
  'nammos': 'Experience beachside luxury at Nammos Four Seasons. Greek island vibes, exceptional Mediterranean cuisine, and the ultimate seaside dining escape.',
  'jumeirah': 'Discover iconic Dubai dining at Jumeirah. A curated collection of culinary experiences capturing the essence of this prestigious neighborhood.',
  'tattu': 'Enter the artistic world of Tattu Dubai Marina. Modern Chinese cuisine, stunning design, and a dining experience inspired by ancient body art traditions.',

  // Beach Clubs
  'verde-beach': 'Unwind at Verde Beach Umm Suqeim — Italian sophistication meets beachfront relaxation. Chic lounging, exceptional cuisine, and sophisticated seaside vibes.',
  'african-queen': 'Experience bold African-inspired luxury at African Queen J1. Premium beachfront lounging, vibrant energy, and a unique cultural experience by the sea.',
  'sakhalin': 'Discover seaside Russian flair at Sakhalin J1. Unique beachfront dining, exceptional seafood, and an atmosphere of relaxed coastal elegance.',
  'gigi-beach': 'Indulge in Italian beach luxury at Gigi J1. Riviera-style glamour, exceptional cuisine, and the ultimate sophisticated beach club experience.',
  'baoli-beach': 'Escape to French Riviera glamour at Baoli J1. Chic beachfront dining, elegant lounging, and Mediterranean sophistication on Dubai shores.',
  'ina-beach': 'Relax at Ina J1 — Mediterranean beach dining at its finest. Fresh flavors, laid-back elegance, and a serene escape from the city bustle.',
  'maison-revka': 'Experience French beach elegance at Maison Revka Bluewaters. Sophisticated seaside lounging, exceptional cuisine, and stunning waterfront views.',
  'nikki-beach': 'Join the iconic global phenomenon at Nikki Beach Pearl Jumeirah. World-famous beach club, international DJs, and the ultimate luxury lifestyle destination.',
  'nobu-beach': 'Discover Japanese beachside luxury at Nobu by the Beach Atlantis The Royal. World-class cuisine, pristine sands, and an atmosphere of refined relaxation.',
  'casablanca-beach': 'Experience Mediterranean beach vibes at CasaBlanca Beach Atlantis The Palm. Vibrant atmosphere, exceptional entertainment, and unforgettable seaside moments.',
  'drift-beach': 'Escape to serenity at Drift Beach Dubai Marina. Mediterranean-inspired beach club, crystal waters, and a tranquil atmosphere of understated luxury.',
  'playa': 'Feel the Latin beach energy at Playa Palm Jumeirah. Vibrant atmosphere, exceptional cuisine, and a celebration of coastal Latin culture.',
  'terra-solis': 'Journey to Tomorrowland at Terra Solis Jebel Ali. Desert oasis experience, world-class festivals, and a unique boho-luxe beach club destination.',
  'surf-beach': 'Catch casual beach vibes at Surf Palm West Beach. Relaxed atmosphere, fun-loving energy, and the perfect spot for sun-soaked Dubai days.',
  'gitano': 'Embrace boho beach spirit at Gitano J1. Mexican-inspired beach club, stunning sunsets, and a free-spirited atmosphere of coastal celebration.',
  'bch-club': 'Discover trendy beach scenes at BCH Palm Jumeirah. Mediterranean-inspired lounging, vibrant social atmosphere, and stylish seaside sophistication.',
  'kyma': 'Experience Greek coastal luxury at Kyma Palm Jumeirah. Mediterranean charm, exceptional beachfront dining, and an atmosphere of island elegance.',
  'casa-amor': 'Find intimate beach luxury at Casa Amor Mandarin Oriental. Exclusive seaside retreat, refined Mediterranean cuisine, and an atmosphere of romantic elegance.',
  'ninive-beach': 'Discover Moroccan beach charm at Ninive Beach J1. Exotic atmosphere, exceptional cuisine, and a unique cultural beachfront experience.',
  'maison-de-la-plage': 'Escape to French Riviera vibes at Maison De La Plage Palm Jumeirah. Chic beach sophistication, exceptional dining, and stylish coastal living.',
  'lucky-fish': 'Enjoy fun beach seafood at Lucky Fish Palm West Beach. Casual elegance, fresh catches, and a relaxed atmosphere perfect for seaside dining.',
  'gallery-740': 'Experience art-inspired beach living at Gallery 7/40 Palm Jumeirah. Creative atmosphere, unique design, and a beach club that doubles as an artistic escape.',
  'o-beach': 'Party Ibiza-style at O Beach JBR. High-energy beach club, international DJs, and the ultimate party atmosphere on Dubai vibrant coastline.',
  'zetta-pool': 'Discover modern pool lifestyle at Zetta Pool Address JBR. Contemporary design, sophisticated lounging, and a fresh approach to beach club culture.',

  // Night Clubs
  'iris': 'Ascend to open-air rooftop nights at Iris Meydan. Stunning views, vibrant atmosphere, and the ultimate outdoor nightlife experience under the stars.',
  'epik': 'Experience high-energy nightlife at Epik Meydan. Festival vibes, world-class entertainment, and an electrifying atmosphere for unforgettable nights.',
  'nyx': 'Enter luxury underground at Nyx by Gaia DIFC. Exclusive atmosphere, sophisticated crowd, and a nightlife experience of refined mystery.',
  'ly-la': 'Discover intimate exclusivity at Ly-La by Alaya DIFC. Chic ambiance, curated crowd, and a sophisticated nightlife sanctuary in the heart of DIFC.',
  'paraiso-rooftop': 'Feel Latin rooftop vibes at Paraiso by Amazonico DIFC. Tropical energy, stunning views, and a vibrant Latin-inspired nightlife destination.',
  'blume-lounge': 'Unwind at Blume Lounge Downtown — chic ambiance meets relaxed sophistication. The perfect spot for stylish evenings and intimate conversations.',
  'shanghai-me-nc': 'Experience late-night sophistication at Shanghai Me DIFC. Upscale Chinese venue transforms into an elegant nightlife destination after dark.',
  'rasputine': 'Enter Parisian nightlife elegance at Rasputine DIFC. Exclusive atmosphere, refined crowd, and the ultimate VIP nightlife experience in Dubai.',
  'avenue': 'Discover classic Dubai clubbing at Avenue Shangri-La Hotel. R&B rhythms, elegant crowd, and a timeless nightlife institution on Sheikh Zayed Road.',
  'ora': 'Explore modern underground at Ora Habtoor City. Contemporary beats, stylish crowd, and a fresh approach to Dubai nightlife scene.',
  'secret-room': 'Find hidden exclusivity at Secret Room Downtown. VIP entrance, intimate setting, and Dubai most coveted nightlife secret.',
  'socialista': 'Experience Cuban-inspired glamour at Socialista Cipriani. Latin energy, sophisticated crowd, and a nightlife celebration of Cuban culture.',
  'soho-garden': 'Join the festival at Soho Garden Meydan. Multi-venue experience, world-class DJs, and the ultimate nightlife destination for music lovers.',
  'code': 'Enter electronic underground at Code by Soho Garden Meydan. Underground beats, dedicated dance floor, and the ultimate destination for electronic music enthusiasts.',
  'babylon-nc': 'Discover ancient-meets-modern at Babylon DIFC. Luxurious setting, late-night dining, and a nightlife experience of timeless sophistication.',
  'litt': 'Feel high-energy vibes at Litt KIRA. Vibrant atmosphere, dynamic crowd, and an electrifying nightlife destination for the young and bold.',
  'ongaku': 'Experience Japanese-inspired nightlife at Ongaku by Clap DIFC. Unique atmosphere, refined entertainment, and a nightlife journey to Tokyo after dark.',

  // Dining & Entertainment
  'adaline': 'Immerse in theatrical dining at Adaline DIFC. Dinner show spectacle, immersive storytelling, and a culinary performance unlike any other.',
  'aretha': 'Experience live performance dining at Aretha Palm Jumeirah. Soulful entertainment, exceptional cuisine, and a celebration of music and gastronomy.',
  'dream': 'Enter theatrical dining at Dream JBR. Spectacular shows, immersive experiences, and a dining journey that blurs the line between cuisine and performance.',
  'gatsby': 'Travel to the Roaring Twenties at Gatsby The Palm. Dinner party extravagance, live entertainment, and an immersive journey to the Jazz Age.',
  'theater': 'Witness spectacular show dining at Theater Fairmont SZR. Awe-inspiring performances, exceptional cuisine, and a theatrical dining experience of epic proportions.',
  'billionaire': 'Indulge in the ultimate dinner spectacle at Billionaire Downtown. World-class entertainment, exceptional Italian cuisine, and an atmosphere of pure luxury.',
  'babylon-de': 'Experience nightlife-cuisine fusion at Babylon DIFC. Where dinner transforms into night, and every evening becomes an unforgettable celebration.',
};

// ─── Image Imports ────────────────────────────────────────────────────────────
import { getSpecificVenueImage } from './venueImages';

// Re-export for backward compatibility
export function getVenueImage(id: string, categoryId: string): string {
  return getSpecificVenueImage(id, categoryId);
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = '971585987600';

export function getWhatsAppUrl(venueName: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I want to book ${venueName}`)}`;
}

// ─── Google Maps Integration ──────────────────────────────────────────────────

export function getGoogleMapsUrl(venueName: string, coordinates?: { lat: number; lng: number }): string {
  if (coordinates) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=${encodeURIComponent(venueName)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ' Dubai')}`;
}

export function getAppleMapsUrl(venueName: string, coordinates?: { lat: number; lng: number }): string {
  if (coordinates) {
    return `https://maps.apple.com/?daddr=${coordinates.lat},${coordinates.lng}&q=${encodeURIComponent(venueName)}`;
  }
  return `https://maps.apple.com/?q=${encodeURIComponent(venueName + ' Dubai')}`;
}

export function getWazeUrl(coordinates: { lat: number; lng: number }): string {
  return `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`;
}

// ─── Location & Vibe Filters ──────────────────────────────────────────────────

export const LOCATIONS = [
  'All Areas',
  'DIFC',
  'Downtown',
  'Palm Jumeirah',
  'JBR',
  'Jumeirah',
  'Meydan',
  'Kempinski Hotel',
  'Atlantis',
  'Bluewaters',
  'J1',
] as const;

export const PRICE_FILTERS = ['All', '$', '$$', '$$$', '$$$$'] as const;

export const VIBE_FILTERS = [
  { id: 'all', label: 'All Vibes' },
  { id: 'fine-dining', label: 'Fine Dining' },
  { id: 'party', label: 'Party Scene' },
  { id: 'lively', label: 'Lively' },
  { id: 'chic', label: 'Chic & Trendy' },
  { id: 'beachfront', label: 'Beachfront' },
  { id: 'skyline', label: 'Skyline Views' },
  { id: 'immersive', label: 'Immersive' },
  { id: 'exclusive', label: 'Exclusive' },
] as const;

// ─── Venue Data ───────────────────────────────────────────────────────────────

export const VENUE_CATEGORIES: VenueCategory[] = [
  {
    id: 'restaurants',
    title: 'Restaurants',
    items: [
      { id: 'bagatelle',     name: 'Bagatelle',       location: 'Fairmont SZR',          tags: ['French', 'Fine Dining', 'Party'],       priceRange: '$$$$', vibe: 'Elegant, lively dinner',          trending: true, coordinates: VENUE_COORDINATES['bagatelle'], seoDescription: VENUE_SEO_DESCRIPTIONS['bagatelle'] },
      { id: 'verde',         name: 'Verde',           location: 'Four Seasons',          tags: ['Italian', 'Mediterranean'],              priceRange: '$$$$', vibe: 'Sophisticated garden dining', coordinates: VENUE_COORDINATES['verde'], seoDescription: VENUE_SEO_DESCRIPTIONS['verde'] },
      { id: 'coucou',        name: 'CouCou',          location: 'Palm Jumeirah',         tags: ['French', 'Seafood'],                     priceRange: '$$$$', vibe: 'Seaside French elegance', coordinates: VENUE_COORDINATES['coucou'], seoDescription: VENUE_SEO_DESCRIPTIONS['coucou'] },
      { id: 'amazonico',     name: 'Amazonico',       location: 'DIFC',                  tags: ['Latin', 'Asian Fusion', 'Lively'],       priceRange: '$$$$', vibe: 'Lively tropical dining',          trending: true, coordinates: VENUE_COORDINATES['amazonico'], seoDescription: VENUE_SEO_DESCRIPTIONS['amazonico'] },
      { id: 'il-gattopardo', name: 'Il Gattopardo',   location: 'DIFC',                  tags: ['Italian', 'Classic'],                    priceRange: '$$$$', vibe: 'Classic Italian fine dining', coordinates: VENUE_COORDINATES['il-gattopardo'], seoDescription: VENUE_SEO_DESCRIPTIONS['il-gattopardo'] },
      { id: 'bar-de-pres',   name: 'Bar de Prés',     location: 'DIFC',                  tags: ['French', 'Japanese', 'Cocktails'],       priceRange: '$$$$', vibe: 'Intimate cocktail dining', coordinates: VENUE_COORDINATES['bar-de-pres'], seoDescription: VENUE_SEO_DESCRIPTIONS['bar-de-pres'] },
      { id: '1920',          name: '1920',            location: 'DIFC',                  tags: ['Speakeasy', 'Intimate'],                 priceRange: '$$$',  vibe: 'Hidden speakeasy vibes', coordinates: VENUE_COORDINATES['1920'], seoDescription: VENUE_SEO_DESCRIPTIONS['1920'] },
      { id: 'nahate',        name: 'Nahate',          location: 'DIFC',                  tags: ['Japanese', 'Premium'],                   priceRange: '$$$$', vibe: 'Premium Japanese cuisine', coordinates: VENUE_COORDINATES['nahate'], seoDescription: VENUE_SEO_DESCRIPTIONS['nahate'] },
      { id: 'nobu',          name: 'Nobu',            location: 'Atlantis The Palm',     tags: ['Japanese', 'World-Renowned'],             priceRange: '$$$$', vibe: 'World-renowned Japanese',          trending: true, coordinates: VENUE_COORDINATES['nobu'], seoDescription: VENUE_SEO_DESCRIPTIONS['nobu'] },
      { id: 'ling-ling',     name: 'Ling Ling',       location: 'Atlantis The Royal',    tags: ['Asian', 'Vibrant'],                      priceRange: '$$$$', vibe: 'Vibrant Asian dining', coordinates: VENUE_COORDINATES['ling-ling'], seoDescription: VENUE_SEO_DESCRIPTIONS['ling-ling'] },
      { id: 'la-mar',        name: 'La Mar',          location: 'Atlantis The Royal',    tags: ['Peruvian', 'Seafood'],                   priceRange: '$$$$', vibe: 'Oceanfront Peruvian', coordinates: VENUE_COORDINATES['la-mar'], seoDescription: VENUE_SEO_DESCRIPTIONS['la-mar'] },
      { id: 'hakkasan',      name: 'Hakkasan',        location: 'Atlantis The Palm',     tags: ['Chinese', 'Award-Winning'],              priceRange: '$$$$', vibe: 'Award-winning Chinese',            trending: true, coordinates: VENUE_COORDINATES['hakkasan'], seoDescription: VENUE_SEO_DESCRIPTIONS['hakkasan'] },
      { id: 'mambaella',     name: 'Mambaella',       location: 'Kempinski Hotel',       tags: ['Italian', 'Playful'],                    priceRange: '$$$',  vibe: 'Playful Italian dining', coordinates: VENUE_COORDINATES['mambaella'], seoDescription: VENUE_SEO_DESCRIPTIONS['mambaella'] },
      { id: 'woohoo',        name: 'Woohoo',          location: 'Kempinski Hotel',       tags: ['Asian', 'Energetic'],                    priceRange: '$$$',  vibe: 'Fun, energetic dining', coordinates: VENUE_COORDINATES['woohoo'], seoDescription: VENUE_SEO_DESCRIPTIONS['woohoo'] },
      { id: 'ram-and-roll',  name: 'Ram & Roll',      location: 'Kempinski Hotel',       tags: ['Grill', 'BBQ'],                          priceRange: '$$$',  vibe: 'Premium grill experience', coordinates: VENUE_COORDINATES['ram-and-roll'], seoDescription: VENUE_SEO_DESCRIPTIONS['ram-and-roll'] },
      { id: 'tang',          name: 'Tang',            location: 'Downtown',              tags: ['Asian Fusion', 'Trendy'],                priceRange: '$$$',  vibe: 'Trendy Asian fusion', coordinates: VENUE_COORDINATES['tang'], seoDescription: VENUE_SEO_DESCRIPTIONS['tang'] },
      { id: 'nazcaa',        name: 'Nazcaa',          location: 'Downtown',              tags: ['Peruvian', 'Contemporary'],              priceRange: '$$$',  vibe: 'Contemporary Peruvian', coordinates: VENUE_COORDINATES['nazcaa'], seoDescription: VENUE_SEO_DESCRIPTIONS['nazcaa'] },
      { id: 'krasota',       name: 'Krasota',         location: 'Downtown',              tags: ['Art Dining', 'Immersive'],               priceRange: '$$$$', vibe: 'Immersive art dining', coordinates: VENUE_COORDINATES['krasota'], seoDescription: VENUE_SEO_DESCRIPTIONS['krasota'] },
      { id: 'salvaje',       name: 'Salvaje',         location: 'Downtown',              tags: ['Latin', 'Asian', 'Lively'],              priceRange: '$$$',  vibe: 'Latin energy, lively nights', coordinates: VENUE_COORDINATES['salvaje'], seoDescription: VENUE_SEO_DESCRIPTIONS['salvaje'] },
      { id: 'villa-coconut', name: 'Villa Coconut',   location: 'DIFC',                  tags: ['Mediterranean', 'Relaxed'],              priceRange: '$$$',  vibe: 'Relaxed Mediterranean', coordinates: VENUE_COORDINATES['villa-coconut'], seoDescription: VENUE_SEO_DESCRIPTIONS['villa-coconut'] },
      { id: 'shanghai-me',   name: 'Shanghai Me',     location: 'DIFC',                  tags: ['Chinese', 'Chic'],                       priceRange: '$$$$', vibe: 'Upscale Chinese chic',             trending: true, coordinates: VENUE_COORDINATES['shanghai-me'], seoDescription: VENUE_SEO_DESCRIPTIONS['shanghai-me'] },
      { id: 'gal',           name: 'Gal',             location: 'Downtown',              tags: ['Mediterranean', 'Waterfront'],           priceRange: '$$$',  vibe: 'Trendy waterfront dining', coordinates: VENUE_COORDINATES['gal'], seoDescription: VENUE_SEO_DESCRIPTIONS['gal'] },
      { id: 'urla',          name: 'Urla',            location: 'Downtown',              tags: ['Turkish', 'Mediterranean'],              priceRange: '$$$',  vibe: 'Rustic Mediterranean charm', coordinates: VENUE_COORDINATES['urla'], seoDescription: VENUE_SEO_DESCRIPTIONS['urla'] },
      { id: 'coya',          name: 'Coya',            location: 'Four Seasons',          tags: ['Peruvian', 'Premium'],                   priceRange: '$$$$', vibe: 'Premium Peruvian experience',      trending: true, coordinates: VENUE_COORDINATES['coya'], seoDescription: VENUE_SEO_DESCRIPTIONS['coya'] },
      { id: 'amelia',        name: 'Amelia',          location: 'Downtown',              tags: ['European', 'Rooftop'],                   priceRange: '$$$$', vibe: 'Rooftop elegance', coordinates: VENUE_COORDINATES['amelia'], seoDescription: VENUE_SEO_DESCRIPTIONS['amelia'] },
      { id: 'ce-la-vi',      name: 'Ce La Vi',        location: 'Downtown',              tags: ['Asian', 'Skyline Views'],                priceRange: '$$$$', vibe: 'Skyline views, Asian fare', coordinates: VENUE_COORDINATES['ce-la-vi'], seoDescription: VENUE_SEO_DESCRIPTIONS['ce-la-vi'] },
      { id: 'sushi-samba',   name: 'Sushi Samba',     location: 'Palm Jumeirah',         tags: ['Japanese', 'Brazilian', 'Fusion'],       priceRange: '$$$$', vibe: 'Fusion skyline dining', coordinates: VENUE_COORDINATES['sushi-samba'], seoDescription: VENUE_SEO_DESCRIPTIONS['sushi-samba'] },
      { id: 'la-nina',       name: 'La Niña',         location: 'DIFC',                  tags: ['Latin', 'Vibrant'],                      priceRange: '$$$',  vibe: 'Vibrant Latin spirit',             isNew: true, coordinates: VENUE_COORDINATES['la-nina'], seoDescription: VENUE_SEO_DESCRIPTIONS['la-nina'] },
      { id: 'opa',           name: 'Opa',             location: 'Fairmont SZR',          tags: ['Greek', 'Entertainment'],                priceRange: '$$$',  vibe: 'Lively Greek party', coordinates: VENUE_COORDINATES['opa'], seoDescription: VENUE_SEO_DESCRIPTIONS['opa'] },
      { id: 'clap',          name: 'Clap',            location: 'DIFC',                  tags: ['Japanese', 'Modern'],                    priceRange: '$$$$', vibe: 'Modern Japanese chic', coordinates: VENUE_COORDINATES['clap'], seoDescription: VENUE_SEO_DESCRIPTIONS['clap'] },
      { id: 'sexy-fish',     name: 'Sexy Fish',       location: 'DIFC',                  tags: ['Asian', 'Seafood', 'Glamorous'],         priceRange: '$$$$', vibe: 'Glamorous seafood',                trending: true, coordinates: VENUE_COORDINATES['sexy-fish'], seoDescription: VENUE_SEO_DESCRIPTIONS['sexy-fish'] },
      { id: 'nammos',        name: 'Nammos',          location: 'Four Seasons',          tags: ['Greek', 'Mediterranean', 'Beachside'],   priceRange: '$$$$', vibe: 'Beachside luxury dining', coordinates: VENUE_COORDINATES['nammos'], seoDescription: VENUE_SEO_DESCRIPTIONS['nammos'] },
      { id: 'jumeirah',      name: 'Jumeirah',        location: 'Jumeirah',              tags: ['Mixed', 'Iconic'],                       priceRange: '$$$',  vibe: 'Iconic Dubai dining', coordinates: VENUE_COORDINATES['jumeirah'], seoDescription: VENUE_SEO_DESCRIPTIONS['jumeirah'] },
      { id: 'tattu',         name: 'Tattu',           location: 'Ciel Dubai Marina',     tags: ['Chinese', 'Modern', 'Artistic'],         priceRange: '$$$$', vibe: 'Artistic modern Chinese',          isNew: true, coordinates: VENUE_COORDINATES['tattu'], seoDescription: VENUE_SEO_DESCRIPTIONS['tattu'] },
    ],
  },
  {
    id: 'beach-clubs',
    title: 'Beach Clubs',
    items: [
      { id: 'verde-beach',       name: 'Verde Beach',           location: 'Umm Suqeim',           tags: ['Italian', 'Beach', 'Sophisticated'],   priceRange: '$$$$', vibe: 'Sophisticated beachside',       trending: true, coordinates: VENUE_COORDINATES['verde-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['verde-beach'] },
      { id: 'african-queen',     name: 'African Queen',         location: 'J1',                    tags: ['African', 'Bold', 'Premium'],          priceRange: '$$$$', vibe: 'Bold African-inspired luxury', coordinates: VENUE_COORDINATES['african-queen'], seoDescription: VENUE_SEO_DESCRIPTIONS['african-queen'] },
      { id: 'sakhalin',          name: 'Sakhalin',              location: 'J1',                    tags: ['Russian', 'Seafood'],                  priceRange: '$$$',  vibe: 'Seaside Russian flair', coordinates: VENUE_COORDINATES['sakhalin'], seoDescription: VENUE_SEO_DESCRIPTIONS['sakhalin'] },
      { id: 'gigi-beach',        name: 'Gigi',                  location: 'J1',                    tags: ['Italian', 'Beach', 'Luxury'],          priceRange: '$$$$', vibe: 'Italian beach luxury',          trending: true, coordinates: VENUE_COORDINATES['gigi-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['gigi-beach'] },
      { id: 'baoli-beach',       name: 'Baoli',                 location: 'J1',                    tags: ['French', 'Riviera'],                   priceRange: '$$$$', vibe: 'Riviera-style glamour', coordinates: VENUE_COORDINATES['baoli-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['baoli-beach'] },
      { id: 'ina-beach',         name: 'Ina',                   location: 'J1',                    tags: ['Mediterranean', 'Relaxed'],            priceRange: '$$$',  vibe: 'Relaxed beach dining', coordinates: VENUE_COORDINATES['ina-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['ina-beach'] },
      { id: 'maison-revka',      name: 'Maison Revka',          location: 'Bluewaters',            tags: ['French', 'Elegant'],                   priceRange: '$$$$', vibe: 'French beach elegance', coordinates: VENUE_COORDINATES['maison-revka'], seoDescription: VENUE_SEO_DESCRIPTIONS['maison-revka'] },
      { id: 'nikki-beach',       name: 'Nikki Beach',           location: 'Pearl Jumeirah',        tags: ['International', 'Iconic'],             priceRange: '$$$$', vibe: 'Iconic global beach club',      trending: true, coordinates: VENUE_COORDINATES['nikki-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['nikki-beach'] },
      { id: 'nobu-beach',        name: 'Nobu by the Beach',     location: 'Atlantis The Royal',    tags: ['Japanese', 'Premium'],                 priceRange: '$$$$', vibe: 'Japanese beachside luxury', coordinates: VENUE_COORDINATES['nobu-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['nobu-beach'] },
      { id: 'casablanca-beach',  name: 'CasaBlanca Beach',      location: 'Atlantis The Palm',     tags: ['Mediterranean', 'Party'],              priceRange: '$$$$', vibe: 'Mediterranean beach vibe', coordinates: VENUE_COORDINATES['casablanca-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['casablanca-beach'] },
      { id: 'drift-beach',       name: 'Drift Beach',           location: 'Dubai Marina',          tags: ['Mediterranean', 'Serene'],             priceRange: '$$$$', vibe: 'Serene beachfront escape',       trending: true, coordinates: VENUE_COORDINATES['drift-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['drift-beach'] },
      { id: 'playa',             name: 'Playa',                 location: 'Palm Jumeirah',         tags: ['Latin', 'Beach', 'Energetic'],         priceRange: '$$$',  vibe: 'Latin beach energy', coordinates: VENUE_COORDINATES['playa'], seoDescription: VENUE_SEO_DESCRIPTIONS['playa'] },
      { id: 'terra-solis',       name: 'Terra Solis',           location: 'Jebel Ali Desert',      tags: ['Desert', 'Boho', 'Festival'],          priceRange: '$$$',  vibe: 'Desert oasis experience', coordinates: VENUE_COORDINATES['terra-solis'], seoDescription: VENUE_SEO_DESCRIPTIONS['terra-solis'] },
      { id: 'surf-beach',        name: 'Surf',                  location: 'Palm West Beach',       tags: ['Casual', 'Beach'],                     priceRange: '$$$',  vibe: 'Casual beach vibes', coordinates: VENUE_COORDINATES['surf-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['surf-beach'] },
      { id: 'gitano',            name: 'Gitano',                location: 'J1',                    tags: ['Mexican', 'Boho', 'Sunset'],           priceRange: '$$$',  vibe: 'Boho beach spirit',             isNew: true, coordinates: VENUE_COORDINATES['gitano'], seoDescription: VENUE_SEO_DESCRIPTIONS['gitano'] },
      { id: 'bch-club',          name: 'BCH',                   location: 'Palm Jumeirah',         tags: ['Mediterranean', 'Trendy'],             priceRange: '$$$',  vibe: 'Trendy beach scene', coordinates: VENUE_COORDINATES['bch-club'], seoDescription: VENUE_SEO_DESCRIPTIONS['bch-club'] },
      { id: 'kyma',              name: 'Kyma',                  location: 'Palm Jumeirah',         tags: ['Greek', 'Coastal'],                    priceRange: '$$$$', vibe: 'Greek coastal luxury', coordinates: VENUE_COORDINATES['kyma'], seoDescription: VENUE_SEO_DESCRIPTIONS['kyma'] },
      { id: 'casa-amor',         name: 'Casa Amor',             location: 'Mandarin Oriental',     tags: ['Mediterranean', 'Intimate'],           priceRange: '$$$$', vibe: 'Intimate beach luxury',          isNew: true, coordinates: VENUE_COORDINATES['casa-amor'], seoDescription: VENUE_SEO_DESCRIPTIONS['casa-amor'] },
      { id: 'ninive-beach',      name: 'Ninive Beach',          location: 'J1',                    tags: ['Moroccan', 'Exotic'],                  priceRange: '$$$',  vibe: 'Moroccan beach charm', coordinates: VENUE_COORDINATES['ninive-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['ninive-beach'] },
      { id: 'maison-de-la-plage',name: 'Maison De La Plage',    location: 'Palm Jumeirah',         tags: ['French', 'Riviera', 'Chic'],           priceRange: '$$$$', vibe: 'French Riviera vibes',           trending: true, coordinates: VENUE_COORDINATES['maison-de-la-plage'], seoDescription: VENUE_SEO_DESCRIPTIONS['maison-de-la-plage'] },
      { id: 'lucky-fish',        name: 'Lucky Fish',            location: 'Palm West Beach',       tags: ['Seafood', 'Fun'],                      priceRange: '$$$',  vibe: 'Fun beach seafood', coordinates: VENUE_COORDINATES['lucky-fish'], seoDescription: VENUE_SEO_DESCRIPTIONS['lucky-fish'] },
      { id: 'gallery-740',       name: 'Gallery 7/40',          location: 'Palm Jumeirah',         tags: ['Art', 'Beach', 'Creative'],            priceRange: '$$$',  vibe: 'Art-inspired beach', coordinates: VENUE_COORDINATES['gallery-740'], seoDescription: VENUE_SEO_DESCRIPTIONS['gallery-740'] },
      { id: 'o-beach',           name: 'O Beach',               location: 'JBR',                   tags: ['Party', 'Ibiza', 'Energetic'],         priceRange: '$$$',  vibe: 'Ibiza-style party', coordinates: VENUE_COORDINATES['o-beach'], seoDescription: VENUE_SEO_DESCRIPTIONS['o-beach'] },
      { id: 'zetta-pool',        name: 'Zetta Pool',            location: 'Address JBR',           tags: ['Pool', 'Lifestyle', 'Modern'],         priceRange: '$$$',  vibe: 'Modern pool lifestyle', coordinates: VENUE_COORDINATES['zetta-pool'], seoDescription: VENUE_SEO_DESCRIPTIONS['zetta-pool'] },
    ],
  },
  {
    id: 'night-clubs',
    title: 'Night Clubs',
    items: [
      { id: 'iris',            name: 'Iris',              location: 'Meydan',                tags: ['Rooftop', 'Open-Air'],              priceRange: '$$$',  vibe: 'Open-air rooftop nights',        trending: true, coordinates: VENUE_COORDINATES['iris'], seoDescription: VENUE_SEO_DESCRIPTIONS['iris'] },
      { id: 'epik',            name: 'Epik',              location: 'Meydan',                tags: ['High-Energy', 'Festival'],          priceRange: '$$$',  vibe: 'High-energy nightlife', coordinates: VENUE_COORDINATES['epik'], seoDescription: VENUE_SEO_DESCRIPTIONS['epik'] },
      { id: 'nyx',             name: 'Nyx',               location: 'By Gaia DIFC',          tags: ['Luxury', 'Underground'],            priceRange: '$$$$', vibe: 'Luxury underground',             trending: true, coordinates: VENUE_COORDINATES['nyx'], seoDescription: VENUE_SEO_DESCRIPTIONS['nyx'] },
      { id: 'ly-la',           name: 'Ly-La',             location: 'By Alaya DIFC',         tags: ['Intimate', 'Exclusive'],            priceRange: '$$$$', vibe: 'Intimate exclusive', coordinates: VENUE_COORDINATES['ly-la'], seoDescription: VENUE_SEO_DESCRIPTIONS['ly-la'] },
      { id: 'paraiso-rooftop', name: 'Paraiso Rooftop',   location: 'By Amazonico DIFC',     tags: ['Rooftop', 'Latin'],                 priceRange: '$$$',  vibe: 'Latin rooftop vibes', coordinates: VENUE_COORDINATES['paraiso-rooftop'], seoDescription: VENUE_SEO_DESCRIPTIONS['paraiso-rooftop'] },
      { id: 'blume-lounge',    name: 'Blume Lounge',      location: 'Downtown',              tags: ['Lounge', 'Chic'],                   priceRange: '$$$',  vibe: 'Chic lounge ambiance', coordinates: VENUE_COORDINATES['blume-lounge'], seoDescription: VENUE_SEO_DESCRIPTIONS['blume-lounge'] },
      { id: 'shanghai-me-nc',  name: 'Shanghai Me',       location: 'DIFC',                  tags: ['Chinese', 'Late-Night'],            priceRange: '$$$$', vibe: 'Late-night sophistication', coordinates: VENUE_COORDINATES['shanghai-me-nc'], seoDescription: VENUE_SEO_DESCRIPTIONS['shanghai-me-nc'] },
      { id: 'rasputine',       name: 'Rasputine',         location: 'DIFC',                  tags: ['Parisian', 'Exclusive'],            priceRange: '$$$$', vibe: 'Parisian nightlife',              trending: true, coordinates: VENUE_COORDINATES['rasputine'], seoDescription: VENUE_SEO_DESCRIPTIONS['rasputine'] },
      { id: 'avenue',          name: 'Avenue',            location: 'Shangri-La Hotel SZR',  tags: ['Classic', 'R&B'],                   priceRange: '$$$',  vibe: 'Classic Dubai club', coordinates: VENUE_COORDINATES['avenue'], seoDescription: VENUE_SEO_DESCRIPTIONS['avenue'] },
      { id: 'ora',             name: 'Ora',               location: 'Habtoor City',          tags: ['Modern', 'Underground'],            priceRange: '$$$',  vibe: 'Modern underground', coordinates: VENUE_COORDINATES['ora'], seoDescription: VENUE_SEO_DESCRIPTIONS['ora'] },
      { id: 'secret-room',     name: 'Secret Room',       location: 'Downtown',              tags: ['Hidden', 'VIP'],                    priceRange: '$$$$', vibe: 'Hidden exclusive venue',          trending: true, coordinates: VENUE_COORDINATES['secret-room'], seoDescription: VENUE_SEO_DESCRIPTIONS['secret-room'] },
      { id: 'socialista',      name: 'Socialista',        location: 'Cipriani DIFC',         tags: ['Cuban', 'Glamour'],                 priceRange: '$$$$', vibe: 'Cuban-inspired glamour', coordinates: VENUE_COORDINATES['socialista'], seoDescription: VENUE_SEO_DESCRIPTIONS['socialista'] },
      { id: 'soho-garden',     name: 'Soho Garden',       location: 'Meydan',                tags: ['Festival', 'Multi-Venue'],          priceRange: '$$$',  vibe: 'Festival-style nightlife',        trending: true, coordinates: VENUE_COORDINATES['soho-garden'], seoDescription: VENUE_SEO_DESCRIPTIONS['soho-garden'] },
      { id: 'code',            name: 'Code',              location: 'By Soho Garden Meydan', tags: ['Electronic', 'Underground'],         priceRange: '$$$',  vibe: 'Electronic underground',          isNew: true, coordinates: VENUE_COORDINATES['code'], seoDescription: VENUE_SEO_DESCRIPTIONS['code'] },
      { id: 'babylon-nc',      name: 'Babylon',           location: 'DIFC',                  tags: ['Lounge', 'Late-Night'],             priceRange: '$$$',  vibe: 'Ancient meets modern', coordinates: VENUE_COORDINATES['babylon-nc'], seoDescription: VENUE_SEO_DESCRIPTIONS['babylon-nc'] },
      { id: 'litt',            name: 'Litt',              location: 'KIRA',                  tags: ['High-Energy', 'Vibrant'],           priceRange: '$$$',  vibe: 'High-energy vibes',               isNew: true, coordinates: VENUE_COORDINATES['litt'], seoDescription: VENUE_SEO_DESCRIPTIONS['litt'] },
      { id: 'ongaku',          name: 'Ongaku',            location: 'By Clap DIFC',          tags: ['Japanese', 'Nightlife'],            priceRange: '$$$$', vibe: 'Japanese-inspired nightlife', coordinates: VENUE_COORDINATES['ongaku'], seoDescription: VENUE_SEO_DESCRIPTIONS['ongaku'] },
    ],
  },
  {
    id: 'dining-entertainment',
    title: 'Dining & Entertainment',
    items: [
      { id: 'adaline',        name: 'Adaline',           location: 'DIFC',                  tags: ['Immersive', 'Dinner Show'],         priceRange: '$$$$', vibe: 'Immersive dinner show',           trending: true, coordinates: VENUE_COORDINATES['adaline'], seoDescription: VENUE_SEO_DESCRIPTIONS['adaline'] },
      { id: 'aretha',         name: 'Aretha',            location: 'Palm Jumeirah',         tags: ['Live', 'Performance'],              priceRange: '$$$$', vibe: 'Live performance dining', coordinates: VENUE_COORDINATES['aretha'], seoDescription: VENUE_SEO_DESCRIPTIONS['aretha'] },
      { id: 'dream',          name: 'Dream',             location: 'JBR',                   tags: ['Theatrical', 'Dinner Show'],        priceRange: '$$$$', vibe: 'Theatrical dining experience',    trending: true, coordinates: VENUE_COORDINATES['dream'], seoDescription: VENUE_SEO_DESCRIPTIONS['dream'] },
      { id: 'gatsby',         name: 'Gatsby',            location: 'The Palm',              tags: ['Dinner Party', 'Luxury'],           priceRange: '$$$$', vibe: 'Roaring dinner party', coordinates: VENUE_COORDINATES['gatsby'], seoDescription: VENUE_SEO_DESCRIPTIONS['gatsby'] },
      { id: 'theater',        name: 'Theater',           location: 'Fairmont SZR',          tags: ['Show', 'Spectacular'],              priceRange: '$$$$', vibe: 'Spectacular show dining', coordinates: VENUE_COORDINATES['theater'], seoDescription: VENUE_SEO_DESCRIPTIONS['theater'] },
      { id: 'billionaire',    name: 'Billionaire',       location: 'Downtown',              tags: ['Dinner Show', 'Luxury', 'Iconic'],  priceRange: '$$$$', vibe: 'Ultimate dinner spectacle',       trending: true, coordinates: VENUE_COORDINATES['billionaire'], seoDescription: VENUE_SEO_DESCRIPTIONS['billionaire'] },
      { id: 'babylon-de',     name: 'Babylon',           location: 'DIFC',                  tags: ['Dining', 'Nightlife', 'Hybrid'],    priceRange: '$$$',  vibe: 'Night meets cuisine', coordinates: VENUE_COORDINATES['babylon-de'], seoDescription: VENUE_SEO_DESCRIPTIONS['babylon-de'] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAllVenues(): (VenueItem & { categoryId: string })[] {
  return VENUE_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryId: cat.id }))
  );
}

export function locationMatches(venueLocation: string, filter: string): boolean {
  if (filter === 'All Areas') return true;
  return venueLocation.toLowerCase().includes(filter.toLowerCase());
}

export function vibeMatches(venue: VenueItem, vibeId: string): boolean {
  if (vibeId === 'all') return true;
  const combined = [venue.vibe, ...venue.tags].join(' ').toLowerCase();
  const keywords: Record<string, string[]> = {
    'fine-dining': ['fine dining', 'gastronomic', 'classic', 'award-winning'],
    'party':       ['party', 'lively', 'festival', 'energetic', 'high-energy', 'ibiza'],
    'lively':      ['lively', 'vibrant', 'fun', 'playful', 'energetic'],
    'chic':        ['chic', 'trendy', 'modern', 'artistic', 'sophisticated', 'glamorous'],
    'beachfront':  ['beach', 'beachside', 'beachfront', 'coastal', 'seaside', 'pool'],
    'skyline':     ['skyline', 'rooftop', 'open-air', 'terrace'],
    'immersive':   ['immersive', 'show', 'theatrical', 'performance', 'dinner show'],
    'exclusive':   ['exclusive', 'hidden', 'vip', 'intimate', 'secret', 'underground'],
  };
  const kws = keywords[vibeId];
  if (!kws) return true;
  return kws.some((k) => combined.includes(k));
}
