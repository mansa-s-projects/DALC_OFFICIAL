import React from 'react';
import Navbar from '../components/navigation/Navbar';
import VenueCard from '../components/cards/VenueCard';
import { CATEGORIES } from '../data/mockData';
import { Search, ChevronDown } from 'lucide-react';
import Footer from '../components/navigation/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import VenueGridSkeleton from '../components/skeletons/VenueGridSkeleton';
import ErrorState from '../components/error/ErrorState';
import { useExplore } from '../hooks/useExplore';

export default function Explore() {
  const {
    activeCategory,
    searchQuery,
    isMoreOpen,
    setActiveCategory,
    setSearchQuery,
    setIsMoreOpen,
    handleCategorySelect,
    currentCategoryLabel,
    venuesQuery,
    filteredVenues,
    primaryCats,
    secondaryCats,
    isMoreActive,
  } = useExplore();

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />
      
      <div className="pt-40 pb-12 max-w-7xl mx-auto px-4 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
                <h2 className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 pl-1">Curated Venues</h2>
                <h1 className="text-4xl md:text-6xl font-display text-white tracking-tight">
                    {currentCategoryLabel}
                </h1>
            </motion.div>

            {/* Elegant Search Input */}
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative w-full md:w-72 group"
            >
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-hover:text-luxury-gold transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search venues, areas..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-3 pl-8 pr-4 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-luxury-gold transition-colors font-light tracking-wide"
                />
            </motion.div>
        </div>

        {/* Editorial Tab Navigation */}
        <div className="relative border-b border-white/10 mb-16">
            <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-4 scrollbar-hide">
                {/* 'All' Tab */}
                <button 
                    onClick={() => setActiveCategory('all')}
                    className={`relative text-xs font-bold uppercase tracking-[0.2em] pb-2 transition-colors whitespace-nowrap ${
                        activeCategory === 'all' ? 'text-luxury-gold' : 'text-gray-500 hover:text-white'
                    }`}
                >
                    All Collection
                    {activeCategory === 'all' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold" />
                    )}
                </button>

                {/* Primary Category Tabs */}
                {primaryCats.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`relative text-xs font-bold uppercase tracking-[0.2em] pb-2 transition-colors whitespace-nowrap ${
                            activeCategory === cat.id ? 'text-luxury-gold' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        {cat.label}
                        {activeCategory === cat.id && (
                             <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold" />
                        )}
                    </button>
                ))}

                {/* 'More' Dropdown Trigger */}
                <div className="relative ml-auto md:ml-0 z-20">
                    <button 
                         onClick={() => setIsMoreOpen(!isMoreOpen)}
                         className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] pb-2 transition-colors whitespace-nowrap ${
                            isMoreActive ? 'text-luxury-gold' : 'text-gray-500 hover:text-white'
                         }`}
                    >
                        More <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                         {isMoreActive && (
                             <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold" />
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isMoreOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 md:left-0 mt-4 w-64 bg-[#0F0F0F] border border-white/10 p-2 shadow-2xl backdrop-blur-3xl"
                            >
                                {secondaryCats.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`w-full text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/5 transition-colors border-b border-white/5 last:border-none ${
                                            activeCategory === cat.id ? 'text-luxury-gold' : 'text-gray-400'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        {venuesQuery.isLoading && <VenueGridSkeleton />}

        {venuesQuery.error && (
          <ErrorState
            message={venuesQuery.error instanceof Error ? venuesQuery.error.message : 'Failed to load venues.'}
            retry={() => venuesQuery.refetch()}
          />
        )}

        {!venuesQuery.isLoading && !venuesQuery.error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode='wait'>
              {filteredVenues.map((venue, i) => (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <VenueCard venue={venue} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!venuesQuery.isLoading && !venuesQuery.error && filteredVenues.length === 0 && (
          <div className="text-center py-32 opacity-50">
            <p className="text-gray-400 font-display text-xl">No venues found.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}