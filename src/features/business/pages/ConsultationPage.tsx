import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Video,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  CalendarCheck,
  X,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ConsultationScheduler from '../../../components/business/ConsultationScheduler';
import { useUserConsultations, useScheduleConsultation } from '../hooks/useConsultation';
import { useBusinessService } from '../hooks/useBusiness';
import { useAppStore } from '../../../store/useAppStore';
import type { MeetingType, TimeSlot } from '../types';

const MEETING_ICONS: Record<MeetingType, React.ReactNode> = {
  online: <Video className="w-5 h-5" />,
  in_person: <MapPin className="w-5 h-5" />,
  phone: <Phone className="w-5 h-5" />,
};

const MEETING_LABELS: Record<MeetingType, string> = {
  online: 'Video Call',
  in_person: 'In Person',
  phone: 'Phone Call',
};

export default function ConsultationPage() {
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useAppStore(s => s.session);

  const isNew = id === 'new';
  const serviceIdFromQuery = searchParams?.get('service') ?? undefined;

  // For new consultation — use scheduler
  const { data: service } = useBusinessService(
    isNew ? undefined : undefined // loaded per consultation lookup in real app
  );

  const { data: consultations = [] } = useUserConsultations(
    !isNew ? session?.user?.id : undefined
  );

  const scheduleConsultation = useScheduleConsultation();

  // File upload state (mock)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDetails, setScheduledDetails] = useState<{
    slot: TimeSlot;
    meetingType: MeetingType;
  } | null>(null);

  // Find existing consultation
  const consultation = !isNew
    ? consultations.find(c => c.id === id)
    : null;

  const handleSchedule = async (params: {
    date: string;
    slot: TimeSlot;
    meetingType: MeetingType;
    agenda: string;
  }) => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    await scheduleConsultation.mutateAsync({
      service_id: serviceIdFromQuery ?? 'general',
      user_id: session.user.id,
      consultation_type: 'initial',
      scheduled_at: params.slot.time,
      meeting_type: params.meetingType,
      agenda: params.agenda,
    });

    setScheduledDetails({ slot: params.slot, meetingType: params.meetingType });
    setScheduled(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).map(f => f.name);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).map(f => f.name);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // ── Scheduled success screen ──────────────────────────────────────────────

  if (scheduled && scheduledDetails) {
    const dt = new Date(scheduledDetails.slot.time);
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full border border-luxury-gold/30 p-10 text-center"
          >
            <CheckCircle2 className="w-14 h-14 text-luxury-gold mx-auto mb-6" />
            <h2 className="text-2xl font-display text-white mb-3">Consultation Scheduled</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your {MEETING_LABELS[scheduledDetails.meetingType].toLowerCase()} consultation has been
              confirmed. You'll receive a confirmation email shortly.
            </p>

            <div className="bg-white/5 border border-white/10 p-5 text-left space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-luxury-gold" />
                <span className="text-gray-300">
                  {dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-luxury-gold" />
                <span className="text-gray-300">{scheduledDetails.slot.label} (Dubai, GST)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-luxury-gold">{MEETING_ICONS[scheduledDetails.meetingType]}</span>
                <span className="text-gray-300">{MEETING_LABELS[scheduledDetails.meetingType]}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/business"
                className="px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors"
              >
                Back to Business Hub
              </Link>
              <Link
                href="/my-requests"
                className="px-6 py-3 border border-white/20 text-gray-300 text-sm uppercase tracking-widest hover:border-luxury-gold/40 hover:text-luxury-gold transition-colors"
              >
                View My Requests
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── New consultation booking ───────────────────────────────────────────────

  if (isNew) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />

        <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Complimentary
            </p>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Book a Free Consultation
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Speak with one of our Dubai business advisors. No commitment, no cost.
              Choose your preferred time below.
            </p>
          </motion.div>
        </section>

        <div className="max-w-2xl mx-auto px-4 pb-24">
          <div className="bg-white/[0.03] border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <CalendarCheck className="w-5 h-5 text-luxury-gold" />
              <div>
                <h3 className="text-white font-medium text-sm">Free 30-minute advisory session</h3>
                <p className="text-gray-500 text-xs mt-0.5">With a certified Dubai business advisor</p>
              </div>
            </div>

            <ConsultationScheduler
              serviceId={serviceIdFromQuery ?? 'general'}
              onSchedule={handleSchedule}
              isLoading={scheduleConsultation.isPending}
            />
          </div>

          <Link
            href="/business"
            className="flex items-center gap-2 mt-6 text-gray-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Business Hub
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  // ── Existing consultation detail ──────────────────────────────────────────

  if (!consultation) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Consultation not found.</p>
          <Link href="/business" className="text-luxury-gold text-sm underline">
            Back to Business Hub
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const dt = new Date(consultation.scheduled_at);
  const isPast = dt < new Date();
  const isOnline = consultation.meeting_type === 'online';

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
        <Link
          href="/business"
          className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                consultation.status === 'confirmed'
                  ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                  : consultation.status === 'completed'
                  ? 'text-gray-400 border-gray-400/30'
                  : consultation.status === 'cancelled'
                  ? 'text-red-400 border-red-400/30'
                  : 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/5'
              }`}
            >
              {consultation.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-white mb-2">
            {consultation.consultation_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Consultation
          </h1>
          {consultation.service && (
            <p className="text-gray-400">{consultation.service.name}</p>
          )}
        </motion.div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Details */}
        <div className="md:col-span-2 space-y-6">

          {/* Meeting info */}
          <div className="border border-white/10 p-6 space-y-4">
            <h2 className="text-white font-display text-base mb-4">Meeting Details</h2>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Date & Time</p>
                <p className="text-white text-sm">
                  {dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-gray-400 text-sm">
                  {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} Dubai (GST)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-luxury-gold flex-shrink-0 mt-0.5">
                {MEETING_ICONS[consultation.meeting_type]}
              </span>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Format</p>
                <p className="text-white text-sm">{MEETING_LABELS[consultation.meeting_type]}</p>
                {consultation.meeting_location && (
                  <p className="text-gray-400 text-xs mt-1">{consultation.meeting_location}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Duration</p>
                <p className="text-white text-sm">{consultation.duration_minutes} minutes</p>
              </div>
            </div>

            {/* Join button */}
            {isOnline && consultation.meeting_link && !isPast && consultation.status === 'confirmed' && (
              <motion.a
                href={consultation.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-center gap-2 w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors mt-2"
              >
                <Video className="w-4 h-4" />
                Join Video Call
                <ExternalLink className="w-3.5 h-3.5" />
              </motion.a>
            )}
          </div>

          {/* Agenda */}
          {consultation.agenda && (
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-luxury-gold" />
                <h2 className="text-white font-display text-base">Agenda</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {consultation.agenda}
              </p>
            </div>
          )}

          {/* Advisor notes (post-consultation) */}
          {consultation.advisor_notes && (
            <div className="border border-luxury-gold/20 bg-luxury-gold/5 p-6">
              <h2 className="text-luxury-gold font-display text-base mb-3">Advisor Notes</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{consultation.advisor_notes}</p>
              {consultation.next_steps && (
                <div className="mt-4 pt-4 border-t border-luxury-gold/20">
                  <p className="text-luxury-gold text-xs uppercase tracking-widest mb-2">Next Steps</p>
                  <p className="text-gray-400 text-sm">{consultation.next_steps}</p>
                </div>
              )}
            </div>
          )}

          {/* Document upload area */}
          <div className="border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-4 h-4 text-luxury-gold" />
              <h2 className="text-white font-display text-base">Upload Documents</h2>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Share relevant documents ahead of your consultation to make the most of your session.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-none p-8 text-center transition-all duration-300 ${
                dragOver ? 'border-luxury-gold bg-luxury-gold/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">Drop files here or</p>
              <label className="cursor-pointer text-luxury-gold text-sm underline hover:text-luxury-gold/80">
                browse to upload
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <p className="text-gray-600 text-xs mt-2">PDF, JPG, PNG — max 10 MB each</p>
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <ul className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-luxury-gold flex-shrink-0" />
                      <span className="text-gray-300 text-sm truncate">{f}</span>
                    </div>
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-gray-600 hover:text-red-400 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border border-white/10 p-5 space-y-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Quick Info</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="text-gray-200 capitalize">
                {consultation.consultation_type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="text-gray-200">{consultation.duration_minutes} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Format</span>
              <span className="text-gray-200">{MEETING_LABELS[consultation.meeting_type]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-luxury-gold capitalize">{consultation.status}</span>
            </div>
          </div>

          {consultation.service && (
            <Link
              href={`/business/${consultation.service.subcategory}/${consultation.service.slug}`}
              className="block border border-white/10 p-4 hover:border-luxury-gold/30 transition-colors group"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Related Service</p>
              <p className="text-gray-200 text-sm group-hover:text-luxury-gold transition-colors">
                {consultation.service.name}
              </p>
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
