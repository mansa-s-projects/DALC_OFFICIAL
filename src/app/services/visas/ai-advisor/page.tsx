'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { StepId, VisaFormData, TravelReport } from '../visa-finder/_lib/types';
import { generateReport } from '../visa-finder/_lib/intelligence';
import { COUNTRIES } from '../visa-finder/_lib/countries';
import StepNationality from '../visa-finder/_components/StepNationality';
import StepResidence from '../visa-finder/_components/StepResidence';
import StepDestination from '../visa-finder/_components/StepDestination';
import StepPurpose from '../visa-finder/_components/StepPurpose';
import StepProfile from '../visa-finder/_components/StepProfile';
import StepDates from '../visa-finder/_components/StepDates';
import StepGenerating from '../visa-finder/_components/StepGenerating';
import IntelligenceReport from '../visa-finder/_components/IntelligenceReport';
import LeadCapture from '../visa-finder/_components/LeadCapture';

const DEFAULT_PROFILE: VisaFormData['profile'] = {
  travelHistory: 'occasional',
  hasVisaRefusals: false,
  hasUSVisa: false,
  hasUKVisa: false,
  hasSchengenVisa: false,
  hasUAEVisa: false,
  isInvestor: false,
  isBusinessOwner: false,
  familyStatus: 'single',
};

const DEFAULT_DATA: VisaFormData = {
  nationalities: [],
  residence: null,
  destination: null,
  purpose: null,
  profile: DEFAULT_PROFILE,
  dates: { arrival: '', departure: '', isFlexible: false },
};

const STEP_ORDER: StepId[] = ['nationality', 'residence', 'destination', 'purpose', 'profile', 'dates', 'generating', 'report'];

const STEP_LABELS: Partial<Record<StepId, string>> = {
  nationality: 'Nationality',
  residence: 'Residence',
  destination: 'Destination',
  purpose: 'Purpose',
  profile: 'Profile',
  dates: 'Dates',
};

export default function VisaFinderPage() {
  const [step, setStep] = useState<StepId>('nationality');
  const [data, setData] = useState<VisaFormData>(DEFAULT_DATA);
  const [report, setReport] = useState<TravelReport | null>(null);
  const [showLead, setShowLead] = useState(false);

  // Pre-populate from quick-search widget params: ?from=AE&to=JP
  // Using window.location.search avoids useSearchParams Suspense requirement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromCode = params.get('from');
    const toCode   = params.get('to');
    if (!fromCode && !toCode) return;

    const fromCountry = fromCode ? COUNTRIES.find(c => c.code === fromCode) : undefined;
    const toCountry   = toCode   ? COUNTRIES.find(c => c.code === toCode)   : undefined;

    if (fromCountry && toCountry) {
      setData(d => ({ ...d, nationalities: [fromCountry], destination: toCountry }));
      setStep('purpose');
    } else if (fromCountry) {
      setData(d => ({ ...d, nationalities: [fromCountry] }));
      setStep('residence');
    }
  }, []);

  const currentIdx = STEP_ORDER.indexOf(step);
  const visibleSteps = STEP_ORDER.filter(s => s !== 'generating' && s !== 'report');
  const progressIdx = visibleSteps.indexOf(step as never);

  const advance = useCallback((next: StepId, update?: Partial<VisaFormData>) => {
    if (update) setData(d => ({ ...d, ...update }));
    setStep(next);
  }, []);

  const back = useCallback((prev: StepId) => setStep(prev), []);

  const handleGenerationComplete = useCallback(() => {
    const finalData = data;
    const r = generateReport(finalData);
    setReport(r);
    setStep('report');
  }, [data]);

  const restart = useCallback(() => {
    setData(DEFAULT_DATA);
    setReport(null);
    setStep('nationality');
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080706] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(201,168,76,0.14),transparent_40%),radial-gradient(ellipse_at_85%_100%,rgba(201,168,76,0.08),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.06]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#C9A84C]/15 bg-[#080706]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9A84C]/60">DALC Global Mobility</p>
            <h1 className="mt-0.5 text-xl font-light text-white sm:text-2xl">
              Travel Intelligence <span className="text-[#C9A84C]">Engine</span>
            </h1>
          </div>

          {step !== 'generating' && step !== 'report' && (
            <div className="hidden items-center gap-1 sm:flex">
              {visibleSteps.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono transition-all ${
                    i < progressIdx
                      ? 'bg-[#C9A84C] text-[#080706]'
                      : i === progressIdx
                        ? 'border border-[#C9A84C] text-[#C9A84C]'
                        : 'border border-[#C9A84C]/20 text-[#8A7D60]'
                  }`}>
                    {i < progressIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${i === progressIdx ? 'text-[#C9A84C]' : 'text-[#8A7D60]'}`}>
                    {STEP_LABELS[s]}
                  </span>
                  {i < visibleSteps.length - 1 && <span className="mx-1 text-[#C9A84C]/20">·</span>}
                </div>
              ))}
            </div>
          )}

          {step === 'report' && (
            <span className="rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]">
              Report Ready
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 'nationality' && (
              <StepNationality data={data} onNext={u => advance('residence', u)} />
            )}
            {step === 'residence' && (
              <StepResidence data={data} onNext={u => advance('destination', u)} onBack={() => back('nationality')} />
            )}
            {step === 'destination' && (
              <StepDestination data={data} onNext={u => advance('purpose', u)} onBack={() => back('residence')} />
            )}
            {step === 'purpose' && (
              <StepPurpose data={data} onNext={u => advance('profile', u)} onBack={() => back('destination')} />
            )}
            {step === 'profile' && (
              <StepProfile data={data} onNext={u => advance('dates', u)} onBack={() => back('purpose')} />
            )}
            {step === 'dates' && (
              <StepDates
                data={data}
                onNext={u => {
                  setData(d => ({ ...d, ...u }));
                  setStep('generating');
                }}
                onBack={() => back('profile')}
              />
            )}
            {step === 'generating' && (
              <StepGenerating onComplete={handleGenerationComplete} />
            )}
            {step === 'report' && report && (
              <IntelligenceReport
                report={report}
                data={data}
                onRestart={restart}
                onShowLead={() => setShowLead(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Lead Capture Modal */}
      {showLead && report && (
        <LeadCapture
          report={report}
          data={data}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  );
}
