"use client";

import React, { useState, useCallback } from "react";
import Navbar from "../../../components/navigation/Navbar";
import Footer from "../../../components/navigation/Footer";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  X,
  UtensilsCrossed,
  Clock,
  Star,
  ChevronDown,
  Navigation2,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  folder: string;
  image: string;
  location: string;
  area: string;
  cuisine: string;
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
}

const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Nobu",
    folder: "Nobu",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    location: "Atlantis The Palm",
    area: "Palm Jumeirah",
    cuisine: "Japanese",
    vibe: "Iconic",
    price_tier: 4,
    tagline: "Where East meets luxury on the Palm",
    description:
      "Nobu at Atlantis The Palm is the crown jewel of Dubai's Japanese dining scene. Chef Nobu Matsuhisa's legendary new-style Japanese cuisine meets the opulence of Atlantis in a setting that redefines what a great dinner looks like.",
    highlights: [
      "🍣 Signature Black Cod Miso",
      "🥂 Omakase Tasting Menus",
      "🌊 Panoramic ocean views",
      "📅 Best: Thursday–Saturday dinners",
    ],
    hours: "6pm – 1am",
    dress_code: "Resort Chic",
    best_for: "Special occasions",
    map_query: "Nobu Dubai Atlantis The Palm",
    featured: true,
    trending: true,
  },
  {
    id: "2",
    name: "Bagatelle",
    folder: "Bagatelle",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    location: "Fairmont SZR",
    area: "Sheikh Zayed Road",
    cuisine: "French Mediterranean",
    vibe: "Social",
    price_tier: 4,
    tagline: "Paris meets Dubai in Fairmont's crown",
    description:
      "Bagatelle is the Parisian import that took Dubai by storm. Its famed Saturday brunch and electric weeknight parties make it the epicenter of Dubai's see-and-be-seen dining culture — where food meets spectacle.",
    highlights: [
      "🥂 Legendary Saturday Brunch",
      "🎵 Live DJ sets",
      "🗼 French-Mediterranean menu",
      "👗 Dressed to impress",
    ],
    hours: "12pm – 2am",
    dress_code: "Smart Glamorous",
    best_for: "Saturday brunch, celebrations",
    map_query: "Bagatelle Dubai Fairmont SZR",
    trending: true,
  },
  {
    id: "3",
    name: "Hakkasan",
    folder: "Hakkasan",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    location: "Atlantis The Palm",
    area: "Palm Jumeirah",
    cuisine: "Chinese",
    vibe: "Glamorous",
    price_tier: 4,
    tagline: "Michelin-pedigree Cantonese at its finest",
    description:
      "Hakkasan brings its coveted Michelin star heritage to Atlantis The Palm. Dark wood, flickering candles, and masterfully crafted Cantonese cuisine in one of Dubai's most electrifying venues.",
    highlights: [
      "⭐ Michelin-star heritage",
      "🦐 Har Gau & Peking Duck",
      "🎶 DJ-powered weekends",
      "🌙 Theatrical interior design",
    ],
    hours: "6pm – 2am",
    dress_code: "Smart Chic",
    best_for: "Culinary experiences",
    map_query: "Hakkasan Dubai Atlantis The Palm",
  },
  {
    id: "4",
    name: "Coya",
    folder: "Coya",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
    location: "Four Seasons DIFC",
    area: "DIFC",
    cuisine: "Peruvian",
    vibe: "Intimate",
    price_tier: 4,
    tagline: "Inca soul with Dubai skyline drama",
    description:
      "COYA brings the soul of Peru to Dubai's financial heartland. Inspired by Incan culture, the menu is a love letter to ceviche, tiradito, and rare Pisco selections — served in a moody, richly decorated space.",
    highlights: [
      "🍋 Signature Tiger's Milk Ceviche",
      "🥃 Award-winning Pisco Bar",
      "🎺 Latin live music",
      "🏔️ Andean-inspired design",
    ],
    hours: "12pm – 1am",
    dress_code: "Smart Casual",
    best_for: "Date nights, business dinners",
    map_query: "COYA Dubai Four Seasons DIFC",
  },
  {
    id: "5",
    name: "Amazonico",
    folder: "Amazonico",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC",
    area: "DIFC",
    cuisine: "Latin American",
    vibe: "Wild & Lush",
    price_tier: 3,
    tagline: "Tropical rainforest meets fine dining",
    description:
      "Step into the Amazon without leaving Dubai. Amazonico's extraordinary jungle interior — complete with tropical trees, macaw-inspired art, and exotic foliage — houses one of the city's most inventive kitchens.",
    highlights: [
      "🌿 Rainforest immersive interior",
      "🐟 Rare Amazon fish dishes",
      "🍹 Exotic tropical cocktails",
      "🦜 Theatre dining experience",
    ],
    hours: "6pm – 2am",
    dress_code: "Smart Chic",
    best_for: "Immersive dining",
    map_query: "Amazonico Dubai DIFC",
    trending: true,
  },
  {
    id: "6",
    name: "Salvaje",
    folder: "Salvaje",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC",
    area: "DIFC",
    cuisine: "Spanish",
    vibe: "Bold",
    price_tier: 3,
    tagline: "Raw, wild, uncaged Spanish passion",
    description:
      'Salvaje — Spanish for "wild" — is the untamed new kid on DIFC\'s block. A primal energy runs through the space: roaring grills, wild meat cuts, and an anarchic spirit that makes every meal an event.',
    highlights: [
      "🔥 Live fire cooking theater",
      "🥩 Iberian prime cuts",
      "💃 Flamenco-inspired service",
      "🍷 Deep Spanish wine list",
    ],
    hours: "7pm – 2am",
    dress_code: "Smart Edgy",
    best_for: "Bold culinary adventures",
    map_query: "Salvaje Dubai DIFC",
  },
  {
    id: "7",
    name: "Sexy Fish",
    folder: "Sexy_Fish",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC",
    area: "DIFC",
    cuisine: "Asian",
    vibe: "Art Lovers",
    price_tier: 4,
    tagline: "Where art and omakase collide",
    description:
      "Sexy Fish is a destination in its own right. Damien Hirst artwork, Frank Gehry designed interiors, and an Asian menu of extraordinary refinement. This is dining as cultural experience — a total assault on the senses.",
    highlights: [
      "🎨 Damien Hirst original works",
      "🏛️ Frank Gehry architecture",
      "🐟 Omakase & sharing platters",
      "🥂 Theatrical cocktail theater",
    ],
    hours: "12pm – 1am",
    dress_code: "Fashion Forward",
    best_for: "Art lovers, power lunches",
    map_query: "Sexy Fish Dubai DIFC",
    featured: true,
  },
  {
    id: "8",
    name: "Nammos",
    folder: "Nammos",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1200&auto=format&fit=crop",
    location: "Four Seasons Resort",
    area: "Jumeirah",
    cuisine: "Mediterranean",
    vibe: "Beach Luxury",
    price_tier: 4,
    tagline: "Mykonos glamour on Dubai's shoreline",
    description:
      "The legendary Mykonos beach club experience transplanted to Dubai's Four Seasons Resort. Nammos is the gold standard for sun-drenched Mediterranean dining — where the seafood is flown in fresh and the rosé flows freely.",
    highlights: [
      "🦞 Fresh imported seafood daily",
      "🌊 Beachfront dining terrace",
      "🎵 Signature DJ afternoons",
      "🥗 Greek & Mediterranean menu",
    ],
    hours: "12pm – 11pm",
    dress_code: "Beach Chic",
    best_for: "Lazy luxe afternoons",
    map_query: "Nammos Dubai Four Seasons",
  },
  {
    id: "9",
    name: "Ce La Vi",
    folder: "Ce_La_Vi",
    image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=1200&auto=format&fit=crop",
    location: "Address Sky View",
    area: "Downtown",
    cuisine: "Asian Contemporary",
    vibe: "Skyline",
    price_tier: 3,
    tagline: "Burj Khalifa at eye level",
    description:
      "CE LA VI floats 42 floors above Downtown Dubai with the Burj Khalifa as its living backdrop. The menu blends pan-Asian cuisine with innovative cocktails in a space where every table has a view worth the price of admission.",
    highlights: [
      "🏙️ Direct Burj Khalifa views",
      "🍜 Pan-Asian contemporary menu",
      "🍸 Sky-high cocktail bar",
      "🌅 Legendary sunset service",
    ],
    hours: "12pm – 2am",
    dress_code: "Smart Pres",
    best_for: "Sunset views, celebrations",
    map_query: "Ce La Vi Dubai Address Sky View",
    trending: true,
  },
  {
    id: "10",
    name: "Shanghai Me",
    folder: "Shanghai_Me",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC",
    area: "DIFC",
    cuisine: "Chinese",
    vibe: "Art Deco",
    price_tier: 3,
    tagline: "1930s Shanghai transported to DIFC",
    description:
      "Shanghai Me channels the glamour of 1930s Shanghai with ornate Art Deco design, dim sum served on lacquer trolleys, and a curated selection of Chinese teas and rare spirits. A meal here is a journey through time.",
    highlights: [
      "🥟 Artisan dim sum service",
      "🫖 Rare Chinese tea collection",
      "🎪 1930s Art Deco setting",
      "🎷 Jazz live performances",
    ],
    hours: "12pm – 1am",
    dress_code: "Elegant Smart",
    best_for: "Dim sum lunch, romantic dinners",
    map_query: "Shanghai Me Dubai DIFC",
  },
  {
    id: "11",
    name: "Nazcaa",
    folder: "Nazcaa",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
    location: "FIVE Palm Jumeirah",
    area: "Palm Jumeirah",
    cuisine: "Peruvian-Japanese",
    vibe: "Fusion Fire",
    price_tier: 3,
    tagline: "Nikkei cuisine with Palm drama",
    description:
      "Nazcaa masterfully fuses Japanese precision with Peruvian fire in the high-energy environment of FIVE Palm. The Nikkei menu is a culinary adventure — from rock shrimp tempura to melt-in-mouth sashimi with aji amarillo.",
    highlights: [
      "🍱 Nikkei fusion cuisine",
      "🎆 Weekly fire shows",
      "🌴 Palm Jumeirah terrace",
      "🍹 Pisco-Sake cocktail menu",
    ],
    hours: "6pm – 2am",
    dress_code: "Smart Party",
    best_for: "Fusion dining, party nights",
    map_query: "Nazcaa Dubai FIVE Palm",
    trending: true,
  },
  {
    id: "12",
    name: "Krasota",
    folder: "Krasota",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC",
    area: "DIFC",
    cuisine: "Russian-European",
    vibe: "Theatrical",
    price_tier: 4,
    tagline: "Gastronomic theatre from Moscow's finest",
    description:
      'Krasota — meaning "beauty" in Russian — delivers a multi-sensorial dining experience where art installations change with every season. From Moscow to Dubai, each course is paired with projected art and live performance.',
    highlights: [
      "🎭 Immersive art installations",
      "🎨 Seasonal menu art pairings",
      "🍽️ 12-course tasting experience",
      "🎬 Cinematic dining format",
    ],
    hours: "7pm – 12am",
    dress_code: "Formal",
    best_for: "Bucket-list dining experiences",
    map_query: "Krasota Dubai DIFC",
    featured: true,
  },
  {
    id: "13",
    name: "1920",
    folder: "1920",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    location: "Burj Al Arab",
    area: "Jumeirah",
    cuisine: "Lebanese",
    vibe: "Heritage",
    price_tier: 3,
    tagline: "Levantine soul in Dubai's golden era",
    description:
      "Named for the year Beirut was at its most glamorous, 1920 brings authentic Lebanese cuisine to Dubai with a presentation that honours tradition. Mezze to the sound of oud music in a space dripping in Levantine nostalgia.",
    highlights: [
      "🥙 Authentic Lebanese mezze",
      "🎵 Live oud music",
      "🌹 Rose water cocktails",
      "🏺 Heritage-inspired interiors",
    ],
    hours: "12pm – 1am",
    dress_code: "Smart Casual",
    best_for: "Lebanese cuisine, family gatherings",
    map_query: "1920 Restaurant Dubai",
  },
  {
    id: "14",
    name: "Tattu",
    folder: "Tattu",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    location: "Address Montgomerie",
    area: "Emirates Hills",
    cuisine: "Chinese",
    vibe: "Garden Fantasy",
    price_tier: 3,
    tagline: "Oriental gardens under the Dubai sky",
    description:
      "Tattu arrived in Dubai straight from its celebrated UK venues, bringing a cherry blossom garden fantasy to Emirates Hills. Hand-painted ceilings, dim lighting, and refined Chinese cuisine make this a consistent favourite among Dubai's discerning crowd.",
    highlights: [
      "🌸 Cherry blossom garden interior",
      "🥢 Modern Chinese cuisine",
      "🥂 Craft cocktail program",
      "🏡 Tranquil Emirates Hills setting",
    ],
    hours: "5pm – 1am",
    dress_code: "Smart Pres",
    best_for: "Romantic evenings, celebrations",
    map_query: "Tattu Dubai Address Montgomerie",
    trending: true,
  },
  {
    id: "15",
    name: "Clap",
    folder: "Clap",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
    location: "ME Dubai Hotel",
    area: "Downtown",
    cuisine: "Japanese",
    vibe: "Contemporary",
    price_tier: 3,
    tagline: "Izakaya culture elevated to fine dining",
    description:
      "CLAP in Dubai embodies the Tokyo izakaya spirit taken to extraordinary heights. Robata grill, black cod, and shared Japanese plates in a setting designed by Zaha Hadid Architects — this is where downtown Dubai dines.",
    highlights: [
      "🔥 Open robata grill",
      "🍱 Izakaya-style sharing plates",
      "🏛️ Zaha Hadid designed space",
      "🎵 Curated music experience",
    ],
    hours: "12pm – 2am",
    dress_code: "Smart Casual",
    best_for: "Business lunch, casual luxury",
    map_query: "Clap Dubai ME Hotel",
  },
  {
    id: "16",
    name: "Sushi Samba",
    folder: "Sushi_Samba",
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=1200&auto=format&fit=crop",
    location: "DIFC Gate Village",
    area: "DIFC",
    cuisine: "Japanese-Brazilian",
    vibe: "Party Dining",
    price_tier: 3,
    tagline: "Samba rhythms meet Japanese mastery",
    description:
      "Sushi Samba fuses Japanese, Brazilian, and Peruvian culinary traditions in a high-energy environment that pulses with Latin rhythms. From churrasco to sashimi to Caipirinha cocktails — this is a celebration on a plate.",
    highlights: [
      "🎺 Brazilian-Japanese fusion",
      "🥩 Churrasco & sashimi combo",
      "💃 Live samba performers",
      "🍹 Brazilian cocktail program",
    ],
    hours: "12pm – 2am",
    dress_code: "Smart Vibrant",
    best_for: "Group dining, parties",
    map_query: "Sushi Samba Dubai DIFC",
  },
  {
    id: "17",
    name: "La Mar",
    folder: "La_Mar",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
    location: "Four Seasons DIFC",
    area: "DIFC",
    cuisine: "Peruvian",
    vibe: "Coastal",
    price_tier: 3,
    tagline: "Lima's finest ceviche, Dubai style",
    description:
      "La Mar by acclaimed chef Gastón Acurio brings the freshest Peruvian ceviche to Dubai's DIFC. Known as the world's best ceviche restaurant brand, La Mar delivers an ocean-fresh experience with Peruvian soul.",
    highlights: [
      "🐟 Gastón Acurio's famous ceviche",
      "🦑 Rare Peruvian seafood menu",
      "🌊 Coastal-inspired design",
      "🥃 Pisco & cocktail program",
    ],
    hours: "12pm – 12am",
    dress_code: "Smart Casual",
    best_for: "Seafood lovers, lunch",
    map_query: "La Mar Dubai Four Seasons DIFC",
  },
  {
    id: "18",
    name: "Opa",
    folder: "Opa",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    location: "Habtoor Grand",
    area: "Dubai Marina",
    cuisine: "Greek",
    vibe: "Mediterranean Energy",
    price_tier: 3,
    tagline: "Santorini nights in the heart of the Marina",
    description:
      "OPA! The Greek call to celebration echoes through this lively Dubai Marina favourite. Expect plate-smashing traditions, fresh Greek mezze, and an atmosphere that turns every table into a party by the time dessert arrives.",
    highlights: [
      "🎉 Traditional plate smashing",
      "🫒 Authentic Greek mezze",
      "🌊 Dubai Marina waterfront",
      "🎵 Live Greek music nights",
    ],
    hours: "6pm – 1am",
    dress_code: "Smart Casual",
    best_for: "Group celebrations",
    map_query: "Opa Greek Restaurant Dubai Marina",
  },
  {
    id: "19",
    name: "Amelia",
    folder: "Amelia",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    location: "W Dubai - Mina Seyahi",
    area: "JBR",
    cuisine: "European",
    vibe: "Garden Terrace",
    price_tier: 2,
    tagline: "Alfresco European dining by the beach",
    description:
      "Amelia at W Dubai is the city's most beautiful garden terrace restaurant. A European menu of stunning quality meets lush tropical greenery and sea breezes — the perfect daytime escape that transforms by candlelight after sunset.",
    highlights: [
      "🌿 Lush tropical garden terrace",
      "🌊 Beachfront location",
      "🥗 Farm-to-table European menu",
      "🕯️ Romantic candlelit evenings",
    ],
    hours: "11am – 11pm",
    dress_code: "Resort Casual",
    best_for: "Romantic lunches, groups",
    map_query: "Amelia Restaurant W Dubai Mina Seyahi",
  },
  {
    id: "20",
    name: "Ling Ling",
    folder: "Ling_Ling",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    location: "Atlantis The Palm",
    area: "Palm Jumeirah",
    cuisine: "Pan-Asian",
    vibe: "Party",
    price_tier: 3,
    tagline: "Pan-Asian glamour on the Palm",
    description:
      "Ling Ling at Atlantis is the Palm's most vibrant Asian dining experience. Inspired by the great nocturnal glamour of Pan-Asian cities, the menu spans Tokyo to Bangkok while DJs keep the energy soaring until the early hours.",
    highlights: [
      "🎮 Pan-Asian party dining",
      "🎵 Live DJ sets nightly",
      "🌴 Palm Jumeirah terrace",
      "🍜 Street food elevated to fine dining",
    ],
    hours: "6pm – 3am",
    dress_code: "Smart Party",
    best_for: "Night out, celebrations",
    map_query: "Ling Ling Dubai Atlantis",
    trending: true,
  },
  {
    id: "21",
    name: "Verde",
    folder: "Verde",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop",
    location: "Eden The Palm",
    area: "Palm Jumeirah",
    cuisine: "Italian",
    vibe: "Organic Luxury",
    price_tier: 3,
    tagline: "Zero-km Italian excellence on the Palm",
    description:
      "Verde is Dubai's most celebrated modern Italian restaurant — a temple to sustainable, ingredient-led cooking on the Palm. Chef's hand-rolled pasta, wood-fired pizzas, and an all-Italian wine cellar of extraordinary depth.",
    highlights: [
      "🌿 Sustainable, zero-km ingredients",
      "🍝 Hand-rolled fresh pasta daily",
      "🍕 Wood-fired ovens from Napoli",
      "🍷 All-Italian wine cellar",
    ],
    hours: "12pm – 11:30pm",
    dress_code: "Smart Casual",
    best_for: "Italian food lovers",
    map_query: "Verde Restaurant Palm Jumeirah Dubai",
  },
  {
    id: "22",
    name: "Tang",
    folder: "Tang",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    location: "Burj Al Arab",
    area: "Jumeirah",
    cuisine: "Cantonese",
    vibe: "Heritage Luxury",
    price_tier: 4,
    tagline: "Imperial Cantonese within Burj Al Arab",
    description:
      "Tang at the iconic Burj Al Arab brings Imperial Cantonese cuisine to Dubai's most prestigious address. Centuries-old recipes reimagined for the 21st century, served in surroundings that define what luxury means.",
    highlights: [
      "👑 Burj Al Arab exclusivity",
      "🦆 Classic Cantonese roasts",
      "🫖 Imperial tea ceremony",
      "🎎 Heritage décor & rituals",
    ],
    hours: "12:30pm – 11:30pm",
    dress_code: "Smart Formal",
    best_for: "Ultimate luxury dining",
    map_query: "Tang Restaurant Burj Al Arab Dubai",
  },
  {
    id: "23",
    name: "Urla",
    folder: "Urla",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    location: "InterContintental DIFC",
    area: "DIFC",
    cuisine: "Turkish",
    vibe: "Anatolian",
    price_tier: 3,
    tagline: "Turkey's coastal jewel arrives in DIFC",
    description:
      "Named after the Aegean coastal town, Urla brings the sophisticated Mediterranean flavours of Turkey's finest region to Dubai's DIFC. Fresh seafood, meze, and wood-grilled meats are served with Turkish hospitality at its warmest.",
    highlights: [
      "🦐 Aegean fresh seafood",
      "🥂 Turkish Raki program",
      "🏺 Authentic Anatolian meze",
      "🔥 Wood-fired grill dishes",
    ],
    hours: "12pm – 12am",
    dress_code: "Smart Casual",
    best_for: "Turkish cuisine, business",
    map_query: "Urla Restaurant DIFC Dubai",
  },
  {
    id: "24",
    name: "Woohoo",
    folder: "Woohoo",
    image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1200&auto=format&fit=crop",
    location: "City Walk",
    area: "City Walk",
    cuisine: "Pan-Asian",
    vibe: "Fun & Festive",
    price_tier: 2,
    tagline: "Asian street food, luxury-level fun",
    description:
      "WOOHOO! is Dubai's most exuberantly fun dining destination. Inspired by the street food capitals of Asia — from Bangkok to Hong Kong — this City Walk spot delivers bold flavours, technicolour décor, and an atmosphere that demands you have the time of your life.",
    highlights: [
      "🎨 Technicolour Asian décor",
      "🍜 Street food elevated",
      "🥢 Pan-Asian sharing plates",
      "🎉 Party atmosphere nightly",
    ],
    hours: "12pm – 1am",
    dress_code: "Casual Cool",
    best_for: "Groups, casual fun",
    map_query: "Woohoo Restaurant City Walk Dubai",
  },
  {
    id: "25",
    name: "Cou Cou",
    folder: "CouCou",
    image: "https://images.unsplash.com/photo-1551882547-ff40c4a49f5d?q=80&w=1200&auto=format&fit=crop",
    location: "Jumeirah Al Naseem",
    area: "Jumeirah",
    cuisine: "Mediterranean-Italian",
    vibe: "Coastal",
    price_tier: 3,
    tagline: "Coastal Italian luxury at Jumeirah",
    description:
      "Cou Cou at Jumeirah Al Naseem is a love letter to coastal Italian living. Linen tablecloths, sea views, hand-made pasta, and the finest antipasti — a setting that makes you feel like you've been transported to the Amalfi Coast.",
    highlights: [
      "🌊 Burj Al Arab beachfront views",
      "🍝 Hand-crafted pasta daily",
      "🫒 Italian antipasti selection",
      "☀️ Famous Friday brunch",
    ],
    hours: "12pm – 11pm",
    dress_code: "Beach Smart",
    best_for: "Beachfront dining, brunches",
    map_query: "Cou Cou Restaurant Jumeirah Al Naseem",
  },
  {
    id: "26",
    name: "Gal",
    folder: "Gal",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    location: "Palazzo Versace",
    area: "Culture Village",
    cuisine: "Mediterranean",
    vibe: "Palace Luxury",
    price_tier: 4,
    tagline: "Mediterranean opulence in a Versace palace",
    description:
      "GAL at Palazzo Versace Dubai is haute cuisine meets haute couture. The Mediterranean menu is as impeccably crafted as the Versace-clad interiors — an experience where every detail commands awe, from the hand-painted crockery to the canal-side terrace.",
    highlights: [
      "👑 Inside Palazzo Versace",
      "🏛️ Canal-side terrace",
      "🎨 Versace-designed interiors",
      "🦞 Mediterranean fine dining",
    ],
    hours: "12pm – 12am",
    dress_code: "Formal Chic",
    best_for: "Luxury occasions, anniversary",
    map_query: "Gal Restaurant Palazzo Versace Dubai",
    featured: true,
  },
  {
    id: "27",
    name: "Il Gattopardo",
    folder: "Il_Gattopardo",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop",
    location: "Four Seasons DIFC",
    area: "DIFC",
    cuisine: "Italian",
    vibe: "Classic",
    price_tier: 4,
    tagline: "The Leopard's timeless Sicilian soul",
    description:
      "Il Gattopardo — The Leopard — is named after Lampedusa's masterpiece for good reason. This is Sicilian haute cuisine of rare authenticity: hand-rolled Sicilian pasta, prime aged proteins, and a wine list that stretches across Italy's best appellations.",
    highlights: [
      "🏆 Authentic Sicilian haute cuisine",
      "🍝 Handmade pasta from scratch",
      "🍷 All-Italian wine list 400+",
      "🎭 Named after Lampedusa novel",
    ],
    hours: "12:30pm – 11:30pm",
    dress_code: "Smart Elegant",
    best_for: "Italian fine dining aficionados",
    map_query: "Il Gattopardo Dubai Four Seasons DIFC",
  },
  {
    id: "28",
    name: "Mambaella",
    folder: "Mambaella",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    location: "JW Marriott Marquis",
    area: "Business Bay",
    cuisine: "Spanish",
    vibe: "Paella Theatre",
    price_tier: 3,
    tagline: "Spain's most theatrical paella experience",
    description:
      "MAMBAELLA is the UAE's most celebrated Spanish restaurant — a love song to the Valencian art of paella. Enormous paella pans, bomba rice imported from Spain, fresh seafood, and a saffron-golden theatre that makes every meal a performance.",
    highlights: [
      "🥘 Bomba rice from Valencia",
      "🦞 Giant seafood paella pans",
      "🎭 Tableside cooking theatre",
      "🍷 Spanish bodega wine wall",
    ],
    hours: "12pm – 12am",
    dress_code: "Smart Casual",
    best_for: "Groups, Spanish cuisine lovers",
    map_query: "Mambaella Dubai JW Marriott Marquis",
    trending: true,
  },
  {
    id: "29",
    name: "Nahate",
    folder: "Nahate",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    location: "Al Habtoor City",
    area: "Al Habtoor City",
    cuisine: "Contemporary Arabic",
    vibe: "Modern Arabic",
    price_tier: 3,
    tagline: "Contemporary Arabic cuisine reimagined",
    description:
      "NAHATE reimagines traditional Arabic cuisine through a contemporary lens at Al Habtoor City. Arabic spices and Levantine techniques are elevated with European technique — the result is breathtakingly original and deeply satisfying.",
    highlights: [
      "🌹 Arabic spice-forward menu",
      "🫒 Levantine mezze elevated",
      "🏛️ Stunning Arabic-modern interiors",
      "☕ Arabic coffee ceremony",
    ],
    hours: "12pm – 12am",
    dress_code: "Smart Arabic Chic",
    best_for: "Arabic food lovers, cultural experience",
    map_query: "Nahate Restaurant Al Habtoor City Dubai",
  },
  {
    id: "30",
    name: "Bar de Prés",
    folder: "Bar_de_Pres",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    location: "St. Regis The Palm",
    area: "Palm Jumeirah",
    cuisine: "French Bistro",
    vibe: "Casual Chic",
    price_tier: 2,
    tagline: "A Parisian corner on the Palm",
    description:
      "Bar de Prés transports you to a sun-dappled Parisian bistro on the shores of Palm Jumeirah. Oysters, steak tartare, French wines, and the effortless cool of Left Bank Paris — all with views of the Arabian Gulf.",
    highlights: [
      "🦪 Daily fresh oyster selection",
      "🥩 Classic steak tartare",
      "🇫🇷 100% French wine list",
      "🌊 Palm beachfront terrace",
    ],
    hours: "11am – 11pm",
    dress_code: "Casual Chic",
    best_for: "Casual luxury lunches",
    map_query: "Bar de Pres St Regis Palm Dubai",
  },
  {
    id: "31",
    name: "Ram & Roll",
    folder: "Ram___Roll",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1200&auto=format&fit=crop",
    location: "Dubai Hills",
    area: "Dubai Hills",
    cuisine: "Indian",
    vibe: "Street Luxury",
    price_tier: 1,
    tagline: "India's street soul elevated to luxury",
    description:
      "RAM & ROLL brings the spectacular street food culture of India — from kebabs to biryanis — and elevates it with premium ingredients and expert technique. No pretension, just pure flavour in a vibrant, high-energy setting.",
    highlights: [
      "🍢 Premium street-style kebabs",
      "🍛 Signature dum biryani",
      "🌶️ Rare Indian spice blends",
      "🎵 Bollywood vibes at full volume",
    ],
    hours: "12pm – 12am",
    dress_code: "Casual",
    best_for: "Casual dining, Indian food lovers",
    map_query: "Ram Roll Restaurant Dubai Hills",
  },
  {
    id: "32",
    name: "Jumeirah",
    folder: "Jumeirah",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    location: "Jumeirah Beach Hotel",
    area: "Jumeirah",
    cuisine: "International",
    vibe: "Beachfront Classic",
    price_tier: 3,
    tagline: "The original Dubai beachfront institution",
    description:
      "The quintessential Dubai dining institution on the sands of Jumeirah. An international menu that has satisfied generations of Dubai residents and visitors, served with legendary Jumeirah hospitality and world-class beach views across to Burj Al Arab.",
    highlights: [
      "🌊 Iconic Burj Al Arab views",
      "🍽️ International multi-course menu",
      "🏖️ Direct beachfront access",
      "👑 Jumeirah five-star service",
    ],
    hours: "12pm – 11pm",
    dress_code: "Smart Casual",
    best_for: "Iconic Dubai experiences",
    map_query: "Jumeirah Beach Hotel Restaurant Dubai",
  },

  {
    id: "34",
    name: "Villa Coconut",
    folder: "Villa_Coconut",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    location: "Jumeirah",
    area: "Jumeirah",
    cuisine: "Tropical Fusion",
    vibe: "Garden Tropical",
    price_tier: 2,
    tagline: "A tropical sanctuary in the heart of Jumeirah",
    description:
      "Villa Coconut is Jumeirah's best-kept secret: a tropical garden oasis where the menu celebrates the flavours of Southeast Asia and the Pacific Islands. Lush coconut palms shade outdoor tables as you sip fresh coconut cocktails and enjoy dishes alive with freshness.",
    highlights: [
      "🌴 Tropical garden setting",
      "🥥 Signature coconut cocktails",
      "🌺 Southeast Asian-Pacific menu",
      "🦜 Lush private garden terrace",
    ],
    hours: "12pm – 11pm",
    dress_code: "Casual Tropical",
    best_for: "Garden dining, groups",
    map_query: "Villa Coconut Jumeirah Dubai",
  },
];

const CUISINES = [
  "All",
  "Japanese",
  "French Mediterranean",
  "Chinese",
  "Peruvian",
  "Latin American",
  "Spanish",
  "Mediterranean",
  "Asian Contemporary",
  "Turkish",
  "Italian",
  "Greek",
  "Lebanese",
  "Indian",
  "International",
];
const AREAS = [
  "All",
  "DIFC",
  "Palm Jumeirah",
  "Downtown",
  "Dubai Marina",
  "Jumeirah",
  "JBR",
  "Business Bay",
  "Emirates Hills",
  "City Walk",
  "Culture Village",
  "Al Habtoor City",
  "Sheikh Zayed Road",
  "Dubai Hills",
];

type ModalType = "blog" | "menu" | null;

export default function Restaurants() {
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [activeArea, setActiveArea] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalRestaurant, setModalRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [modalType, setModalType] = useState<ModalType>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const filtered = React.useMemo(() => {
    return RESTAURANTS.filter((r) => {
      const matchesCuisine =
        activeCuisine === "All" || r.cuisine.includes(activeCuisine);
      const matchesArea = activeArea === "All" || r.area === activeArea;
      const matchesSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCuisine && matchesArea && matchesSearch;
    });
  }, [activeCuisine, activeArea, searchQuery]);

  const featured = RESTAURANTS.filter((r) => r.featured);

  const openModal = useCallback((restaurant: Restaurant, type: ModalType) => {
    setModalRestaurant(restaurant);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    setModalRestaurant(null);
    setModalType(null);
  }, []);

  const priceTierLabel = (tier: number) => "◆".repeat(tier);

  return (
    <div className="min-h-screen bg-[#080706] text-[#F5EDD8]">
      <Navbar />

      {/* ── CINEMATIC HERO ── */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop"
            alt="Dubai Fine Dining"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${heroLoaded ? "opacity-50" : "opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080706]/70 via-transparent to-[#080706]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080706]/60 via-transparent to-[#080706]/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-semibold uppercase tracking-[0.5em]">
              The Concierge Edit
            </span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>

          <h1 className="font-['Cormorant_Garamond'] text-7xl md:text-9xl font-light text-[#F5EDD8] mb-6 leading-none tracking-tight">
            Restaurants
          </h1>

          <p className="text-[#F5EDD8]/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
            From Michelin-starred rooms to hidden speakeasies in DIFC.
            Thirty-three curated tables, handpicked by Dubai's finest concierge.
          </p>

          <div className="flex items-center gap-2 justify-center text-[#F5EDD8]/40 text-sm">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span>{RESTAURANTS.length} Curated Restaurants</span>
            <span className="mx-2">·</span>
            <Star className="w-4 h-4 text-[#C9A84C]" />
            <span>Concierge Selected</span>
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
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.4em]">
            Editor's Picks
          </span>
          <div className="h-px flex-1 bg-[#F5EDD8]/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((r, i) => (
            <motion.div
              key={r.id + "-featured"}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: "3/4" }}
              onClick={() => openModal(r, "blog")}
            >
              <img
                src={r.image}
                alt={r.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#C9A84C] text-[#080706] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Editor's Pick
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-widest mb-1">
                  {r.cuisine}
                </div>
                <div className="font-['Cormorant_Garamond'] text-2xl text-white mb-1">
                  {r.name}
                </div>
                <div className="text-white/50 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {r.location}
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
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 rounded-full px-5 py-2.5 text-sm text-[#F5EDD8] placeholder-[#F5EDD8]/30 outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "DIFC",
                "Palm Jumeirah",
                "Downtown",
                "Jumeirah",
                "Dubai Marina",
              ].map((area) => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeArea === area
                      ? "bg-[#C9A84C] text-[#080706]"
                      : "bg-[#F5EDD8]/5 text-[#F5EDD8]/60 hover:bg-[#F5EDD8]/10 border border-[#F5EDD8]/10"
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
          {filtered.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              index={index}
              priceTierLabel={priceTierLabel}
              onBlog={() => openModal(restaurant, "blog")}
              onMenu={() => openModal(restaurant, "menu")}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32">
            <div className="text-[#F5EDD8]/20 text-6xl mb-4">🍽️</div>
            <p className="text-[#F5EDD8]/40 text-lg italic">
              No restaurants match your filters.
            </p>
          </div>
        )}
      </section>

      <Footer />

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modalRestaurant && modalType === "blog" && (
          <BlogModal
            restaurant={modalRestaurant}
            onClose={closeModal}
            priceTierLabel={priceTierLabel}
            onMenuOpen={() => setModalType("menu")}
          />
        )}
        {modalRestaurant && modalType === "menu" && (
          <MenuModal
            restaurant={modalRestaurant}
            onClose={closeModal}
            onBlogOpen={() => setModalType("blog")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RestaurantCard({
  restaurant: r,
  index,
  priceTierLabel,
  onBlog,
  onMenu,
}: {
  restaurant: Restaurant;
  index: number;
  priceTierLabel: (tier: number) => string;
  onBlog: () => void;
  onMenu: () => void;
}) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.map_query)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: (index % 3) * 0.1,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      {/* Image Stack */}
      <div
        className="relative overflow-hidden rounded-2xl mb-5"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={r.image}
          alt={r.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-transparent to-transparent" />

        {r.trending && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#C9A84C] text-[#080706] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              Trending
            </span>
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenu();
            }}
            className="bg-[#080706]/80 backdrop-blur-sm text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border border-[#C9A84C]/30 hover:bg-[#C9A84C] hover:text-[#080706] transition-all duration-200 flex items-center gap-1.5"
          >
            <BookOpen className="w-3 h-3" /> Menu
          </button>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#080706]/80 backdrop-blur-sm text-[#F5EDD8] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border border-[#F5EDD8]/20 hover:bg-[#F5EDD8] hover:text-[#080706] transition-all duration-200 flex items-center gap-1.5"
          >
            <Navigation2 className="w-3 h-3" /> Take Me There
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-[#C9A84C] text-[10px] font-semibold uppercase tracking-widest mb-1">
              {r.cuisine}
            </div>
            <h3
              className="font-['Cormorant_Garamond'] text-2xl text-[#F5EDD8] cursor-pointer hover:text-[#C9A84C] transition-colors leading-tight"
              onClick={onBlog}
            >
              {r.name}
            </h3>
          </div>
          <span className="text-[#C9A84C] text-xs font-mono mt-1 shrink-0 ml-3">
            {priceTierLabel(r.price_tier)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#F5EDD8]/40 text-xs mb-3">
          <MapPin className="w-3 h-3 text-[#C9A84C]" />
          <span>{r.location}</span>
          <span className="text-[#F5EDD8]/20">·</span>
          <span className="text-[#F5EDD8]/30">{r.area}</span>
        </div>

        <p className="text-[#F5EDD8]/55 text-sm leading-relaxed mb-4 line-clamp-2">
          {r.tagline}
        </p>

        <div className="flex items-center gap-2 pt-3 border-t border-[#F5EDD8]/5">
          <div className="flex items-center gap-1.5 text-[#F5EDD8]/35 text-xs">
            <Clock className="w-3 h-3" />
            <span>{r.hours}</span>
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

function BlogModal({
  restaurant: r,
  onClose,
  priceTierLabel,
  onMenuOpen,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  priceTierLabel: (tier: number) => string;
  onMenuOpen: () => void;
}) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.map_query)}`;

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
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f0d0b] border border-[#F5EDD8]/8 rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Hero image */}
        <div className="relative h-72 overflow-hidden rounded-t-3xl md:rounded-t-3xl">
          <img
            src={r.image}
            alt={r.name}
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
            <div className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-1">
              {r.cuisine} · {r.area}
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white">
              {r.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {r.location}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#F5EDD8]/60 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {r.hours}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#C9A84C] text-xs px-3 py-1.5 rounded-full font-mono">
              {priceTierLabel(r.price_tier)}
            </span>
            <span className="bg-[#F5EDD8]/5 border border-[#F5EDD8]/10 text-[#F5EDD8]/60 text-xs px-3 py-1.5 rounded-full">
              👗 {r.dress_code}
            </span>
          </div>

          <p className="text-[#F5EDD8]/80 leading-relaxed mb-6 text-base">
            {r.description}
          </p>

          <div className="bg-[#C9A84C]/5 border-l-2 border-[#C9A84C] rounded-r-xl p-5 mb-6">
            <div className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3">
              What To Expect
            </div>
            <ul className="space-y-2">
              {r.highlights.map((h, i) => (
                <li key={i} className="text-[#F5EDD8]/70 text-sm">
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-[#F5EDD8]/40 text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>
              Best for: <span className="text-[#F5EDD8]/70">{r.best_for}</span>
            </span>
          </div>

          {/* CTAs */}
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

const MENU_DATA: Record<
  string,
  {
    sections: {
      title: string;
      items: { name: string; desc: string; price: string }[];
    }[];
  }
> = {
  Nobu: {
    sections: [
      {
        title: "Raw Bar",
        items: [
          {
            name: "Black Cod Miso",
            desc: "Chilean sea bass, den miso, 3-day marinade",
            price: "AED 195",
          },
          {
            name: "Rock Shrimp Tempura",
            desc: "Creamy ponzu, togarashi",
            price: "AED 145",
          },
          {
            name: "Yellowtail Jalapeño",
            desc: "Ponzu, yuzu, micro cilantro",
            price: "AED 125",
          },
        ],
      },
      {
        title: "Signature Mains",
        items: [
          {
            name: "Wagyu Ishiyaki",
            desc: "A5 Wagyu, volcanic stone, truffle salt",
            price: "AED 395",
          },
          {
            name: "Omakase Tasting",
            desc: "7-course chef selection, sake pairing optional",
            price: "AED 680",
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Bento Box Fondant",
            desc: "Warm chocolate, green tea ice cream",
            price: "AED 75",
          },
          {
            name: "Yuzu Tart",
            desc: "Citrus curd, Japanese meringue",
            price: "AED 65",
          },
        ],
      },
    ],
  },
  Bagatelle: {
    sections: [
      {
        title: "Entrées",
        items: [
          {
            name: "Burrata Truffe",
            desc: "Black truffle shavings, heritage tomato",
            price: "AED 145",
          },
          {
            name: "Foie Gras Poêlé",
            desc: "Brioche, fig compote, port reduction",
            price: "AED 165",
          },
        ],
      },
      {
        title: "Plats Principaux",
        items: [
          {
            name: "Côte de Veau",
            desc: "French veal chop, morel sauce, pomme purée",
            price: "AED 345",
          },
          {
            name: "Sole Meunière",
            desc: "Whole Dover sole, brown butter, capers",
            price: "AED 285",
          },
        ],
      },
      {
        title: "Signatures",
        items: [
          {
            name: "Saturday Brunch Package",
            desc: "All-inclusive, house beverages, 4 courses",
            price: "AED 595",
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Crème Brûlée Classique",
            desc: "Madagascar vanilla, caramelised sugar dome",
            price: "AED 65",
          },
        ],
      },
    ],
  },
  "Villa Coconut": {
    sections: [
      {
        title: "Starters",
        items: [
          {
            name: "Coconut Ceviche",
            desc: "Tiger prawns, young coconut, lime, bird's eye chilli",
            price: "AED 95",
          },
          {
            name: "Som Tum Salad",
            desc: "Green papaya, roasted peanuts, tamarind dressing",
            price: "AED 75",
          },
          {
            name: "Tuna Tataki",
            desc: "Sesame crust, yuzu ponzu, micro herbs",
            price: "AED 115",
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            name: "Barramundi Curry",
            desc: "Green coconut curry, jasmine rice, Thai basil",
            price: "AED 165",
          },
          {
            name: "Wagyu Rendang",
            desc: "Slow-braised wagyu, rendang spice, crispy shallots",
            price: "AED 225",
          },
          {
            name: "Prawn Pad Thai",
            desc: "Rice noodles, tamarind, bean sprouts, lime",
            price: "AED 145",
          },
        ],
      },
      {
        title: "Coconut Cocktails",
        items: [
          {
            name: "Paradise Spritz",
            desc: "Fresh coconut water, passion fruit, prosecco",
            price: "AED 85",
          },
          {
            name: "Tropical Mule",
            desc: "Coconut vodka, ginger beer, lime, chilli rim",
            price: "AED 80",
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Pandan Panna Cotta",
            desc: "Coconut cream, mango coulis, toasted coconut",
            price: "AED 60",
          },
        ],
      },
    ],
  },
};

function getMenuData(name: string, cuisine: string, priceTier: number) {
  if (MENU_DATA[name]) return MENU_DATA[name].sections;
  const p = (base: number) => `AED ${base + priceTier * 30}`;
  const c = cuisine.toLowerCase();

  if (c.includes("japanese") || c.includes("nikkei"))
    return [
      {
        title: "Starters",
        items: [
          {
            name: "Edamame & Gyoza",
            desc: "Pan-seared pork gyoza, yuzu ponzu",
            price: p(65),
          },
          {
            name: "Miso Soup",
            desc: "Tofu, wakame, spring onion, dashi",
            price: p(35),
          },
        ],
      },
      {
        title: "Sushi & Sashimi",
        items: [
          {
            name: "Chef's Omakase Platter",
            desc: "Daily selection of 12 premium cuts",
            price: p(245),
          },
          {
            name: "Dragon Roll",
            desc: "Shrimp tempura, avocado, tobiko",
            price: p(145),
          },
        ],
      },
      {
        title: "Hot Dishes",
        items: [
          {
            name: "Wagyu Sukiyaki",
            desc: "A5 wagyu, tofu, vegetables, egg yolk",
            price: p(295),
          },
          {
            name: "Black Cod Dengaku",
            desc: "Sweet miso glaze, shiso oil",
            price: p(185),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Matcha Tiramisu",
            desc: "Ceremonial matcha, mascarpone, ladyfingers",
            price: p(65),
          },
        ],
      },
    ];

  if (c.includes("french") || c.includes("bistro") || c.includes("speakeasy"))
    return [
      {
        title: "Entrées",
        items: [
          {
            name: "Foie Gras Poêlé",
            desc: "Brioche, fig compote, Sauternes reduction",
            price: p(145),
          },
          {
            name: "Burrata Truffe",
            desc: "Black truffle shavings, heritage tomato, basil oil",
            price: p(125),
          },
          {
            name: "Soupe à l'Oignon",
            desc: "Caramelised onion, gruyère crust",
            price: p(75),
          },
        ],
      },
      {
        title: "Plats Principaux",
        items: [
          {
            name: "Côte de Bœuf",
            desc: "Dry-aged 800g rib, béarnaise, pommes frites",
            price: p(285),
          },
          {
            name: "Sole Meunière",
            desc: "Whole Dover sole, brown butter, capers, lemon",
            price: p(235),
          },
          {
            name: "Poulet Rôti",
            desc: "Free-range chicken, fines herbes, truffle jus",
            price: p(195),
          },
        ],
      },
      {
        title: "Vins & Cocktails",
        items: [
          {
            name: "Kir Royale",
            desc: "Cassis, champagne, lemon zest",
            price: p(75),
          },
          {
            name: "French 75",
            desc: "Gin, champagne, lemon, sugar",
            price: p(80),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Crème Brûlée",
            desc: "Madagascar vanilla, caramelised sugar dome",
            price: p(65),
          },
          {
            name: "Île Flottante",
            desc: "Poached meringue, crème anglaise, praline",
            price: p(55),
          },
        ],
      },
    ];

  if (
    c.includes("italian") ||
    (c.includes("mediterranean") &&
      !c.includes("french") &&
      !c.includes("greek") &&
      !c.includes("turkish"))
  )
    return [
      {
        title: "Antipasti",
        items: [
          {
            name: "Burrata Pugliese",
            desc: "Stracciatella, heirloom tomato, basil oil",
            price: p(85),
          },
          {
            name: "Prosciutto e Melone",
            desc: "36-month San Daniele, cantaloupe",
            price: p(95),
          },
        ],
      },
      {
        title: "Pasta",
        items: [
          {
            name: "Tagliatelle al Tartufo",
            desc: "Hand-rolled pasta, black truffle, parmesan",
            price: p(175),
          },
          {
            name: "Risotto ai Frutti di Mare",
            desc: "Arborio rice, mixed seafood, white wine",
            price: p(165),
          },
        ],
      },
      {
        title: "Secondi",
        items: [
          {
            name: "Branzino al Forno",
            desc: "Whole sea bass, lemon, capers, herb oil",
            price: p(195),
          },
          {
            name: "Fiorentina",
            desc: "600g T-bone, rosemary oil, sea salt",
            price: p(285),
          },
        ],
      },
      {
        title: "Dolci",
        items: [
          {
            name: "Tiramisu della Casa",
            desc: "Espresso-soaked ladyfingers, mascarpone",
            price: p(65),
          },
          {
            name: "Panna Cotta",
            desc: "Vanilla cream, seasonal berry compote",
            price: p(55),
          },
        ],
      },
    ];

  if (c.includes("spanish"))
    return [
      {
        title: "Tapas & Pintxos",
        items: [
          {
            name: "Jamón Ibérico de Bellota",
            desc: "48-month Pata Negra, pan con tomate",
            price: p(125),
          },
          {
            name: "Croquetas de Jamón",
            desc: "Crispy ham bechamel bites (6 pcs)",
            price: p(75),
          },
          {
            name: "Patatas Bravas",
            desc: "Crispy potato, spicy aioli, smoked paprika",
            price: p(55),
          },
        ],
      },
      {
        title: "Platos Principales",
        items: [
          {
            name: "Paella Valenciana",
            desc: "Saffron rice, chicken, rabbit, bomba rice",
            price: p(185),
          },
          {
            name: "Chuletón de Buey",
            desc: "Dry-aged T-bone, Maldon salt, chimichurri",
            price: p(275),
          },
          {
            name: "Lubina al Horno",
            desc: "Whole sea bass, lemon oil, olives",
            price: p(195),
          },
        ],
      },
      {
        title: "Vinos & Cocktails",
        items: [
          {
            name: "Sangria Blanca",
            desc: "Albariño, lychee, elderflower, citrus",
            price: p(75),
          },
          {
            name: "Aperol Español",
            desc: "Aperol, Cava, mandarin, rosemary",
            price: p(70),
          },
        ],
      },
      {
        title: "Postres",
        items: [
          {
            name: "Crema Catalana",
            desc: "Orange-infused custard, caramelised crust",
            price: p(60),
          },
          {
            name: "Churros con Chocolate",
            desc: "Fried dough, dark chocolate sauce",
            price: p(55),
          },
        ],
      },
    ];

  if (c.includes("chinese") || c.includes("cantonese"))
    return [
      {
        title: "Dim Sum",
        items: [
          {
            name: "Har Gow",
            desc: "Crystal prawn dumplings (4 pcs)",
            price: p(85),
          },
          {
            name: "Char Siu Bao",
            desc: "BBQ pork buns, steamed (3 pcs)",
            price: p(65),
          },
          {
            name: "Xiao Long Bao",
            desc: "Shanghainese soup dumplings, ginger vinegar",
            price: p(75),
          },
        ],
      },
      {
        title: "Wok & Grill",
        items: [
          {
            name: "Peking Duck",
            desc: "Whole duck, pancakes, hoisin, spring onion",
            price: p(285),
          },
          {
            name: "Mapo Tofu",
            desc: "Silken tofu, minced pork, Sichuan peppercorn",
            price: p(125),
          },
          {
            name: "Crispy Sea Bass",
            desc: "Whole fish, ginger, scallion, soy",
            price: p(215),
          },
        ],
      },
      {
        title: "Tea & Cocktails",
        items: [
          {
            name: "Lychee Martini",
            desc: "Lychee liqueur, vodka, rose",
            price: p(75),
          },
          {
            name: "Jasmine Iced Tea",
            desc: "House jasmine, osmanthus, honey",
            price: p(40),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Mango Pudding",
            desc: "Alphonso mango, evaporated milk",
            price: p(55),
          },
          {
            name: "Sesame Balls",
            desc: "Black sesame paste, osmanthus syrup",
            price: p(50),
          },
        ],
      },
    ];

  if (c.includes("peruvian") || c.includes("latin american"))
    return [
      {
        title: "Ceviches",
        items: [
          {
            name: "Ceviche Clásico",
            desc: "Sea bass, tiger's milk, aji amarillo, choclo",
            price: p(115),
          },
          {
            name: "Tiradito Nikkei",
            desc: "Yellowfin tuna, yuzu leche de tigre",
            price: p(135),
          },
        ],
      },
      {
        title: "Hot Plates",
        items: [
          {
            name: "Lomo Saltado",
            desc: "Sirloin strips, tomato, red onion, aji panca",
            price: p(195),
          },
          {
            name: "Anticucho de Corazón",
            desc: "Grilled beef heart, huancaína sauce, choclo",
            price: p(145),
          },
          {
            name: "Causa Limeña",
            desc: "Potato terrine, tuna, avocado, aji amarillo",
            price: p(95),
          },
        ],
      },
      {
        title: "Pisco Bar",
        items: [
          {
            name: "Pisco Sour",
            desc: "Quebranta pisco, citrus, egg white, bitters",
            price: p(75),
          },
          {
            name: "Chilcano de Oro",
            desc: "Italia pisco, ginger ale, lime, golden bitters",
            price: p(70),
          },
        ],
      },
      {
        title: "Postres",
        items: [
          {
            name: "Tres Leches",
            desc: "Soaked sponge, dulce de leche, meringue",
            price: p(60),
          },
        ],
      },
    ];

  if (c.includes("greek"))
    return [
      {
        title: "Mezze",
        items: [
          {
            name: "Taramosalata & Pita",
            desc: "House smoked roe dip, warm pita, crudités",
            price: p(65),
          },
          {
            name: "Grilled Halloumi",
            desc: "Cypriot halloumi, honey, watermelon",
            price: p(85),
          },
          {
            name: "Dolmades",
            desc: "Vine leaves stuffed with rice, herbs, lemon",
            price: p(70),
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            name: "Grilled Octopus",
            desc: "Charred tentacles, caper vinaigrette, tomato",
            price: p(175),
          },
          {
            name: "Lamb Souvlaki",
            desc: "Marinated lamb skewers, tzatziki, pita",
            price: p(185),
          },
          {
            name: "Whole Seabream",
            desc: "Lemon, olive oil, oregano, Greek salad",
            price: p(195),
          },
        ],
      },
      {
        title: "Drinks",
        items: [
          {
            name: "Aperol Spritz Hellas",
            desc: "Aperol, prosecco, blood orange, olives",
            price: p(70),
          },
          {
            name: "Ouzo Lemonade",
            desc: "Ouzo, fresh lemon, sparkling water, mint",
            price: p(60),
          },
        ],
      },
      {
        title: "Γλυκά (Sweets)",
        desc: "",
        items: [
          {
            name: "Baklava",
            desc: "Honey-walnut layered pastry, vanilla ice cream",
            price: p(60),
          },
          {
            name: "Loukoumades",
            desc: "Greek honey doughnuts, cinnamon, sesame",
            price: p(55),
          },
        ],
      },
    ];

  if (c.includes("turkish") || c.includes("anatolian"))
    return [
      {
        title: "Meze",
        items: [
          {
            name: "Hummus & Pide",
            desc: "Tahini-rich hummus, warm Turkish flatbread",
            price: p(65),
          },
          {
            name: "Sigara Böreği",
            desc: "Crispy cheese-filled pastry cigars (4 pcs)",
            price: p(80),
          },
          {
            name: "Grilled Aegean Octopus",
            desc: "Charred, caper-lemon dressing",
            price: p(125),
          },
        ],
      },
      {
        title: "Izgara (Grill)",
        items: [
          {
            name: "Adana Kebab",
            desc: "Spiced lamb mince, lavash, sumac onion",
            price: p(155),
          },
          {
            name: "Alabalık (Trout)",
            desc: "Whole Aegean trout, dill butter, bulgur",
            price: p(175),
          },
          {
            name: "Bursa İskender",
            desc: "Lamb döner, tomato sauce, yoghurt, butter",
            price: p(165),
          },
        ],
      },
      {
        title: "Içecekler (Drinks)",
        items: [
          {
            name: "Raki Sour",
            desc: "Turkish raki, citrus, anise, honey",
            price: p(75),
          },
          {
            name: "Şalgam Spritz",
            desc: "Purple carrot juice, gin, lemon",
            price: p(70),
          },
        ],
      },
      {
        title: "Tatlı (Sweets)",
        items: [
          {
            name: "Künefe",
            desc: "Shredded wheat, cheese, honey, pistachio",
            price: p(65),
          },
          {
            name: "Sütlaç",
            desc: "Turkish rice pudding, rose water, pomegranate",
            price: p(55),
          },
        ],
      },
    ];

  if (c.includes("lebanese") || c.includes("arabic") || c.includes("levantine"))
    return [
      {
        title: "Mezze Bared",
        desc: "",
        items: [
          {
            name: "Hummus Beiruti",
            desc: "Extra-smooth hummus, olive oil, paprika",
            price: p(55),
          },
          {
            name: "Fattoush",
            desc: "Crispy pita, herbs, pomegranate molasses",
            price: p(65),
          },
          {
            name: "Kibbeh Nayeh",
            desc: "Raw lamb, bulgur, spices, mint (seasonal)",
            price: p(85),
          },
        ],
      },
      {
        title: "Grills & Mains",
        items: [
          {
            name: "Mixed Grill Beirut",
            desc: "Shish taouk, kofta, lamb chop, garlic sauce",
            price: p(175),
          },
          {
            name: "Samkeh Harra",
            desc: "Whole sea bass, spiced tomato, tahini",
            price: p(185),
          },
          {
            name: "Moghrabieh",
            desc: "Lebanese couscous, chicken, caramelised onion",
            price: p(145),
          },
        ],
      },
      {
        title: "Arak & Cocktails",
        items: [
          {
            name: "Arak Fountain",
            desc: "Lebanese arak, water, ice ritual",
            price: p(65),
          },
          {
            name: "Rose Water Spritz",
            desc: "Gin, rose syrup, citrus, soda",
            price: p(70),
          },
        ],
      },
      {
        title: "Halawiyat (Sweets)",
        items: [
          {
            name: "Knafeh",
            desc: "Shredded pastry, akkawi cheese, rose syrup",
            price: p(65),
          },
          {
            name: "Baklawa Selection",
            desc: "Assorted Lebanese pastries, pistachios",
            price: p(60),
          },
        ],
      },
    ];

  if (c.includes("indian") || c.includes("street"))
    return [
      {
        title: "Starters",
        items: [
          {
            name: "Seekh Kebab",
            desc: "Minced lamb, green chilli, charcoal grill",
            price: p(85),
          },
          {
            name: "Papdi Chaat",
            desc: "Crispy wafers, chutney, yoghurt, pomegranate",
            price: p(65),
          },
          {
            name: "Samosa",
            desc: "Spiced potato & pea, mint chutney (3 pcs)",
            price: p(55),
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            name: "Dum Biryani",
            desc: "Slow-cooked basmati, saffron, fried onion, raita",
            price: p(145),
          },
          {
            name: "Butter Chicken",
            desc: "Tandoor-roasted chicken, tomato cream, fenugreek",
            price: p(135),
          },
          {
            name: "Lamb Rogan Josh",
            desc: "Kashmiri spiced lamb shank, saffron rice",
            price: p(165),
          },
        ],
      },
      {
        title: "Drinks",
        items: [
          {
            name: "Mango Lassi",
            desc: "Alphonso mango, yoghurt, cardamom",
            price: p(45),
          },
          {
            name: "Masala Chai",
            desc: "Spiced milk tea, ginger, cinnamon",
            price: p(35),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Gulab Jamun",
            desc: "Rose-scented milk dumplings, vanilla ice cream",
            price: p(55),
          },
          {
            name: "Kulfi",
            desc: "Pistachio Indian ice cream, rose petals",
            price: p(50),
          },
        ],
      },
    ];

  if (
    c.includes("asian") ||
    c.includes("pan-asian") ||
    c.includes("asian contemporary")
  )
    return [
      {
        title: "Small Plates",
        items: [
          { name: "Edamame", desc: "Sea salt, sesame oil", price: p(45) },
          { name: "Gyoza", desc: "Pan-seared pork, yuzu ponzu", price: p(85) },
          {
            name: "Tuna Tataki",
            desc: "Seared yellowfin, ponzu, micro herbs",
            price: p(115),
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            name: "Wagyu Bulgogi",
            desc: "Marinated wagyu, garlic rice, kimchi",
            price: p(235),
          },
          {
            name: "Pad Thai Royale",
            desc: "Tiger prawns, rice noodles, tamarind, peanuts",
            price: p(145),
          },
          {
            name: "Singapore Laksa",
            desc: "Coconut prawn noodle soup, tofu puffs",
            price: p(135),
          },
        ],
      },
      {
        title: "Cocktails",
        items: [
          {
            name: "Lychee Martini",
            desc: "Lychee liqueur, vodka, rose water",
            price: p(80),
          },
          {
            name: "Yuzu Spritz",
            desc: "Yuzu sake, prosecco, shiso",
            price: p(75),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Mango Sticky Rice",
            desc: "Glutinous rice, coconut cream, fresh mango",
            price: p(60),
          },
        ],
      },
    ];

  if (c.includes("european") || c.includes("international"))
    return [
      {
        title: "Starters",
        items: [
          {
            name: "Burrata & Heirloom Tomato",
            desc: "Basil oil, sea salt, aged balsamic",
            price: p(95),
          },
          {
            name: "Smoked Salmon Blini",
            desc: "Crème fraîche, capers, dill",
            price: p(105),
          },
          {
            name: "French Onion Soup",
            desc: "Caramelised onion, gruyère crouton",
            price: p(75),
          },
        ],
      },
      {
        title: "Mains",
        items: [
          {
            name: "Wagyu Tenderloin",
            desc: "Potato gratin, bordelaise, seasonal vegetables",
            price: p(295),
          },
          {
            name: "Seafood Linguine",
            desc: "Lobster, clams, prawns, white wine, herbs",
            price: p(195),
          },
          {
            name: "Duck à l'Orange",
            desc: "Confit duck leg, orange jus, haricot vert",
            price: p(185),
          },
        ],
      },
      {
        title: "Cocktails",
        items: [
          {
            name: "Classic Negroni",
            desc: "Campari, gin, sweet vermouth, orange",
            price: p(75),
          },
          {
            name: "Champagne Cocktail",
            desc: "Bitters, cognac, Champagne, sugar cube",
            price: p(85),
          },
        ],
      },
      {
        title: "Desserts",
        items: [
          {
            name: "Soufflé au Chocolat",
            desc: "Dark chocolate, vanilla crème anglaise",
            price: p(70),
          },
          {
            name: "Pavlova",
            desc: "Meringue, whipped cream, seasonal berries",
            price: p(60),
          },
        ],
      },
    ];

  if (
    c.includes("russian") ||
    c.includes("theatrical") ||
    c.includes("immersive") ||
    c.includes("art")
  )
    return [
      {
        title: "Opening Acts",
        items: [
          {
            name: "Oscietra Caviar",
            desc: "30g tin, blinis, crème fraîche, chives",
            price: p(245),
          },
          {
            name: "Beetroot Salad",
            desc: "Roasted beet, goat cheese, walnut, dill",
            price: p(85),
          },
          {
            name: "Beef Tartare",
            desc: "Hand-cut fillet, Dijon, cornichons, quail egg",
            price: p(125),
          },
        ],
      },
      {
        title: "Principal Courses",
        items: [
          {
            name: "Wagyu Châteaubriand",
            desc: "A5 wagyu, truffle jus, seasonal sides",
            price: p(395),
          },
          {
            name: "Lobster Thermidor",
            desc: "Half lobster, brandy cream, gruyère crust",
            price: p(285),
          },
        ],
      },
      {
        title: "Signature Experience",
        items: [
          {
            name: "Chef's Theatre Tasting Menu",
            desc: "12-course immersive experience, wine pairing optional",
            price: p(580),
          },
        ],
      },
      {
        title: "Finales",
        items: [
          {
            name: "Dark Chocolate Sphere",
            desc: "Hot caramel poured tableside, praline mousse",
            price: p(85),
          },
        ],
      },
    ];

  return [
    {
      title: "Starters",
      items: [
        {
          name: "Seasonal Soup",
          desc: "Chef's daily preparation, artisan bread",
          price: p(55),
        },
        {
          name: "Signature Salad",
          desc: "Mixed greens, house vinaigrette, seasonal garnish",
          price: p(65),
        },
      ],
    },
    {
      title: "Mains",
      items: [
        {
          name: cuisine + " Signature",
          desc: "Speciality of the house, seasonal sides",
          price: p(175),
        },
        {
          name: "Chef's Daily Special",
          desc: "Ask your server for today's creation",
          price: p(155),
        },
      ],
    },
    {
      title: "Desserts",
      items: [
        {
          name: "Dessert of the Day",
          desc: "Freshly prepared by our pastry chef",
          price: p(65),
        },
      ],
    },
  ];
}

function MenuModal({
  restaurant: r,
  onClose,
  onBlogOpen,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  onBlogOpen: () => void;
}) {
  const sections = getMenuData(r.name, r.cuisine, r.price_tier);

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
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f0d0b] border border-[#F5EDD8]/8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F5EDD8]/8">
          <div>
            <div className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest mb-1">
              {r.cuisine}
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#F5EDD8]">
              {r.name} — Menu
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBlogOpen}
              className="text-[#F5EDD8]/40 hover:text-[#C9A84C] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onClose}
              className="bg-[#F5EDD8]/5 text-[#F5EDD8]/60 hover:text-[#F5EDD8] w-9 h-9 rounded-full flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-2 pb-2 border-b border-[#F5EDD8]/5">
          <div className="flex items-center gap-3 py-3">
            <div className="h-px flex-1 bg-[#C9A84C]/20" />
            <span className="text-[#C9A84C]/60 text-[10px] font-bold uppercase tracking-[0.4em]">
              Curated Selection
            </span>
            <div className="h-px flex-1 bg-[#C9A84C]/20" />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: si * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-['Cormorant_Garamond'] text-lg text-[#C9A84C] italic">
                  {section.title}
                </span>
                <div className="h-px flex-1 bg-[#F5EDD8]/8" />
              </div>
              <div className="space-y-4">
                {section.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex items-start justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#F5EDD8] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors duration-200">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[#F5EDD8]/40 text-xs mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[#C9A84C] text-sm font-mono shrink-0 mt-0.5">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="pt-4 border-t border-[#F5EDD8]/5">
            <p className="text-[#F5EDD8]/20 text-[11px] text-center leading-relaxed">
              Menu is subject to seasonal changes · All prices include VAT ·
              Allergen information available on request
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.map_query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 bg-[#C9A84C] hover:bg-[#d4b562] text-[#080706] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-widest px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-center transition-all duration-300"
          >
            <Navigation2 className="w-4 h-4" />
            Take Me There
          </a>
          <a
            href="/concierge/request"
            className="flex-1 min-w-0 bg-transparent border border-[#F5EDD8]/10 hover:border-[#C9A84C]/30 text-[#F5EDD8]/60 hover:text-[#C9A84C] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-widest px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-center transition-all duration-300"
          >
            Reserve via Concierge
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
