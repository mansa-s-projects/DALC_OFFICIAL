'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { COUNTRIES, POPULAR_DESTINATIONS, TRENDING_DESTINATIONS, searchCountries } from '../_lib/countries';
import type { VisaFormData, Country } from '../_lib/types';
import StepShell from './StepShell';

const trending = TRENDING_DESTINATIONS.map(code => COUNTRIES.find(c => c.code === code)).filter(Boolean) as Country[];
const popular = POPULAR_DESTINATIONS.map(code => COUNTRIES.find(c => c.code === code)).filter(Boolean) as Country[];

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
  onBack: () => void;
}

export default function StepDestination({ data, onNext, onBack }: Props) {
  const [query, setQuery] = useState('');
  const natCodes = data.nationalities.map(c => c.code);

  const results = useMemo(() => searchCountries(query, natCodes), [query, natCodes]);

  const select = (country: Country) => {
    onNext({ destination: country });
  };

  return (
    <StepShell
      step={3} totalSteps={6}
      tag="Destination Intelligence"
      title="Where Are You Travelling?"
      subtitle={`Passport: ${data.nationalities.map(c => c.flag + ' ' + c.name).join(', ')}. Select your destination to unlock entry intelligence.`}
      onBack={onBack}
      backLabel="Change Residence"
    >
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search destination country..."
        className="mb-6 w-full rounded-xl border border-[#C9A84C]/20 bg-[#120F0A] px-4 py-3 text-sm text-white placeholder-[#8A7D60] focus:border-[#C9A84C]/60 focus:outline-none"
      />

      {!query && (
        <>
          <div className="mb-6">
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">
              <TrendingUp className="h-3 w-3" /> Trending
            </p>
            <div className="flex flex-wrap gap-2">
              {trending.filter(c => !natCodes.includes(c.code)).map(c => (
                <button
                  key={c.code}
                  onClick={() => select(c)}
                  className="flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-[#181510] px-3.5 py-2 text-sm text-white transition-all hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/8"
                >
                  <span>{c.flag}</span> {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">
              <Star className="h-3 w-3" /> Popular destinations
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {popular.filter(c => !natCodes.includes(c.code)).map(c => (
                <button
                  key={c.code}
                  onClick={() => select(c)}
                  className="rounded-2xl border border-[#C9A84C]/12 bg-[#181510] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A84C]/40"
                >
                  <span className="mb-2 block text-2xl">{c.flag}</span>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="mt-0.5 text-xs text-[#8A7D60]">{c.region}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {query && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {results.map(c => (
            <button
              key={c.code}
              onClick={() => select(c)}
              className="rounded-2xl border border-[#C9A84C]/12 bg-[#181510] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9A84C]/40"
            >
              <span className="mb-2 block text-2xl">{c.flag}</span>
              <p className="text-sm font-medium text-white">{c.name}</p>
              <p className="mt-0.5 text-xs text-[#8A7D60]">{c.region}</p>
            </button>
          ))}
          {results.length === 0 && (
            <p className="col-span-full rounded-xl border border-[#C9A84C]/15 bg-[#120F0A] px-4 py-5 text-center text-sm text-[#8A7D60]">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </StepShell>
  );
}
