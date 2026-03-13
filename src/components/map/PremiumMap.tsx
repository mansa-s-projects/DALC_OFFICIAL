import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Locate, Plus, Minus, RotateCw, Map as MapIcon, Layers, ArrowUpRight } from 'lucide-react';
import { Venue } from '../../types';

interface PremiumMapProps {
  venue: Venue;
}

export default function PremiumMap({ venue }: PremiumMapProps) {
  const [isInteractive, setIsInteractive] = useState(false);

  return (
    <div className="relative w-full h-[500px] bg-luxury-charcoal overflow-hidden rounded-sm group border border-white/5">
      
      {/* Simulated Map Layer (Using Image for Demo without API Key) */}
      <div className={`w-full h-full relative transition-transform duration-1000 ${isInteractive ? 'scale-110' : 'scale-100'}`}>
         {/* Base Dark Map Texture */}
         <div className="absolute inset-0 bg-[#121212]" />
         
         {/* Fake Map Elements (Roads/Blocks) - Stylistic representation */}
         <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)',
            backgroundSize: '20px 20px'
         }} />
         
         {/* Simulated Map Image */}
         <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop" 
            alt="Map View"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale" 
         />
         
         {/* Location Pin */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <motion.div 
               initial={{ y: -20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               className="relative"
            >
               <div className="w-16 h-16 rounded-full bg-luxury-gold/20 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               <div className="relative z-10 bg-luxury-black border border-luxury-gold px-4 py-2 rounded-sm shadow-aura flex items-center gap-2">
                  <MapIcon className="w-3 h-3 text-luxury-gold" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">{venue.name}</span>
               </div>
               <div className="w-0.5 h-8 bg-luxury-gold mx-auto" />
               <div className="w-3 h-3 bg-luxury-gold rounded-full mx-auto shadow-[0_0_15px_rgba(212,175,55,1)]" />
            </motion.div>
         </div>
      </div>

      {/* Overlay UI Controls */}
      <div className="absolute top-6 left-6 z-20">
         <div className="bg-luxury-black/80 backdrop-blur-md border border-white/10 p-4 rounded-sm max-w-xs">
            <h4 className="text-white font-display text-lg mb-1">{venue.area}</h4>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Live Traffic: Smooth</p>
            <button className="text-luxury-gold text-xs font-bold uppercase tracking-widest hover:text-white flex items-center gap-2">
               Get Directions <ArrowUpRight className="w-3 h-3" />
            </button>
         </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
         {[
            { icon: Plus, label: "Zoom In" },
            { icon: Minus, label: "Zoom Out" },
            { icon: RotateCw, label: "Rotate" },
            { icon: Layers, label: "Layers" },
         ].map((control, i) => (
            <button 
               key={i}
               onClick={() => setIsInteractive(!isInteractive)}
               className="w-10 h-10 bg-luxury-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-luxury-gold hover:border-luxury-gold transition-colors"
               title={control.label}
            >
               <control.icon className="w-4 h-4" />
            </button>
         ))}
      </div>

      {/* Interaction Prompt Overlay */}
      {!isInteractive && (
         <div 
            className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
            onClick={() => setIsInteractive(true)}
         >
            <div className="bg-luxury-black/90 border border-luxury-gold/30 px-6 py-3 rounded-full flex items-center gap-3 transform group-hover:scale-105 transition-transform">
               <Locate className="w-4 h-4 text-luxury-gold animate-pulse" />
               <span className="text-white text-xs font-bold uppercase tracking-widest">Enable 3D View</span>
            </div>
         </div>
      )}
    </div>
  );
}