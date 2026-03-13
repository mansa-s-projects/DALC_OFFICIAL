import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Utensils, Music, Palmtree, Ship, Car, Star, 
  ShoppingBag, Briefcase, Plane, ArrowUpRight, Wine, Trophy 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  { 
    id: 'nightlife-hub', // Changed ID to avoid confusion with the 'nightlife' category ID
    icon: Music, 
    label: 'Nightlife', 
    desc: 'Exclusive club access & events',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop',
    position: 'top-left',
    path: '/nightlife' // Direct path to new landing page
  },
  { 
    id: 'sports', 
    icon: Trophy, 
    label: 'Activities', 
    desc: 'Premium sports & leisure',
    image: 'https://images.unsplash.com/photo-1587280501635-68a6e82cd7db?q=80&w=2671&auto=format&fit=crop',
    position: 'mid-left',
    path: '/explore/sports'
  },
  { 
    id: 'shopping', 
    icon: ShoppingBag, 
    label: 'Lifestyle', 
    desc: 'Personal shopping & wellness',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop',
    position: 'bottom-left',
    path: '/explore/shopping'
  },
  { 
    id: 'experiences', 
    icon: Star, 
    label: 'Experiences', 
    desc: 'Unique adventures, curated for you',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2670&auto=format&fit=crop',
    position: 'top-right',
    path: '/explore/experiences'
  },
  { 
    id: 'car-rental', 
    icon: Car, 
    label: 'Car Rental', 
    desc: 'Luxury fleet & chauffeurs',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop',
    position: 'mid-right',
    path: '/explore/car-rental'
  },
  { 
    id: 'business', 
    icon: Briefcase, 
    label: 'Business and Legal', 
    desc: 'Professional services & support',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop',
    position: 'bottom-right',
    path: '/explore/business'
  },
  { 
    id: 'travel', 
    icon: Plane, 
    label: 'Travel', 
    desc: 'Private jets & transfers',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2576&auto=format&fit=crop',
    position: 'extra',
    path: '/explore/travel'
  },
  { 
    id: 'yachts', 
    icon: Ship, 
    label: 'Yachts', 
    desc: 'Private charters & marine',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2670&auto=format&fit=crop',
    position: 'extra',
    path: '/explore/yachts'
  }
];

// Map positions to coordinates for the "Orbit" layout
const POSITIONS: Record<string, { x: number, y: number }> = {
  'top-left': { x: -380, y: -180 },
  'mid-left': { x: -420, y: 0 },
  'bottom-left': { x: -380, y: 180 },
  'top-right': { x: 380, y: -180 },
  'mid-right': { x: 420, y: 0 },
  'bottom-right': { x: 380, y: 180 },
};

export default function FloatingOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 15);
    mouseY.set((clientY / innerHeight - 0.5) * 15);
  };

  // Filter services for the main orbital display
  const mainServices = SERVICES.filter(s => POSITIONS[s.position]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[900px] w-full flex items-center justify-center overflow-hidden py-20 bg-luxury-black"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-speed-lines opacity-5 pointer-events-none" />

      {/* Orbit Rings (Thin Gold Lines) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-luxury-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-luxury-gold/5 pointer-events-none" />

      {/* Desktop Orbit Layout */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative w-full max-w-[1200px] h-[800px] hidden lg:flex items-center justify-center"
      >
        {/* Center Hub */}
        <div className="absolute z-20 w-[340px] h-[440px] rounded-sm bg-luxury-black border border-luxury-gold/40 shadow-aura-strong flex flex-col items-center justify-center text-center p-8 group overflow-hidden">
          {/* Inner Glow/Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 via-transparent to-luxury-gold/5 opacity-50" />
          <div className="absolute inset-0 border-[3px] border-luxury-black rounded-sm" /> {/* Inner Border effect */}
          <div className="absolute inset-[4px] border border-luxury-gold/20 rounded-sm" />

          <div className="relative z-10 flex flex-col items-center h-full justify-center">
            <h3 className="font-display text-4xl text-luxury-gold mb-1 tracking-tight">ELEVATED</h3>
            <h3 className="font-display text-4xl text-white mb-6 tracking-tight">LIVING</h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[240px] font-light">
              Experience unparalleled luxury and curated experiences beyond expectation in the heart of Dubai. 
              <br/><br/>
              Your desires, our expertise.
            </p>

            <Link to="/explore">
              <button className="px-8 py-3 border border-luxury-gold/30 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all duration-300 flex items-center gap-2 group-hover:shadow-aura">
                Explore Concierge <ArrowUpRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>

        {/* Orbital Cards */}
        {mainServices.map((service, i) => {
          const pos = POSITIONS[service.position];
          return (
            <motion.div
              key={service.id}
              className="absolute z-30"
              initial={{ opacity: 0, x: 0, y: 0 }} // Start at center
              animate={{ opacity: 1, x: pos.x, y: pos.y }}
              transition={{ delay: i * 0.1, duration: 0.8, type: "spring", stiffness: 50 }}
            >
              <Link to={service.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group relative w-[280px] h-[140px] rounded-xl bg-luxury-black border border-white/10 hover:border-luxury-gold/60 hover:shadow-aura transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={service.image} 
                      alt="" 
                      className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      {/* Gold Icon Box */}
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-[#D4AF37] to-[#8a7020] flex items-center justify-center shadow-lg">
                        <service.icon className="w-5 h-5 text-black" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-luxury-gold transition-colors" />
                    </div>

                    <div>
                      <h4 className="text-white font-display text-lg tracking-wide group-hover:text-luxury-gold transition-colors">{service.label}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">{service.desc}</p>
                    </div>
                  </div>
                  
                  {/* Glow Edge */}
                  <div className="absolute inset-0 border border-luxury-gold/0 group-hover:border-luxury-gold/20 rounded-xl transition-all duration-500" />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile Stacked Layout */}
      <div className="lg:hidden w-full px-4 flex flex-col gap-6">
         {/* Mobile Center Card */}
         <div className="w-full rounded-xl bg-luxury-black border border-luxury-gold/30 p-8 text-center shadow-aura relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent)]" />
            <h3 className="relative font-display text-3xl text-luxury-gold mb-1">ELEVATED</h3>
            <h3 className="relative font-display text-3xl text-white mb-4">LIVING</h3>
            <p className="relative text-gray-400 text-sm mb-6">Curated experiences beyond expectation.</p>
            <Link to="/explore" className="inline-block relative">
              <button className="px-6 py-3 bg-luxury-gold text-black text-xs font-bold uppercase tracking-widest">
                Explore Concierge
              </button>
            </Link>
         </div>

         {/* Mobile Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((service) => (
              <Link key={service.id} to={service.path}>
                <div className="group relative h-32 rounded-xl bg-luxury-charcoal border border-white/10 p-5 flex flex-col justify-between active:scale-[0.98] transition-all overflow-hidden">
                   {/* Bg Image Mobile */}
                   <div className="absolute inset-0 opacity-20">
                      <img src={service.image} className="w-full h-full object-cover grayscale" alt="" />
                   </div>
                   <div className="absolute inset-0 bg-black/60" />

                   <div className="relative flex justify-between items-start">
                      <div className="w-8 h-8 rounded bg-luxury-gold flex items-center justify-center">
                        <service.icon className="w-4 h-4 text-black" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-500" />
                   </div>
                   <div className="relative">
                      <h4 className="text-white font-medium">{service.label}</h4>
                      <p className="text-xs text-gray-400">{service.desc}</p>
                   </div>
                </div>
              </Link>
            ))}
         </div>
      </div>
    </div>
  );
}