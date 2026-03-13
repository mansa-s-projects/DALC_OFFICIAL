import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Waves, Umbrella, Filter, X } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import PropertyCard from '../../../components/stays/PropertyCard';
import StaysFilters from '../../../components/stays/StaysFilters';
import { useProperties } from '../hooks/useStays';

const BEDROOM_OPTIONS = [
  { value: 3, label: '3+ Bedrooms' },
  { value: 4, label: '4+ Bedrooms' },
  { value: 5, label: '5+ Bedrooms' },
  { value: 7, label: '7+ Bedrooms' },
];

export default function VillasList() {
  const { data: properties = [], isLoading } = useProperties({ subcategory: 'villas' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [beachfrontOnly, setBeachfrontOnly] = useState(false);
  const [poolOnly, setPoolOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popularity'>('popularity');

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Bedrooms filter
    if (selectedBedrooms) {
      filtered = filtered.filter(p => (p.bedrooms ?? 0) >= selectedBedrooms);
    }

    // Beachfront filter
    if (beachfrontOnly) {
      filtered = filtered.filter(p => p.beachfront);
    }

    // Pool filter
    if (poolOnly) {
      filtered = filtered.filter(p => p.private_pool);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.popularity_score - a.popularity_score);
        break;
    }

    return filtered;
  }, [properties, selectedBedrooms, beachfrontOnly, poolOnly, sortBy]);

  const clearFilters = () => {
    setSelectedBedrooms(null);
    setBeachfrontOnly(false);
    setPoolOnly(false);
  };

  const hasActiveFilters = selectedBedrooms !== null || beachfrontOnly || poolOnly;

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"
            alt="Luxury villas in Dubai"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/40 to-luxury-black" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/stays" 
              className="inline-flex items-center gap-2 text-luxury-gold hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-widest">Back to Stays</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
              Private Villas
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Experience ultimate privacy and luxury in Dubai's most exclusive villas. 
              Beachfront estates, golf course views, and private pools await.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters & Results ───────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-sm hover:border-luxury-gold hover:text-luxury-gold transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 w-5 h-5 bg-luxury-gold text-luxury-black text-xs rounded-full flex items-center justify-center font-bold">
                  {(selectedBedrooms ? 1 : 0) + (beachfrontOnly ? 1 : 0) + (poolOnly ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Quick filters */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setBeachfrontOnly(!beachfrontOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  beachfrontOnly
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Umbrella className="w-3.5 h-3.5" />
                Beachfront
              </button>
              <button
                onClick={() => setPoolOnly(!poolOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  poolOnly
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                Private Pool
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {filteredProperties.length} villas
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white/5 border border-white/20 text-white text-sm px-4 py-2 focus:outline-none focus:border-luxury-gold"
            >
              <option value="popularity" className="bg-luxury-black">Most Popular</option>
              <option value="price_asc" className="bg-luxury-black">Price: Low to High</option>
              <option value="price_desc" className="bg-luxury-black">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active filters */}
        {hasActiveFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="text-gray-400 text-sm">Active filters:</span>
            {selectedBedrooms && (
              <span className="flex items-center gap-1 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-sm">
                {selectedBedrooms}+ Bedrooms
                <button onClick={() => setSelectedBedrooms(null)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {beachfrontOnly && (
              <span className="flex items-center gap-1 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-sm">
                <Umbrella className="w-3 h-3" />
                Beachfront
                <button onClick={() => setBeachfrontOnly(false)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {poolOnly && (
              <span className="flex items-center gap-1 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-sm">
                <Waves className="w-3 h-3" />
                Private Pool
                <button onClick={() => setPoolOnly(false)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-luxury-gold text-sm hover:text-white transition-colors ml-2"
            >
              Clear all
            </button>
          </motion.div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <StaysFilters 
                subcategory="villas"
                onFiltersChange={(filters) => {
                  // Handle filter changes
                }}
              />
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-96 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-white/10">
                <Home className="w-12 h-12 text-luxury-gold/30 mx-auto mb-4" />
                <h3 className="text-white font-display text-xl mb-2">No villas found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
