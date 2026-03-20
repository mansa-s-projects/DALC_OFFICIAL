'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Utensils, Music, Sunset, Palette, Briefcase, Shield, Users, Heart, Sparkles, Mountain, Crown, Globe, Baby } from 'lucide-react';
import { USER_SKILLS, UserSkill, SKILL_LABELS, SKILL_DESCRIPTIONS } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const SKILL_ICONS: Record<UserSkill, React.ElementType> = {
  NETWORKING: Briefcase,
  DEAL_MAKING: Shield,
  SOCIALITE: Users,
  FOODIE: Utensils,
  WELLNESS: Heart,
  ADVENTURE: Mountain,
  LUXURY: Crown,
  CULTURAL: Globe,
  NIGHTLIFE: Music,
  FAMILY: Baby,
};

const SCENE_OPTIONS = [
  { id: 'INTIMATE' as const, label: 'Intimate dinner', icon: Utensils, desc: 'Quiet, refined, personal' },
  { id: 'HIGH_ENERGY' as const, label: 'High-energy scene', icon: Music, desc: 'Dancing, DJs, energy' },
  { id: 'ROOFTOP' as const, label: 'Rooftop cocktails', icon: Sunset, desc: 'Skyline views, sunset vibes' },
  { id: 'CULTURAL' as const, label: 'Cultural experience', icon: Palette, desc: 'Art, heritage, local' },
];

const TIMING_OPTIONS = [
  { id: 'WEEKDAY_BUSINESS', label: 'Weekday business' },
  { id: 'WEEKEND_SOCIAL', label: 'Weekend social' },
  { id: 'LATE_NIGHT', label: 'Late night' },
  { id: 'SUNSET_EARLY', label: 'Sunset / early evening' },
];

const STEPS = [
  {
    id: 'skills',
    title: 'What brings you to Dubai?',
    subtitle: 'Select your priorities — we use this to curate your experience',
  },
  {
    id: 'scene',
    title: 'What is your ideal evening?',
    subtitle: 'This helps us find the right atmosphere',
  },
  {
    id: 'timing',
    title: 'When do you typically go out?',
    subtitle: 'We use this for timely recommendations',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const step = useAppStore((s) => s.onboardingStep);
  const data = useAppStore((s) => s.onboardingData);
  const setStep = useAppStore((s) => s.setOnboardingStep);
  const updateData = useAppStore((s) => s.updateOnboardingData);
  const complete = useAppStore((s) => s.completeOnboarding);

  const currentStep = STEPS[step];
  const canProceed =
    (step === 0 && data.skills.length > 0) ||
    (step === 1 && data.scene !== null) ||
    (step === 2 && data.timing.length > 0);

  const toggleSkill = (skill: UserSkill) => {
    const current = data.skills;
    if (current.includes(skill)) {
      updateData({ skills: current.filter((s) => s !== skill) });
    } else if (current.length < 5) {
      updateData({ skills: [...current, skill] });
    }
  };

  const toggleTiming = (id: string) => {
    const current = data.timing;
    if (current.includes(id)) {
      updateData({ timing: current.filter((t) => t !== id) });
    } else {
      updateData({ timing: [...current, id] });
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      complete();
      router.push('/');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-luxury-black flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-luxury-gold"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Skip */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => {
            complete();
            router.push('/');
          }}
          className="text-gray-500 text-sm hover:text-white transition-colors uppercase tracking-wider"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Step Header */}
            <div className="text-center mb-10">
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] mb-3">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="text-3xl md:text-4xl font-display text-white mb-3">
                {currentStep.title}
              </h1>
              <p className="text-gray-400 text-sm">{currentStep.subtitle}</p>
            </div>

            {/* Step 1: Skills */}
            {step === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {USER_SKILLS.map((skill) => {
                  const Icon = SKILL_ICONS[skill];
                  const isSelected = data.skills.includes(skill);
                  return (
                    <motion.button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative p-4 rounded-lg border transition-all duration-300 text-left ${
                        isSelected
                          ? 'bg-luxury-gold/10 border-luxury-gold/50 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-luxury-gold rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-black" />
                        </motion.div>
                      )}
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-luxury-gold' : ''}`} />
                      <p className="text-sm font-bold">{SKILL_LABELS[skill]}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{SKILL_DESCRIPTIONS[skill]}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Scene */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCENE_OPTIONS.map((option) => {
                  const isSelected = data.scene === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => updateData({ scene: option.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-lg border transition-all duration-300 text-left ${
                        isSelected
                          ? 'bg-luxury-gold/10 border-luxury-gold/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <option.icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-luxury-gold' : 'text-gray-500'}`} />
                      <p className={`text-lg font-display ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Timing */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIMING_OPTIONS.map((option) => {
                  const isSelected = data.timing.includes(option.id);
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => toggleTiming(option.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`p-5 rounded-lg border transition-all duration-300 text-left flex items-center gap-4 ${
                        isSelected
                          ? 'bg-luxury-gold/10 border-luxury-gold/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-luxury-gold bg-luxury-gold' : 'border-gray-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 flex justify-between items-center max-w-2xl mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`flex items-center gap-2 text-sm uppercase tracking-widest transition-colors ${
            step === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
            canProceed
              ? 'bg-luxury-gold text-black hover:bg-white'
              : 'bg-white/10 text-gray-600 cursor-not-allowed'
          }`}
        >
          {step === STEPS.length - 1 ? 'Get Started' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
