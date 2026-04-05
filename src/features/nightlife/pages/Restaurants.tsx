"use client";

import React from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import EditorialCard from '../../../components/cards/EditorialCard';
import { MOCK_VENUES } from '../../../data/venues/mockData';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export default function Restaurants() {
  const restaurants = React.useMemo(() => MOCK_VENUES.filter(v => v.category === 'dining' || v.category === 'dining-entertainment'), []);
  const isLoading = false;

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Editorial Hero */}
      <section className="relative h-[50vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
         >
            <h2 className="text-luxury-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6">
               The Concierge Edit
            </h2>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-8">
               Restaurants
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
               From hidden speakeasies in DIFC to Michelin-starred tables overlooking the fountains. 
               This is our curated selection of Dubai's culinary excellence.
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
                  {restaurants.map((venue, index) => (
                     <React.Fragment key={venue.id}>
                        <EditorialCard venue={venue} index={index} />
                     </React.Fragment>
                  ))}
               </div>
               {restaurants.length === 0 && (
                  <div className="text-center py-20 border-t border-white/10 mt-20">
                     <p className="text-gray-500 italic">More curated venues coming soon.</p>
                  </div>
               )}
            </>
         )}
      </section>

      <Footer />
    </div>
  );
}