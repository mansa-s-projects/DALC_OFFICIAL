'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
  ArrowRight,
  CheckCircle2,
  Camera,
  Upload,
  Download,
  RefreshCcw,
  Sparkles,
  User
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'nationality' | 'destination' | 'result' | 'photo' | 'lead';

interface VisaResult {
  status: string;
  label: string;
  color: string;
  bgColor: string;
  processingTime: string;
  estimatedCost: string;
  successRate: string;
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
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

const VISA_RESULTS: Record<string, VisaResult> = {
  'AE-US': { status: 'EV', label: 'eVisa Required', color: 'text-blue-400', bgColor: 'bg-blue-400/10', processingTime: '3-5 days', estimatedCost: 'AED 350-550', successRate: '94%' },
  'US-GB': { status: 'VF', label: 'Visa-Free', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', processingTime: 'Instant', estimatedCost: 'AED 0', successRate: '100%' },
  'GB-AE': { status: 'EV', label: 'eVisa / Visa on Arrival', color: 'text-blue-400', bgColor: 'bg-blue-400/10', processingTime: '1-3 days', estimatedCost: 'AED 300-500', successRate: '98%' },
  'default': { status: 'VR', label: 'Custom Visa Required', color: 'text-amber-400', bgColor: 'bg-amber-400/10', processingTime: '10-30 days', estimatedCost: 'AED 400-1200', successRate: 'Assessment needed' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisaFinderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('nationality');
  const [passport, setPassport] = useState('');
  const [destination, setDestination] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Photo State
  const [photoMode, setPhotoMode] = useState<'upload' | 'camera'>('upload');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState<'original' | 'processed'>('processed');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [passportQuery, setPassportQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');

  const stepNumber = { nationality: 1, destination: 2, result: 3, photo: 4, lead: 5 };

  const filteredPassportCountries = useMemo(
    () => COUNTRIES.filter((country) => country.name.toLowerCase().includes(passportQuery.toLowerCase())),
    [passportQuery]
  );

  const filteredDestinationCountries = useMemo(
    () => COUNTRIES
      .filter((country) => country.code !== passport)
      .filter((country) => country.name.toLowerCase().includes(destinationQuery.toLowerCase())),
    [passport, destinationQuery]
  );

  const getVisaResult = (): VisaResult => VISA_RESULTS[`${passport}-${destination}`] || VISA_RESULTS.default;

  const handleBack = () => {
    if (step === 'destination') { setStep('nationality'); setPassport(''); setDestinationQuery(''); }
    else if (step === 'result') { setStep('destination'); setDestination(''); }
    else if (step === 'photo') { setStep('result'); cancelCamera(); }
    else if (step === 'lead') { setStep('result'); setIsUnlocked(false); }
  };

  // ─── AI Photo Methods ───────────────────────────────────────────────────────

  const startCamera = async () => {
    setPhotoMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied or failed", err);
      alert("Camera access failed. Please use file upload instead.");
      setPhotoMode('upload');
    }
  };

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => cancelCamera();
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      cancelCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setCapturedImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    
    try {
      // Convert base64 to File Blob for FormData
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append('image', blob, 'passport-photo.jpg');

      const apiRes = await fetch('/api/passport-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await apiRes.json();
      if (data.success) {
        setProcessedImage(data.processedImage);
        setShowPreview('processed');
      } else {
        alert("Image processing failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Processing error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'DALC-Compliant-Passport-Photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetPhoto = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    if (photoMode === 'camera') startCamera();
  };

  // ─── Lead Form Methods ──────────────────────────────────────────────────────

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUnlocked(true);
    setIsSubmitting(false);
  };

  const result = getVisaResult();
  const passportCountry = COUNTRIES.find(c => c.code === passport)?.name || '';
  const destinationCountry = COUNTRIES.find(c => c.code === destination)?.name || '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050506] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.13),transparent_38%),radial-gradient(circle_at_80%_100%,rgba(212,175,55,0.08),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.08]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-[#D4AF37]/20 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#D4AF37]/75">DALC Global Mobility</p>
            <h1 className="mt-1 text-2xl font-light text-white sm:text-3xl">
              Visa <span className="text-[#D4AF37]">Intelligence</span> Finder
            </h1>
            <p className="mt-1 text-sm text-gray-400">Live eligibility, processing windows, and concierge-led application support</p>
          </div>
          <div className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]/80">Progress</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-[#D4AF37]">Step {stepNumber[step]} of 5</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      i <= stepNumber[step] ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:pt-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Nationality */}
          {step === 'nationality' && (
            <motion.div key="nationality" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#0C0C0D]/85 backdrop-blur-xl">
                <div className="border-b border-[#D4AF37]/20 px-6 py-8 sm:px-10">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D4AF37]/70">Step 1</p>
                      <h2 className="mt-2 text-3xl font-light text-white sm:text-4xl">Select Passport Nationality</h2>
                      <p className="mt-2 max-w-xl text-sm text-gray-400">Find your passport quickly and unlock destination rules built for your profile.</p>
                    </div>
                    <div className="w-full md:w-[320px]">
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Search Country</label>
                      <input
                        type="text"
                        value={passportQuery}
                        onChange={(e) => setPassportQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#D4AF37]/25 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Type: United States, India, UAE..."
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-10 sm:py-8">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gray-500">Available Countries: {filteredPassportCountries.length}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredPassportCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setPassport(country.code);
                      setDestinationQuery('');
                      setTimeout(() => setStep('destination'), 200);
                    }}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      passport === country.code
                        ? 'border-[#FFD700] bg-[#D4AF37]/12 shadow-[0_0_24px_rgba(212,175,55,0.16)]'
                        : 'border-[#D4AF37]/15 bg-[#121214] hover:border-[#D4AF37]/45'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl transition-transform group-hover:scale-110">{country.flag}</span>
                      <span className="font-mono text-xs tracking-widest text-[#D4AF37]/75">{country.code}</span>
                    </div>
                    <div className="text-sm font-medium text-white">{country.name}</div>
                    <p className="mt-1 text-xs text-gray-500">Passport jurisdiction</p>
                  </button>
                ))}
                  </div>
                  {filteredPassportCountries.length === 0 && (
                    <p className="rounded-xl border border-[#D4AF37]/20 bg-black/30 px-4 py-6 text-center text-sm text-gray-400">No matching country found. Try a shorter keyword.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Destination */}
          {step === 'destination' && (
            <motion.div key="destination" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-5xl">
              <button onClick={handleBack} className="mb-5 flex items-center gap-2 text-[#D4AF37] transition-colors hover:text-[#FFD700]">
                <ChevronLeft className="w-5 h-5" /> Change Nationality
              </button>

              <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#0C0C0D]/85 backdrop-blur-xl">
                <div className="border-b border-[#D4AF37]/20 px-6 py-8 sm:px-10">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D4AF37]/70">Step 2</p>
                      <h2 className="mt-2 text-3xl font-light text-white sm:text-4xl">Choose Destination</h2>
                      <p className="mt-2 max-w-xl text-sm text-gray-400">Your passport: {passportCountry}. Pick where you want to travel next.</p>
                    </div>
                    <div className="w-full md:w-[320px]">
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Search Destination</label>
                      <input
                        type="text"
                        value={destinationQuery}
                        onChange={(e) => setDestinationQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#D4AF37]/25 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Type destination country..."
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-10 sm:py-8">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gray-500">Eligible Destinations: {filteredDestinationCountries.length}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredDestinationCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setDestination(country.code);
                      setTimeout(() => setStep('result'), 200);
                    }}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      destination === country.code
                        ? 'border-[#FFD700] bg-[#D4AF37]/12 shadow-[0_0_24px_rgba(212,175,55,0.16)]'
                        : 'border-[#D4AF37]/15 bg-[#121214] hover:border-[#D4AF37]/45'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl transition-transform group-hover:scale-110">{country.flag}</span>
                      <ChevronRight className="h-4 w-4 text-[#D4AF37]/70" />
                    </div>
                    <div className="text-sm font-medium text-white">{country.name}</div>
                    <p className="mt-1 text-xs text-gray-500">Entry rules preview</p>
                  </button>
                ))}
                  </div>
                  {filteredDestinationCountries.length === 0 && (
                    <p className="rounded-xl border border-[#D4AF37]/20 bg-black/30 px-4 py-6 text-center text-sm text-gray-400">No destination found. Refine your search keyword.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-5xl">
              <button onClick={handleBack} className="mb-5 flex items-center gap-2 text-[#D4AF37] transition-colors hover:text-[#FFD700]">
                <ChevronLeft className="w-5 h-5" /> Change Destination
              </button>

              <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#0E0E10]/90 backdrop-blur-xl">
                <div className="border-b border-[#D4AF37]/20 px-6 py-8 sm:px-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{COUNTRIES.find(c => c.code === destination)?.flag}</span>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4AF37]/75">Visa Match</p>
                        <h2 className="mt-1 text-3xl font-light text-white sm:text-4xl">{passportCountry} to {destinationCountry}</h2>
                        <p className="mt-1 text-sm text-gray-400">Intelligence snapshot generated for your route</p>
                      </div>
                    </div>
                    <div className={`inline-flex rounded-full px-5 py-2.5 ${result.bgColor} border ${result.color.replace('text-', 'border-')}/30`}>
                      <span className={`text-sm font-semibold ${result.color}`}>{result.label}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-8 sm:px-10">
                  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#D4AF37]/20 bg-black/30 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm text-gray-400">Processing Time</span>
                      </div>
                      <p className="text-xl font-light text-white">{result.processingTime}</p>
                    </div>
                    <div className="rounded-2xl border border-[#D4AF37]/20 bg-black/30 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm text-gray-400">Estimated Cost</span>
                      </div>
                      <p className="text-xl font-light text-white">{result.estimatedCost}</p>
                    </div>
                    <div className="rounded-2xl border border-[#D4AF37]/20 bg-black/30 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-sm text-gray-400">Success Rate</span>
                      </div>
                      <p className="text-xl font-light text-white">{result.successRate}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#D4AF37]/25 bg-[linear-gradient(120deg,rgba(212,175,55,0.12),rgba(212,175,55,0.02)_55%)] p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-lg font-medium text-white">
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                        AI Passport Photo Assistant
                      </h3>
                      <p className="max-w-xl text-sm text-gray-300">
                        Generate a 100% compliant, background-removed passport photo instantly. Perfect for your UAE Visa application.
                      </p>
                    </div>
                      <button
                        onClick={() => setStep('photo')}
                        className="whitespace-nowrap rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 px-6 py-3 font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
                      >
                        Generate Photo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-[#D4AF37]/20 bg-black/35 p-6 sm:grid-cols-2 sm:p-8">
                  <button
                    onClick={() => setStep('photo')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-6 py-4 font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
                  >
                    <Sparkles className="h-5 w-5" />
                    Enhance Passport Photo
                  </button>
                  <button onClick={() => setStep('lead')} className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-4 font-medium text-[#0A0A0A] transition-all hover:bg-[#FFD700]">
                    <ArrowRight className="w-5 h-5" />
                    Continue Application
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Photo Assistant */}
          {step === 'photo' && (
            <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-5xl">
              <button 
                onClick={handleBack} 
                className="mb-5 flex items-center gap-2 text-[#D4AF37] transition-colors hover:text-[#FFD700]"
                disabled={isProcessing}
              >
                <ChevronLeft className="w-5 h-5" /> Back to Visa Results
              </button>

              <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#0E0E10]/90 backdrop-blur-xl">
                <div className="border-b border-[#D4AF37]/20 p-8 text-center sm:p-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
                    <User className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4AF37]/75">Step 4</p>
                  <h2 className="mb-2 mt-3 text-3xl font-light text-white sm:text-4xl">Passport Photo AI Studio</h2>
                  <p className="mx-auto max-w-2xl text-gray-400">Our AI removes background, aligns framing, and formats your image to UAE visa standards in one pass.</p>
                </div>

                <div className="p-6 sm:p-8">
                  {!capturedImage && !processedImage ? (
                    <div className="mx-auto max-w-3xl">
                      <div className="mb-6 flex justify-center gap-3">
                        <button 
                          onClick={() => { setPhotoMode('upload'); cancelCamera(); }}
                          className={`flex items-center gap-2 rounded-full border px-6 py-3 transition-all ${photoMode === 'upload' ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0A]' : 'border-gray-700 bg-transparent text-gray-400 hover:text-white'}`}
                        >
                          <Upload className="w-4 h-4" /> Upload File
                        </button>
                        <button 
                          onClick={startCamera}
                          className={`flex items-center gap-2 rounded-full border px-6 py-3 transition-all ${photoMode === 'camera' ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0A]' : 'border-gray-700 bg-transparent text-gray-400 hover:text-white'}`}
                        >
                          <Camera className="w-4 h-4" /> Use Camera
                        </button>
                      </div>

                      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/30 bg-black/40 p-8">
                        {photoMode === 'upload' ? (
                          <>
                            <Upload className="mb-4 h-16 w-16 text-[#D4AF37]/50" />
                            <h3 className="mb-2 text-lg font-medium text-white">Upload Passport Portrait</h3>
                            <p className="mb-6 max-w-sm text-center text-sm text-gray-500">JPEG or PNG supported. Use a clear, front-facing portrait for best AI output.</p>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              ref={fileInputRef} 
                              onChange={handleFileUpload}
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-xl border border-[#D4AF37]/50 bg-[#1A1A1A] px-8 py-3 text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
                            >
                              Browse Files
                            </button>
                          </>
                        ) : (
                          <div className="w-full flex flex-col items-center">
                            <div className="relative w-full max-w-[400px] aspect-[3/4] bg-black rounded-lg overflow-hidden border border-[#D4AF37]/50">
                              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-3/4 h-3/4 border-2 border-dashed border-[#D4AF37]/50 rounded-full" />
                              </div>
                            </div>
                            <button 
                              onClick={takePhoto}
                              className="mt-6 flex items-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 font-medium text-[#0A0A0A] transition-all hover:bg-[#FFD700]"
                            >
                              <Camera className="w-5 h-5" /> 
                              Capture Photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto max-w-5xl">
                      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
                        <div className={`transition-opacity duration-500 ${showPreview === 'processed' ? 'opacity-50 blur-[2px] scale-95' : 'opacity-100 scale-100'}`}>
                          <h4 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-gray-400">Original</h4>
                          <div className="aspect-square w-[300px] overflow-hidden rounded-xl border border-gray-700 bg-black">
                            {capturedImage && (
                              <img src={capturedImage} alt="Original capture" className="w-full h-full object-cover" />
                            )}
                          </div>
                        </div>

                        <div className="flex w-16 shrink-0 flex-col items-center justify-center">
                          {isProcessing ? (
                            <div className="mt-6 flex flex-col items-center space-y-4 text-center">
                              <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                              <span className="text-[#D4AF37] text-xs font-mono uppercase tracking-widest animate-pulse">Running AI</span>
                            </div>
                          ) : processedImage ? (
                            <ArrowRight className="w-8 h-8 text-[#D4AF37]" />
                          ) : null}
                        </div>

                        <div className={`transition-opacity duration-500 ${showPreview === 'original' ? 'opacity-50 blur-[2px] scale-95' : 'opacity-100 scale-100'}`}>
                          <h4 className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-[#D4AF37]">Passport Standard</h4>
                          <div className="relative aspect-square w-[300px] overflow-hidden rounded-xl border-2 border-[#D4AF37] bg-white">
                            {processedImage ? (
                              <img src={processedImage} alt="AI Processed Photo" className="w-full h-full object-contain" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                Awaiting Processing...
                              </div>
                            )}
                            
                            {!isProcessing && !processedImage && capturedImage && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <button 
                                  onClick={processImage}
                                  className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-medium text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-colors hover:bg-[#FFD700]"
                                >
                                  <Sparkles className="w-5 h-5" /> Enhance Photo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {processedImage && !isProcessing && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                          <button 
                            onClick={resetPhoto}
                            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-400 transition-colors hover:text-white"
                          >
                            <RefreshCcw className="w-4 h-4" /> Retake Photo
                          </button>
                          
                          <div className="flex gap-4">
                            <button 
                              onMouseEnter={() => setShowPreview('original')}
                              onMouseLeave={() => setShowPreview('processed')}
                              className="flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#1A1A1A] px-6 py-3 text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                            >
                              Hold for Original
                            </button>
                            
                            <button 
                              onClick={handleDownload}
                              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition-all hover:bg-gray-200"
                            >
                              <Download className="w-5 h-5" /> Download HD
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {processedImage && (
                  <div className="border-t border-[#D4AF37]/20 bg-black/35 p-8">
                    <button onClick={() => setStep('lead')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-4 font-medium text-[#0A0A0A] transition-all duration-300 hover:bg-[#FFD700]">
                      Submit & Continue Application
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Lead Capture */}
          {step === 'lead' && (
            <motion.div key="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-3xl">
              <button onClick={handleBack} className="mb-5 flex items-center gap-2 text-[#D4AF37] transition-colors hover:text-[#FFD700]">
                <ChevronLeft className="w-5 h-5" /> Back
              </button>

              <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#0E0E10]/90 p-7 backdrop-blur-xl sm:p-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
                    <Lock className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4AF37]/75">Step 5</p>
                  <h2 className="mb-2 mt-3 text-3xl font-light text-white">Secure Your Submission</h2>
                  <p className="mx-auto max-w-xl text-gray-400">Enter your official details to proceed with your fast-tracked visa application.</p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#D4AF37]/20 bg-black/30 px-4 py-3 text-center text-sm text-gray-300">Route: {passportCountry} {'>'} {destinationCountry}</div>
                  <div className="rounded-xl border border-[#D4AF37]/20 bg-black/30 px-4 py-3 text-center text-sm text-gray-300">Estimated: {result.processingTime}</div>
                  <div className="rounded-xl border border-[#D4AF37]/20 bg-black/30 px-4 py-3 text-center text-sm text-gray-300">Guidance: Concierge Priority</div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Full Name *</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0A0A] px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-[#D4AF37] focus:outline-none" placeholder="Enter your full name as per passport" />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Email Address *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0A0A] px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-[#D4AF37] focus:outline-none" placeholder="your@email.com" />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Phone Number *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0A0A] px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-[#D4AF37] focus:outline-none" placeholder="+971 50 123 4567" />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="pt-4">
                    {!isUnlocked ? (
                       <button onClick={handleLeadSubmit} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-8 py-4 font-medium text-[#0A0A0A] transition-all duration-300 hover:bg-[#FFD700] disabled:cursor-not-allowed disabled:opacity-70">
                       {isSubmitting ? (
                         <>
                           <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                           Processing...
                         </>
                       ) : (
                         <>
                           <Unlock className="w-5 h-5" />
                           Submit to Concierge
                         </>
                       )}
                     </button>
                    ) : (
                      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                        <h4 className="text-white text-lg font-medium mb-1">Application Submitted</h4>
                        <p className="text-emerald-400/80 text-sm">Your dedicated DALC advisor will contact you shortly.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
