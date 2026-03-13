import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  Home,
  Car,
  Building2,
  CalendarCheck,
  Sparkles,
  Clock,
  Zap,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useSubmitConciergeRequest } from '../../features/concierge/hooks/useConcierge';
import type {
  ConciergeRequestType,
  ConciergeUrgency,
  ConciergeRequestInput,
} from '../../features/concierge/types';
import { CONCIERGE_TYPE_LABELS } from '../../features/concierge/types';

// ─── Type Cards Config ────────────────────────────────────────────────────────

const TYPE_CARDS: Array<{
  type: ConciergeRequestType;
  icon: React.ReactNode;
  description: string;
  examples: string[];
}> = [
  {
    type: 'travel_arrival',
    icon: <Plane className="w-6 h-6" />,
    description: 'Private jet coordination, airport transfers, luxury transport.',
    examples: ['Private jet booking', 'Airport meet & greet', 'Hotel transfer'],
  },
  {
    type: 'property_stay',
    icon: <Home className="w-6 h-6" />,
    description: 'Exclusive villa rentals, hotel access, temporary accommodation.',
    examples: ['Beachfront villa', '5-star hotel suite', 'Furnished residence'],
  },
  {
    type: 'transport_lifestyle',
    icon: <Car className="w-6 h-6" />,
    description: 'Chauffeur services, yacht charters, curated daily itineraries.',
    examples: ['Yacht charter', 'Supercar rental', 'Lifestyle itinerary'],
  },
  {
    type: 'business_support',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Meeting rooms, document assistance, introductions and connections.',
    examples: ['Company formation', 'Meeting room booking', 'Business intro'],
  },
  {
    type: 'event_reservation',
    icon: <CalendarCheck className="w-6 h-6" />,
    description: 'Restaurant bookings, VIP event access, private experiences.',
    examples: ['Restaurant reservation', 'VIP nightclub table', 'Private event'],
  },
  {
    type: 'personal_request',
    icon: <Sparkles className="w-6 h-6" />,
    description: "Bespoke requests that don't fit a category — we handle it all.",
    examples: ['Personal shopping', 'Gift sourcing', 'Custom experience'],
  },
];

const URGENCY_OPTIONS: Array<{
  value: ConciergeUrgency;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Within 24 hours',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Within 4 hours',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    value: 'asap',
    label: 'ASAP',
    description: 'Immediate response',
    icon: <AlertCircle className="w-5 h-5" />,
  },
];

const BUDGET_OPTIONS = [
  'Under AED 5,000',
  'AED 5,000 – 15,000',
  'AED 15,000 – 50,000',
  'AED 50,000 – 150,000',
  'AED 150,000+',
  'Flexible / No limit',
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
              i + 1 < current
                ? 'bg-luxury-gold border-luxury-gold text-luxury-black'
                : i + 1 === current
                ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold'
                : 'bg-white/5 border-white/20 text-white/40'
            }`}
          >
            {i + 1 < current ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-px w-8 transition-all duration-500 ${
                i + 1 < current ? 'bg-luxury-gold' : 'bg-white/15'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ConciergeRequest() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useSubmitConciergeRequest();

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  // Form state
  const [requestType, setRequestType] = useState<ConciergeRequestType | null>(null);
  const [urgency, setUrgency] = useState<ConciergeUrgency>('standard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step validation
  const canProceed = () => {
    if (step === 1) return requestType !== null;
    if (step === 2) return title.trim().length >= 3 && description.trim().length >= 10;
    return true;
  };

  const handleSubmit = async () => {
    if (!requestType) return;

    const input: ConciergeRequestInput = {
      request_type: requestType,
      urgency,
      title: title.trim(),
      description: description.trim(),
      ...(preferredDate && { preferred_date: preferredDate }),
      ...(preferredTime && { preferred_time: preferredTime }),
      ...(budgetRange && { budget_range: budgetRange }),
      ...(specialInstructions.trim() && { special_instructions: specialInstructions.trim() }),
    };

    await mutateAsync(input);
    navigate('/request/success');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="pt-28 pb-24 px-4">
        <div className="max-w-2xl mx-auto">

          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              to="/concierge"
              className="text-white/40 hover:text-luxury-gold transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Concierge
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-luxury-gold text-sm">New Request</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white tracking-tight mb-2"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-white/50 mb-10"
          >
            Your dedicated concierge team will respond based on your urgency level.
          </motion.p>

          <StepIndicator current={step} total={TOTAL_STEPS} />

          {/* ── Steps ─────────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {/* Step 1: Request Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg font-semibold text-white mb-6">
                  What type of request is this?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TYPE_CARDS.map((card) => (
                    <button
                      key={card.type}
                      onClick={() => setRequestType(card.type)}
                      className={`text-left p-5 border rounded-lg transition-all duration-200 ${
                        requestType === card.type
                          ? 'border-luxury-gold bg-luxury-gold/10'
                          : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      <div
                        className={`mb-3 ${
                          requestType === card.type ? 'text-luxury-gold' : 'text-white/50'
                        }`}
                      >
                        {card.icon}
                      </div>
                      <div
                        className={`text-sm font-semibold mb-1 ${
                          requestType === card.type ? 'text-luxury-gold' : 'text-white'
                        }`}
                      >
                        {CONCIERGE_TYPE_LABELS[card.type]}
                      </div>
                      <div className="text-xs text-white/40 leading-relaxed">
                        {card.description}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {card.examples.map((ex) => (
                          <span
                            key={ex}
                            className="text-[10px] px-2 py-0.5 bg-white/5 text-white/30 rounded-full"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-white mb-6">Tell us what you need</h2>

                {/* Title */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Request title <span className="text-luxury-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Yacht charter for 10 guests this Friday"
                    maxLength={120}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 rounded text-sm focus:outline-none focus:border-luxury-gold/60 transition-colors"
                  />
                  <div className="mt-1 text-xs text-white/25 text-right">{title.length}/120</div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Description <span className="text-luxury-gold">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Include as much detail as possible — dates, guest count, preferences, destination, etc."
                    rows={5}
                    maxLength={1000}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 rounded text-sm focus:outline-none focus:border-luxury-gold/60 transition-colors resize-none"
                  />
                  <div className="mt-1 text-xs text-white/25 text-right">
                    {description.length}/1000
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm text-white/60 mb-3">Response urgency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {URGENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setUrgency(opt.value)}
                        className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                          urgency === opt.value
                            ? 'border-luxury-gold bg-luxury-gold/10'
                            : 'border-white/10 bg-white/3 hover:border-white/25'
                        }`}
                      >
                        <div
                          className={`flex justify-center mb-2 ${
                            urgency === opt.value ? 'text-luxury-gold' : 'text-white/40'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            urgency === opt.value ? 'text-luxury-gold' : 'text-white'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <div className="text-xs text-white/35 mt-0.5">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-semibold text-white mb-1">Preferences</h2>
                <p className="text-sm text-white/40 mb-6">
                  All fields below are optional but help us serve you better.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Preferred date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/15 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-luxury-gold/60 transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Preferred time</label>
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-luxury-gold/60 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Budget range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setBudgetRange(budgetRange === opt ? '' : opt)}
                        className={`px-3 py-2 border rounded text-xs text-left transition-all duration-200 ${
                          budgetRange === opt
                            ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                            : 'border-white/10 bg-white/3 text-white/50 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Special instructions</label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Dietary requirements, accessibility needs, VIP preferences…"
                    rows={3}
                    maxLength={400}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 rounded text-sm focus:outline-none focus:border-luxury-gold/60 transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg font-semibold text-white mb-6">Review & submit</h2>

                <div className="border border-white/10 rounded-lg divide-y divide-white/8 mb-8">
                  <SummaryRow label="Request type" value={requestType ? CONCIERGE_TYPE_LABELS[requestType] : ''} />
                  <SummaryRow label="Urgency" value={URGENCY_OPTIONS.find((o) => o.value === urgency)?.label ?? ''} />
                  <SummaryRow label="Title" value={title} />
                  <SummaryRow label="Description" value={description} multiline />
                  {preferredDate && <SummaryRow label="Preferred date" value={preferredDate} />}
                  {preferredTime && <SummaryRow label="Preferred time" value={preferredTime} />}
                  {budgetRange && <SummaryRow label="Budget range" value={budgetRange} />}
                  {specialInstructions && (
                    <SummaryRow label="Special instructions" value={specialInstructions} multiline />
                  )}
                </div>

                {isError && (
                  <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 rounded text-sm text-red-400">
                    {(error as Error)?.message ?? 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 rounded"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="mt-4 text-xs text-white/30 text-center">
                  Your concierge will contact you shortly via WhatsApp or email.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation ────────────────────────────────────────────────── */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className={`flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors ${
                  step === 1 ? 'invisible' : ''
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 rounded"
              >
                {step === 3 ? 'Review' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="mt-6">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to preferences
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={`px-5 py-4 flex ${multiline ? 'flex-col gap-1' : 'justify-between items-start gap-4'}`}>
      <span className="text-xs text-white/40 uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-sm text-white ${multiline ? '' : 'text-right'}`}>{value}</span>
    </div>
  );
}
