"use client";

import React from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Utensils, Palmtree, Music, Mic2 } from 'lucide-react';
import { MOCK_VENUES } from '../../../data/venues/mockData';
import VenueCard from '../../../components/cards/VenueCard';

const NIGHTLIFE_CATEGORIES = [
  {
    id: 'dining',
    label: 'Restaurants',
    sub: 'Fine Dining & Culinary Excellence',
    image: '/images/restaurants/Bagatelle/image1.jpg',
    icon: Utensils,
    desc: 'Michelin restaurants, rooftop dining, and chef-driven concepts.',
    path: '/nightlife/restaurants'
  },
  {
    id: 'beach-clubs',
    label: 'Beach Clubs',
    sub: 'Day to Night Sanctuaries',
    image: '/images/beach_clubs/Nikki_Beach/image1.jpg',
    icon: Palmtree,
    desc: 'Sunset lounges, pool clubs, and seaside luxury.',
    path: '/nightlife/beach-clubs'
  },
  {
    id: 'nightclubs',
    label: 'Night Clubs',
    sub: 'The After Dark Elite',
    image: '/images/nightclubs/Iris/image1.jpg',
    icon: Music,
    desc: 'VIP table service, international DJs, and late-night access.',
    path: '/nightlife/clubs'
  }
];

export default function Nightlife() {
  const diningEntertainmentVenues = MOCK_VENUES.filter(v => v.category === 'dining-entertainment').slice(0, 2);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />
      
      {/* Nightlife Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/nightclubs/Soho_Garden/image1.jpg" 
            alt="Dubai Nightlife" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-luxury-gold text-sm font-bold uppercase tracking-[0.4em] mb-4">
              Curated After Dark
            </h2>
            <h1 className="text-6xl md:text-8xl font-display text-white mb-6">
              Nightlife
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              From sunset to sunrise. Experience the city's most exclusive venues, reserved for the few.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 3 Pillars (Top Row) */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
          {NIGHTLIFE_CATEGORIES.map((category, index) => (
            <Link href={category.path} key={category.id} className="group">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-[400px] overflow-hidden rounded-sm border border-white/5 hover:border-luxury-gold/50 transition-colors"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={category.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                  <div className="mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                     <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center mb-4">
                        <category.icon className="w-6 h-6 text-black" />
                     </div>
                  </div>
                  
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl font-display text-white mb-2">{category.label}</h3>
                    <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-widest mb-2">{category.sub}</p>
                    <p className="text-gray-400 text-xs max-w-xs font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {category.desc}
                    </p>
                  </div>
                  
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Featured Section: Dining & Entertainment */}
        <div className="relative w-full rounded-sm overflow-hidden bg-luxury-charcoal border border-white/5 group">
           <div className="absolute inset-0">
              <img 
                src="/images/dining_entertainment/Billionaire/image1.jpg" 
                alt="Dining & Entertainment"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/90 to-transparent" />
           </div>

           <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div className="flex items-center gap-3 mb-6">
                    <span className="w-12 h-[1px] bg-luxury-gold" />
                    <span className="text-luxury-gold text-xs font-bold uppercase tracking-widest">Spotlight Collection</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-display text-white mb-6">Dining & <br/> Entertainment</h2>
                 <p className="text-gray-300 text-lg font-light leading-relaxed mb-8 max-w-md">
                    Dinner shows, live performances, and themed experiences. Discover the venues where dinner comes with a spectacle.
                 </p>
                 <Link href="/nightlife/dining">
                    <button className="px-8 py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white font-bold uppercase tracking-widest transition-all duration-300">
                       Explore Collection
                    </button>
                 </Link>
              </div>

              {/* Mini Venue Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {diningEntertainmentVenues.map((venue) => (
                    <motion.div
                       key={venue.id}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                    >
                       <VenueCard venue={venue} />
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}