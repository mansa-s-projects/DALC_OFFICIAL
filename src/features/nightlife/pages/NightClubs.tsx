import React from 'react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import EditorialCard from '../../../components/cards/EditorialCard';
import { MOCK_VENUES } from '../../../data/mockData';
import { motion } from 'framer-motion';

export default function NightClubs() {
  // Filter for Night Clubs
  const clubs = MOCK_VENUES.filter(v => v.category === 'nightlife');

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center pt-20 px-4 text-center overflow-hidden">
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop" 
               alt="Dubai Night Clubs"
               className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/80" />
            
            {/* Subtle purple glow for nightlife vibe */}
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

      {/* Editorial Grid */}
      <section className="pb-24 px-4 md:px-8 max-w-[1600px] mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {clubs.map((venue, index) => (
               <React.Fragment key={venue.id}>
                  <EditorialCard venue={venue} index={index} />
               </React.Fragment>
            ))}
         </div>

         {clubs.length === 0 && (
            <div className="text-center py-20 border-t border-white/10 mt-20">
               <p className="text-gray-500 italic">Curating the city's best venues...</p>
            </div>
         )}
      </section>

      <Footer />
    </div>
  );
}