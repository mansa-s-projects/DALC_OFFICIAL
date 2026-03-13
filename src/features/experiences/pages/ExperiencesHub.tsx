import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Moon,
  Mountain,
  UtensilsCrossed,
  Waves,
  Plane,
  Sparkles,
  Landmark,
  ArrowRight,
  Search,
  Calendar,
  Star,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ExperienceCard from '../../../components/experiences/ExperienceCard';
import TrendingStrip from '../../../components/experiences/TrendingStrip';
import { useFeaturedExperiences, useUpcomingEvents } from '../hooks/useExperiences';
import type { ExperienceSubcategory } from '../types';
import {
  SUBCATEGORY_LABELS,
  SUBCATEGORY_DESCRIPTIONS,
} from '../types';

// ─── Category Config ──────────────────────────────────────────────────────────

interface CategoryConfig {
  subcategory: ExperienceSubcategory;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    subcategory: 'nightlife',
    icon: <Moon className="w-7 h-7" />,
    gradient: 'from-purple-900/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'adventure',
    icon: <Mountain className="w-7 h-7" />,
    gradient: 'from-amber-900/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'dining',
    icon: <UtensilsCrossed className="w-7 h-7" />,
    gradient: 'from-rose-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'water',
    icon: <Waves className="w-7 h-7" />,
    gradient: 'from-cyan-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'sky',
    icon: <Plane className="w-7 h-7" />,
    gradient: 'from-blue-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'wellness',
    icon: <Sparkles className="w-7 h-7" />,
    gradient: 'from-emerald-900/40 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
  },
  {
    subcategory: 'culture',
    icon: <Landmark className="w-7 h-7" />,
    gradient: 'from-stone-700/60 to-luxury-black',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  },
];

// ─── Hero Carousel Data ───────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2670&auto=format&fit=crop',
    title: 'Discover Dubai',
    subtitle: 'Unforgettable Experiences',
    description: 'From desert adventures to rooftop luxury — curate your perfect Dubai journey.',
  },
  {
    image: 'https://images.unsplash.com/photo-1529661197280-63dc398c6b33?q=80&w=2670&auto=format&fit=crop',
    title: 'Sky High Thrills',
    subtitle: 'Adrenaline Awaits',
    description: 'Skydive over Palm Jumeirah or take a helicopter tour of the city skyline.',
  },
  {
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2670&auto=format&fit=crop',
    title: 'Luxury After Dark',
    subtitle: 'Nightlife Redefined',
    description: 'Exclusive access to Dubai\'s most coveted clubs, lounges, and events.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExperiencesHub() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: featured = [], isLoading: featuredLoading } = useFeaturedExperiences();
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useUpcomingEvents();

  // Auto-advance carousel
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero Carousel ────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              opacity: currentSlide === idx ? 1 : 0,
              scale: currentSlide === idx ? 1 : 1.05,
            }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-luxury-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
          </motion.div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center pt-20">
          <div className="text-center max-w-4xl mx-auto px-4">
            {HERO_SLIDES.map((slide, idx) => (
              <motion.div
                key={idx}
                initial={false}
                animate={{
                  opacity: currentSlide === idx ? 1 : 0,
                  y: currentSlide === idx ? 0 : 20,
                }}
                transition={{ duration: 0.6 }}
                className={currentSlide === idx ? 'block' : 'hidden'}
              >
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.5em] mb-4">
                  {slide.subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
                  {slide.description}
                </p>
              </motion.div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/experiences"
                className="px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Experiences
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="#categories"
                className="px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-12 h-1 transition-all duration-300 ${
                currentSlide === idx ? 'bg-luxury-gold' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Trending Strip ───────────────────────────────────────────────────── */}
      <TrendingStrip />

      {/* ── Category Grid ────────────────────────────────────────────────────── */}
      <section id="categories" className="px-4 md:px-8 max-w-7xl mx-auto py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">Categories</p>
          <h2 className="text-3xl md:text-4xl font-display text-white">Find Your Experience</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.subcategory}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/experiences/${cat.subcategory}`}
                className="group relative block h-64 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
              >
                {/* BG Image */}
                <img
                  src={cat.image}
                  alt={SUBCATEGORY_LABELS[cat.subcategory]}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="text-luxury-gold/70 group-hover:text-luxury-gold transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-display text-xl mb-2 leading-snug group-hover:text-luxury-gold transition-colors duration-300">
                      {SUBCATEGORY_LABELS[cat.subcategory]}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {SUBCATEGORY_DESCRIPTIONS[cat.subcategory]}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-luxury-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Experiences ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
              Curated
            </p>
            <h2 className="text-3xl md:text-4xl font-display text-white">Featured Experiences</h2>
          </div>
          <Link
            to="/experiences"
            className="text-luxury-gold text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((experience, idx) => (
              <ExperienceCard key={experience.id} experience={experience} index={idx} />
            ))}
          </div>
        )}

        {!featuredLoading && featured.length === 0 && (
          <div className="text-center py-16 border border-white/10">
            <p className="text-gray-500 italic">Featured experiences coming soon.</p>
          </div>
        )}
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Calendar
              </p>
              <h2 className="text-3xl md:text-4xl font-display text-white">Upcoming Events</h2>
            </div>
          </motion.div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/experiences/${event.subcategory}/${event.slug}`}
                    className="group block relative h-64 overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500"
                  >
                    {event.hero_image && (
                      <img
                        src={event.hero_image}
                        alt={event.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent" />

                    {/* Event Date Badge */}
                    {event.event_date && (
                      <div className="absolute top-4 left-4 bg-luxury-gold text-luxury-black px-3 py-2 text-center">
                        <span className="block text-xs font-bold uppercase">
                          {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="block text-2xl font-bold">
                          {new Date(event.event_date).getDate()}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-luxury-gold text-xs uppercase tracking-widest">
                        {SUBCATEGORY_LABELS[event.subcategory]}
                      </span>
                      <h3 className="text-white font-display text-lg mt-1 group-hover:text-luxury-gold transition-colors">
                        {event.name}
                      </h3>
                      {event.price_from && (
                        <p className="text-gray-400 text-sm mt-2">
                          From {event.price_currency} {event.price_from.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── CTA Section ──────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-luxury-gold/20 p-10 md:p-16 text-center"
        >
          {/* BG */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />

          <div className="relative z-10">
            <Star className="w-8 h-8 text-luxury-gold mx-auto mb-6 opacity-60" />
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Bespoke Experiences
            </p>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Our concierge team can arrange exclusive experiences tailored to your preferences.
              From private yacht charters to celebrity chef dinners — we make it happen.
            </p>
            <Link
              to="/concierge"
              className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              Request Custom Experience
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
