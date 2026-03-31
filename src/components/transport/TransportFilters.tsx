import React from 'react';
import { motion } from 'motion/react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { 
  TransportFilters as FilterType, 
  TransportSubcategory,
  PricingModel,
  AvailabilityType,
} from '../../types/transport';
import { 
  CAR_SUBCATEGORIES, 
  YACHT_SUBCATEGORIES, 
  JET_SUBCATEGORIES,
  PRICING_MODEL_LABELS,
  AVAILABILITY_TYPE_LABELS,
} from '../../types/transport';

interface TransportFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  subcategory: TransportSubcategory;
  isOpen: boolean;
  onToggle: () => void;
}

export default function TransportFilters({
  filters,
  onFilterChange,
  subcategory,
  isOpen,
  onToggle,
}: TransportFiltersProps) {
  const hasFilters = Boolean(
    filters.sub_subcategory ||
    filters.pricing_model ||
    filters.price_min ||
    filters.price_max ||
    filters.availability_type ||
    filters.capacity_min
  );

  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      subcategory,
      search: filters.search, // Keep search
    });
  };

  const getSubcategoryOptions = () => {
    switch (subcategory) {
      case 'cars':
        return CAR_SUBCATEGORIES;
      case 'yachts':
        return YACHT_SUBCATEGORIES;
      case 'jets':
        return JET_SUBCATEGORIES;
      default:
        return [];
    }
  };

  const subcategoryOptions = getSubcategoryOptions();

  return (
    <div className="sticky top-24 z-30">
      {/* Filter Bar */}
      <div className="bg-luxury-black/95 backdrop-blur-md border border-white/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${
              isOpen || hasFilters
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasFilters && (
              <span className="w-4 h-4 bg-luxury-gold text-luxury-black text-[10px] font-bold rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-luxury-gold transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-luxury-black/95 backdrop-blur-md border-x border-b border-white/10 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Sub-subcategory */}
            {subcategoryOptions.length > 0 && (
              <div>
                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  Type
                </label>
                <select
                  value={filters.sub_subcategory || ''}
                  onChange={(e) => updateFilter('sub_subcategory', e.target.value || undefined)}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
                >
                  <option value="">All types</option>
                  {subcategoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pricing Model */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                Pricing
              </label>
              <select
                value={filters.pricing_model || ''}
                onChange={(e) => updateFilter('pricing_model', (e.target.value as PricingModel) || undefined)}
                className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
              >
                <option value="">All pricing</option>
                {(Object.keys(PRICING_MODEL_LABELS) as PricingModel[]).map((model) => (
                  <option key={model} value={model}>
                    {PRICING_MODEL_LABELS[model]}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                Price Range (AED)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={100}
                  placeholder="Min"
                  value={filters.price_min || ''}
                  onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  placeholder="Max"
                  value={filters.price_max || ''}
                  onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors placeholder-gray-600"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                Min Capacity
              </label>
              <select
                value={filters.capacity_min || ''}
                onChange={(e) => updateFilter('capacity_min', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
              >
                <option value="">Any capacity</option>
                <option value={2}>2+ guests</option>
                <option value={4}>4+ guests</option>
                <option value={6}>6+ guests</option>
                <option value={10}>10+ guests</option>
                <option value={20}>20+ guests</option>
              </select>
            </div>

            {/* Availability Type */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                Availability
              </label>
              <select
                value={filters.availability_type || ''}
                onChange={(e) => updateFilter('availability_type', (e.target.value as AvailabilityType) || undefined)}
                className="w-full bg-white/5 border border-white/10 text-gray-300 text-xs py-2 px-3 outline-none focus:border-luxury-gold/50 transition-colors"
              >
                <option value="">All availability</option>
                {(Object.keys(AVAILABILITY_TYPE_LABELS) as AvailabilityType[]).map((type) => (
                  <option key={type} value={type}>
                    {AVAILABILITY_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
