import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Home, Bed, Waves, Umbrella, Check, DollarSign } from 'lucide-react';
import type { StaysSubcategory, StaysFilters as StaysFiltersType } from '../../types/stays';

interface StaysFiltersProps {
  subcategory: StaysSubcategory;
  onFiltersChange: (filters: StaysFiltersType) => void;
  className?: string;
}

export default function StaysFilters({ subcategory, onFiltersChange, className = '' }: StaysFiltersProps) {
  const [filters, setFilters] = useState<StaysFiltersType>({});

  const updateFilter = <K extends keyof StaysFiltersType>(
    key: K, 
    value: StaysFiltersType[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-display text-lg">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-luxury-gold text-xs hover:text-white transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="pb-6 border-b border-white/10">
        <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Price Range
        </h4>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={filters.price_min || ''}
            onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-luxury-gold placeholder-gray-500"
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.price_max || ''}
            onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-luxury-gold placeholder-gray-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="pb-6 border-b border-white/10">
        <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Location</h4>
        <select
          value={filters.area || ''}
          onChange={(e) => updateFilter('area', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-luxury-gold"
        >
          <option value="" className="bg-luxury-black">All Areas</option>
          <option value="Downtown Dubai" className="bg-luxury-black">Downtown Dubai</option>
          <option value="Dubai Marina" className="bg-luxury-black">Dubai Marina</option>
          <option value="Palm Jumeirah" className="bg-luxury-black">Palm Jumeirah</option>
          <option value="Jumeirah Beach" className="bg-luxury-black">Jumeirah Beach</option>
          <option value="Emirates Hills" className="bg-luxury-black">Emirates Hills</option>
        </select>
      </div>

      {/* Hotels-specific: Star Rating */}
      {subcategory === 'hotels' && (
        <div className="pb-6 border-b border-white/10">
          <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Star Rating
          </h4>
          <div className="space-y-2">
            {[5, 4, 3].map((stars) => (
              <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.star_rating === stars}
                  onChange={(e) => updateFilter('star_rating', e.target.checked ? stars : undefined)}
                  className="w-4 h-4 accent-luxury-gold"
                />
                <span className="flex items-center gap-1 text-gray-300 group-hover:text-white transition-colors">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                  ))}
                  <span className="ml-1 text-sm">{stars} Star</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Villas-specific: Features */}
      {subcategory === 'villas' && (
        <div className="pb-6 border-b border-white/10">
          <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Features</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.beachfront || false}
                onChange={(e) => updateFilter('beachfront', e.target.checked || undefined)}
                className="w-4 h-4 accent-luxury-gold"
              />
              <span className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
                <Umbrella className="w-4 h-4" />
                <span className="text-sm">Beachfront</span>
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.private_pool || false}
                onChange={(e) => updateFilter('private_pool', e.target.checked || undefined)}
                className="w-4 h-4 accent-luxury-gold"
              />
              <span className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
                <Waves className="w-4 h-4" />
                <span className="text-sm">Private Pool</span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Residences-specific: Furnished */}
      {subcategory === 'residences' && (
        <div className="pb-6 border-b border-white/10">
          <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Type</h4>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.furnished || false}
              onChange={(e) => updateFilter('furnished', e.target.checked || undefined)}
              className="w-4 h-4 accent-luxury-gold"
            />
            <span className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
              <Check className="w-4 h-4" />
              <span className="text-sm">Furnished Only</span>
            </span>
          </label>
        </div>
      )}

      {/* Bedrooms - All categories */}
      <div className="pb-6 border-b border-white/10">
        <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <Bed className="w-4 h-4" />
          Bedrooms
        </h4>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => updateFilter('bedrooms', filters.bedrooms === num ? undefined : num)}
              className={`px-3 py-1.5 text-sm transition-colors ${
                filters.bedrooms === num
                  ? 'bg-luxury-gold text-luxury-black'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Instant Booking */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.instant_booking || false}
            onChange={(e) => updateFilter('instant_booking', e.target.checked || undefined)}
            className="w-4 h-4 accent-luxury-gold"
          />
          <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
            Instant Booking Only
          </span>
        </label>
      </div>
    </div>
  );
}
