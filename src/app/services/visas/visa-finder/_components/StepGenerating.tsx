'use client';

import { useEffect, useState } from 'react';

const STAGES = [
  'Analysing passport eligibility matrix...',
  'Cross-referencing bilateral visa agreements...',
  'Computing approval confidence score...',
  'Evaluating travel risk profile...',
  'Generating document checklist...',
  'Calculating DALC concierge recommendations...',
  'Compiling your Travel Intelligence Report™...',
];

interface Props {
  onComplete: () => void;
}

export default function StepGenerating({ onComplete }: Props) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(s => {
        if (s >= STAGES.length - 1) {
          clearInterval(interval);
          setDone(true);
          setTimeout(onComplete, 800);
          return s;
        }
        return s + 1;
      });
    }, 550);
    return () => clearInterval(interval);
  }, [onComplete]);

  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20" />
        <div
          className="absolute inset-0 rounded-full border-2 border-[#C9A84C]"
          style={{
            clipPath: `inset(0 ${100 - progress}% 0 0 round 50%)`,
            transition: 'clip-path 0.5s ease',
          }}
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A84C]/10">
          <span className="font-mono text-lg font-semibold text-[#C9A84C]">
            {done ? '✓' : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>

      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9A84C]/70">
        DALC Intelligence Engine
      </p>
      <h2 className="mb-4 text-2xl font-light text-white sm:text-3xl">
        Generating Your Report
      </h2>

      <div className="h-10">
        {!done ? (
          <p className="text-sm text-[#D4C9A8]/60 transition-all duration-300">{STAGES[stage]}</p>
        ) : (
          <p className="text-sm font-medium text-[#E8CC70]">Report ready — loading...</p>
        )}
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#C9A84C]/10">
          <div
            className="h-full rounded-full bg-[#C9A84C] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-1.5">
        {STAGES.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${i <= stage ? 'text-[#D4C9A8]/70' : 'text-[#3D2E0C]'}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${i < stage ? 'bg-[#C9A84C]' : i === stage ? 'bg-[#E8CC70] shadow-[0_0_6px_rgba(232,204,112,0.8)]' : 'bg-[#3D2E0C]'}`} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
