'use client';

import { useState } from 'react';
import { CheckCircle2, Unlock, X, MessageCircle } from 'lucide-react';
import type { TravelReport, VisaFormData } from '../_lib/types';

interface LeadForm {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

interface Props {
  report: TravelReport;
  data: VisaFormData;
  onClose: () => void;
}

export default function LeadCapture({ report, data, onClose }: Props) {
  const [form, setForm] = useState<LeadForm>({ fullName: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Partial<LeadForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nat = data.nationalities[0];
  const dest = data.destination;
  const service = report.dalcServices[0];

  const validate = () => {
    const e: Partial<LeadForm> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  const field = (key: keyof LeadForm, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="mb-1.5 block text-sm text-[#D4C9A8]/70">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#C9A84C]/20 bg-[#0D0B08] px-4 py-3 text-sm text-white placeholder-[#8A7D60] focus:border-[#C9A84C]/60 focus:outline-none"
      />
      {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-[#C9A84C]/25 bg-[#0D0B08] sm:rounded-3xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8A7D60] transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 py-7 sm:px-8">
          {submitted ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-400" />
              <h3 className="mb-2 text-xl font-light text-white">Advisor Assigned</h3>
              <p className="text-sm text-[#8A7D60]">
                Your DALC advisor will contact you within 2 business hours via WhatsApp or email.
              </p>
              <div className="mt-5 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-4 py-3 text-left">
                <p className="text-xs text-[#8A7D60]">Route</p>
                <p className="text-sm text-white">{nat?.flag} {nat?.name} → {dest?.flag} {dest?.name}</p>
                <p className="mt-1 text-xs text-[#C9A84C]">{service?.title}</p>
              </div>
              <button onClick={onClose} className="mt-5 w-full rounded-xl bg-[#C9A84C] py-3 text-sm font-medium text-[#080706] hover:bg-[#E8CC70]">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/12">
                  <MessageCircle className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Talk to a DALC Advisor</h3>
                  <p className="text-xs text-[#8A7D60]">We will contact you within 2 business hours</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { label: 'Route', value: `${nat?.flag} → ${dest?.flag}` },
                  { label: 'Confidence', value: `${report.scores.confidence}%` },
                  { label: 'Service', value: service?.title.split(' ').slice(0, 2).join(' ') ?? 'Concierge' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-[#C9A84C]/12 bg-[#181510] px-2 py-2">
                    <p className="text-[#8A7D60]">{label}</p>
                    <p className="mt-0.5 text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {field('fullName', 'Full Name *', 'text', 'As per passport')}
                {field('email', 'Email Address *', 'email', 'your@email.com')}
                {field('phone', 'WhatsApp / Phone *', 'tel', '+971 50 000 0000')}

                <div>
                  <label className="mb-1.5 block text-sm text-[#D4C9A8]/70">Additional Notes (optional)</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={2}
                    placeholder="Any specific requirements or questions..."
                    className="w-full resize-none rounded-xl border border-[#C9A84C]/20 bg-[#0D0B08] px-4 py-3 text-sm text-white placeholder-[#8A7D60] focus:border-[#C9A84C]/60 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] py-3.5 text-sm font-medium text-[#080706] transition-all hover:bg-[#E8CC70] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#080706] border-t-transparent" />
                    Assigning advisor...
                  </span>
                ) : (
                  <><Unlock className="h-4 w-4" /> Submit to DALC Concierge</>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] text-[#8A7D60]">
                No spam. Your data is handled in strict confidence.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
