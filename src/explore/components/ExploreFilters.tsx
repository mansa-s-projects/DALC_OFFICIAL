import { Search, X, ChevronDown, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ExploreFilterState } from '../types';

const EMIRATES = [
  'All Emirates',
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Fujairah',
  'Ajman',
  'Umm Al Quwain',
];

const CATEGORIES = [
  'All Categories',
  'Nature',
  'Historic',
  'Adventure',
  'Culture',
  'Wellness',
  'Urban',
  'Desert',
  'Coastal',
];

interface ExploreFiltersProps {
  filters: ExploreFilterState;
  onChange: (filters: ExploreFilterState) => void;
  totalCount: number;
  filteredCount: number;
  mobileView?: 'grid' | 'map';
  onMobileViewChange?: (v: 'grid' | 'map') => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const isActive = value !== options[0];

  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'appearance-none cursor-pointer rounded-xl border py-2.5 pl-4 pr-9 text-sm outline-none transition-all duration-200',
          'bg-[#111214] font-medium',
          isActive
            ? 'border-[rgba(200,164,107,0.6)] text-[#C8A46B] shadow-[0_0_14px_rgba(200,164,107,0.12)]'
            : 'border-[rgba(200,164,107,0.2)] text-[#B6B6B6] hover:border-[rgba(200,164,107,0.4)] hover:text-white',
        ].join(' ')}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#111214] text-white">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className={[
          'pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors',
          isActive ? 'text-[#C8A46B]' : 'text-[#B6B6B6]/60',
        ].join(' ')}
      />
    </div>
  );
}

export default function ExploreFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
  mobileView,
  onMobileViewChange,
}: ExploreFiltersProps) {
  const set = <K extends keyof ExploreFilterState>(k: K, v: ExploreFilterState[K]) =>
    onChange({ ...filters, [k]: v });

  const hasActive =
    filters.emirate !== 'All Emirates' ||
    filters.category !== 'All Categories' ||
    filters.hiddenGems !== 'all' ||
    filters.search.trim() !== '';

  return (
    <div className="sticky top-[68px] z-30 border-b border-[rgba(200,164,107,0.12)] bg-[#0B0B0C]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* ── Mobile view toggle (lg:hidden) ── */}
          {onMobileViewChange && (
            <div className="flex flex-shrink-0 items-center gap-0.5 rounded-xl border border-[rgba(200,164,107,0.18)] bg-[#111214] p-1 lg:hidden">
              <button
                onClick={() => onMobileViewChange('grid')}
                aria-label="Grid view"
                className={cn(
                  'flex h-7 w-8 items-center justify-center rounded-lg transition-all duration-200',
                  mobileView === 'grid'
                    ? 'bg-[rgba(200,164,107,0.15)] text-[#C8A46B]'
                    : 'text-[#B6B6B6]/45 hover:text-[#B6B6B6]',
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onMobileViewChange('map')}
                aria-label="Map view"
                className={cn(
                  'flex h-7 w-8 items-center justify-center rounded-lg transition-all duration-200',
                  mobileView === 'map'
                    ? 'bg-[rgba(200,164,107,0.15)] text-[#C8A46B]'
                    : 'text-[#B6B6B6]/45 hover:text-[#B6B6B6]',
                )}
              >
                <MapIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* ── Search ── */}
          <div className="relative w-44 flex-shrink-0 sm:w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#B6B6B6]/40" />
            <input
              type="text"
              placeholder="Search locations…"
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="w-full rounded-xl border border-[rgba(200,164,107,0.2)] bg-[#111214] py-2.5 pl-9 pr-8 text-sm text-white placeholder-[#B6B6B6]/35 outline-none transition-all duration-200 focus:border-[rgba(200,164,107,0.5)] focus:shadow-[0_0_0_2px_rgba(200,164,107,0.08)]"
            />
            {filters.search && (
              <button
                onClick={() => set('search', '')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B6B6B6]/40 transition-colors hover:text-[#B6B6B6]/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px flex-shrink-0 bg-[rgba(200,164,107,0.12)]" />

          {/* ── Dropdowns ── */}
          <FilterSelect
            label="Emirate"
            value={filters.emirate}
            options={EMIRATES}
            onChange={(v) => set('emirate', v)}
          />
          <FilterSelect
            label="Category"
            value={filters.category}
            options={CATEGORIES}
            onChange={(v) => set('category', v)}
          />

          {/* Hidden Gems */}
          <div className="relative flex-shrink-0">
            <select
              value={filters.hiddenGems}
              onChange={(e) => set('hiddenGems', e.target.value as ExploreFilterState['hiddenGems'])}
              className={cn(
                'appearance-none cursor-pointer rounded-xl border py-2.5 pl-4 pr-9 text-sm font-medium outline-none transition-all duration-200 bg-[#111214]',
                filters.hiddenGems !== 'all'
                  ? 'border-[rgba(200,164,107,0.6)] text-[#C8A46B] shadow-[0_0_14px_rgba(200,164,107,0.12)]'
                  : 'border-[rgba(200,164,107,0.2)] text-[#B6B6B6] hover:border-[rgba(200,164,107,0.4)] hover:text-white',
              )}
            >
              <option value="all" className="bg-[#111214] text-white">All Locations</option>
              <option value="true" className="bg-[#111214] text-white">Hidden Gems Only</option>
              <option value="false" className="bg-[#111214] text-white">Landmarks Only</option>
            </select>
            <ChevronDown
              className={cn(
                'pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2',
                filters.hiddenGems !== 'all' ? 'text-[#C8A46B]' : 'text-[#B6B6B6]/60',
              )}
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Count + Clear ── */}
          <div className="flex flex-shrink-0 items-center gap-3">
            {hasActive && (
              <button
                onClick={() =>
                  onChange({ emirate: 'All Emirates', category: 'All Categories', hiddenGems: 'all', search: '' })
                }
                className="text-xs text-[#C8A46B]/70 underline underline-offset-2 transition-colors hover:text-[#C8A46B]"
              >
                Clear
              </button>
            )}
            <span className="whitespace-nowrap text-xs text-[#B6B6B6]/50">
              <span className="text-[#B6B6B6]/80">{filteredCount}</span>
              {filteredCount !== totalCount && <span> / {totalCount}</span>}{' '}
              locations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
