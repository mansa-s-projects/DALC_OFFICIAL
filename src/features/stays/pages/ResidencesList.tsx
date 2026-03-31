import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Building2, Clock, Check, Filter, X } from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import PropertyCard from '../../../components/stays/PropertyCard';
import StaysFilters from '../../../components/stays/StaysFilters';
import { useProperties } from '../hooks/useStays';

const LEASE_TERMS = [
  { value: '6_months', label: '6+ Months' },
  { value: '12_months', label: '12+ Months' },
  { value: '24_months', label: '24+ Months' },
];

const BEDROOM_OPTIONS = [
  { value: 1, label: '1 Bedroom' },
  { value: 2, label: '2 Bedrooms' },
  { value: 3, label: '3 Bedrooms' },
];

export default function ResidencesList() {
  const { data: properties = [], isLoading } = useProperties({ subcategory: 'residences' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedLeaseTerm, setSelectedLeaseTerm] = useState<string | null>(null);
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'popularity'>('popularity');

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Bedrooms filter
    if (selectedBedrooms) {
      filtered = filtered.filter(p => (p.bedrooms ?? 0) >= selectedBedrooms);
    }

    // Lease term filter
    if (selectedLeaseTerm) {
      filtered = filtered.filter(p => 
        p.lease_terms?.includes(selectedLeaseTerm)
      );
    }

    // Furnished filter
    if (furnishedOnly) {
      filtered = filtered.filter(p => p.furnished);
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
  }, [properties, selectedBedrooms, selectedLeaseTerm, furnishedOnly, sortBy]);

  const clearFilters = () => {
    setSelectedBedrooms(null);
    setSelectedLeaseTerm(null);
    setFurnishedOnly(false);
  };

  const hasActiveFilters = selectedBedrooms !== null || selectedLeaseTerm !== null || furnishedOnly;

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop"
            alt="Premium residences in Dubai"
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
              href="/stays"
              className="inline-flex items-center gap-2 text-luxury-gold hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-widest">Back to Stays</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
              Furnished Residences
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Long-term luxury living in Dubai's most desirable neighborhoods. 
              Fully furnished apartments with flexible lease terms.
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
                  {(selectedBedrooms ? 1 : 0) + (selectedLeaseTerm ? 1 : 0) + (furnishedOnly ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Quick filters */}
            <div className="hidden md:flex items-center gap-2">
              {LEASE_TERMS.slice(0, 2).map(term => (
                <button
                  key={term.value}
                  onClick={() => setSelectedLeaseTerm(
                    selectedLeaseTerm === term.value ? null : term.value
                  )}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                    selectedLeaseTerm === term.value
                      ? 'bg-luxury-gold text-luxury-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {term.label}
                </button>
              ))}
              <button
                onClick={() => setFurnishedOnly(!furnishedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                  furnishedOnly
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Furnished
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {filteredProperties.length} residences
            </span>
            <select
              title="Sort properties"
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
                {selectedBedrooms} Bedroom{selectedBedrooms > 1 ? 's' : ''}
                <button title="Remove bedroom filter" onClick={() => setSelectedBedrooms(null)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedLeaseTerm && (
              <span className="flex items-center gap-1 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-sm">
                <Clock className="w-3 h-3" />
                {LEASE_TERMS.find(t => t.value === selectedLeaseTerm)?.label}
                <button title="Remove lease term filter" onClick={() => setSelectedLeaseTerm(null)} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {furnishedOnly && (
              <span className="flex items-center gap-1 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-sm">
                <Check className="w-3 h-3" />
                Furnished
                <button title="Remove furnished filter" onClick={() => setFurnishedOnly(false)} className="ml-1 hover:text-white">
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
                subcategory="residences"
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
                <Building2 className="w-12 h-12 text-luxury-gold/30 mx-auto mb-4" />
                <h3 className="text-white font-display text-xl mb-2">No residences found</h3>
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
