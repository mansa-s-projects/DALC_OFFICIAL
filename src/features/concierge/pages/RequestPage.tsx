"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowRight, Clock3, MessageSquare, Shield, Sparkles } from 'lucide-react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { useRequests } from '@/hooks/useRequests';
import { useAppStore } from '@/store/useAppStore';
import { CONCIERGE_TYPE_LABELS, type ConciergeRequestType } from '../types';

const WA = '971585987600';

const BRIEF_TYPES: Array<{ value: ConciergeRequestType; eyebrow: string; note: string }> = [
  { value: 'travel_arrival', eyebrow: 'Travel & Arrival', note: 'Airport meet-and-greet, flights, ground movement, and first 48-hour planning.' },
  { value: 'property_stay', eyebrow: 'Property & Stay', note: 'Hotels, villas, residences, and relocation-adjacent living support.' },
  { value: 'transport_lifestyle', eyebrow: 'Lifestyle & Access', note: 'Nightlife, dining, beach clubs, luxury mobility, and daily assistance.' },
  { value: 'business_support', eyebrow: 'Business Support', note: 'Formation, licensing, banking, and executive setup.' },
  { value: 'event_reservation', eyebrow: 'Reservations & Events', note: 'Tables, celebrations, hosted evenings, and one-off access requests.' },
  { value: 'personal_request', eyebrow: 'Anything Bespoke', note: 'Private shopping, gifting, security, staffing, or requests that do not fit a fixed bucket.' },
];

function getWhatsAppUrl(topic: string, note: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Hello DALC, I want help with ${topic}. ${note}`)}`;
}

export default function RequestPage() {
  const searchParams = useSearchParams();
  const initialLocation = searchParams.get('location') || '';
  const session = useAppStore((s) => s.session);
  const { createRequest } = useRequests(session?.user?.id);

  const [briefType, setBriefType] = useState<ConciergeRequestType>('personal_request');
  const [form, setForm] = useState({
    name: '',
    contact: '',
    target: initialLocation,
    when: '',
    partySize: '2',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const selectedType = useMemo(
    () => BRIEF_TYPES.find((item) => item.value === briefType) ?? BRIEF_TYPES[0],
    [briefType],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmissionError(null);

    try {
      await createRequest.mutateAsync({
        category: 'concierge',
        request_type: 'inquiry',
        date_time: form.when || new Date().toISOString(),
        party_size: Number(form.partySize) || 1,
        contact_name: form.name,
        contact_info: form.contact,
        venue_name: form.target || CONCIERGE_TYPE_LABELS[briefType],
        notes: [`brief_type=${briefType}`, form.details].filter(Boolean).join(' | '),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit concierge request:', error);
      setSubmissionError('We could not submit your brief. Please try again or use the WhatsApp backup link.');
    }
  }

  return (
    <div className="min-h-screen bg-[#080706] text-white">
      <Navbar />

      <section className="border-b border-white/5 bg-[linear-gradient(180deg,#120F0A_0%,#080706_100%)] px-4 pb-12 pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#C9A84C]/70">DALC Concierge Intake</p>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="font-display text-[clamp(44px,7vw,84px)] font-light leading-[0.92] text-[#F5EDD8]">
                Request anything. <span className="italic text-[#C9A84C]">We orchestrate the rest.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">
                Use one brief to coordinate nightlife, stays, travel, business setup, and edge-case concierge asks without bouncing between siloed pages.
              </p>
            </div>
            <div className="rounded-2xl border border-[#C9A84C]/15 bg-[#120F0A]/70 p-6 backdrop-blur">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]/60">Response</p>
                  <p className="mt-2 text-xl text-[#F5EDD8]">Fast</p>
                  <p className="mt-1 text-white/45">Priority routing on every brief</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]/60">Scope</p>
                  <p className="mt-2 text-xl text-[#F5EDD8]">Cross-pillar</p>
                  <p className="mt-1 text-white/45">Travel, stays, venues, business</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]/60">Escalation</p>
                  <p className="mt-2 text-xl text-[#F5EDD8]">WhatsApp</p>
                  <p className="mt-1 text-white/45">Direct human fallback when needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-5">
          {BRIEF_TYPES.map((item) => {
            const active = item.value === briefType;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setBriefType(item.value)}
                className="w-full rounded-2xl border p-5 text-left transition-all"
                style={{
                  background: active ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                  borderColor: active ? 'rgba(201,168,76,0.22)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]/70">{item.eyebrow}</p>
                <h2 className="mt-2 font-display text-2xl text-[#F5EDD8]">{CONCIERGE_TYPE_LABELS[item.value]}</h2>
                <p className="mt-2 text-sm leading-6 text-white/45">{item.note}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-[28px] border border-white/6 bg-[#11100D] p-6 md:p-8">
          {!submitted ? (
            <>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A84C]/70">Selected Brief</p>
                  <h3 className="mt-2 font-display text-3xl text-[#F5EDD8]">{CONCIERGE_TYPE_LABELS[briefType]}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">{selectedType.note}</p>
                </div>
                <a
                  href={getWhatsAppUrl(CONCIERGE_TYPE_LABELS[briefType], form.target || form.details || selectedType.note)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#C9A84C]/20 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#C9A84C]"
                >
                  WhatsApp Backup
                </a>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#C9A84C]/30" required />
                  <input value={form.contact} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} placeholder="WhatsApp or email" className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#C9A84C]/30" required />
                </div>
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.6fr]">
                  <input value={form.target} onChange={(e) => setForm((prev) => ({ ...prev, target: e.target.value }))} placeholder="Target venue, area, hotel, aircraft, or ask" className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#C9A84C]/30" />
                  <input type="datetime-local" value={form.when} onChange={(e) => setForm((prev) => ({ ...prev, when: e.target.value }))} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#C9A84C]/30" />
                  <input type="number" min="1" value={form.partySize} onChange={(e) => setForm((prev) => ({ ...prev, partySize: e.target.value }))} placeholder="Guests" className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#C9A84C]/30" />
                </div>
                <textarea value={form.details} onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))} placeholder="Tell us what success looks like: timing, atmosphere, budget range, logistics, preferences, edge cases." rows={7} className="w-full rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm leading-6 outline-none focus:border-[#C9A84C]/30" required />

                {submissionError && (
                  <p className="text-sm text-red-300">{submissionError}</p>
                )}

                <div className="flex flex-col gap-3 border-t border-white/6 pt-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap gap-3 text-xs text-white/45">
                    <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#C9A84C]" /> One brief, multiple pillars</span>
                    <span className="inline-flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-[#C9A84C]" /> Human follow-through</span>
                    <span className="inline-flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 text-[#C9A84C]" /> WhatsApp escalation available</span>
                  </div>
                  <button
                    type="submit"
                    disabled={createRequest.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-[#100800]"
                  >
                    {createRequest.isPending ? 'Submitting...' : 'Submit Concierge Brief'} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/10">
                <Sparkles className="h-7 w-7 text-[#C9A84C]" />
              </div>
              <h3 className="mt-6 font-display text-4xl text-[#F5EDD8]">Brief received</h3>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/45">
                Your request is now in the DALC pipeline. If the ask is time-sensitive, use the WhatsApp backup for immediate escalation.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 md:flex-row">
                <Link href="/my-requests" className="rounded-full bg-[#C9A84C] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-[#100800]">View My Requests</Link>
                <a href={getWhatsAppUrl(CONCIERGE_TYPE_LABELS[briefType], form.details)} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  Open WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
