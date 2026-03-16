import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Users,
  Calendar,
  Flag,
  Wallet,
  Home,
  FileText,
  Loader2,
  MapPin,
} from 'lucide-react';
import { useCreateRelocationProfile } from '../../hooks/useRelocation';
import { useUser } from '../../hooks/useUser';
import type { IntakeFormData, RelocationPurpose, BudgetRange, PropertyPreference, VisaStatus } from '../../types/relocation';
import { PURPOSE_LABELS, BUDGET_LABELS, PROPERTY_LABELS, VISA_STATUS_LABELS } from '../../types/relocation';

// ─── Phase Configuration ──────────────────────────────────────────────────────

type PhaseId = 'purpose' | 'situation' | 'preferences' | 'review';

interface Phase {
  id: PhaseId;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const PHASES: Phase[] = [
  {
    id: 'purpose',
    title: 'Your Purpose',
    icon: <Flag className="w-5 h-5" />,
    description: 'Tell us why you are moving to Dubai',
  },
  {
    id: 'situation',
    title: 'Current Situation',
    icon: <User className="w-5 h-5" />,
    description: 'Information about you and your family',
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: <Home className="w-5 h-5" />,
    description: 'Your timeline and housing preferences',
  },
  {
    id: 'review',
    title: 'Review',
    icon: <FileText className="w-5 h-5" />,
    description: 'Review your information before submitting',
  },
];

// ─── Form Data Options ────────────────────────────────────────────────────────

const PURPOSE_OPTIONS: { value: RelocationPurpose; icon: string }[] = [
  { value: 'employment', icon: '💼' },
  { value: 'business', icon: '🏢' },
  { value: 'retirement', icon: '🌴' },
  { value: 'family', icon: '👨‍👩‍👧‍👦' },
  { value: 'investment', icon: '💎' },
];

const BUDGET_OPTIONS: BudgetRange[] = ['under_10k', '10k_50k', '50k_200k', '200k_plus'];

const PROPERTY_OPTIONS: { value: PropertyPreference; icon: string }[] = [
  { value: 'rent', icon: '🏠' },
  { value: 'buy', icon: '🏡' },
  { value: 'undecided', icon: '🤔' },
];

const VISA_OPTIONS: VisaStatus[] = ['not_started', 'in_progress', 'approved', 'rejected'];

// ─── Initial Form State ───────────────────────────────────────────────────────

const INITIAL_FORM_DATA: IntakeFormData = {
  purpose: 'employment',
  current_country: '',
  family_size: 1,
  has_children: false,
  budget_range: '10k_50k',
  target_move_date: '',
  property_preference: 'rent',
  visa_status: 'not_started',
  notes: '',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntakeForm() {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const user = userData?.session?.user;
  const createProfile = useCreateRelocationProfile();

  const [currentPhase, setCurrentPhase] = useState<PhaseId>('purpose');
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof IntakeFormData, string>>>({});

  const currentPhaseIndex = PHASES.findIndex((p) => p.id === currentPhase);

  // Validation
  const validatePhase = (phase: PhaseId): boolean => {
    const newErrors: typeof errors = {};

    switch (phase) {
      case 'purpose':
        if (!formData.purpose) {
          newErrors.purpose = 'Please select a purpose';
        }
        break;
      case 'situation':
        if (!formData.current_country.trim()) {
          newErrors.current_country = 'Please enter your current country';
        }
        if (formData.family_size < 1) {
          newErrors.family_size = 'Family size must be at least 1';
        }
        break;
      case 'preferences':
        if (!formData.target_move_date) {
          newErrors.target_move_date = 'Please select a target move date';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (!validatePhase(currentPhase)) return;

    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < PHASES.length) {
      setCurrentPhase(PHASES[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentPhaseIndex - 1;
    if (prevIndex >= 0) {
      setCurrentPhase(PHASES[prevIndex].id);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!user?.id) {
      setErrors({ purpose: 'Please log in to submit' });
      return;
    }

    await createProfile.mutateAsync({
      ...formData,
      user_id: user.id,
      status: 'active',
    });

    // Navigate to dashboard on success
    navigate('/move-to-dubai/dashboard');
  };

  // Update form data
  const updateField = <K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ─── Phase Renderers ─────────────────────────────────────────────────────────

  const renderPurposePhase = () => (
    <div className="space-y-6">
      <p className="text-gray-400 text-center mb-8">
        Select the primary reason for your relocation to Dubai
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PURPOSE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateField('purpose', option.value)}
            className={`p-6 border text-left transition-all duration-300 ${
              formData.purpose === option.value
                ? 'border-luxury-gold bg-luxury-gold/10'
                : 'border-white/10 bg-white/[0.02] hover:border-luxury-gold/40'
            }`}
          >
            <span className="text-3xl mb-3 block">{option.icon}</span>
            <span
              className={`font-display text-lg ${
                formData.purpose === option.value ? 'text-luxury-gold' : 'text-white'
              }`}
            >
              {PURPOSE_LABELS[option.value]}
            </span>
          </button>
        ))}
      </div>
      {errors.purpose && (
        <p className="text-red-400 text-sm text-center">{errors.purpose}</p>
      )}
    </div>
  );

  const renderSituationPhase = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Current Country
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={formData.current_country}
            onChange={(e) => updateField('current_country', e.target.value)}
            placeholder="e.g., United Kingdom"
            className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:border-luxury-gold focus:outline-none transition-colors"
          />
        </div>
        {errors.current_country && (
          <p className="text-red-400 text-xs mt-2">{errors.current_country}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Family Size
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateField('family_size', Math.max(1, formData.family_size - 1))}
            className="w-12 h-12 border border-white/20 text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors"
          >
            -
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-luxury-gold" />
            <span className="text-2xl font-display text-white w-8 text-center">
              {formData.family_size}
            </span>
          </div>
          <button
            onClick={() => updateField('family_size', formData.family_size + 1)}
            className="w-12 h-12 border border-white/20 text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Monthly Budget Range (AED)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUDGET_OPTIONS.map((budget) => (
            <button
              key={budget}
              onClick={() => updateField('budget_range', budget)}
              className={`p-4 border text-left transition-all duration-300 ${
                formData.budget_range === budget
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-luxury-gold/40'
              }`}
            >
              <Wallet
                className={`w-4 h-4 mb-2 ${
                  formData.budget_range === budget ? 'text-luxury-gold' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-sm ${
                  formData.budget_range === budget ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                {BUDGET_LABELS[budget]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.has_children}
            onChange={(e) => updateField('has_children', e.target.checked)}
            className="w-5 h-5 accent-luxury-gold"
          />
          <span className="text-gray-300">I have children (school age)</span>
        </label>
      </div>
    </div>
  );

  const renderPreferencesPhase = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Target Move Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={formData.target_move_date}
            onChange={(e) => updateField('target_move_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-3 text-white focus:border-luxury-gold focus:outline-none transition-colors [color-scheme:dark]"
          />
        </div>
        {errors.target_move_date && (
          <p className="text-red-400 text-xs mt-2">{errors.target_move_date}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Housing Preference
        </label>
        <div className="grid grid-cols-3 gap-4">
          {PROPERTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('property_preference', option.value)}
              className={`p-4 border text-center transition-all duration-300 ${
                formData.property_preference === option.value
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-luxury-gold/40'
              }`}
            >
              <span className="text-2xl mb-2 block">{option.icon}</span>
              <span
                className={`text-xs uppercase tracking-wider ${
                  formData.property_preference === option.value
                    ? 'text-luxury-gold'
                    : 'text-gray-300'
                }`}
              >
                {PROPERTY_LABELS[option.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Visa Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {VISA_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => updateField('visa_status', status)}
              className={`p-4 border text-left transition-all duration-300 ${
                formData.visa_status === status
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-luxury-gold/40'
              }`}
            >
              <span
                className={`text-sm capitalize ${
                  formData.visa_status === status ? 'text-luxury-gold' : 'text-gray-300'
                }`}
              >
                {VISA_STATUS_LABELS[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm uppercase tracking-widest mb-3">
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Any specific requirements or questions..."
          rows={4}
          className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-gray-600 focus:border-luxury-gold focus:outline-none transition-colors resize-none"
        />
      </div>
    </div>
  );

  const renderReviewPhase = () => (
    <div className="space-y-6">
      <p className="text-gray-400 text-center mb-8">
        Please review your information before submitting
      </p>

      <div className="border border-white/10 bg-white/[0.02] p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Purpose</span>
          <span className="text-white font-medium">{PURPOSE_LABELS[formData.purpose]}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Current Country</span>
          <span className="text-white font-medium">{formData.current_country || 'Not specified'}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Family Size</span>
          <span className="text-white font-medium">{formData.family_size} people</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Budget Range</span>
          <span className="text-white font-medium">{BUDGET_LABELS[formData.budget_range]}</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Target Move Date</span>
          <span className="text-white font-medium">
            {formData.target_move_date
              ? new Date(formData.target_move_date).toLocaleDateString()
              : 'Not specified'}
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Housing</span>
          <span className="text-white font-medium capitalize">
            {PROPERTY_LABELS[formData.property_preference]}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm uppercase tracking-widest">Visa Status</span>
          <span className="text-white font-medium">
            {VISA_STATUS_LABELS[formData.visa_status]}
          </span>
        </div>
      </div>

      {formData.notes && (
        <div className="border border-luxury-gold/20 bg-luxury-gold/5 p-4">
          <span className="text-luxury-gold text-xs uppercase tracking-widest block mb-2">
            Additional Notes
          </span>
          <p className="text-gray-300 text-sm">{formData.notes}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={createProfile.isPending}
        className="w-full py-4 bg-luxury-gold text-luxury-black font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {createProfile.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Submit & Create Roadmap
          </>
        )}
      </button>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      {/* Progress Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
            Step {currentPhaseIndex + 1} of {PHASES.length}
          </span>
          <span className="text-gray-500 text-xs">
            {Math.round(((currentPhaseIndex + 1) / PHASES.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-luxury-gold"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPhaseIndex + 1) / PHASES.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Phase Indicators */}
        <div className="flex justify-between mt-4">
          {PHASES.map((phase, idx) => {
            const isActive = idx === currentPhaseIndex;
            const isCompleted = idx < currentPhaseIndex;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  if (isCompleted) setCurrentPhase(phase.id);
                }}
                disabled={!isCompleted && !isActive}
                className={`flex flex-col items-center gap-2 transition-all ${
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
                    isActive
                      ? 'border-luxury-gold bg-luxury-gold/20 text-luxury-gold'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500'
                      : 'border-white/10 bg-white/5 text-gray-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : phase.icon}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-luxury-gold' : isCompleted ? 'text-emerald-500' : 'text-gray-600'
                  }`}
                >
                  {phase.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase Content */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-display text-white mb-2">
              {PHASES[currentPhaseIndex].title}
            </h2>
            <p className="text-gray-400 mb-8">{PHASES[currentPhaseIndex].description}</p>

            {currentPhase === 'purpose' && renderPurposePhase()}
            {currentPhase === 'situation' && renderSituationPhase()}
            {currentPhase === 'preferences' && renderPreferencesPhase()}
            {currentPhase === 'review' && renderReviewPhase()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentPhase !== 'review' && (
        <div className="border-t border-white/10 p-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentPhaseIndex === 0}
            className="flex items-center gap-2 px-6 py-3 border border-white/20 text-gray-400 text-sm uppercase tracking-widest hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
