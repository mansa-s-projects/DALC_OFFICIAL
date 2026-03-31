'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import type { ExperienceService, PricingTier } from '../types';

interface GiftExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceService;
  selectedTier: PricingTier | null;
}

interface GiftFormData {
  recipientName: string;
  recipientEmail: string;
  message: string;
  deliveryDate: string;
}

export default function GiftExperienceModal({ 
  isOpen, 
  onClose, 
  experience,
  selectedTier 
}: GiftExperienceModalProps) {
  const [formData, setFormData] = useState<GiftFormData>({
    recipientName: '',
    recipientEmail: '',
    message: '',
    deliveryDate: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [giftCode, setGiftCode] = useState('');
  const profile = useAppStore((s) => s.profile);
  const session = useAppStore((s) => s.session);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !selectedTier) return;

    setIsSubmitting(true);
    
    // Simulate API call - would create gift voucher in Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate gift code
    const code = `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGiftCode(code);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const isFormValid = formData.recipientName && formData.recipientEmail && formData.deliveryDate;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-2xl border border-luxury-gold/30 bg-[#0E1012] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-b from-luxury-gold/10 to-transparent border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-display text-white">
                    {submitted ? 'Gift Sent!' : 'Give as a Gift'}
                  </h2>
                  <p className="text-white/50 text-sm">
                    {experience.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg text-white mb-2">Gift Voucher Created!</h3>
                  <p className="text-white/50 text-sm mb-6">
                    Your gift will be delivered to {formData.recipientEmail} on {new Date(formData.deliveryDate).toLocaleDateString()}.
                  </p>
                  
                  <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-4 mb-6">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Gift Code</p>
                    <p className="text-2xl font-mono font-bold text-luxury-gold tracking-wider">{giftCode}</p>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {!session?.user ? (
                    <div className="text-center py-4">
                      <p className="text-white/50 text-sm mb-4">Sign in to send a gift</p>
                      <a
                        href="/auth/login"
                        className="inline-block w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors text-center"
                      >
                        Sign In
                      </a>
                    </div>
                  ) : !selectedTier ? (
                    <div className="text-center py-4">
                      <p className="text-white/50 text-sm mb-4">Please select a tier first</p>
                      <button
                        onClick={onClose}
                        className="w-full py-3 px-6 rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Selected Tier Summary */}
                      <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Selected Tier</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{selectedTier.tier}</span>
                          <span className="text-luxury-gold font-display">AED {selectedTier.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Recipient Name *</label>
                        <input
                          type="text"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:border-luxury-gold/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Recipient Email *</label>
                        <input
                          type="email"
                          value={formData.recipientEmail}
                          onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:border-luxury-gold/50 focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Delivery Date *</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:border-luxury-gold/50 focus:outline-none transition-colors [color-scheme:dark]"
                            required
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Gift Message (Optional)</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Write a personal message..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:border-luxury-gold/50 focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      <div className="pt-4 space-y-3">
                        <button
                          type="submit"
                          disabled={!isFormValid || isSubmitting}
                          className="w-full py-3 px-6 rounded-xl bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Creating Gift...
                            </>
                          ) : (
                            <>
                              <Gift className="w-4 h-4" />
                              Send Gift
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full py-3 px-6 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
