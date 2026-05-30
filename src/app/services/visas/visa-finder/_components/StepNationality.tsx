'use client';

import { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { COUNTRIES, searchCountries } from '../_lib/countries';
import type { VisaFormData, Country } from '../_lib/types';
import StepShell from './StepShell';

const POPULAR = COUNTRIES.filter(c => c.popular).slice(0, 12);

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
}

export default function StepNationality({ data, onNext }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Country[]>(data.nationalities);

  const excluded = selected.map(c => c.code);
  const results = useMemo(() => searchCountries(query, excluded), [query, excluded]);
  const showPopular = !query && selected.length === 0;
  const display = showPopular ? POPULAR.filter(c => !excluded.includes(c.code)) : results;

  const toggle = (country: Country) => {
    const next = selected.some(c => c.code === country.code)
      ? selected.filter(c => c.code !== country.code)
      : [...selected, country];
    setSelected(next);
    if (next.length === 1) setQuery('');
  };

  const handleNext = () => {
    if (selected.length > 0) onNext({ nationalities: selected });
  };

  return (
    <StepShell
      step={1} totalSteps={6}
      tag="Passport & Nationality"
      title="Select Your Passport"
      subtitle="Choose your primary nationality. Add a second passport if you hold dual citizenship."
      footer={
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      {selected.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {selected.map(c => (
            <div key={c.code} className="flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5">
              <span>{c.flag}</span>
              <span className="text-sm text-[#E8CC70]">{c.name}</span>
              <button onClick={() => toggle(c)} className="text-[#C9A84C]/60 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {selected.length === 1 && (
            <button onClick={() => setQuery('')} className="flex items-center gap-1.5 rounded-full border border-dashed border-[#C9A84C]/25 px-3 py-1.5 text-sm text-[#C9A84C]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]">
              <Plus className="h-3.5 w-3.5" /> Add second passport
            </button>
          )}
        </div>
      )}

      <div className="mb-5">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search country or nationality..."
          className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#120F0A] px-4 py-3 text-sm text-white placeholder-[#8A7D60] focus:border-[#C9A84C]/60 focus:outline-none"
        />
      </div>

      {showPopular && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Popular passports</p>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {display.map(country => (
          <button
            key={country.code}
            onClick={() => toggle(country)}
            className="group rounded-2xl border border-[#C9A84C]/12 bg-[#181510] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A84C]/40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl">{country.flag}</span>
              <span className="font-mono text-[10px] tracking-widest text-[#C9A84C]/50">{country.code}</span>
            </div>
            <p className="text-sm font-medium text-white">{country.name}</p>
            <p className="mt-0.5 text-xs text-[#8A7D60]">{country.region}</p>
          </button>
        ))}
      </div>

      {display.length === 0 && (
        <p className="rounded-xl border border-[#C9A84C]/15 bg-[#120F0A] px-4 py-5 text-center text-sm text-[#8A7D60]">
          No results for &ldquo;{query}&rdquo; — try a shorter keyword
        </p>
      )}
    </StepShell>
  );
}
