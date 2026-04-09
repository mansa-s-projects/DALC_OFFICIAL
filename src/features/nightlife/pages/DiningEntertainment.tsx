"use client";

import React from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import EditorialCard from '../../../components/cards/EditorialCard';
import { useVenues } from '../hooks/useVenues';
import { motion } from 'motion/react';

export default function DiningEntertainment() {
  const { data: venues = [], isLoading } = useVenues({ category: 'dining-entertainment' });

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
         {/* Background video or image suggestion */}
         <div className="absolute inset-0 z-0">
            <img 
               src="/images/dining_entertainment/Gatsby/image1.jpg" 
               alt="Dining Entertainment"
               className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/80" />
            
            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-luxury-gold/10 blur-[150px] rounded-full pointer-events-none" />
         </div>

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
         >
            <h2 className="text-luxury-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6">
               Theatrical Dining
            </h2>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-tight">
               Dining & <br/> Entertainment
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
               From Parisian cabaret in DIFC to immersive digital art in Downtown.
               Discover the venues where dinner comes with a spectacle.
            </p>
         </motion.div>
      </section>

      {/* Editorial Grid */}
      <section className="pb-24 px-4 md:px-8 max-w-[1600px] mx-auto">
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                     <div className="aspect-[4/5] bg-white/5 mb-4" />
                     <div className="h-4 bg-white/5 w-3/4 mb-2" />
                     <div className="h-3 bg-white/5 w-1/2" />
                  </div>
               ))}
            </div>
         ) : (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {venues.map((venue, index) => (
                     <React.Fragment key={venue.id}>
                        <EditorialCard venue={venue} index={index} />
                     </React.Fragment>
                  ))}
               </div>
               {venues.length === 0 && (
                  <div className="text-center py-20 border-t border-white/10 mt-20">
                     <p className="text-gray-500 italic">Curating the season's best shows...</p>
                  </div>
               )}
            </>
         )}
      </section>

      <Footer />
    </div>
  );
}