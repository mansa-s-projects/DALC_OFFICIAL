'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  Unlock, 
  Clock, 
  CreditCard, 
  TrendingUp,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'nationality' | 'destination' | 'result' | 'lead';

interface VisaResult {
  status: string;
  label: string;
  color: string;
  bgColor: string;
  processingTime: string;
  estimatedCost: string;
  successRate: string;
}

interface LeadPayload {
  passport: string;
  destination: string;
  fullName: string;
  email: string;
  phone: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

const VISA_RESULTS: Record<string, VisaResult> = {
  'AE-AE': { 
    status: 'VF', 
    label: 'Visa-Free', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-400/10',
    processingTime: 'Instant',
    estimatedCost: 'AED 0',
    successRate: '100%'
  },
  'AE-US': { 
    status: 'EV', 
    label: 'eVisa Required', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/10',
    processingTime: '3-5 days',
    estimatedCost: 'AED 350-550',
    successRate: '94%'
  },
  'US-GB': { 
    status: 'VF', 
    label: 'Visa-Free', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-400/10',
    processingTime: 'Instant',
    estimatedCost: 'AED 0',
    successRate: '100%'
  },
  'US-AE': { 
    status: 'EV', 
    label: 'eVisa / Visa on Arrival', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/10',
    processingTime: '1-3 days',
    estimatedCost: 'AED 300-500',
    successRate: '98%'
  },
  'IN-AE': { 
    status: 'EV', 
    label: 'eVisa / Pre-approved', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/10',
    processingTime: '3-5 days',
    estimatedCost: 'AED 250-450',
    successRate: '92%'
  },
  'IN-US': { 
    status: 'VR', 
    label: 'Visa Required', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-400/10',
    processingTime: '7-15 days',
    estimatedCost: 'AED 550-850',
    successRate: '78%'
  },
  'IN-GB': { 
    status: 'VR', 
    label: 'Visa Required', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-400/10',
    processingTime: '10-20 days',
    estimatedCost: 'AED 600-950',
    successRate: '76%'
  },
  'GB-AE': { 
    status: 'EV', 
    label: 'eVisa / Visa on Arrival', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/10',
    processingTime: '1-3 days',
    estimatedCost: 'AED 300-500',
    successRate: '98%'
  },
  'GB-US': { 
    status: 'VF', 
    label: 'Visa-Free (ESTA)', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-400/10',
    processingTime: 'ESTA: 24hrs',
    estimatedCost: 'AED 80',
    successRate: '99%'
  },
  'default': { 
    status: 'VR', 
    label: 'Custom Visa Required', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-400/10',
    processingTime: '10-30 days',
    estimatedCost: 'AED 400-1200',
    successRate: 'Assessment needed'
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisaFinderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('nationality');
  const [passport, setPassport] = useState('');
  const [destination, setDestination] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const stepNumber = {
    nationality: 1,
    destination: 2,
    result: 3,
    lead: 4,
  };

  const getVisaResult = (): VisaResult => {
    return VISA_RESULTS[`${passport}-${destination}`] || VISA_RESULTS.default;
  };

  const handleNext = () => {
    if (step === 'nationality' && passport) setStep('destination');
    else if (step === 'destination' && destination) setStep('result');
    else if (step === 'result') setStep('lead');
  };

  const handleBack = () => {
    if (step === 'destination') {
      setStep('nationality');
      setPassport('');
    } else if (step === 'result') {
      setStep('destination');
      setDestination('');
    } else if (step === 'lead') {
      setStep('result');
      setIsUnlocked(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeadSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const leadPayload: LeadPayload = {
      passport,
      destination,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
    };

    // Simulate API call - replace with actual Supabase/Backend call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsUnlocked(true);
    setIsSubmitting(false);
    
    // TODO: Connect to Supabase
    // await supabase.from('visa_leads').insert(leadPayload);
  };

  const result = getVisaResult();
  const passportCountry = COUNTRIES.find(c => c.code === passport)?.name || '';
  const destinationCountry = COUNTRIES.find(c => c.code === destination)?.name || '';

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-white">
                Visa <span className="text-[#D4AF37]">Finder</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Discover your pathway to Dubai</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-sm">Step {stepNumber[step]} of 4</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i <= stepNumber[step] ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Nationality */}
          {step === 'nationality' && (
            <motion.div
              key="nationality"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-light text-white mb-3">Select Your Nationality</h2>
                <p className="text-gray-400">Choose your passport country to begin</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setPassport(country.code);
                      setTimeout(() => setStep('destination'), 200);
                    }}
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      passport === country.code
                        ? 'border-[#FFD700] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/20 bg-[#1A1A1A] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{country.flag}</div>
                    <div className="text-white text-sm font-medium">{country.name}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Destination */}
          {step === 'destination' && (
            <motion.div
              key="destination"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Change Nationality
              </button>

              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/30 mb-4">
                  <span className="text-2xl">{COUNTRIES.find(c => c.code === passport)?.flag}</span>
                  <span className="text-[#D4AF37]">{passportCountry}</span>
                </div>
                <h2 className="text-3xl font-light text-white mb-3">Where Are You Going?</h2>
                <p className="text-gray-400">Select your destination country</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {COUNTRIES.filter(c => c.code !== passport).map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setDestination(country.code);
                      setTimeout(() => setStep('result'), 200);
                    }}
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      destination === country.code
                        ? 'border-[#FFD700] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/20 bg-[#1A1A1A] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{country.flag}</div>
                    <div className="text-white text-sm font-medium">{country.name}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Change Destination
              </button>

              {/* Result Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/30 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-[#D4AF37]/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{COUNTRIES.find(c => c.code === destination)?.flag}</span>
                      <div>
                        <h2 className="text-3xl font-light text-white">{destinationCountry}</h2>
                        <p className="text-gray-400 text-sm">From {passportCountry}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${result.bgColor} border ${result.color.replace('text-', 'border-')}/30`}>
                      <span className={`text-sm font-semibold ${result.color}`}>{result.label}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid - Locked or Unlocked */}
                <div className="p-8 relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center p-8">
                        <Lock className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="text-xl text-white mb-2">Unlock Full Details</h3>
                        <p className="text-gray-400 mb-6 max-w-sm">Enter your details to see complete visa requirements and next steps</p>
                        <button
                          onClick={() => setStep('lead')}
                          className="px-8 py-3 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                          <Unlock className="w-4 h-4" />
                          Unlock Now
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#D4AF37]/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-gray-400 text-sm">Processing Time</span>
                      </div>
                      <p className="text-white text-lg font-medium">{result.processingTime}</p>
                    </div>

                    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#D4AF37]/10">
                      <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-gray-400 text-sm">Estimated Cost</span>
                      </div>
                      <p className="text-white text-lg font-medium">{result.estimatedCost}</p>
                    </div>

                    <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#D4AF37]/10">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-gray-400 text-sm">Success Rate</span>
                      </div>
                      <p className="text-white text-lg font-medium">{result.successRate}</p>
                    </div>
                  </div>

                  {isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20"
                    >
                      <h4 className="text-[#D4AF37] font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Requirements Checklist
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">• Valid passport (6+ months)</li>
                        <li className="flex items-center gap-2">• Passport-sized photo</li>
                        <li className="flex items-center gap-2">• Return flight ticket</li>
                        <li className="flex items-center gap-2">• Hotel booking or invitation</li>
                        <li className="flex items-center gap-2">• Travel insurance (recommended)</li>
                      </ul>
                    </motion.div>
                  )}
                </div>

                {/* CTAs */}
                <div className="p-8 border-t border-[#D4AF37]/20 bg-[#0A0A0A]/50">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {isUnlocked ? (
                      <>
                        <button
                          onClick={() => router.push('/request')}
                          className="flex-1 px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Start Application
                          <ArrowRight className="w-5 h-5" />
                        </button>
                        <a
                          href="https://wa.me/971585987600"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl font-medium hover:border-[#FFD700] hover:text-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Talk to Advisor
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => setStep('lead')}
                        className="w-full px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Unlock className="w-5 h-5" />
                        Unlock Full Details
                      </button>
                    )}
                  </div>
                  
                  <p className="text-center text-[#D4AF37]/60 text-sm mt-4 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Limited processing slots available this week
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Lead Capture */}
          {step === 'lead' && (
            <motion.div
              key="lead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Back to Results
              </button>

              <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/30 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-2">Unlock Your Visa Details</h2>
                  <p className="text-gray-400">Enter your details to see complete requirements and next steps</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="+971 50 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleLeadSubmit}
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Unlock className="w-5 h-5" />
                          Unlock Full Details
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-gray-500 text-sm">
                    Your information is secure and will only be used to assist with your visa inquiry.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
