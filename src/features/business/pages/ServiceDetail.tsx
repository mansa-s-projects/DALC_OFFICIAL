import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Building2,
  CalendarCheck,
  DollarSign,
  FileText,
  CheckCircle2,
  MapPin,
  Star,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import ProcessTimeline from '../../../components/business/ProcessTimeline';
import DocumentRequirements from '../../../components/business/DocumentRequirements';
import ComplianceChecklist from '../../../components/business/ComplianceChecklist';
import { useBusinessService } from '../hooks/useBusiness';
import { useCreateBusinessBooking } from '../hooks/useBusinessBooking';
import { useAppStore } from '../../../store/useAppStore';
import { SUBCATEGORY_LABELS, SERVICE_TYPE_LABELS } from '../types';

export default function ServiceDetail() {
  const params = useParams();
  const subcategory = params?.subcategory as string;
  const slug = params?.slug as string;
  const router = useRouter();
  const session = useAppStore(s => s.session);

  const { data: service, isLoading, error } = useBusinessService(slug);
  const createBooking = useCreateBusinessBooking();

  const [bookingStarted, setBookingStarted] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleEngage = async () => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }
    if (!service) return;

    setBookingStarted(true);
    try {
      await createBooking.mutateAsync({
        service_id: service.id,
        user_id: session.user.id,
        documents_required: service.required_documents,
        government_fees: service.government_fees,
      });
      setBookingSuccess(true);
    } catch {
      setBookingStarted(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-full max-w-4xl px-8">
            <div className="h-72 bg-white/5 animate-pulse" />
            <div className="h-8 bg-white/5 animate-pulse w-2/3" />
            <div className="h-4 bg-white/5 animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Service not found.</p>
          <Link href={`/business/${subcategory}`} className="text-luxury-gold text-sm underline">
            Back to {subcategory}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const priceLabel =
    service.price_display ??
    (service.pricing_model === 'custom_quote'
      ? 'Custom Quote'
      : service.pricing_model === 'hourly'
      ? `AED ${service.price_from?.toLocaleString()}/hr`
      : service.pricing_model === 'starting_from'
      ? `From AED ${service.price_from?.toLocaleString()}`
      : `AED ${service.price_from?.toLocaleString()}`);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {service.hero_image ? (
          <img
            src={service.hero_image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/30" />

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
            <Link href="/business" className="hover:text-luxury-gold transition-colors">Business</Link>
            <span>/</span>
            <Link href={`/business/${subcategory}`} className="hover:text-luxury-gold transition-colors">
              {subcategory ? SUBCATEGORY_LABELS[subcategory as keyof typeof SUBCATEGORY_LABELS] ?? subcategory : ''}
            </Link>
            <span>/</span>
            <span className="text-luxury-gold truncate max-w-[200px]">{service.name}</span>
          </nav>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-luxury-black/80 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                {service.subcategory ? SUBCATEGORY_LABELS[service.subcategory] : ''}
              </span>
              <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
                {SERVICE_TYPE_LABELS[service.service_type]}
              </span>
              {service.is_featured && (
                <span className="flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-display text-white mb-3 leading-tight">
              {service.name}
            </h1>
            {service.description_short && (
              <p className="text-gray-300 text-base max-w-2xl leading-relaxed">
                {service.description_short}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left / main column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">

          {/* Overview */}
          {service.description_long && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-display text-white mb-4">Overview</h2>
              <p className="text-gray-400 leading-relaxed">{service.description_long}</p>
            </motion.div>
          )}

          {/* Key info tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {service.duration_description && (
              <div className="border border-white/10 p-4">
                <Clock className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Timeline</p>
                <p className="text-white text-sm font-medium">{service.duration_description}</p>
              </div>
            )}
            <div className="border border-white/10 p-4">
              <FileText className="w-5 h-5 text-luxury-gold mb-2" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Steps</p>
              <p className="text-white text-sm font-medium">{service.estimated_steps} steps</p>
            </div>
            {service.location && (
              <div className="border border-white/10 p-4">
                <MapPin className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Location</p>
                <p className="text-white text-sm font-medium">
                  {service.freezone ? `${service.freezone}` : service.location}
                </p>
              </div>
            )}
            {service.government_authority && (
              <div className="border border-white/10 p-4">
                <Building2 className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Authority</p>
                <p className="text-white text-sm font-medium leading-snug">{service.government_authority}</p>
              </div>
            )}
          </div>

          {/* Process timeline */}
          {service.workflow_template.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-white mb-6">Step-by-Step Process</h2>
              <ProcessTimeline steps={service.workflow_template} currentStep={0} />
            </div>
          )}

          {/* Documents */}
          {service.required_documents.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-white mb-6">Document Requirements</h2>
              <DocumentRequirements required={service.required_documents} />
            </div>
          )}

          {/* Government fees */}
          <div className="border border-white/10 p-6">
            <h2 className="text-xl font-display text-white mb-5">Fee Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400 text-sm">Service fee</span>
                <span className="text-white text-sm font-medium">{priceLabel}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-gray-400 text-sm">Government fees</span>
                <span className="text-white text-sm font-medium">
                  {service.government_fees > 0
                    ? `AED ${service.government_fees.toLocaleString()}`
                    : 'Included / N/A'}
                </span>
              </div>
              {service.government_authority && (
                <p className="text-gray-600 text-xs mt-2">
                  Government fees paid to {service.government_authority}. Subject to change.
                </p>
              )}
            </div>
          </div>

          {/* Compliance checklist preview */}
          {service.compliance_checklist.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-white mb-6">Compliance Checklist</h2>
              <ComplianceChecklist items={service.compliance_checklist} editable={false} />
            </div>
          )}

          {/* Eligibility */}
          {service.eligibility_criteria.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-white mb-6">Eligibility Criteria</h2>
              <ul className="space-y-3">
                {service.eligibility_criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold/70 flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right / sticky sidebar ──────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">

            {/* Pricing card */}
            <div className="border border-luxury-gold/30 p-6 bg-white/[0.02]">
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                {service.pricing_model === 'custom_quote' ? 'Pricing' : 'Starting from'}
              </p>
              <p className="text-luxury-gold font-display text-3xl font-bold mb-1">{priceLabel}</p>
              {service.government_fees > 0 && (
                <p className="text-gray-500 text-xs mb-5">
                  + AED {service.government_fees.toLocaleString()} govt. fees
                </p>
              )}

              {bookingSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm py-3 border border-emerald-400/20 px-4">
                  <CheckCircle2 className="w-4 h-4" />
                  Booking submitted! We'll be in touch.
                </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleEngage}
                    disabled={createBooking.isPending || bookingStarted}
                    className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 mb-3"
                  >
                    {createBooking.isPending ? 'Processing…' : 'Engage Service'}
                  </motion.button>
                  <Link
                    href={`/business/consultation/new?service=${service.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Free Consultation First
                  </Link>
                </>
              )}
            </div>

            {/* Quick info */}
            <div className="border border-white/10 p-5 space-y-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Quick Info</p>
              {service.freezone && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Free Zone</span>
                  <span className="text-gray-200">{service.freezone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Currency</span>
                <span className="text-gray-200">{service.price_currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-200">{SERVICE_TYPE_LABELS[service.service_type]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Docs required</span>
                <span className="text-gray-200">{service.required_documents.length}</span>
              </div>
            </div>

            {/* Back link */}
            <Link
              href={`/business/${subcategory}`}
              className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {subcategory ? SUBCATEGORY_LABELS[subcategory as keyof typeof SUBCATEGORY_LABELS] ?? subcategory : ''}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related / CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Unsure which service is right?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Speak with an expert advisor — free
            </h3>
          </div>
          <Link
            href="/business/consultation/new"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Book Free Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
