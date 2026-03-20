'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../../../../components/navigation/Navbar';
import Footer from '../../../../components/navigation/Footer';
import TimeSlotPicker from '../../../../components/experiences/TimeSlotPicker';
import TierSelector from '../../../../components/experiences/TierSelector';
import CapacityBadge from '../../../../components/experiences/CapacityBadge';
import TicketDisplay from '../../../../components/experiences/TicketDisplay';
import { useExperience } from '../../../../features/experiences/hooks/useExperiences';
import { useCheckCapacity, useCreateExperienceBooking } from '../../../../features/experiences/hooks/useExperienceBooking';
import { useAppStore } from '../../../../store/useAppStore';
import {
  SUBCATEGORY_LABELS,
  SERVICE_TYPE_LABELS,
  PRICING_MODEL_LABELS,
} from '../../../../features/experiences/types';
import type { ExperienceBooking } from '../../../../features/experiences/types';

export default function ExperienceDetailPage({ 
  params 
}: { 
  params: { subcategory: string; slug: string } 
}) {
  const { subcategory, slug } = params;
  const router = useRouter();
  const session = useAppStore(s => s.session);

  const { data: experience, isLoading, error } = useExperience(slug);
  const createBooking = useCreateExperienceBooking();

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [partySize, setPartySize] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<ExperienceBooking | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Check capacity
  const { data: capacity } = useCheckCapacity(
    experience?.id,
    selectedDate || new Date(),
    selectedSlot || undefined
  );

  // Set initial tier when experience loads
  useEffect(() => {
    if (experience?.pricing_tiers?.length && !selectedTier) {
      setSelectedTier(experience.pricing_tiers[0].tier);
    }
  }, [experience, selectedTier]);

  const handleBooking = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    if (!experience || !selectedDate || !selectedTier) return;

    const tier = experience.pricing_tiers.find(t => t.tier === selectedTier);
    if (!tier) return;

    const unitPrice = tier.price;
    const totalPrice = unitPrice * partySize;

    try {
      const booking = await createBooking.mutateAsync({
        service_id: experience.id,
        user_id: session.user.id,
        booking_date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedSlot || undefined,
        party_size: partySize,
        tier: selectedTier,
        unit_price: unitPrice,
        total_price: totalPrice,
      });

      setCompletedBooking(booking);
      setBookingComplete(true);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  // Gallery navigation
  const galleryImages = experience?.gallery_images?.length
    ? [experience.hero_image, ...experience.gallery_images].filter(Boolean)
    : [experience?.hero_image].filter(Boolean);

  const nextImage = () => setGalleryIndex(prev => (prev + 1) % galleryImages.length);
  const prevImage = () => setGalleryIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);

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

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Experience not found.</p>
          <Link href={`/experiences/${subcategory}`} className="text-luxury-gold text-sm underline">
            Back to {subcategory}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedTierData = experience.pricing_tiers.find(t => t.tier === selectedTier);
  const bookingEnabled = selectedDate && (experience.service_type === 'on_demand' || selectedSlot);

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero Gallery ─────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {galleryImages.length > 0 ? (
          <>
            <motion.img
              key={galleryIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={galleryImages[galleryIndex]}
              alt={experience.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-luxury-black/20" />

            {/* Gallery Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === galleryIndex ? 'bg-luxury-gold' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
            <Link href="/experiences" className="hover:text-luxury-gold transition-colors">Experiences</Link>
            <span>/</span>
            <Link href={`/experiences/${subcategory}`} className="hover:text-luxury-gold transition-colors">
              {subcategory ? SUBCATEGORY_LABELS[subcategory as keyof typeof SUBCATEGORY_LABELS] ?? subcategory : ''}
            </Link>
            <span>/</span>
            <span className="text-luxury-gold truncate max-w-[200px]">{experience.name}</span>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-luxury-black/80 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                {SUBCATEGORY_LABELS[experience.subcategory]}
              </span>
              <span className="px-2 py-1 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
                {SERVICE_TYPE_LABELS[experience.service_type]}
              </span>
              {experience.is_trending && (
                <span className="flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
              {experience.is_featured && !experience.is_trending && (
                <span className="flex items-center gap-1 px-2 py-1 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-display text-white mb-3 leading-tight">
              {experience.name}
            </h1>
            {experience.description_short && (
              <p className="text-gray-300 text-base max-w-2xl leading-relaxed">
                {experience.description_short}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Left Column ────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          {experience.description_long && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-display text-white mb-4">Overview</h2>
              <p className="text-gray-400 leading-relaxed">{experience.description_long}</p>
            </motion.div>
          )}

          {/* Highlights */}
          {experience.highlights?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="text-xl font-display text-white mb-4">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {experience.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                    <Star className="w-4 h-4 text-luxury-gold/70 flex-shrink-0 mt-0.5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Info Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experience.duration_minutes && (
              <div className="border border-white/10 p-4">
                <Clock className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                <p className="text-white text-sm font-medium">
                  {experience.duration_minutes >= 60
                    ? `${Math.floor(experience.duration_minutes / 60)}h ${experience.duration_minutes % 60 > 0 ? `${experience.duration_minutes % 60}m` : ''}`
                    : `${experience.duration_minutes} min`}
                </p>
              </div>
            )}
            {experience.max_capacity && (
              <div className="border border-white/10 p-4">
                <Users className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                <p className="text-white text-sm font-medium">Up to {experience.max_capacity}</p>
              </div>
            )}
            {(experience.location || experience.area) && (
              <div className="border border-white/10 p-4">
                <MapPin className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Location</p>
                <p className="text-white text-sm font-medium">
                  {experience.area || experience.location}
                </p>
              </div>
            )}
            {experience.venue_name && (
              <div className="border border-white/10 p-4">
                <Info className="w-5 h-5 text-luxury-gold mb-2" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Venue</p>
                <p className="text-white text-sm font-medium">{experience.venue_name}</p>
              </div>
            )}
          </div>

          {/* Vibe Tags */}
          {experience.vibe_tags?.length > 0 && (
            <div>
              <h2 className="text-xl font-display text-white mb-4">Vibe</h2>
              <div className="flex flex-wrap gap-2">
                {experience.vibe_tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What's Included / Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experience.included?.length > 0 && (
              <div className="border border-luxury-gold/20 bg-luxury-gold/5 p-5">
                <h3 className="text-luxury-gold font-medium mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> What's Included
                </h3>
                <ul className="space-y-2">
                  {experience.included.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-luxury-gold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {experience.excluded?.length > 0 && (
              <div className="border border-white/10 p-5">
                <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Not Included
                </h3>
                <ul className="space-y-2">
                  {experience.excluded.map((item, idx) => (
                    <li key={idx} className="text-gray-500 text-sm flex items-start gap-2">
                      <span className="text-gray-600">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Requirements */}
          {experience.requirements?.length > 0 && (
            <div className="border border-white/10 p-5">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Requirements
              </h3>
              <ul className="space-y-2">
                {experience.requirements.map((req, idx) => (
                  <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                    <span className="text-amber-400">•</span> {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Age & Dress Code */}
          {(experience.age_minimum || experience.dress_code) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experience.age_minimum && (
                <div className="border border-white/10 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Age Requirement</p>
                  <p className="text-white text-sm">{experience.age_minimum}+ years</p>
                </div>
              )}
              {experience.dress_code && (
                <div className="border border-white/10 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dress Code</p>
                  <p className="text-white text-sm">{experience.dress_code}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Column (Sticky Booking Panel) ────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <AnimatePresence mode="wait">
              {bookingComplete && completedBooking ? (
                <motion.div
                  key="ticket"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TicketDisplay booking={completedBooking} />
                </motion.div>
              ) : (
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-luxury-gold/30 bg-white/[0.02] p-6 space-y-6"
                >
                  {/* Capacity Badge */}
                  {capacity && (
                    <CapacityBadge capacity={capacity} showDetails />
                  )}

                  {/* Time Slot Picker */}
                  <TimeSlotPicker
                    experience={experience}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onDateChange={setSelectedDate}
                    onSlotChange={setSelectedSlot}
                    partySize={partySize}
                  />

                  {/* Party Size */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center border border-white/10">
                      <button
                        onClick={() => setPartySize(p => Math.max(1, p - 1))}
                        className="px-4 py-2 text-white hover:bg-white/5 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-white">{partySize}</span>
                      <button
                        onClick={() => setPartySize(p => p + 1)}
                        className="px-4 py-2 text-white hover:bg-white/5 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Tier Selector */}
                  <TierSelector
                    tiers={experience.pricing_tiers}
                    pricingModel={experience.pricing_model}
                    selectedTier={selectedTier}
                    onTierChange={setSelectedTier}
                    partySize={partySize}
                    currency={experience.price_currency}
                  />

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: bookingEnabled ? 1.01 : 1 }}
                    whileTap={{ scale: bookingEnabled ? 0.99 : 1 }}
                    onClick={handleBooking}
                    disabled={!bookingEnabled || createBooking.isPending}
                    className="w-full py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createBooking.isPending
                      ? 'Processing…'
                      : !selectedDate
                      ? 'Select Date'
                      : experience.service_type !== 'on_demand' && !selectedSlot
                      ? 'Select Time'
                      : 'Book Now'}
                  </motion.button>

                  {!session?.user && (
                    <p className="text-gray-500 text-xs text-center">
                      Please <Link href="/login" className="text-luxury-gold underline">sign in</Link> to book
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Info */}
            <div className="border border-white/10 p-5 space-y-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Quick Info</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-200">{SUBCATEGORY_LABELS[experience.subcategory]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-200">{SERVICE_TYPE_LABELS[experience.service_type]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pricing</span>
                <span className="text-gray-200">{PRICING_MODEL_LABELS[experience.pricing_model]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
