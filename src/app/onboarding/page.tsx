'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  Plane, 
  Sparkles, 
  Building,
  Compass,
  Crown,
  Star,
  Zap,
  Gem,
  Plane as PlaneIcon,
  Home,
  User
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';
import type { UserSkill, UserTier } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingStep = 'intent' | 'interests' | 'profile' | 'membership' | 'complete';

interface IntentOption {
  id: string;
  label: string;
  icon: typeof Plane;
  description: string;
}

interface InterestOption {
  id: UserSkill;
  label: string;
  description: string;
}

interface TierOption {
  id: UserTier;
  label: string;
  price: string;
  color: string;
  features: string[];
  notIncluded?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTENTS: IntentOption[] = [
  { 
    id: 'relocating', 
    label: 'Relocating to Dubai', 
    icon: Plane,
    description: 'Moving here for work or lifestyle'
  },
  { 
    id: 'business', 
    label: 'Business Setup', 
    icon: Briefcase,
    description: 'Starting or expanding a company'
  },
  { 
    id: 'leisure', 
    label: 'Leisure & Experiences', 
    icon: Sparkles,
    description: 'Visiting for vacation and fun'
  },
  { 
    id: 'investment', 
    label: 'Property Investment', 
    icon: Building,
    description: 'Buying real estate in Dubai'
  },
  { 
    id: 'exploring', 
    label: 'Just Exploring', 
    icon: Compass,
    description: 'Getting to know what\'s possible'
  },
];

const INTERESTS: InterestOption[] = [
  { id: 'NIGHTLIFE', label: 'Nightlife', description: 'Clubs, lounges, parties' },
  { id: 'FOODIE', label: 'Fine Dining', description: 'Michelin restaurants, chef tables' },
  { id: 'ADVENTURE', label: 'Water Sports', description: 'Jet ski, diving, yachting' },
  { id: 'WELLNESS', label: 'Yoga & Wellness', description: 'Spas, retreats, fitness' },
  { id: 'LUXURY', label: 'Golf', description: 'World-class courses' },
  { id: 'CULTURAL', label: 'Art & Culture', description: 'Museums, galleries, heritage' },
  { id: 'ADVENTURE', label: 'Fast Cars', description: 'Supercar experiences' },
  { id: 'LUXURY', label: 'Luxury Yachts', description: 'Private charters' },
  { id: 'ADVENTURE', label: 'Skydiving', description: 'Thrill experiences' },
  { id: 'ADVENTURE', label: 'Desert Safaris', description: 'Dune bashing, camping' },
];

const TIERS: TierOption[] = [
  {
    id: 'gold',
    label: 'Gold',
    price: 'Free',
    color: 'from-[#C8A46B] to-[#EFD7A4]',
    features: [
      'Standard bookings',
      'Concierge requests',
      'Member rates',
      'Priority support',
    ],
    notIncluded: ['Jet charter', 'Residency services'],
  },
  {
    id: 'platinum',
    label: 'Platinum',
    price: 'AED 500/yr',
    color: 'from-[#A8B8D0] to-[#D0D8E8]',
    features: [
      'Everything in Gold',
      'Jet charter access',
      'Residency by Investment',
      'Private villa bookings',
      'VIP concierge line',
    ],
    notIncluded: ['Dedicated concierge'],
  },
  {
    id: 'black',
    label: 'Black',
    price: 'AED 2,500/yr',
    color: 'from-white to-gray-400',
    features: [
      'Everything in Platinum',
      'Dedicated concierge',
      'Black Card exclusives',
      'Priority jet access',
      'Private event invites',
      'Bespoke experiences',
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('intent');
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<UserSkill[]>([]);
  const [selectedTier, setSelectedTier] = useState<UserTier>('gold');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const session = useAppStore((s) => s.session);
  const setProfile = useAppStore((s) => s.setProfile);
  const profile = useAppStore((s) => s.profile);

  const toggleIntent = (id: string) => {
    setSelectedIntents(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleInterest = (id: UserSkill) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleNext = async () => {
    if (step === 'intent') setStep('interests');
    else if (step === 'interests') setStep('profile');
    else if (step === 'profile') setStep('membership');
    else if (step === 'membership') {
      await completeOnboarding();
      setStep('complete');
    }
  };

  const handleBack = () => {
    if (step === 'interests') setStep('intent');
    else if (step === 'profile') setStep('interests');
    else if (step === 'membership') setStep('profile');
  };

  const completeOnboarding = async () => {
    if (!session?.user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update profile in Supabase
      const updates = {
        first_name: firstName || profile?.first_name,
        last_name: lastName || profile?.last_name,
        phone: phone || profile?.phone,
        skills: selectedInterests,
        tier: selectedTier,
        onboarding_completed: true,
        intents: selectedIntents,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      if (error) throw error;

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...updates,
          skills: selectedInterests,
          tier: selectedTier,
        });
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'intent': return selectedIntents.length > 0;
      case 'interests': return selectedInterests.length > 0;
      case 'profile': return true; // Optional
      case 'membership': return true;
      default: return false;
    }
  };

  const getStepNumber = () => {
    const steps: OnboardingStep[] = ['intent', 'interests', 'profile', 'membership', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const totalSteps = 4;

  // Render complete state
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[#C8A46B]/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#C8A46B]" />
          </div>
          <h1 className="text-3xl font-display text-white mb-3">Welcome to Dubai À La Carte</h1>
          <p className="text-white/50 mb-8">
            Your profile is set up and we&apos;re ready to curate your Dubai experience.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/explore')}
              className="w-full py-4 px-6 bg-[#C8A46B] text-black font-semibold rounded-xl hover:bg-[#EFD7A4] transition-colors"
            >
              Start Exploring
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="w-full py-3 px-6 border border-white/10 text-white/60 rounded-xl hover:text-white hover:border-white/20 transition-colors"
            >
              View My Profile
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-[#C8A46B]"
          animate={{ width: `${(getStepNumber() / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Skip */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => router.push('/')}
          className="text-white/30 text-sm hover:text-white/60 transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full pb-24">
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
              <p className="text-[#C8A46B] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                Step {getStepNumber()} of {totalSteps}
              </p>
              <h1 className="text-3xl md:text-4xl font-display text-white mb-3">
                {step === 'intent' && 'What are you here for?'}
                {step === 'interests' && 'Personalize your experience'}
                {step === 'profile' && 'Complete your profile'}
                {step === 'membership' && 'Choose your membership'}
              </h1>
              <p className="text-white/40 text-sm">
                {step === 'intent' && 'Select all that apply'}
                {step === 'interests' && 'Pick up to 5 interests'}
                {step === 'profile' && 'Help us personalize your experience'}
                {step === 'membership' && 'Upgrade anytime as your needs grow'}
              </p>
            </div>

            {/* Step 1: Intents */}
            {step === 'intent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTENTS.map((intent) => {
                  const isSelected = selectedIntents.includes(intent.id);
                  return (
                    <motion.button
                      key={intent.id}
                      onClick={() => toggleIntent(intent.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#C8A46B]/10 border-[#C8A46B]/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#C8A46B]/20' : 'bg-white/5'
                        }`}>
                          <intent.icon className={`w-6 h-6 ${isSelected ? 'text-[#C8A46B]' : 'text-white/40'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {intent.label}
                            </p>
                            {isSelected && <Check className="w-4 h-4 text-[#C8A46B]" />}
                          </div>
                          <p className="text-sm text-white/40 mt-1">{intent.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 'interests' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <motion.button
                      key={interest.label}
                      onClick={() => toggleInterest(interest.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#C8A46B]/10 border-[#C8A46B]/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-[#C8A46B] rounded-full flex items-center justify-center mx-auto mb-2"
                        >
                          <Check className="w-3 h-3 text-black" />
                        </motion.div>
                      )}
                      <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                        {interest.label}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">{interest.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 'profile' && (
              <div className="max-w-md mx-auto space-y-5">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={profile?.first_name || 'John'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#C8A46B]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={profile?.last_name || 'Doe'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#C8A46B]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={profile?.phone || '+971 50 000 0000'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-[#C8A46B]/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Membership */}
            {step === 'membership' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-6 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-b from-white/10 to-transparent border-white/40'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#C8A46B] flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                        {tier.id === 'gold' && <Star className="w-5 h-5 text-black" />}
                        {tier.id === 'platinum' && <Zap className="w-5 h-5 text-black" />}
                        {tier.id === 'black' && <Crown className="w-5 h-5 text-black" />}
                      </div>
                      <p className="text-lg font-display text-white mb-1">{tier.label}</p>
                      <p className="text-[#C8A46B] font-semibold mb-4">{tier.price}</p>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                            <Check className="w-3 h-3 text-[#C8A46B]" />
                            {feature}
                          </li>
                        ))}
                        {tier.notIncluded?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-white/30 line-through">
                            <span className="w-3 h-3 rounded-full border border-white/20" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050607] to-transparent">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 'intent'}
            className={`flex items-center gap-2 text-sm transition-colors ${
              step === 'intent' ? 'text-white/20 cursor-not-allowed' : 'text-white/40 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 font-semibold text-sm rounded-xl transition-all ${
              canProceed() && !isSubmitting
                ? 'bg-[#C8A46B] text-black hover:bg-[#EFD7A4]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              'Saving...'
            ) : step === 'membership' ? (
              <>
                Complete Setup
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
