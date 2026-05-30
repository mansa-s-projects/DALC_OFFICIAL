'use client';

import { useState } from 'react';
import type { VisaFormData, TravelProfile } from '../_lib/types';
import StepShell from './StepShell';

const HISTORY_OPTIONS = [
  { value: 'none' as const, label: 'First Trip', description: 'No prior international travel' },
  { value: 'occasional' as const, label: 'Occasional', description: '1–5 trips in total' },
  { value: 'frequent' as const, label: 'Frequent', description: '5–20 international trips' },
  { value: 'very_frequent' as const, label: 'Very Frequent', description: '20+ international trips' },
];

const FAMILY_OPTIONS = [
  { value: 'single' as const, label: 'Single' },
  { value: 'married' as const, label: 'Married' },
  { value: 'family' as const, label: 'Family with Children' },
];

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
  onBack: () => void;
}

export default function StepProfile({ data, onNext, onBack }: Props) {
  const [profile, setProfile] = useState<TravelProfile>(data.profile);

  const update = (patch: Partial<TravelProfile>) => setProfile(p => ({ ...p, ...patch }));

  const toggleBool = (key: keyof TravelProfile) => {
    update({ [key]: !profile[key] } as Partial<TravelProfile>);
  };

  return (
    <StepShell
      step={5} totalSteps={6}
      tag="Travel Profile"
      title="Build Your Travel Profile"
      subtitle="This data refines your eligibility score and unlocks more precise DALC recommendations."
      onBack={onBack}
      backLabel="Change Purpose"
      footer={
        <button
          onClick={() => onNext({ profile })}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70]"
        >
          Continue
        </button>
      }
    >
      <div className="space-y-7">
        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Travel history</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {HISTORY_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => update({ travelHistory: o.value })}
                className={`rounded-xl border p-3 text-left transition-all ${
                  profile.travelHistory === o.value
                    ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10'
                    : 'border-[#C9A84C]/12 bg-[#181510] hover:border-[#C9A84C]/30'
                }`}
              >
                <p className={`text-sm font-medium ${profile.travelHistory === o.value ? 'text-[#E8CC70]' : 'text-white'}`}>{o.label}</p>
                <p className="mt-0.5 text-xs text-[#8A7D60]">{o.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Existing visas (select all that apply)</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { key: 'hasUSVisa' as const, label: '🇺🇸 US Visa' },
              { key: 'hasUKVisa' as const, label: '🇬🇧 UK Visa' },
              { key: 'hasSchengenVisa' as const, label: '🇪🇺 Schengen Visa' },
              { key: 'hasUAEVisa' as const, label: '🇦🇪 UAE Visa' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleBool(key)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  profile[key]
                    ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#E8CC70]'
                    : 'border-[#C9A84C]/12 bg-[#181510] text-white hover:border-[#C9A84C]/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Profile flags</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { key: 'hasVisaRefusals' as const, label: 'Prior Visa Refusal', warning: true },
              { key: 'isInvestor' as const, label: 'Investor / HNW', warning: false },
              { key: 'isBusinessOwner' as const, label: 'Business Owner', warning: false },
            ].map(({ key, label, warning }) => (
              <button
                key={key}
                onClick={() => toggleBool(key)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  profile[key]
                    ? warning
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : 'border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#E8CC70]'
                    : 'border-[#C9A84C]/12 bg-[#181510] text-white hover:border-[#C9A84C]/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Family status</p>
          <div className="flex gap-2">
            {FAMILY_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => update({ familyStatus: o.value })}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  profile.familyStatus === o.value
                    ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#E8CC70]'
                    : 'border-[#C9A84C]/12 bg-[#181510] text-white hover:border-[#C9A84C]/30'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </StepShell>
  );
}
