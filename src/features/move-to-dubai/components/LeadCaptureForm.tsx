'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { waUrl } from '../data/services';
import { submitMoveToDubaiLead } from '../config/tracking';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  phone: string;
  situation: string;
}

type Status = 'idle' | 'submitting' | 'success';

// ─── Component ────────────────────────────────────────────────────────────────

interface LeadCaptureFormProps {
  /**
   * Contextual message prefix injected into the WhatsApp deep-link.
   * Defaults to a generic relocation enquiry.
   */
  contextMessage?: string;
  className?: string;
  leadContext?: {
    source_page: string;
    source_section: string;
    cta_label: string;
    service_slug?: string;
    destination: string;
  };
  onSubmitAttempt?: (form: FormState) => void;
  onSubmitSuccess?: (form: FormState) => void;
}

export default function LeadCaptureForm({
  contextMessage = 'I am interested in relocating to Dubai',
  className = '',
  leadContext,
  onSubmitAttempt,
  onSubmitSuccess,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', situation: '' });
  const [status, setStatus] = useState<Status>('idle');
  const submitLockRef = useRef(false);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePhoneChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Basic phone validation - only allow numbers, spaces, and common phone characters
    const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
    setForm((prev) => ({ ...prev, phone: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current || status !== 'idle') return;

    submitLockRef.current = true;
    setStatus('submitting');
    onSubmitAttempt?.(form);

    const leadPersistPromise = submitMoveToDubaiLead({
      name: form.name.trim(),
      email: '',
      phone: form.phone.trim(),
      source_page: leadContext?.source_page || window.location.pathname,
      source_section: leadContext?.source_section || 'contact',
      cta_label: leadContext?.cta_label || 'lead_form_submit',
      service_slug: leadContext?.service_slug,
      destination: leadContext?.destination || 'whatsapp',
    });

    // Build a rich WhatsApp message from form data
    const message = [
      contextMessage + '.',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.situation ? `Situation: ${form.situation}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    // Brief delay for UX, then open WhatsApp
    setTimeout(() => {
      setStatus('success');
      onSubmitSuccess?.(form);
      window.open(waUrl(message), '_blank', 'noopener,noreferrer');
      void leadPersistPromise;
    }, 600);
  };

  const isValid = form.name.trim().length > 0 && form.phone.trim().length > 0;

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-luxury-gold" />
            </motion.div>
            <p className="font-display text-2xl text-white mb-2">We'll be in touch.</p>
            <p className="text-sm text-gray-400">
              WhatsApp opened with your details. Expect a response within 2 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="lead-name"
                className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400"
              >
                Full Name <span className="text-luxury-gold">*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200 focus:border-luxury-gold/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label
                htmlFor="lead-phone"
                className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400"
              >
                WhatsApp Number <span className="text-luxury-gold">*</span>
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="+971 58 598 7600"
                pattern="[+]?[0-9\s\-\(\)]{8,}"
                title="Please enter a valid phone number"
                className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200 focus:border-luxury-gold/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* Situation */}
            <div>
              <label
                htmlFor="lead-situation"
                className="mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400"
              >
                Your Situation <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                id="lead-situation"
                name="situation"
                rows={3}
                value={form.situation}
                onChange={handleChange}
                placeholder="Brief overview — timeline, visa situation, what you need help with..."
                className="w-full resize-none border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200 focus:border-luxury-gold/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || status === 'submitting'}
              className="flex w-full items-center justify-center gap-2.5 bg-luxury-gold px-6 py-4 text-sm font-bold uppercase tracking-widest text-luxury-black transition-all duration-300 hover:bg-luxury-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Start Your Move
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-600">
              We respond within 2 hours · 100% confidential · No spam
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
