'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Check, 
  Calendar,
  Gift,
  Users as UsersIcon,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  ImageOff
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import { getExperienceCategory, getExperienceItem } from '../catalog';
import { useCheckCapacity, useCreateExperienceBooking, useAvailableSlots } from '../hooks/useExperienceBooking';
import { useWaitlistStatus } from '../hooks/useWaitlist';
import { useAppStore } from '../../../store/useAppStore';
import WaitlistModal from '../components/WaitlistModal';
import TierComparisonModal from '../components/TierComparisonModal';
import GiftExperienceModal from '../components/GiftExperienceModal';
import ExperienceReviews from '../components/ExperienceReviews';
import type { PricingTier } from '../types';

interface ExperienceDetailPageProps {
  params: Promise<{ category: string; item: string }>;
}

// Category fallback images for error handling
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'desert-adventures': 'https://images.unsplash.com/photo-1547234935-80c7142ee969?q=80&w=800&auto=format&fit=crop',
  'water-activities': 'https://images.unsplash.com/photo-1566373809071-8bc4ae67f186?q=80&w=800&auto=format&fit=crop',
  'aerial-and-adrenaline': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=800&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
  'tickets-and-culture': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
  'luxury-leisure': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
};

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { category: categorySlug, item: itemSlug } = use(params);
  const category = getExperienceCategory(categorySlug);
  const item = getExperienceItem(categorySlug, itemSlug);
  
  const profile = useAppStore((s) => s.profile);
  const session = useAppStore((s) => s.session);
  
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showTierComparison, setShowTierComparison] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showGroupBooking, setShowGroupBooking] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    included: true,
    requirements: false,
    highlights: true,
  });
  
  // Image fallback logic
  const fallbackImage = category ? CATEGORY_FALLBACK_IMAGES[category.slug] : '';
  const imageSrc = imgError ? fallbackImage : (item?.image || fallbackImage);
  
  const createBooking = useCreateExperienceBooking();
  
  // Check capacity for selected date/slot
  const { data: capacity, isLoading: capacityLoading } = useCheckCapacity(
    item?.slug || '',
    selectedDate ? new Date(selectedDate) : new Date(),
    selectedTimeSlot
  );
  
  const { data: availableSlots } = useAvailableSlots(
    item?.slug || '',
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const isSoldOut = capacity?.remaining === 0;
  const isFillingUp = capacity?.is_filling_up;

  const handleBook = async () => {
    if (!session?.user?.id || !selectedTier || !item) return;
    
    const totalPrice = selectedTier.price * guestCount;
    
    await createBooking.mutateAsync({
      service_id: item.slug,
      user_id: session.user.id,
      booking_date: selectedDate,
      time_slot: selectedTimeSlot,
      party_size: guestCount,
      tier: selectedTier.tier,
      unit_price: selectedTier.price,
      total_price: totalPrice,
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!category || !item) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
          <p className="text-gray-400 mb-6">Experience detail not found.</p>
          <Link href="/experiences" className="text-luxury-gold text-sm uppercase tracking-widest">
            Back to Experiences
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse item description for capacity/pricing info
  const itemPrice = item.description.match(/AED ([\d,]+)/)?.[1];
  const itemCapacity = item.description.match(/(\d+) passengers?|Up to (\d+) people/)?.[1] || item.description.match(/(\d+) guests?/)?.[1];

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <Link
          href={`/experiences/${category.slug}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {category.title}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column - Image & Details */}
          <div>
            {/* Hero Image */}
            <div className="border border-white/10 overflow-hidden bg-white/[0.02] mb-6">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={item.title} 
                  className="w-full h-[420px] object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-[420px] bg-white/5 flex items-center justify-center">
                  <ImageOff className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 p-4 text-center">
                <Clock className="w-5 h-5 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-white/40 uppercase">Duration</p>
                <p className="text-white text-sm font-medium">Varies</p>
              </div>
              <div className="bg-white/5 p-4 text-center">
                <Users className="w-5 h-5 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-white/40 uppercase">Capacity</p>
                <p className="text-white text-sm font-medium">{itemCapacity || 'Varies'}</p>
              </div>
              <div className="bg-white/5 p-4 text-center">
                <MapPin className="w-5 h-5 text-luxury-gold mx-auto mb-2" />
                <p className="text-xs text-white/40 uppercase">Location</p>
                <p className="text-white text-sm font-medium">Dubai</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-display text-white mb-3">About This Experience</h3>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3">
              {/* What's Included */}
              <div className="border border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('included')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-white font-medium">What's Included</span>
                  {expandedSections.included ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </button>
                {expandedSections.included && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                        Full experience access
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                        Professional guide/instructor
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                        All necessary equipment
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="border border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('requirements')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-white font-medium">Requirements</span>
                  {expandedSections.requirements ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </button>
                {expandedSections.requirements && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Info className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                        Valid ID required
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Info className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                        Comfortable clothing recommended
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-400">
                        <Info className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                        Advance booking required
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <ExperienceReviews experienceId={item.slug} />
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:sticky lg:top-28">
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <p className="text-luxury-gold text-xs uppercase tracking-[0.35em] mb-2">{category.title}</p>
              <h1 className="text-3xl font-display text-white mb-4">{item.title}</h1>
              
              {/* Price Display */}
              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                {itemPrice ? (
                  <>
                    <span className="text-3xl font-display text-luxury-gold">AED {itemPrice}</span>
                    <span className="text-white/40">starting price</span>
                  </>
                ) : (
                  <span className="text-xl text-white/60">Contact for pricing</span>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                  <Calendar className="w-3 h-3 inline mr-1" /> Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-luxury-gold/50 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>

              {/* Time Slots */}
              {selectedDate && availableSlots && availableSlots.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 inline mr-1" /> Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        disabled={!slot.available}
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                          selectedTimeSlot === slot.time
                            ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                            : slot.available
                              ? 'bg-white/5 text-white border-white/10 hover:border-luxury-gold/50'
                              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest Count */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-white/40 uppercase tracking-wider">
                    <UsersIcon className="w-3 h-3 inline mr-1" /> Guests
                  </label>
                  <button
                    onClick={() => setShowGroupBooking(!showGroupBooking)}
                    className="text-xs text-luxury-gold hover:text-white transition-colors"
                  >
                    Group booking?
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:border-luxury-gold/50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-8 text-center">{guestCount}</span>
                  <button
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:border-luxury-gold/50 transition-colors"
                  >
                    +
                  </button>
                </div>
                {showGroupBooking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg"
                  >
                    <p className="text-xs text-luxury-gold">
                      Groups of 6+ may qualify for special rates. Contact concierge for group pricing.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Capacity Warning */}
              {capacityLoading ? (
                <div className="mb-4 p-3 bg-white/5 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                  <span className="text-sm text-white/60">Checking availability...</span>
                </div>
              ) : isSoldOut ? (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Sold Out</span>
                </div>
              ) : isFillingUp ? (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-400">Filling up fast! Only {capacity?.remaining} spots left</span>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isSoldOut ? (
                  <button
                    onClick={() => setShowWaitlistModal(true)}
                    className="w-full py-3 px-6 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 font-semibold hover:bg-amber-500/30 transition-colors"
                  >
                    Join Waitlist
                  </button>
                ) : (
                  <button
                    onClick={handleBook}
                    disabled={!selectedDate || createBooking.isPending}
                    className="w-full py-3 px-6 rounded-lg bg-luxury-gold text-luxury-black font-semibold hover:bg-luxury-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createBooking.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </span>
                    ) : (
                      'Book Now'
                    )}
                  </button>
                )}

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowGiftModal(true)}
                    className="py-3 px-4 rounded-lg border border-white/10 text-white/70 text-sm hover:text-white hover:border-luxury-gold/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    Gift
                  </button>
                  <button
                    onClick={() => setShowTierComparison(true)}
                    className="py-3 px-4 rounded-lg border border-white/10 text-white/70 text-sm hover:text-white hover:border-luxury-gold/50 transition-colors"
                  >
                    Compare Tiers
                  </button>
                </div>
              </div>

              {/* Concierge Link */}
              <Link
                href="/request"
                className="block mt-4 text-center text-sm text-white/40 hover:text-luxury-gold transition-colors"
              >
                Questions? Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        experience={{ id: item.slug, name: item.title } as any}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
      />

      <TierComparisonModal
        isOpen={showTierComparison}
        onClose={() => setShowTierComparison(false)}
        tiers={[{ tier: 'Standard', price: 300, includes: ['Basic access'] }, { tier: 'Premium', price: 500, includes: ['Premium access', 'Extras'] }, { tier: 'VIP', price: 1000, includes: ['VIP access', 'All extras'] }]}
        experienceName={item.title}
      />

      <GiftExperienceModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        experience={{ id: item.slug, name: item.title, slug: item.slug } as any}
        selectedTier={selectedTier}
      />

      <Footer />
    </div>
  );
}
