'use client';

import { useState } from 'react';
import { Palmtree, Briefcase, GraduationCap, Building2, HeartPulse, PlaneTakeoff, TrendingUp, Home, Users, Laptop } from 'lucide-react';
import type { VisaFormData, TravelPurpose } from '../_lib/types';
import StepShell from './StepShell';

const PURPOSES: { value: TravelPurpose; icon: React.ElementType; label: string; description: string }[] = [
  { value: 'tourism', icon: Palmtree, label: 'Tourism', description: 'Leisure, sightseeing, holiday' },
  { value: 'business', icon: Briefcase, label: 'Business', description: 'Meetings, conferences, trade' },
  { value: 'study', icon: GraduationCap, label: 'Study', description: 'University, courses, exchange' },
  { value: 'employment', icon: Building2, label: 'Employment', description: 'New job, work permit' },
  { value: 'medical', icon: HeartPulse, label: 'Medical', description: 'Treatment, surgery, wellness' },
  { value: 'transit', icon: PlaneTakeoff, label: 'Transit', description: 'Stopover, connecting flight' },
  { value: 'investment', icon: TrendingUp, label: 'Investment', description: 'Real estate, business, stocks' },
  { value: 'relocation', icon: Home, label: 'Relocation', description: 'Moving permanently or long-term' },
  { value: 'family_visit', icon: Users, label: 'Family Visit', description: 'Visiting relatives or spouse' },
  { value: 'remote_work', icon: Laptop, label: 'Remote Work', description: 'Digital nomad, freelance' },
];

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
  onBack: () => void;
}

export default function StepPurpose({ data, onNext, onBack }: Props) {
  const [purpose, setPurpose] = useState<TravelPurpose | null>(data.purpose);

  const handleSelect = (value: TravelPurpose) => {
    setPurpose(value);
    setTimeout(() => onNext({ purpose: value }), 180);
  };

  return (
    <StepShell
      step={4} totalSteps={6}
      tag="Travel Purpose"
      title="What Is Your Purpose of Travel?"
      subtitle={`${data.destination?.flag} ${data.destination?.name} — Select the primary reason for your trip to receive a tailored intelligence report.`}
      onBack={onBack}
      backLabel="Change Destination"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PURPOSES.map(({ value, icon: Icon, label, description }) => {
          const active = purpose === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`group rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                active
                  ? 'border-[#C9A84C]/70 bg-[#C9A84C]/12 shadow-[0_0_20px_rgba(201,168,76,0.12)]'
                  : 'border-[#C9A84C]/12 bg-[#181510] hover:border-[#C9A84C]/35'
              }`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${active ? 'bg-[#C9A84C]/20' : 'bg-[#242118] group-hover:bg-[#C9A84C]/10'}`}>
                <Icon className={`h-5 w-5 ${active ? 'text-[#E8CC70]' : 'text-[#8A7D60] group-hover:text-[#C9A84C]'}`} />
              </div>
              <p className={`text-sm font-medium ${active ? 'text-[#E8CC70]' : 'text-white'}`}>{label}</p>
              <p className="mt-0.5 text-xs text-[#8A7D60]">{description}</p>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}
