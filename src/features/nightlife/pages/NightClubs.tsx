"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowUpRight, Star, X, MapPin, Clock, Music } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';

interface Club {
  id: string;
  name: string;
  folder: string;
  area: string;
  vibe: string;
  description_short: string;
  description_long: string;
  is_featured: boolean;
  recommend_score: number;
  opening_hours: string;
  music: string;
  dress_code: string;
}

const CLUBS: Club[] = [
  {
    id: 'avenue',
    name: 'Avenue',
    folder: 'Avenue',
    area: 'Shangri-La Hotel, SZR',
    vibe: 'Superclub',
    description_short: "Dubai's statement superclub inside the Shangri-La on Sheikh Zayed Road â€” where A-list DJs command a massive dance floor and VIP tables line the perimeter.",
    description_long: "Avenue is one of Dubai's most celebrated superclub destinations, rising inside the iconic Shangri-La Hotel on Sheikh Zayed Road. Known for its exceptional atmosphere, world-class DJ programme, and premium bottle service, it stands as a benchmark venue in the city's elite nightlife circuit.",
    is_featured: true,
    recommend_score: 95,
    opening_hours: 'Thu â€“ Sat: 10 PM â€“ 4 AM',
    music: 'House Â· Hip-Hop Â· Commercial',
    dress_code: 'Smart Elegant â€“ No Sports Wear',
  },
  {
    id: 'babylon',
    name: 'Babylon',
    folder: 'Babylon',
    area: 'DIFC',
    vibe: 'Lounge Club',
    description_short: 'An opulent club in the heart of DIFC, fusing bold dÃ©cor with a global beats soundtrack and Miami-style energy.',
    description_long: "Babylon brings an unapologetically rich aesthetic to DIFC. Think dramatic interiors, velvet booths, and a programming slate that moves between Eastern rhythms and global house music. The venue draws a cosmopolitan crowd seeking late-night energy in DIFC's most storied district.",
    is_featured: true,
    recommend_score: 92,
    opening_hours: 'Wed â€“ Sat: 9 PM â€“ 3 AM',
    music: 'House Â· Hip-Hop Â· R&B',
    dress_code: 'Smart Elegant',
  },
  {
    id: 'blume-lounge',
    name: 'Blume Lounge',
    folder: 'Blume_Lounge',
    area: 'Dubai',
    vibe: 'Lounge & Club',
    description_short: 'A sophisticated lounge-club with an intimate vibe, craft cocktail programme, and a curated night of live and electronic music.',
    description_long: "Blume Lounge delivers a refined nightlife experience for those who prefer elegance over spectacle. Its interior is plush and inviting, with a dedicated bar team and a programme that runs from relaxed lounge hours through to a full late-night club set.",
    is_featured: false,
    recommend_score: 87,
    opening_hours: 'Tue â€“ Sat: 8 PM â€“ 2 AM',
    music: 'Deep House Â· Chill Â· Live Music',
    dress_code: 'Smart Casual',
  },
  {
    id: 'code',
    name: 'Code',
    folder: 'Code',
    area: 'Soho Garden, Meydan',
    vibe: 'Underground Club',
    description_short: 'The underground room at Soho Garden â€” dark, bass-heavy, and built for serious music lovers seeking an authentic club experience in Dubai.',
    description_long: "Code operates as Soho Garden's dedicated underground music space at Meydan. With a focus on techno, dark house, and international underground talent, it stands apart from Dubai's mainstream nightlife. A space where the music is always the headliner.",
    is_featured: true,
    recommend_score: 94,
    opening_hours: 'Fri â€“ Sat: 11 PM â€“ 6 AM',
    music: 'Techno Â· Dark House Â· Underground',
    dress_code: 'Dark colours preferred',
  },
  {
    id: 'epik',
    name: 'Epik',
    folder: 'Epik',
    area: 'Meydan Grandstand',
    vibe: 'Arabic Nightclub',
    description_short: "Dubai's best Arabic nightclub at Meydan Grandstand â€” DJ Bliss, DJ Kaboo, and Mr. Shef Codes bring house and Afro house energy to a dancefloor that never stops.",
    description_long: 'EPIK Dubai fuses cutting-edge technology with unparalleled entertainment at the iconic Meydan Grandstand. Tuesdays are legendary â€” DJ Bliss, DJ Kaboo, and Mr. Shef Codes light up the dancefloor with the hottest house and Afro house beats. Expect electrifying vibes, non-stop grooves, and a night of pure energy.',
    is_featured: true,
    recommend_score: 96,
    opening_hours: 'Tue & Thu â€“ Sat: 10 PM â€“ 4 AM',
    music: 'House Â· Afro House Â· Arabic',
    dress_code: 'Smart / Elegant',
  },
  {
    id: 'iris',
    name: 'Iris',
    folder: 'Iris',
    area: 'Meydan',
    vibe: 'Outdoor Club',
    description_short: "A landmark open-air nightlife destination at Meydan with multiple terraces, international DJ bookings, and Dubai's most electric outdoor atmosphere.",
    description_long: "Iris at Meydan is one of Dubai's most enduring nightlife institutions. Set across outdoor terraces with sweeping views, it delivers a world-class DJ programme alongside premium bottle service and an atmosphere that builds from sunset through to the early hours.",
    is_featured: true,
    recommend_score: 93,
    opening_hours: 'Wed â€“ Sat: 8 PM â€“ 3 AM',
    music: 'Commercial House Â· R&B Â· Hip-Hop',
    dress_code: 'Smart Casual',
  },
  {
    id: 'litt',
    name: 'Litt',
    folder: 'Litt',
    area: 'KIRA, Dubai',
    vibe: 'High-Energy Club',
    description_short: "KIRA's most electric nightlife destination â€” a high-energy club space with nightly DJ sets in a bold, immersive setting.",
    description_long: "Litt brings relentless energy to its home at KIRA. The venue's striking interior and powerful sound system create an atmosphere built for maximum impact. Expect hip-hop and R&B nights alongside international guest DJ appearances.",
    is_featured: false,
    recommend_score: 88,
    opening_hours: 'Thu â€“ Sat: 10 PM â€“ 4 AM',
    music: 'Hip-Hop Â· R&B Â· Trap',
    dress_code: 'Smart Casual',
  },
  {
    id: 'ly-la',
    name: 'Ly-La',
    folder: 'Ly-La',
    area: 'Alaya, DIFC',
    vibe: 'Chic Club',
    description_short: 'Tucked within Alaya in DIFC, Ly-La combines refined design, an intimate dance floor, and a seductive soundtrack for an exclusive late-night crowd.',
    description_long: "Ly-La lives inside the Alaya venue in DIFC, carving out a space that feels entirely its own. Understated luxury meets a curated club experience â€” intimate enough to feel exclusive, electric enough to keep you until the lights come on.",
    is_featured: true,
    recommend_score: 91,
    opening_hours: 'Wed â€“ Sat: 9 PM â€“ 3 AM',
    music: 'Dark House Â· Nu-Disco Â· Electronic',
    dress_code: 'Smart Elegant',
  },
  {
    id: 'nyx',
    name: 'Nyx',
    folder: 'Nyx',
    area: 'Gaia, DIFC',
    vibe: 'After-Hours Club',
    description_short: 'The late-night extension of Gaia DIFC â€” Nyx takes over after dinner and transforms into one of the most sought-after after-hours spaces in the city.',
    description_long: "Named for the Greek goddess of night, Nyx operates as the after-dark alter ego of Gaia in DIFC. The restaurant's guests stay as the music builds, and by midnight Nyx is fully alive â€” a sophisticated space for the city's most discerning night owls.",
    is_featured: false,
    recommend_score: 92,
    opening_hours: 'Wed â€“ Sat: 11 PM â€“ 4 AM',
    music: 'Electronic Â· House Â· Afrobeats',
    dress_code: 'Smart Elegant',
  },
  {
    id: 'ongaku',
    name: 'Ongaku',
    folder: 'Ongaku',
    area: 'Clap, DIFC',
    vibe: 'Japanese Club',
    description_short: 'The after-dark face of Clap DIFC â€” Ongaku ("music" in Japanese) delivers precision sound, Japanese-inspired aesthetics, and a tight programme of electronic artists.',
    description_long: '"Ongaku" is Japanese for music, and this venue lives up to its name within the Clap restaurant space in DIFC. Transitioning from a renowned Japanese dining experience into a curated late-night club, Ongaku offers one of Dubai\'s most audiophile-focused club experiences.',
    is_featured: false,
    recommend_score: 90,
    opening_hours: 'Thu â€“ Sat: 11 PM â€“ 4 AM',
    music: 'Electronic Â· Japanese House Â· Rave',
    dress_code: 'Fashion-forward',
  },
  {
    id: 'ora',
    name: 'Ora',
    folder: 'Ora',
    area: 'Habtoor City',
    vibe: 'Luxury Club',
    description_short: "An exclusive luxury club at Habtoor City, where VIP booths, premium bottle service, and a high-calibre DJ programme define Dubai's most aspirational night out.",
    description_long: 'Ora at Habtoor City is designed for an elite tier of Dubai nightlife. Set within the magnificent W Dubai â€“ Al Habtoor City, the venue blends world-class design with an expertly curated music programme â€” from commercial house to Afrohouse â€” alongside impeccable service.',
    is_featured: true,
    recommend_score: 96,
    opening_hours: 'Wed â€“ Sat: 9 PM â€“ 4 AM',
    music: 'House Â· Commercial Â· Afrohouse',
    dress_code: 'Cocktail Attire â€“ Strict Door',
  },
  {
    id: 'paraiso-rooftop',
    name: 'Paraiso Rooftop',
    folder: 'Paraiso_Rooftop',
    area: 'Amazonico, DIFC',
    vibe: 'Rooftop Club',
    description_short: 'The rooftop extension of Amazonico in DIFC â€” a lush Latin-tropical experience with open skies, DJ sets, and an Amazonian energy above the city.',
    description_long: "Paraiso Rooftop sits atop Amazonico DIFC, bringing a rainforest energy to Dubai's skyline. Tropical dÃ©cor, live percussion elements, and a soundtrack that journeys from Afrobeats to reggaeton make this one of the city's most vibrant rooftop experiences.",
    is_featured: false,
    recommend_score: 89,
    opening_hours: 'Thu â€“ Sat: 9 PM â€“ 3 AM',
    music: 'Reggaeton Â· Latin House Â· Afrobeats',
    dress_code: 'Tropical Chic',
  },
  {
    id: 'rasputine',
    name: 'Rasputine',
    folder: 'Rasputine',
    area: 'DIFC',
    vibe: 'Imperial Club',
    description_short: "A lavishly theatrical DIFC venue channelling Imperial Russian decadence â€” live violinists, champagne ceremonies, and an atmosphere unlike anything else in the Gulf.",
    description_long: "Rasputine reimagines Tsarist Russian opulence in the heart of DIFC. Crystal chandeliers, velvet curtains, live violinists moving between tables, and a champagne service conducted like theatre make it one of Dubai's most dramatic and memorable nightlife experiences.",
    is_featured: true,
    recommend_score: 95,
    opening_hours: 'Wed â€“ Sat: 9 PM â€“ 4 AM',
    music: 'Contemporary Club Â· Russian Pop Â· House',
    dress_code: 'Formal â€“ Evening Wear',
  },
  {
    id: 'secret-room',
    name: 'Secret Room',
    folder: 'Secret_Room',
    area: 'Downtown Dubai',
    vibe: 'Speakeasy',
    description_short: "Downtown Dubai's most discreet venue â€” entry through a hidden door, intimate capacity, and a carefully guarded guest list for those in the know.",
    description_long: "The Secret Room is exactly what it sounds like â€” a hidden speakeasy-style club in Downtown Dubai that operates by invitation and word of mouth. No sign, no obvious entrance. Behind a concealed door lies one of Dubai's most intimate and coveted nocturnal experiences.",
    is_featured: false,
    recommend_score: 93,
    opening_hours: 'Fri â€“ Sat: 11 PM â€“ Late',
    music: 'House Â· Soul Â· Eclectic',
    dress_code: 'Smart â€“ Invitation preferred',
  },
  {
    id: 'shanghai-me',
    name: 'Shanghai Me',
    folder: 'Shanghai_Me',
    area: 'DIFC',
    vibe: 'Asian Fusion Club',
    description_short: "A DIFC icon â€” Shanghai Me's 1930s Art Deco aesthetic, acclaimed Pan-Asian kitchen, and late-night DJ programme have made it one of the most enduring venues in the city.",
    description_long: "Shanghai Me is one of DIFC's most storied and celebrated addresses. Inspired by 1930s Shanghai glamour, the venue moves seamlessly from one of Dubai's best Pan-Asian dining experiences into a full late-night club atmosphere, attracting a faithful, international crowd.",
    is_featured: true,
    recommend_score: 94,
    opening_hours: 'Daily: 7 PM â€“ 3 AM',
    music: 'Nu-Disco Â· House Â· Oriental Fusion',
    dress_code: 'Smart Elegant',
  },
  {
    id: 'socialista',
    name: 'Socialista',
    folder: 'Socialista',
    area: 'Cipriani, Dubai',
    vibe: 'Latin Club',
    description_short: 'The late-night chapter of Cipriani Dubai â€” Socialista channels Havana spirit with a Latin DJ programme, elaborate cocktails, and an infectious dancefloor energy.',
    description_long: "Socialista captures the vibrant spirit of revolutionary Havana within the iconic Cipriani venue in Dubai. Live Latin rhythms, expertly mixed mojitos, and a programming slate that spans salsa to reggaeton create the most joyful clubbing experience in the city.",
    is_featured: false,
    recommend_score: 88,
    opening_hours: 'Wed â€“ Sat: 9 PM â€“ 3 AM',
    music: 'Latin Â· Reggaeton Â· Salsa',
    dress_code: 'Smart Casual',
  },
  {
    id: 'soho-garden',
    name: 'Soho Garden',
    folder: 'Soho_Garden',
    area: 'Meydan',
    vibe: 'Festival Club',
    description_short: "Dubai's most expansive nightlife destination at Meydan â€” multiple indoor and outdoor spaces hosting global headline acts in a festival-scale environment.",
    description_long: "Soho Garden at Meydan is in a class entirely its own. With seven distinct spaces spread across the Meydan Racecourse grounds â€” including Code's underground room â€” it hosts everything from intimate acoustic sessions to sold-out headline acts. The closest Dubai gets to a permanent festival.",
    is_featured: true,
    recommend_score: 97,
    opening_hours: 'Thu â€“ Sat: 8 PM â€“ 6 AM',
    music: 'All Genres â€“ Multiple Stages',
    dress_code: 'Smart Casual',
  },
];

// â”€â”€â”€ Club Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ClubModal({ club, onClose }: { club: Club; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-[#0c0a07] border border-white/10 overflow-hidden max-h-[95vh] overflow-y-auto"
        >
          {/* Image pair */}
          <div className="grid grid-cols-2 h-64">
            <img
              src={`/images/nightclubs/${club.folder}/image1.jpg`}
              alt={club.name}
              className="w-full h-full object-cover"
            />
            <img
              src={`/images/nightclubs/${club.folder}/image2.jpg`}
              alt={`${club.name} atmosphere`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-1">{club.vibe}</p>
                <h2 className="text-3xl font-display text-white">{club.name}</h2>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  {club.area}, Dubai
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-8 border-l-2 border-luxury-gold/30 pl-4">
              {club.description_long}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Clock, label: 'Hours', value: club.opening_hours },
                { icon: Music, label: 'Music', value: club.music },
                { icon: Star, label: 'Dress Code', value: club.dress_code },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5 text-luxury-gold" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-600">{label}</span>
                  </div>
                  <p className="text-white text-sm">{value}</p>
                </div>
              ))}
            </div>
            <Link
              href="/request"
              className="w-full flex items-center justify-center gap-2 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
            >
              Reserve a Table <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// â”€â”€â”€ Club Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ClubCard({ club, index, onClick }: { club: Club; index: number; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="group text-left w-full"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#111] mb-4">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />
        <img
          src={`/images/nightclubs/${club.folder}/image1.jpg`}
          alt={club.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />

        {club.is_featured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
              Editor's Pick
            </span>
          </div>
        )}

        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]">
          <div className="px-6 py-3 border border-white/40 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Insider Guide <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-2xl md:text-3xl font-display text-white group-hover:text-luxury-gold transition-colors duration-300">
            {club.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mt-1 font-medium">
            <span className="text-luxury-gold">{club.vibe}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>{club.area}</span>
          </div>
        </div>
        {club.recommend_score > 93 && (
          <div className="flex items-center gap-1 opacity-60 mt-1">
            <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 max-w-md font-light border-l border-white/10 pl-3 mt-2 px-1">
        {club.description_short}
      </p>
    </motion.button>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function NightClubs() {
  const [activeClub, setActiveClub] = useState<Club | null>(null);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/nightclubs/Nyx/image1.jpg"
            alt="Dubai Night Clubs"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <h2 className="text-luxury-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6">
            After Dark Elite
          </h2>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-tight">
            Night Clubs
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Access the inaccessible. From hidden speakeasies in DIFC to high-energy superclubs
            hosting the world's best DJs. Your table is waiting.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="pb-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {CLUBS.map((club, index) => (
            <ClubCard
              key={club.id}
              club={club}
              index={index}
              onClick={() => setActiveClub(club)}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {activeClub && (
        <ClubModal club={activeClub} onClose={() => setActiveClub(null)} />
      )}

      <Footer />
    </div>
  );
}
