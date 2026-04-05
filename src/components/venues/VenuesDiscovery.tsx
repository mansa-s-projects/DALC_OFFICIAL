"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Heart, ArrowRight, ArrowUpRight,
  SlidersHorizontal, X, Search,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type VenueCategory = 'dining' | 'beach-clubs' | 'nightlife' | 'dining-entertainment';

interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  cuisine_or_style: string;
  vibe: string;
  location: string;
  tags: string[];
  featured?: boolean;
}

// ─── Image Pools (deterministic by venue id hash) ─────────────────────────────

const IMG: Record<string, string[]> = {
  dining: [
    'photo-1414235077428-338989a2e8c0',
    'photo-1551218808-94e220e084d2',
    'photo-1559339352-11d035aa65de',
    'photo-1600891964092-4316c288032e',
    'photo-1504674900247-0877df9cc836',
    'photo-1555396273-367ea4eb4db5',
    'photo-1544025162-d76694265947',
    'photo-1517248135467-4c7edcad34c4',
    'photo-1484980972926-edee96e0960d',
    'photo-1590846406792-0adc7f938f1d',
  ],
  'beach-clubs': [
    'photo-1507525428034-b723cf961d3e',
    'photo-1582719508461-905c673771fd',
    'photo-1499793983690-e29da59ef1c2',
    'photo-1575429198097-0414ec08e8cd',
    'photo-1566073771259-6a8506099945',
  ],
  nightlife: [
    'photo-1570824104453-508955ab713e',
    'photo-1516450360452-9312f5e86fc7',
    'photo-1578736641330-3155e606cd40',
    'photo-1470225620780-dba8ba36b745',
  ],
  'dining-entertainment': [
    'photo-1540575467063-178a50c2df87',
    'photo-1533174072545-e8d4aa97edf9',
    'photo-1492684223066-81342ee5ff30',
    'photo-1536761758672-a40458c4001a',
  ],
};

function getImage(id: string, category: string): string {
  const pool = IMG[category] ?? IMG.dining;
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `https://images.unsplash.com/${pool[hash % pool.length]}?q=80&w=900&auto=format&fit=crop`;
}

// ─── Location normalizer ──────────────────────────────────────────────────────

const LOCATION_MAP: Record<string, string[]> = {
  'DIFC':           ['difc', 'emirates towers'],
  'Downtown Dubai': ['downtown dubai', 'dubai mall', 'burj khalifa'],
  'Business Bay':   ['business bay'],
  'Palm Jumeirah':  ['palm jumeirah', 'atlantis', 'the palm', 'west palm', 'one&only royal mirage'],
  'Jumeirah':       ['jumeirah', 'burj al arab', 'jumeirah al naseem', 'j1 beach'],
  'JBR':            ['jbr', 'rixos jbr', 'dubai harbour', 'dubai marina'],
};

function locationMatches(venueLocation: string, filter: string): boolean {
  if (filter === 'All Areas') return true;
  const targets = LOCATION_MAP[filter];
  if (!targets) return venueLocation.toLowerCase().includes(filter.toLowerCase());
  return targets.some(t => venueLocation.toLowerCase().includes(t));
}

// ─── Venue Data ───────────────────────────────────────────────────────────────

const VENUES: Venue[] = [
  // ── RESTAURANTS (40) ──────────────────────────────────────────────────────
  { id: 'amelia',         name: 'Amelia',                      category: 'dining', cuisine_or_style: 'Asian Fusion',          vibe: 'Show Dinner',      location: 'Downtown Dubai',        tags: ['Show Dinner', 'Asian Fusion'],          featured: true },
  { id: 'aretha-r',       name: 'Aretha',                      category: 'dining', cuisine_or_style: 'French & World',        vibe: 'Dinner + Show',    location: 'Downtown Dubai',        tags: ['Dinner Show', 'French'] },
  { id: 'amazonico',      name: 'Amazonico',                   category: 'dining', cuisine_or_style: 'Asian/Latin Fusion',    vibe: 'Lively',           location: 'DIFC',                  tags: ['Latin', 'Lively'] },
  { id: 'urla',           name: 'Urla',                        category: 'dining', cuisine_or_style: 'Mediterranean/Turkish', vibe: 'Terrace',          location: 'Downtown Dubai',        tags: ['Mediterranean', 'Terrace'] },
  { id: 'billionaire-r',  name: 'Billionaire',                 category: 'dining', cuisine_or_style: 'Italian & World',       vibe: 'Dinner Show',      location: 'Business Bay',          tags: ['Dinner Show', 'Italian'] },
  { id: 'gigi',           name: 'Gigi',                        category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Luxury',           location: 'Jumeirah',              tags: ['Italian', 'Luxury'],                   featured: true },
  { id: 'three-cuts',     name: 'Three Cuts',                  category: 'dining', cuisine_or_style: 'French/Steakhouse',     vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Fine Dining', 'Steakhouse'] },
  { id: 'ce-la-vie',      name: 'CE LA VIE',                   category: 'dining', cuisine_or_style: 'World Cuisine',         vibe: 'Skyline Views',    location: 'Downtown Dubai',        tags: ['Skyline Views', 'Rooftop'] },
  { id: 'joel-robuchon',  name: "L'Atelier de Joël Robuchon",  category: 'dining', cuisine_or_style: 'French Gastronomic',    vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Fine Dining', 'Gastronomic'],           featured: true },
  { id: 'okku',           name: 'OKKU',                        category: 'dining', cuisine_or_style: 'Japanese/Asian',        vibe: 'Trendy',           location: 'Palm Jumeirah',         tags: ['Japanese', 'Trendy'] },
  { id: 'tatel',          name: 'Tatel',                       category: 'dining', cuisine_or_style: 'Spanish',               vibe: 'Chic',             location: 'Downtown Dubai',        tags: ['Spanish', 'Chic'] },
  { id: 'bar-des-pres',   name: 'Bar des Prés',                category: 'dining', cuisine_or_style: 'Asian Fusion',          vibe: 'High End',         location: 'DIFC',                  tags: ['Asian Fusion', 'High End'] },
  { id: 'gattopardo',     name: 'Gattopardo',                  category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Fine Dining',      location: 'Business Bay',          tags: ['Italian', 'Classic'] },
  { id: 'bagatelle',      name: 'Bagatelle',                   category: 'dining', cuisine_or_style: 'French & World',        vibe: 'Party Restaurant', location: 'Business Bay',          tags: ['French', 'Party'] },
  { id: 'coucou',         name: 'Coucou',                      category: 'dining', cuisine_or_style: 'French & World',        vibe: 'Skyline Views',    location: 'Palm Jumeirah',         tags: ['French', 'Skyline'] },
  { id: 'verde',          name: 'Verde',                       category: 'dining', cuisine_or_style: 'Italian & World',       vibe: 'Trendy',           location: 'DIFC',                  tags: ['Italian', 'Trendy'] },
  { id: 'verde-beach',    name: 'Verde Beach',                 category: 'dining', cuisine_or_style: 'Italian & World',       vibe: 'Beachfront',       location: 'JBR',                   tags: ['Italian', 'Beachfront'] },
  { id: 'chic-nonna',     name: 'Chic Nonna',                  category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Fine Dining',      location: 'Business Bay',          tags: ['Italian', 'Fine Dining'] },
  { id: 'baoli',          name: 'Baoli',                       category: 'dining', cuisine_or_style: 'Asian Fusion',          vibe: 'Party Restaurant', location: 'DIFC',                  tags: ['Asian Fusion', 'Party'] },
  { id: 'tang',           name: 'Tang',                        category: 'dining', cuisine_or_style: 'Asian Fusion',          vibe: 'Trendy',           location: 'Downtown Dubai',        tags: ['Asian', 'Trendy'] },
  { id: 'salvaje',        name: 'Salvaje',                     category: 'dining', cuisine_or_style: 'Asian Fusion/Latin',    vibe: 'Lively',           location: 'Business Bay',          tags: ['Latin', 'Lively'] },
  { id: 'adeline',        name: 'Adeline',                     category: 'dining', cuisine_or_style: 'World Cuisine',         vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Fine Dining', 'World'] },
  { id: 'gal',            name: 'Gal',                         category: 'dining', cuisine_or_style: 'World Cuisine',         vibe: 'Trendy',           location: 'Dubai Marina',          tags: ['Trendy', 'Marina'] },
  { id: 'opa',            name: 'Opa',                         category: 'dining', cuisine_or_style: 'Greek',                 vibe: 'Dinner Show',      location: 'Business Bay',          tags: ['Greek', 'Entertainment'] },
  { id: 'shimmers',       name: 'Shimmers',                    category: 'dining', cuisine_or_style: 'Greek',                 vibe: 'Beachfront',       location: 'Jumeirah',              tags: ['Greek', 'Beachfront'] },
  { id: 'kinu-gawa',      name: 'Kinu Gawa',                   category: 'dining', cuisine_or_style: 'Japanese',              vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Japanese', 'Fine Dining'] },
  { id: 'rialto',         name: 'Rialto',                      category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Classic',          location: 'Palm Jumeirah',         tags: ['Italian', 'Classic'] },
  { id: 'culinan',        name: 'Culinan',                     category: 'dining', cuisine_or_style: 'Steakhouse',            vibe: 'Luxury',           location: 'Downtown Dubai',        tags: ['Steakhouse', 'Luxury'] },
  { id: 'lpm',            name: 'LPM',                         category: 'dining', cuisine_or_style: 'French',                vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['French', 'Fine Dining'],               featured: true },
  { id: 'shanghai-me',    name: 'Shanghai Me',                 category: 'dining', cuisine_or_style: 'Chinese',               vibe: 'Chic',             location: 'DIFC',                  tags: ['Chinese', 'Chic'] },
  { id: 'la-cantine',     name: 'La Cantine',                  category: 'dining', cuisine_or_style: 'World Cuisine',         vibe: 'Trendy',           location: 'DIFC',                  tags: ['Trendy', 'World'] },
  { id: 'raspoutine',     name: 'Raspoutine',                  category: 'dining', cuisine_or_style: 'Russian & World',       vibe: 'Nightlife Hybrid', location: 'DIFC',                  tags: ['Russian', 'Party'] },
  { id: 'niniv',          name: 'Niniv',                       category: 'dining', cuisine_or_style: 'Moroccan',              vibe: 'Arabesque',        location: 'Jumeirah',              tags: ['Moroccan', 'Arabesque'] },
  { id: 'ling-ling',      name: 'Ling Ling',                   category: 'dining', cuisine_or_style: 'Asian',                 vibe: 'Trendy',           location: 'Downtown Dubai',        tags: ['Asian', 'Trendy'] },
  { id: 'cipriani',       name: 'Cipriani',                    category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Italian', 'Classic'] },
  { id: 'gaia',           name: 'Gaia',                        category: 'dining', cuisine_or_style: 'Greek/Mediterranean',   vibe: 'Luxury',           location: 'DIFC',                  tags: ['Greek', 'Luxury'],                     featured: true },
  { id: 'alaya',          name: 'Alaya',                       category: 'dining', cuisine_or_style: 'Mediterranean',         vibe: 'Fine Dining',      location: 'DIFC',                  tags: ['Mediterranean', 'Fine Dining'] },
  { id: 'scalini',        name: 'Scalini',                     category: 'dining', cuisine_or_style: 'Italian',               vibe: 'Classic',          location: 'Jumeirah',              tags: ['Italian', 'Classic'] },
  { id: 'maison-ani',     name: 'Maison Ani',                  category: 'dining', cuisine_or_style: 'French & World',        vibe: 'Luxury',           location: 'Dubai Mall',            tags: ['French', 'Luxury'] },
  { id: 'ina',            name: 'INA',                         category: 'dining', cuisine_or_style: 'World Cuisine',         vibe: 'Beachfront',       location: 'J1 Beach',              tags: ['Beachfront', 'World'] },

  // ── BEACH CLUBS (15) ──────────────────────────────────────────────────────
  { id: 'marsa-pool',     name: 'Marsa Al Arab Pool Club',     category: 'beach-clubs', cuisine_or_style: 'Pool Club',      vibe: 'Adults Only',      location: 'Jumeirah',              tags: ['+21', 'Exclusive'],                    featured: true },
  { id: 'summersalt',     name: 'Summersalt',                  category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Family Friendly',  location: 'Jumeirah Al Naseem',    tags: ['Family', 'Beach'] },
  { id: 'bch-club',       name: 'BCH Club',                    category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Adults Only',      location: 'Palm Jumeirah',         tags: ['+21', 'Beach'] },
  { id: 'cloud22',        name: 'Cloud22',                     category: 'beach-clubs', cuisine_or_style: 'Sky Pool Club',  vibe: 'Adults Only',      location: 'Atlantis The Royal',    tags: ['+21', 'Sky Pool', 'Luxury'],           featured: true },
  { id: 'sal-burj',       name: 'Sal by Burj Al Arab',         category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Family Friendly',  location: 'Burj Al Arab',          tags: ['Family', 'Iconic'] },
  { id: 'twiggy',         name: 'Twiggy',                      category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Mixed',            location: 'Dubai Creek',           tags: ['Creek View', 'All Welcome'] },
  { id: 'maison-revka',   name: 'Maison Revka',                category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Adults Only',      location: 'Palm Jumeirah',         tags: ['+21', 'Chic'] },
  { id: 'eva-beach',      name: 'Eva Beach',                   category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Family Friendly',  location: 'Palm Jumeirah',         tags: ['Family', 'Beach'] },
  { id: 'drift',          name: 'Drift',                       category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Adults Only',      location: 'One&Only Royal Mirage', tags: ['+21', 'Exclusive', 'Luxury'],          featured: true },
  { id: 'aura-sky',       name: 'Aura Sky Pool',               category: 'beach-clubs', cuisine_or_style: 'Sky Pool Club',  vibe: 'Adults Only',      location: 'Palm Jumeirah',         tags: ['+21', 'Sky Pool'],                     featured: true },
  { id: 'ammos',          name: 'Ammos',                       category: 'beach-clubs', cuisine_or_style: 'Greek Beach',    vibe: 'Beachfront',       location: 'Rixos JBR',             tags: ['Greek', 'Beachfront'] },
  { id: 'azure-beach',    name: 'Azure Beach',                 category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Family Friendly',  location: 'JBR',                   tags: ['Family', 'JBR'] },
  { id: 'casablanca',     name: 'Casablanca',                  category: 'beach-clubs', cuisine_or_style: 'Beach Club',     vibe: 'Party',            location: 'Palm Jumeirah',         tags: ['Party', 'Beach'] },
  { id: 'sirene-gaia',    name: 'Sirène by Gaia',              category: 'beach-clubs', cuisine_or_style: 'Luxury Beach',   vibe: 'Luxury',           location: 'J1 Beach',              tags: ['Luxury', 'Greek'],                     featured: true },
  { id: 'maison-plage',   name: 'Maison de la Plage',          category: 'beach-clubs', cuisine_or_style: 'Luxury Beach',   vibe: 'Luxury',           location: 'West Palm',             tags: ['Luxury', 'Beach'] },

  // ── NIGHT CLUBS (13) ──────────────────────────────────────────────────────
  { id: 'blu',            name: 'Blu',                         category: 'nightlife', cuisine_or_style: 'Skyline Club',     vibe: 'Skyline Views',    location: 'Trade Center',          tags: ['Skyline', 'Rooftop'] },
  { id: 'blu-oasis',      name: 'Blu Oasis',                   category: 'nightlife', cuisine_or_style: 'Outdoor Club',     vibe: 'Outdoor',          location: 'Business Bay',          tags: ['Outdoor', 'Open Air'] },
  { id: 'lillys',         name: "Lilly's by Surf Club",        category: 'nightlife', cuisine_or_style: 'Beach Party',      vibe: 'Beach Party',      location: 'Palm Jumeirah',         tags: ['Beach', 'Party'] },
  { id: 'surf-club',      name: 'Surf Club',                   category: 'nightlife', cuisine_or_style: 'Beach Nightlife',  vibe: 'Beach Party',      location: 'Palm Jumeirah',         tags: ['Beach', 'Nightlife'] },
  { id: 'paraiso',        name: 'Paraiso by Amazonico',        category: 'nightlife', cuisine_or_style: 'Dinner + Club',    vibe: 'After Party',      location: 'Business Bay',          tags: ['Latin', 'After Party'] },
  { id: '1920',           name: '1920',                        category: 'nightlife', cuisine_or_style: 'Speakeasy',        vibe: 'Speakeasy',        location: 'DIFC',                  tags: ['Intimate', 'Speakeasy'],               featured: true },
  { id: 'be-beach',       name: 'Be Beach',                    category: 'nightlife', cuisine_or_style: 'Beach Party',      vibe: 'Beach Party',      location: 'Dubai Harbour',         tags: ['Beach', 'Harbour'] },
  { id: 'ushuaia',        name: 'Ushuaia',                     category: 'nightlife', cuisine_or_style: 'Festival Club',    vibe: 'Festival Vibe',    location: 'Palm Jumeirah',         tags: ['Festival', 'Party'] },
  { id: 'nyx',            name: 'NYX',                         category: 'nightlife', cuisine_or_style: 'Luxury Club',      vibe: 'Luxury',           location: 'DIFC',                  tags: ['Luxury', 'Exclusive'],                 featured: true },
  { id: 'ly-la',          name: 'Ly-La',                       category: 'nightlife', cuisine_or_style: 'Nightclub',        vibe: 'Trendy',           location: 'DIFC',                  tags: ['Trendy', 'DIFC'] },
  { id: 'bund',           name: 'Bund',                        category: 'nightlife', cuisine_or_style: 'High End Club',    vibe: 'High End',         location: 'DIFC',                  tags: ['High End', 'DIFC'] },
  { id: 'little-mykonos', name: 'Little Mykonos',              category: 'nightlife', cuisine_or_style: 'Greek Beach Party',vibe: 'Beach Party',      location: 'J1 Beach',              tags: ['Greek', 'Beach'] },
  { id: 'la-sombra',      name: 'La Sombra',                   category: 'nightlife', cuisine_or_style: 'Luxury Club',      vibe: 'Luxury',           location: 'West Palm',             tags: ['Luxury', 'Exclusive'],                 featured: true },

  // ── DINING & ENTERTAINMENT (7) ────────────────────────────────────────────
  { id: 'adaline-de',     name: 'Adaline',                     category: 'dining-entertainment', cuisine_or_style: 'Immersive Dining',       vibe: 'Immersive',        location: 'DIFC',          tags: ['Immersive', 'Dinner Show'],    featured: true },
  { id: 'aretha-de',      name: 'Aretha',                      category: 'dining-entertainment', cuisine_or_style: 'Dinner + Show',          vibe: 'Live Entertainment',location: 'Palm Jumeirah', tags: ['Dinner Show', 'Live'] },
  { id: 'dream',          name: 'Dream',                       category: 'dining-entertainment', cuisine_or_style: 'Live Performance Dining', vibe: 'Live Entertainment',location: 'JBR',           tags: ['Live Performance', 'Dinner'],  featured: true },
  { id: 'gatsby',         name: 'Gatsby',                      category: 'dining-entertainment', cuisine_or_style: 'Dinner Party',           vibe: 'Party',            location: 'The Palm',      tags: ['Dinner Party', 'Luxury'] },
  { id: 'theater',        name: 'Theater',                     category: 'dining-entertainment', cuisine_or_style: 'Show Restaurant',        vibe: 'Live Entertainment',location: 'Fairmont SZR',  tags: ['Show', 'Entertainment'] },
  { id: 'billionaire-de', name: 'Billionaire',                 category: 'dining-entertainment', cuisine_or_style: 'Dinner Show',            vibe: 'Dinner Show',      location: 'Downtown Dubai',tags: ['Dinner Show', 'Luxury'],       featured: true },
  { id: 'babylon',        name: 'Babylon',                     category: 'dining-entertainment', cuisine_or_style: 'Dining + Nightlife',     vibe: 'Nightlife Hybrid', location: 'DIFC',          tags: ['Dining', 'Nightlife'] },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',                    label: 'All Venues' },
  { id: 'dining',                 label: 'Restaurants' },
  { id: 'beach-clubs',            label: 'Beach Clubs' },
  { id: 'nightlife',              label: 'Night Clubs' },
  { id: 'dining-entertainment',   label: 'Dining & Entertainment' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const LOCATIONS = [
  'All Areas', 'DIFC', 'Downtown Dubai', 'Business Bay',
  'Palm Jumeirah', 'Jumeirah', 'JBR',
];

const VIBE_FILTERS = [
  { id: 'all',           label: 'All Vibes',         keywords: [] as string[] },
  { id: 'fine-dining',   label: 'Fine Dining',       keywords: ['fine dining', 'gastronomic', 'classic', 'high end', 'luxury'] },
  { id: 'party',         label: 'Party Scene',       keywords: ['party', 'lively', 'festival', 'nightlife', 'after party'] },
  { id: 'entertainment', label: 'Live Entertainment',keywords: ['show', 'immersive', 'performance', 'entertainment', 'dinner show'] },
  { id: 'trendy',        label: 'Trendy',            keywords: ['trendy', 'chic', 'speakeasy', 'arabesque', 'hybrid'] },
  { id: 'beachfront',    label: 'Beachfront',        keywords: ['beachfront', 'beach', 'greek beach'] },
  { id: 'skyline',       label: 'Skyline Views',     keywords: ['skyline', 'rooftop', 'terrace', 'outdoor'] },
  { id: 'adults-only',   label: '+21 Only',          keywords: ['adults only', '+21'] },
];

const INITIAL_VISIBLE = 12;

// ─── Motion Variants ──────────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

// ─── Venue Card ───────────────────────────────────────────────────────────────

function VenueCard({ venue }: { venue: Venue }) {
  const toggleSaved = useAppStore((s) => s.toggleSavedVenue);
  const savedVenues = useAppStore((s) => s.savedVenues);
  const isSaved = savedVenues.includes(venue.id);
  const image = getImage(venue.id, venue.category);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative h-[380px] w-full rounded-sm overflow-hidden bg-luxury-charcoal border border-white/5 hover:border-luxury-gold/25 transition-colors duration-500"
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={`${venue.name} — ${venue.cuisine_or_style}`}
          className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />
      </div>

      {/* Top: badge + heart */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {venue.featured ? (
          <span className="bg-luxury-gold text-black text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.15em]">
            Curated
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(venue.id); }}
          aria-label={isSaved ? 'Remove from saved' : 'Save venue'}
          className={cn(
            'p-2 rounded-full backdrop-blur-sm transition-all duration-300',
            isSaved
              ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40'
              : 'bg-black/40 text-white/70 border border-white/15 hover:text-white hover:bg-black/60'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isSaved && 'fill-luxury-gold')} />
        </button>
      </div>

      {/* Bottom content — lifts on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300 group-hover:-translate-y-2">
        <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5">
          {venue.cuisine_or_style}
        </p>
        <h3 className="text-xl font-display text-white font-medium leading-snug mb-2.5">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-3">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          {venue.location}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[9px] font-semibold uppercase tracking-wide bg-white/8 text-gray-400 border border-white/10 px-2 py-0.5">
            {venue.vibe}
          </span>
          {venue.tags.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[9px] font-semibold uppercase tracking-wide bg-white/5 text-gray-500 border border-white/8 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/venue/${venue.id}`} className="block w-full">
          <button className="w-full py-2.5 bg-white/10 hover:bg-luxury-gold hover:text-black border border-white/20 hover:border-luxury-gold text-white uppercase text-[9px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-aura">
            Enquire
            <ArrowRight className="w-3 h-3" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Spotlight Card ───────────────────────────────────────────────────────────

function SpotlightCard({ venue }: { venue: Venue }) {
  const image = getImage(venue.id, venue.category);
  return (
    <motion.div
      key={venue.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
      className="group relative w-full overflow-hidden rounded-sm border border-white/8 mb-8 md:mb-12"
    >
      <Link href={`/venue/${venue.id}`} className="grid grid-cols-1 md:grid-cols-5">
        {/* Text panel */}
        <div className="md:col-span-2 relative bg-luxury-charcoal p-8 md:p-12 lg:p-14 flex flex-col justify-center gap-5">
          <div className="absolute top-0 left-0 w-14 h-px bg-luxury-gold opacity-40" />
          <div className="absolute top-0 left-0 w-px h-14 bg-luxury-gold opacity-40" />

          <div>
            <span className="bg-luxury-gold text-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
              Spotlight
            </span>
            <p className="text-luxury-gold text-[9px] font-bold uppercase tracking-[0.3em] mt-4 mb-2">
              {venue.cuisine_or_style}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-white font-medium leading-tight mb-3">
              {venue.name}
            </h2>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {venue.location}
            </div>
          </div>

          <div className="border-l-2 border-luxury-gold/30 pl-4">
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-3">
              {venue.vibe}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {venue.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-white/5 text-gray-600 border border-white/8 px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-luxury-gold hover:text-black border border-white/10 hover:border-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group-hover:shadow-aura w-fit">
            Reserve Experience
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Image */}
        <div className="md:col-span-3 relative h-[280px] md:h-[480px] overflow-hidden">
          <img
            src={image}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal/60 via-transparent to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function VenuesDiscovery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeLocation, setActiveLocation] = useState('All Areas');
  const [activeVibe, setActiveVibe] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Reset pagination on any filter change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory, activeLocation, activeVibe, searchQuery]);

  // Clear search when category changes (avoids confusing cross-category search state)
  useEffect(() => {
    setSearchQuery('');
  }, [activeCategory]);

  const filteredVenues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const vibeFilter = VIBE_FILTERS.find((f) => f.id === activeVibe);

    return VENUES.filter((v) => {
      if (activeCategory !== 'all' && v.category !== activeCategory) return false;
      if (!locationMatches(v.location, activeLocation)) return false;
      if (q && !v.name.toLowerCase().includes(q)) return false;
      if (activeVibe !== 'all' && vibeFilter && vibeFilter.keywords.length > 0) {
        const combined = [v.vibe, ...v.tags].join(' ').toLowerCase();
        if (!vibeFilter.keywords.some((k) => combined.includes(k))) return false;
      }
      return true;
    });
  }, [activeCategory, activeLocation, activeVibe, searchQuery]);

  // Spotlight: best featured venue for the active category
  const spotlight = useMemo(() => {
    if (activeCategory === 'all') {
      return filteredVenues.find((v) => v.featured && v.category === 'dining-entertainment')
        ?? filteredVenues.find((v) => v.featured);
    }
    return filteredVenues.find((v) => v.featured);
  }, [filteredVenues, activeCategory]);

  const gridVenues = useMemo(
    () => (spotlight ? filteredVenues.filter((v) => v.id !== spotlight.id) : filteredVenues),
    [filteredVenues, spotlight]
  );

  const visibleVenues = gridVenues.slice(0, visibleCount);
  const remaining = gridVenues.length - visibleCount;
  const hasMore = remaining > 0;

  const hasActiveFilters = activeLocation !== 'All Areas' || activeVibe !== 'all';
  const activeFilterCount =
    (activeLocation !== 'All Areas' ? 1 : 0) + (activeVibe !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setActiveLocation('All Areas');
    setActiveVibe('all');
  };

  const totalCount = filteredVenues.length;

  return (
    <section className="bg-luxury-black py-24 scroll-mt-16" id="venues">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* ── Section Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.45em] mb-4">
            The Concierge Edit
          </p>
          <div className="h-px w-10 bg-luxury-gold/50 mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-white font-medium">
            Curated Venues
          </h2>
          <p className="text-gray-500 text-sm font-light mt-4 max-w-md mx-auto leading-relaxed tracking-wide">
            Hand-selected by our concierge team. Every listing earns its place.
          </p>
        </motion.div>

        {/* ── Search ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="relative mb-10"
        >
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venues by name…"
            className="w-full bg-transparent border-b border-white/10 focus:border-luxury-gold/40 pl-7 pb-3 text-white text-sm font-light placeholder:text-gray-600 outline-none transition-colors duration-300 caret-luxury-gold"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                aria-label="Clear search"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 pb-3"
              >
                <X className="w-3.5 h-3.5 text-gray-500 hover:text-white transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Category Navigation ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-luxury-black to-transparent z-10 pointer-events-none md:hidden" />
            <div
              role="tablist"
              aria-label="Venue categories"
              className="flex items-end gap-7 md:gap-10 overflow-x-auto border-b border-white/8 pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === 'all'
                  ? VENUES.length
                  : VENUES.filter((v) => v.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'relative flex-shrink-0 pb-4 transition-colors duration-300 whitespace-nowrap flex items-baseline gap-1.5',
                      isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                    )}
                  >
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      {cat.label}
                    </span>
                    <span className={cn(
                      'text-[8px] font-medium tabular-nums transition-colors duration-300',
                      isActive ? 'text-gray-500' : 'text-gray-700'
                    )}>
                      {count}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="cat-underline"
                        className="absolute bottom-0 left-0 right-0 h-px bg-luxury-gold"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-medium">
            {searchQuery ? (
              <>
                <span className="text-gray-400 font-semibold tabular-nums">{totalCount}</span>
                {' '}results for{' '}
                <span className="text-gray-400 italic">"{searchQuery}"</span>
              </>
            ) : (
              <>
                <span className="text-gray-400 font-semibold tabular-nums">{totalCount}</span>
                {' '}venues
              </>
            )}
          </p>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-luxury-gold transition-colors duration-200"
              >
                <X className="w-2.5 h-2.5" />
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all duration-300',
                showFilters || hasActiveFilters
                  ? 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/40'
                  : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20 hover:text-white'
              )}
            >
              <SlidersHorizontal className="w-3 h-3" />
              Refine
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-luxury-gold text-black flex items-center justify-center text-[8px] font-black tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* ── Filter Panel ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-white/[0.02] border border-white/8 p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">Area</p>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={cn(
                          'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200',
                          activeLocation === loc
                            ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                            : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                        )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">Vibe</p>
                  <div className="flex flex-wrap gap-2">
                    {VIBE_FILTERS.map((vf) => (
                      <button
                        key={vf.id}
                        onClick={() => setActiveVibe(vf.id)}
                        className={cn(
                          'px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200',
                          activeVibe === vf.id
                            ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                            : 'bg-transparent text-gray-600 border-white/8 hover:border-white/20 hover:text-gray-400'
                        )}
                      >
                        {vf.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}|${activeLocation}|${activeVibe}|${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredVenues.length === 0 ? (
              <div className="text-center py-28 border border-white/5">
                <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
                <p className="font-display text-2xl text-white mb-2">Nothing matches</p>
                <p className="text-gray-600 text-sm font-light">
                  Adjust your filters or search to explore more.
                </p>
                <button
                  onClick={() => { clearFilters(); setSearchQuery(''); }}
                  className="mt-8 px-8 py-3 border border-white/10 hover:border-luxury-gold/40 text-gray-500 hover:text-luxury-gold text-[9px] font-bold uppercase tracking-widest transition-all duration-300"
                >
                  Reset All
                </button>
              </div>
            ) : (
              <>
                {/* Spotlight */}
                <AnimatePresence mode="wait">
                  {spotlight && <SpotlightCard key={spotlight.id} venue={spotlight} />}
                </AnimatePresence>

                {/* Grid */}
                {visibleVenues.length > 0 && (
                  <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  >
                    {visibleVenues.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </motion.div>
                )}

                {/* Load More */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12"
                  >
                    <div className="h-px w-10 bg-white/8 mx-auto mb-6" />
                    <button
                      onClick={() => setVisibleCount((c) => c + 12)}
                      className="px-10 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-gray-500 hover:text-white font-bold uppercase text-[9px] tracking-widest transition-all duration-300"
                    >
                      Explore More
                      <span className="text-gray-700 font-normal ml-2 normal-case tracking-normal">
                        · {remaining} more
                      </span>
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer CTA ───────────────────────────────────────────── */}
        {filteredVenues.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center mt-20"
          >
            <div className="h-px w-10 bg-luxury-gold/30 mx-auto mb-6" />
            <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-5 font-medium">
              Looking for something specific?
            </p>
            <Link href="/request">
              <button className="px-10 py-4 bg-transparent hover:bg-luxury-gold hover:text-black border border-white/15 hover:border-luxury-gold text-white font-bold uppercase text-[10px] tracking-widest transition-all duration-300">
                Speak with a Concierge
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
