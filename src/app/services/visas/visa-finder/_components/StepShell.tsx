'use client';

import { ChevronLeft } from 'lucide-react';

interface StepShellProps {
  step: number;
  totalSteps: number;
  tag: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
  backLabel?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function StepShell({
  step, totalSteps, tag, title, subtitle,
  onBack, backLabel = 'Back', children, footer,
}: StepShellProps) {
  return (
    <div className="mx-auto max-w-5xl">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-[#C9A84C] transition-colors hover:text-[#E8CC70]"
        >
          <ChevronLeft className="h-5 w-5" />
          {backLabel}
        </button>
      )}

      <div className="overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#0D0B08]/90 backdrop-blur-xl">
        <div className="border-b border-[#C9A84C]/15 px-6 py-8 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C9A84C]/70">
            Step {step} / {totalSteps}
          </p>
          <h2 className="mt-2 text-3xl font-light text-white sm:text-4xl">{title}</h2>
          <p className="mt-1.5 max-w-xl text-sm text-[#D4C9A8]/60">{subtitle}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/40">{tag}</p>
        </div>

        <div className="px-6 py-6 sm:px-10 sm:py-8">{children}</div>

        {footer && (
          <div className="border-t border-[#C9A84C]/15 bg-[#080706]/60 px-6 py-5 sm:px-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
