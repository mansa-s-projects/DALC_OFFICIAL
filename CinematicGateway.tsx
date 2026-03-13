import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Lottie from 'lottie-react';
import { ArrowRight, Lock, Globe, Star, Martini, Plane, Briefcase, ConciergeBell } from 'lucide-react';

// NOTE: Download a cinematic bird Lottie JSON and place it at this path.
// Recommended: A dark silhouette or semi-transparent style works best.
// import eagleAnimation from '../assets/eagle.json';

type ViewState = 'access' | 'menu';

const CATEGORIES = [
  { id: 'move', label: 'Move To Dubai', icon: Globe },
  { id: 'exp', label: 'Experiences', icon: Star },
  { id: 'night', label: 'Nightlife', icon: Martini },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'biz', label: 'Business Setup', icon: Briefcase },
  { id: 'concierge', label: 'Concierge', icon: ConciergeBell },
];

// --- Animation Constants (from Design System) ---
const TRANSITION_EASE = [0.16, 1, 0.3, 1]; // Premium cubic-bezier
const DURATION_ENTRANCE = 0.9;
const DURATION_CARD = 0.6;

export const CinematicGateway: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('access');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API verification
    setTimeout(() => {
      setViewState('menu');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-luxury-black font-sans text-luxury-white">
      
      {/* --- SCENE LAYER 1: ATMOSPHERE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Horizon Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#1e2029_0%,_#0A0A0A_55%)] opacity-80" />
        
        {/* Film Grain / Noise Overlay (Essential for cinematic texture) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      </div>

      {/* --- SCENE LAYER 2: THE EAGLE (Parallax) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          // Long, slow diagonal flight path
          initial={{ x: '-20vw', y: '60vh', scale: 0.8, rotate: 5, opacity: 0 }}
          animate={{ x: '120vw', y: '10vh', scale: 0.6, rotate: 0, opacity: 0.7 }}
          transition={{ 
            duration: 25, 
            ease: "linear", 
            repeat: Infinity, 
            repeatDelay: 5 
          }}
          className="absolute w-96 h-96 mix-blend-multiply filter blur-[1px]"
        >
          {/* Lottie Player - Temporarily disabled (requires lottie-react package and eagle.json asset) */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-white/10 rounded-full flex items-center justify-center">
              <span className="text-white/20 text-xs">🦅</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- SCENE LAYER 3: INTERFACE --- */}
      <div className="relative z-30 w-full max-w-6xl px-6">
        <AnimatePresence mode="wait">
          
          {/* --- STATE: ACCESS CARD --- */}
          {viewState === 'access' && (
            <motion.div
              key="access-card"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
              transition={{ duration: DURATION_ENTRANCE, ease: TRANSITION_EASE }}
              className="max-w-md mx-auto"
            >
              <div className="bg-[#111214] border border-luxury-gold/30 rounded-2xl p-10 shadow-aura relative overflow-hidden group">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-aura-faint opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <div className="w-12 h-12 border border-luxury-gold/50 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <span className="text-luxury-gold font-display text-xl">D</span>
                    </div>
                    <h1 className="text-3xl font-display text-white tracking-wide">DUBAI À LA CARTE</h1>
                    <p className="text-luxury-silver/50 text-[10px] uppercase tracking-[0.2em] mt-3">Curated Access</p>
                  </motion.div>

                  <form onSubmit={handleAccess} className="w-full space-y-5">
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-luxury-gold/50" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="block w-full pl-10 pr-3 py-3.5 bg-luxury-charcoal/50 border border-white/10 rounded-lg text-sm placeholder-white/20 text-white focus:outline-none focus:border-luxury-gold/60 focus:ring-1 focus:ring-luxury-gold/60 focus:shadow-aura transition-all text-center"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 bg-luxury-gold hover:bg-[#C8A46B] text-luxury-black font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-aura"
                    >
                      <span>{isSubmitting ? 'Verifying...' : 'Access Menu'}</span>
                      {!isSubmitting && (
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      )}
                    </button>
                    
                    <p className="text-[10px] text-white/20 uppercase tracking-widest pt-2">
                      Private Invitation Only
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- STATE: MENU GRID --- */}
          {viewState === 'menu' && (
            <motion.div
              key="menu-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: TRANSITION_EASE }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-display text-white mb-2">Welcome to Dubai</h2>
                <p className="text-luxury-silver text-sm tracking-wide">Select your destination</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.3 + (index * 0.1), 
                      duration: DURATION_CARD,
                      ease: TRANSITION_EASE 
                    }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative h-48 bg-[#111214] border border-white/5 hover:border-luxury-gold/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-aura"
                  >
                    {/* Card Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/0 to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
                      <div className="mb-4 text-luxury-gold/40 group-hover:text-luxury-gold transition-colors duration-300">
                        <cat.icon size={24} strokeWidth={1} />
                      </div>
                      
                      <span className="text-luxury-silver text-[10px] uppercase tracking-[0.2em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        Explore
                      </span>
                      <h3 className="text-xl font-display text-white group-hover:text-luxury-gold transition-colors duration-300">
                        {cat.label}
                      </h3>
                      
                      <motion.div 
                        className="absolute bottom-6 opacity-0 group-hover:opacity-100"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-4 h-4 text-luxury-gold" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};