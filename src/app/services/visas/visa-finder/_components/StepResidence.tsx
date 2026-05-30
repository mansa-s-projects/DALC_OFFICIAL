'use client';

import { useState, useMemo } from 'react';
import { searchCountries } from '../_lib/countries';
import type { VisaFormData, Country, ResidencyStatus } from '../_lib/types';
import StepShell from './StepShell';

const STATUSES: { value: ResidencyStatus; label: string; description: string }[] = [
  { value: 'citizen', label: 'Citizen', description: 'Born or naturalised citizen' },
  { value: 'uae_resident', label: 'UAE Resident', description: 'UAE residency visa holder' },
  { value: 'gcc_resident', label: 'GCC Resident', description: 'Resident in another GCC country' },
  { value: 'us_resident', label: 'US Resident', description: 'US Green Card or long-term visa' },
  { value: 'uk_resident', label: 'UK Resident', description: 'UK Settled / Pre-Settled Status' },
  { value: 'eu_resident', label: 'EU Resident', description: 'EU long-term residency permit' },
  { value: 'perm_resident', label: 'Permanent Resident', description: 'Permanent residency in another country' },
  { value: 'expat', label: 'Expat / Work Visa', description: 'Living abroad on a work visa' },
];

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
  onBack: () => void;
}

export default function StepResidence({ data, onNext, onBack }: Props) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState<Country | null>(data.residence?.country ?? null);
  const [status, setStatus] = useState<ResidencyStatus>(data.residence?.status ?? 'expat');

  const results = useMemo(() => searchCountries(query), [query]);
  const display = query ? results : results.filter(c => c.popular).slice(0, 12);

  const handleNext = () => {
    if (country) onNext({ residence: { country, status } });
  };

  return (
    <StepShell
      step={2} totalSteps={6}
      tag="Current Residence"
      title="Where Do You Currently Live?"
      subtitle="Your country of residence affects entry rules and eligibility for certain visa pathways."
      onBack={onBack}
      backLabel="Change Passport"
      footer={
        <button
          onClick={handleNext}
          disabled={!country}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      }
    >
      {country ? (
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-3">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <p className="font-medium text-white">{country.name}</p>
              <p className="text-xs text-[#8A7D60]">Country of residence</p>
            </div>
            <button onClick={() => setCountry(null)} className="ml-auto text-xs text-[#C9A84C]/60 hover:text-[#C9A84C]">
              Change
            </button>
          </div>

          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Residency status</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  status === s.value
                    ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10'
                    : 'border-[#C9A84C]/12 bg-[#181510] hover:border-[#C9A84C]/30'
                }`}
              >
                <p className={`text-sm font-medium ${status === s.value ? 'text-[#E8CC70]' : 'text-white'}`}>{s.label}</p>
                <p className="mt-0.5 text-xs text-[#8A7D60]">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country of residence..."
            className="mb-5 w-full rounded-xl border border-[#C9A84C]/20 bg-[#120F0A] px-4 py-3 text-sm text-white placeholder-[#8A7D60] focus:border-[#C9A84C]/60 focus:outline-none"
          />
          {!query && <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Popular countries</p>}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {display.map(c => (
              <button
                key={c.code}
                onClick={() => setCountry(c)}
                className="rounded-2xl border border-[#C9A84C]/12 bg-[#181510] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#C9A84C]/40"
              >
                <span className="mb-2 block text-2xl">{c.flag}</span>
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="mt-0.5 text-xs text-[#8A7D60]">{c.region}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </StepShell>
  );
}
