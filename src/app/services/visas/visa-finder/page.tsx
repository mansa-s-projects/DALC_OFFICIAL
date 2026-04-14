'use client';

import { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
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

  const stepNumber = { nationality: 1, destination: 2, result: 3, photo: 4, lead: 5 };

  const getVisaResult = (): VisaResult => VISA_RESULTS[`${passport}-${destination}`] || VISA_RESULTS.default;

  const handleBack = () => {
    if (step === 'destination') { setStep('nationality'); setPassport(''); }
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
              <span className="text-[#D4AF37] text-sm">Step {stepNumber[step]} of 5</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
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
            <motion.div key="nationality" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
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
                      passport === country.code ? 'border-[#FFD700] bg-[#D4AF37]/10' : 'border-[#D4AF37]/20 bg-[#1A1A1A] hover:border-[#D4AF37]/50'
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
            <motion.div key="destination" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors">
                <ChevronLeft className="w-5 h-5" /> Change Nationality
              </button>
              <div className="text-center mb-10">
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
                      destination === country.code ? 'border-[#FFD700] bg-[#D4AF37]/10' : 'border-[#D4AF37]/20 bg-[#1A1A1A] hover:border-[#D4AF37]/50'
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
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors">
                <ChevronLeft className="w-5 h-5" /> Change Destination
              </button>

              <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/30 overflow-hidden">
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

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                  {/* AI Photo Assistant Call-to-Action */}
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div>
                      <h3 className="text-white font-medium flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                        AI Passport Photo Assistant
                      </h3>
                      <p className="text-sm text-gray-400">
                        Generate a 100% compliant, background-removed passport photo instantly. Perfect for your UAE Visa application.
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('photo')}
                      className="px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all whitespace-nowrap"
                    >
                      Generate Photo
                    </button>
                  </div>
                </div>

                <div className="p-8 border-t border-[#D4AF37]/20 bg-[#0A0A0A]/50">
                  <button onClick={() => setStep('lead')} className="w-full px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Skip to Application Details
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Photo Assistant */}
          {step === 'photo' && (
            <motion.div key="photo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
              <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors"
                disabled={isProcessing}
              >
                <ChevronLeft className="w-5 h-5" /> Back to Visa Results
              </button>

              <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/30 overflow-hidden">
                <div className="p-8 text-center border-b border-[#D4AF37]/20">
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-3xl font-light text-white mb-2">Setup Your Passport Photo</h2>
                  <p className="text-gray-400">Our AI will remove the background, center your face, and format it exactly for UAE Visa requirements.</p>
                </div>

                <div className="p-8">
                  {/* Photo Flow Container */}
                  {!capturedImage && !processedImage ? (
                    // Capture / Upload mode
                    <div className="max-w-2xl mx-auto">
                      <div className="flex justify-center gap-4 mb-6">
                        <button 
                          onClick={() => { setPhotoMode('upload'); cancelCamera(); }}
                          className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${photoMode === 'upload' ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]' : 'bg-transparent text-gray-400 border-gray-700 hover:text-white'}`}
                        >
                          <Upload className="w-4 h-4" /> Upload File
                        </button>
                        <button 
                          onClick={startCamera}
                          className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${photoMode === 'camera' ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]' : 'bg-transparent text-gray-400 border-gray-700 hover:text-white'}`}
                        >
                          <Camera className="w-4 h-4" /> Use Camera
                        </button>
                      </div>

                      <div className="bg-[#0A0A0A] border border-dashed border-[#D4AF37]/30 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                        {photoMode === 'upload' ? (
                          <>
                            <Upload className="w-16 h-16 text-[#D4AF37]/50 mb-4" />
                            <h3 className="text-white text-lg font-medium mb-2">Drag & Drop or Verify Image</h3>
                            <p className="text-gray-500 mb-6 text-sm text-center max-w-sm">JPEG, PNG formats supported. Must be a clear picture of your face.</p>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              ref={fileInputRef} 
                              onChange={handleFileUpload}
                            />
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="px-8 py-3 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/10 transition-colors"
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
                              className="mt-6 px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] font-medium rounded-full hover:bg-[#FFD700] transition-all flex items-center gap-2"
                            >
                              <Camera className="w-5 h-5" /> 
                              Capture Photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Processing / Results mode
                    <div className="max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                        
                        {/* Original Image */}
                        <div className={`transition-opacity duration-500 ${showPreview === 'processed' ? 'opacity-50 blur-[2px] scale-95' : 'opacity-100 scale-100'}`}>
                          <h4 className="text-center text-gray-400 mb-3 text-sm font-medium uppercase tracking-wider">Original</h4>
                          <div className="w-[300px] aspect-square rounded-xl overflow-hidden border border-gray-700 bg-black">
                            {capturedImage && (
                              <img src={capturedImage} alt="Original capture" className="w-full h-full object-cover" />
                            )}
                          </div>
                        </div>

                        {/* Processed Arrow/Loader */}
                        <div className="flex flex-col items-center justify-center shrink-0 w-16">
                          {isProcessing ? (
                            <div className="space-y-4 text-center flex flex-col items-center mt-6">
                              <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                              <span className="text-[#D4AF37] text-xs font-mono uppercase tracking-widest animate-pulse">Running AI</span>
                            </div>
                          ) : processedImage ? (
                            <ArrowRight className="w-8 h-8 text-[#D4AF37]" />
                          ) : null}
                        </div>

                        {/* Final AI Output */}
                        <div className={`transition-opacity duration-500 ${showPreview === 'original' ? 'opacity-50 blur-[2px] scale-95' : 'opacity-100 scale-100'}`}>
                          <h4 className="text-center text-[#D4AF37] mb-3 text-sm font-medium uppercase tracking-wider">Passort Standard</h4>
                          <div className="w-[300px] aspect-square rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-white relative">
                            {processedImage ? (
                              <img src={processedImage} alt="AI Processed Photo" className="w-full h-full object-contain" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                Awaiting Processing...
                              </div>
                            )}
                            
                            {/* Process Action Overlay */}
                            {!isProcessing && !processedImage && capturedImage && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <button 
                                  onClick={processImage}
                                  className="px-6 py-3 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                                >
                                  <Sparkles className="w-5 h-5" /> Enhance Photo
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls after processing */}
                      {processedImage && !isProcessing && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                          <button 
                            onClick={resetPhoto}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors flex items-center gap-2 justify-center"
                          >
                            <RefreshCcw className="w-4 h-4" /> Retake Photo
                          </button>
                          
                          <div className="flex gap-4">
                            <button 
                              onMouseEnter={() => setShowPreview('original')}
                              onMouseLeave={() => setShowPreview('processed')}
                              className="px-6 py-3 bg-[#1A1A1A] border border-[#D4AF37]/50 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/10 transition-all flex items-center gap-2 justify-center"
                            >
                              Hold for Original
                            </button>
                            
                            <button 
                              onClick={handleDownload}
                              className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2 justify-center shadow-md"
                            >
                              <Download className="w-5 h-5" /> Download HD
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Continue to App */}
                {processedImage && (
                  <div className="p-8 border-t border-[#D4AF37]/20 bg-[#0A0A0A]/50">
                    <button onClick={() => setStep('lead')} className="w-full px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2">
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
            <motion.div key="lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto">
              <button onClick={handleBack} className="flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-[#FFD700] transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back
              </button>

              <div className="bg-[#1A1A1A] rounded-2xl border border-[#D4AF37]/30 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-2">Secure Your Submission</h2>
                  <p className="text-gray-400">Enter your official details to proceed with your fast-tracked visa application</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                    <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors" placeholder="Enter your full name as per passport" />
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors" placeholder="your@email.com" />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Phone Number *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-xl text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none transition-colors" placeholder="+971 50 123 4567" />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="pt-4">
                    {!isUnlocked ? (
                       <button onClick={handleLeadSubmit} disabled={isSubmitting} className="w-full px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] rounded-xl font-medium hover:bg-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2">
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
                      <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-6 text-center">
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
