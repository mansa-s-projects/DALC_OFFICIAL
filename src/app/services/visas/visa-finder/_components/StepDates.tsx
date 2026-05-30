'use client';

import { useState } from 'react';
import { CalendarDays, Shuffle } from 'lucide-react';
import type { VisaFormData } from '../_lib/types';
import StepShell from './StepShell';

interface Props {
  data: VisaFormData;
  onNext: (update: Partial<VisaFormData>) => void;
  onBack: () => void;
}

function durationLabel(arrival: string, departure: string): string {
  if (!arrival || !departure) return '';
  const days = Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000);
  if (days <= 0) return '';
  return `${days} day${days !== 1 ? 's' : ''}`;
}

function minDate(): string {
  return new Date().toISOString().split('T')[0];
}

function maxDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().split('T')[0];
}

export default function StepDates({ data, onNext, onBack }: Props) {
  const [arrival, setArrival] = useState(data.dates.arrival);
  const [departure, setDeparture] = useState(data.dates.departure);
  const [isFlexible, setIsFlexible] = useState(data.dates.isFlexible);

  const duration = durationLabel(arrival, departure);
  const canContinue = isFlexible || (!!arrival && !!departure && departure > arrival);

  const handleNext = () => {
    onNext({ dates: { arrival, departure, isFlexible } });
  };

  return (
    <StepShell
      step={6} totalSteps={6}
      tag="Travel Dates"
      title="When Are You Travelling?"
      subtitle="Your travel window determines the recommended application date and processing urgency."
      onBack={onBack}
      backLabel="Change Profile"
      footer={
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="ml-auto flex items-center gap-2 rounded-xl bg-[#C9A84C] px-7 py-3 font-medium text-[#080706] transition-all hover:bg-[#E8CC70] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate Report
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <p className="mb-2 text-sm text-[#D4C9A8]/70">Arrival date</p>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A84C]/50" />
              <input
                type="date"
                value={arrival}
                min={minDate()}
                max={maxDate()}
                onChange={e => setArrival(e.target.value)}
                disabled={isFlexible}
                className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#120F0A] py-3 pl-10 pr-4 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none disabled:opacity-40"
              />
            </div>
          </label>

          <label className="block">
            <p className="mb-2 text-sm text-[#D4C9A8]/70">Departure date</p>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A84C]/50" />
              <input
                type="date"
                value={departure}
                min={arrival || minDate()}
                max={maxDate()}
                onChange={e => setDeparture(e.target.value)}
                disabled={isFlexible}
                className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#120F0A] py-3 pl-10 pr-4 text-sm text-white focus:border-[#C9A84C]/60 focus:outline-none disabled:opacity-40"
              />
            </div>
          </label>
        </div>

        {duration && !isFlexible && (
          <div className="flex items-center gap-2 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Duration</span>
            <span className="ml-auto text-sm font-medium text-[#E8CC70]">{duration}</span>
          </div>
        )}

        <button
          onClick={() => setIsFlexible(!isFlexible)}
          className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            isFlexible
              ? 'border-[#C9A84C]/50 bg-[#C9A84C]/8'
              : 'border-[#C9A84C]/12 bg-[#181510] hover:border-[#C9A84C]/30'
          }`}
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isFlexible ? 'bg-[#C9A84C]/20' : 'bg-[#242118]'}`}>
            <Shuffle className={`h-4 w-4 ${isFlexible ? 'text-[#E8CC70]' : 'text-[#8A7D60]'}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isFlexible ? 'text-[#E8CC70]' : 'text-white'}`}>Flexible dates</p>
            <p className="text-xs text-[#8A7D60]">I&apos;m still planning — generate a general report</p>
          </div>
        </button>
      </div>
    </StepShell>
  );
}
