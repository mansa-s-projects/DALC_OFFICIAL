import React from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import EditorialCard from '../../../components/cards/EditorialCard';
import { MOCK_VENUES } from '../../../data/mockData';
import { motion } from 'framer-motion';

export default function BeachClubs() {
  // Filter for Beach Clubs
  const beachClubs = MOCK_VENUES.filter(v => v.category === 'beach-clubs');

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
         {/* Background video or image suggestion */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1544957992-20516f265fb2?q=80&w=2670&auto=format&fit=crop" 
               alt="Dubai Beach Club"
               className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-luxury-black/80" />
         </div>

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl"
         >
            <h2 className="text-luxury-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6">
               Luxury Daylife & Sunset
            </h2>
            <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-tight">
               Beach Clubs
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
               From the bohemian shores of Palm West Beach to the high-octane energy of J1. 
               Experience the epitome of Dubai's sun-soaked luxury culture.
            </p>
         </motion.div>
      </section>

      {/* Editorial Grid */}
      <section className="pb-24 px-4 md:px-8 max-w-[1600px] mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {beachClubs.map((venue, index) => (
               <React.Fragment key={venue.id}>
                  <EditorialCard venue={venue} index={index} />
               </React.Fragment>
            ))}
         </div>

         {beachClubs.length === 0 && (
            <div className="text-center py-20 border-t border-white/10 mt-20">
               <p className="text-gray-500 italic">Curating the season's best venues...</p>
            </div>
         )}
      </section>

      <Footer />
    </div>
  );
}