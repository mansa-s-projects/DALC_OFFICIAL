"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVenue } from "../hooks/useVenue";
import { useVenues } from "../hooks/useVenues";
import { useRequests } from "../../../hooks/useRequests";
import { useAppStore } from "../../../store/useAppStore";
import Navbar from "../../../components/navigation/Navbar";
import {
  getVenueCategoryHref,
  getVenueRecommendations,
} from "../lib/venueDiscovery";
import {
  MapPin,
  Clock,
  Check,
  ArrowLeft,
  ShieldAlert,
  Calendar,
  Shirt,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Users,
  ArrowDown,
  BookOpen,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import Footer from "../../../components/navigation/Footer";
import PremiumMap from "../../../components/map/PremiumMap";
import VenueCard from "../../../components/cards/VenueCard";
import { motion, AnimatePresence } from "motion/react";
import {
  getVenueMenuImage,
  getVenueBlogPath,
} from "../../../data/venues/venueImages";
import VenueFAQ from "../components/VenueFAQ";

export default function VenueDetail() {
  const params = useParams();
  const id = (params?.slug ?? params?.id) as string;
  const router = useRouter();
  const { data: venue, isLoading } = useVenue(id);
  const { data: allVenues = [] } = useVenues();
  const session = useAppStore((s) => s.session);
  const profileSkills = useAppStore(
    (s) => s.profile?.skills ?? s.user?.skills ?? [],
  );
  const { createRequest } = useRequests(session?.user?.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    guests: "2",
    name: "",
    contact: "",
    notes: "",
  });

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Reset booking form when modal closes
  useEffect(() => {
    if (!isBookingModalOpen) {
      const timer = setTimeout(() => {
        setBookingStep(1);
        setBookingForm({
          date: "",
          guests: "2",
          name: "",
          contact: "",
          notes: "",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isBookingModalOpen]);

  const allImages = venue
    ? [venue.hero_image, ...(venue.gallery_images || [])].filter(Boolean)
    : [];

  // Similar Venues
  const similarVenues = venue
    ? getVenueRecommendations(venue, allVenues, profileSkills, 4)
    : [];

  // Hero Carousel Navigation
  const nextHeroImage = useCallback(() => {
    setCurrentHeroIndex((prev) => (prev + 1) % Math.max(allImages.length, 1));
  }, [allImages.length]);

  const prevHeroImage = useCallback(() => {
    setCurrentHeroIndex(
      (prev) => (prev - 1 + allImages.length) % Math.max(allImages.length, 1),
    );
  }, [allImages.length]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(nextHeroImage, 6000);
    return () => clearInterval(timer);
  }, [nextHeroImage, allImages.length]);

  // Lightbox Navigation
  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedImageIndex !== null) {
        setSelectedImageIndex((selectedImageIndex + 1) % allImages.length);
      }
    },
    [selectedImageIndex, allImages.length],
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedImageIndex !== null) {
        setSelectedImageIndex(
          (selectedImageIndex - 1 + allImages.length) % allImages.length,
        );
      }
    },
    [selectedImageIndex, allImages.length],
  );

  const scrollToInsiderView = () => {
    const element = document.getElementById("insider-view");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMenuOpen) setIsMenuOpen(false);
        if (selectedImageIndex !== null) setSelectedImageIndex(null);
        return;
      }
      if (selectedImageIndex === null) return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  // Handle booking submission — creates a real request
  const handleBookingSubmit = async () => {
    if (!venue) return;

    try {
      await createRequest.mutateAsync({
        venue_id: venue.id,
        venue_name: venue.name,
        category: venue.category,
        request_type: "booking",
        date_time: `${bookingForm.date}T20:00:00`,
        party_size:
          bookingForm.guests === "large" ? 20 : Number(bookingForm.guests) || 2,
        contact_name: bookingForm.name,
        contact_info: bookingForm.contact,
        notes: bookingForm.notes || undefined,
      });
      setBookingStep(3);
    } catch {
      // Stay on step 2, user can retry
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="h-[80vh] bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!venue)
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-display">Venue not found</h2>
          <Link
            href="/explore"
            className="text-luxury-gold mt-4 block hover:underline"
          >
            Return to Explore
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* Hero Carousel */}
      <div className="relative h-[80vh] w-full overflow-hidden group">
        <AnimatePresence mode="popLayout">
          {allImages.length > 0 && (
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={allImages[currentHeroIndex]}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevHeroImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 text-white/30 hover:text-white hover:bg-black/20 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-sm"
        >
          <ChevronLeft className="w-10 h-10" strokeWidth={1} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            nextHeroImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 text-white/30 hover:text-white hover:bg-black/20 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block backdrop-blur-sm"
        >
          <ChevronRight className="w-10 h-10" strokeWidth={1} />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-2 hidden md:flex">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroIndex(i)}
              className={`h-0.5 transition-all duration-500 ${i === currentHeroIndex ? "w-8 bg-luxury-gold" : "w-4 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-7xl mx-auto z-10">
          <Link
            href={getVenueCategoryHref(venue.category)}
            className="flex items-center gap-2 text-white/60 hover:text-luxury-gold mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-luxury-gold/90 text-black text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                  {venue.category.replace("-", " ")}
                </span>
                {venue.cuisine && (
                  <span className="border border-white/30 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm backdrop-blur-md">
                    {venue.cuisine}
                  </span>
                )}
              </div>

              <h1 className="text-6xl md:text-8xl font-display text-white mb-6 leading-tight tracking-tight">
                {venue.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base font-light">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  {venue.location}, {venue.area}
                </div>
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                <div className="flex gap-1 text-luxury-gold">
                  {"$$$$".slice(0, venue.price_tier)}
                  <span className="text-gray-600">
                    {"$$$$".slice(venue.price_tier)}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={scrollToInsiderView}
                className="px-8 py-5 border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 text-sm group"
              >
                View Insider Guide{" "}
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-12 py-5 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 hover:shadow-aura-strong shadow-aura flex items-center justify-center gap-3 text-sm w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4" /> Request Table
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content (Left) */}
        <div className="lg:col-span-7 space-y-20">
          {/* Editorial Description */}
          <motion.section
            id="insider-view"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none scroll-mt-32"
          >
            <h2 className="text-3xl font-display text-white mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-luxury-gold"></span>
              Insider View
            </h2>
            <p className="text-gray-300 leading-relaxed text-xl font-light tracking-wide first-letter:text-5xl first-letter:font-display first-letter:text-luxury-gold first-letter:mr-2 first-letter:float-left">
              {venue.description_long}
            </p>
          </motion.section>

          {/* Booking Intelligence */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-sm"
          >
            <h3 className="text-xl font-display text-white mb-8">
              Booking Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">
                    Best Time to Go
                  </h4>
                  <p className="text-white">
                    {venue.best_time || "Dinner Service (8:00 PM)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">
                    Perfect For
                  </h4>
                  <p className="text-white">
                    {venue.who_its_for || "Special Occasions & Couples"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0">
                  <Shirt className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">
                    Dress Code
                  </h4>
                  <p className="text-white">{venue.dress_code}</p>
                </div>
              </div>

              {venue.insider_tip && (
                <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-white/5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center shrink-0 animate-pulse">
                      <Sparkles className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-luxury-gold mb-1 tracking-wider">
                        Concierge Tip
                      </h4>
                      <p className="text-white italic font-light">
                        "{venue.insider_tip}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Highlights Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-display text-white mb-6">
              Signature Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venue.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 border border-white/5 rounded-sm bg-luxury-charcoal hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="w-1 h-8 bg-luxury-gold/20 group-hover:bg-luxury-gold transition-colors" />
                  <span className="text-gray-200 font-medium tracking-wide">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Similar Venues Section */}
          {similarVenues.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-t border-white/5 pt-12"
            >
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-luxury-gold/70">
                    DALC Matchmaking
                  </p>
                  <h2 className="text-xl font-display text-white">
                    Recommended Next Stops
                  </h2>
                </div>
                <p className="max-w-md text-right text-sm text-white/45">
                  Ranked by scene, area, spend, vibe overlap, and your profile
                  preferences.
                </p>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                {similarVenues.map(
                  ({ venue: similar, matchScore, matchExplanation }) => (
                    <div
                      key={similar.id}
                      className="min-w-[280px] w-[280px] snap-center"
                    >
                      <VenueCard
                        venue={similar}
                        matchScore={matchScore}
                        matchExplanation={matchExplanation}
                      />
                    </div>
                  ),
                )}
              </div>
            </motion.section>
          )}

          {/* Menu Image */}
          {venue && getVenueMenuImage(venue.id) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-sm"
            >
              <h2 className="text-xl font-display text-white mb-6 flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-luxury-gold" />
                Menu
              </h2>
              <div
                className="relative overflow-hidden rounded-sm border border-white/10 group cursor-pointer"
                onClick={() => setIsMenuOpen(true)}
              >
                <img
                  src={getVenueMenuImage(venue.id)}
                  alt={`${venue.name} menu preview`}
                  className="w-full h-auto object-contain bg-white/5 transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {/* Always-visible expand button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                  <div className="p-4 rounded-full bg-black/50 backdrop-blur-md border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all duration-300 shadow-lg shadow-luxury-gold/10 group-hover:scale-110">
                    <Maximize2 className="w-7 h-7" />
                  </div>
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest text-center">
                    Tap to expand
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Menu 3D Lightbox Modal */}
          <AnimatePresence>
            {isMenuOpen && venue && getVenueMenuImage(venue.id) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                onClick={() => setIsMenuOpen(false)}
                style={{ perspective: "1200px" }}
              >
                {/* Close button */}
                <button
                  className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-6 left-6 z-20"
                >
                  <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-1">
                    <UtensilsCrossed className="w-3 h-3 inline mr-2" />
                    {venue.name}
                  </p>
                  <h3 className="text-white text-xl font-display">Menu</h3>
                </motion.div>

                {/* 3D Card */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                    rotateX: 25,
                    rotateY: -10,
                  }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotateX: -15, rotateY: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="relative max-w-4xl max-h-[85vh] overflow-auto rounded-sm border border-white/20 shadow-2xl shadow-luxury-gold/5"
                  onClick={(e) => e.stopPropagation()}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src={getVenueMenuImage(venue.id)}
                    alt={`${venue.name} full menu`}
                    className="w-full h-auto object-contain bg-[#0a0a0a]"
                  />
                </motion.div>

                {/* Bottom hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs tracking-widest uppercase"
                >
                  Click anywhere to close
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insider Blog */}
          {venue && getVenueBlogPath(venue.id) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-display text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-luxury-gold" />
                Insider Guide
              </h2>
              <div className="rounded-sm overflow-hidden border border-white/10">
                <iframe
                  src={getVenueBlogPath(venue.id)}
                  title={`${venue.name} Guide`}
                  className="w-full border-0 bg-white rounded-sm"
                  style={{ minHeight: "600px" }}
                  loading="lazy"
                />
              </div>
            </motion.section>
          )}

          {/* Gallery - Masonry Layout */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-display text-white mb-6">
              Visual Journey
            </h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className="relative break-inside-avoid mb-4 overflow-hidden rounded-sm cursor-pointer group border border-white/5 hover:border-luxury-gold/50 transition-colors"
                >
                  <img
                    src={img}
                    alt={`${venue.name} gallery image ${i + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Maximize2 className="text-white w-8 h-8 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
              ))}
              {allImages.length === 0 && (
                <div className="h-40 bg-white/5 rounded-sm flex items-center justify-center text-gray-500">
                  No additional images
                </div>
              )}
            </div>
          </motion.section>

          {/* FAQ Section */}
          <VenueFAQ venue={venue} onBook={() => setIsBookingModalOpen(true)} />
        </div>

        {/* Sidebar (Right) - Sticky */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 space-y-8"
        >
          {/* Map Card */}
          <div className="sticky top-24 space-y-8">
            <div className="glass-panel rounded-sm border border-white/10 overflow-hidden shadow-2xl">
              <PremiumMap venue={venue} />
            </div>

            {/* Quick Actions Card */}
            <div className="glass-panel p-8 rounded-sm border border-white/10 bg-luxury-black/50 backdrop-blur-xl">
              <h3 className="text-xl font-display text-white mb-6">
                Reservation Details
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                  <span className="text-gray-400">Opening Hours</span>
                  <span className="text-white text-right max-w-[50%]">
                    {venue.opening_hours}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                  <span className="text-gray-400">Cancellation</span>
                  <span className="text-white text-right max-w-[50%]">
                    24h Notice Required
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pb-2">
                  <span className="text-gray-400">Deposit</span>
                  <span className="text-white text-right">
                    Required for 6+ guests
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="block w-full py-4 bg-white text-black hover:bg-luxury-gold uppercase text-xs font-bold tracking-widest transition-all duration-300 shadow-lg"
                >
                  Check Availability
                </button>
                <p className="text-[10px] text-gray-500 text-center mt-4">
                  <ShieldAlert className="w-3 h-3 inline mr-1" />
                  Concierge Guarantee applies to all bookings
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-luxury-black/95 backdrop-blur-md border-t border-white/10">
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="w-full py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Calendar className="w-4 h-4" />
          Reserve at {venue.name}
        </button>
      </div>

      <Footer />

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0"
              onClick={() => setIsBookingModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white/5 p-6 flex justify-between items-center border-b border-white/5">
                <div>
                  <h3 className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-1">
                    Reservation Request
                  </h3>
                  <h2 className="text-xl font-display text-white">
                    {venue.name}
                  </h2>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                {bookingStep === 1 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBookingStep(2);
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors"
                          value={bookingForm.date}
                          onChange={(e) =>
                            setBookingForm({
                              ...bookingForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                          Guests
                        </label>
                        <select
                          className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors"
                          value={bookingForm.guests}
                          onChange={(e) =>
                            setBookingForm({
                              ...bookingForm,
                              guests: e.target.value,
                            })
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                            <option key={n} value={n}>
                              {n} Guests
                            </option>
                          ))}
                          <option value="large">Large Group (15+)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/20 rounded-sm flex gap-3 items-start">
                      <ShieldAlert className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-400 leading-relaxed">
                        <span className="text-luxury-gold font-bold block mb-1">
                          Concierge Guarantee
                        </span>
                        Your request will be prioritized. Availability is
                        subject to venue confirmation within 30 minutes.
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Continue
                    </button>
                  </form>
                )}

                {bookingStep === 2 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleBookingSubmit();
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors"
                        value={bookingForm.name}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                        Contact (WhatsApp / Email)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+971..."
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors"
                        value={bookingForm.contact}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        placeholder="Occasion, dietary restrictions, seating preference..."
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-luxury-gold outline-none transition-colors h-24 resize-none"
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="flex-1 py-4 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={createRequest.isPending}
                        className="flex-[2] py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
                      >
                        {createRequest.isPending
                          ? "Submitting..."
                          : "Confirm Request"}
                      </button>
                    </div>
                  </form>
                )}

                {bookingStep === 3 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-luxury-gold" />
                    </div>
                    <h3 className="text-2xl font-display text-white mb-2">
                      Request Sent
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                      Our concierge team has received your request for{" "}
                      <strong>{venue.name}</strong>. We will contact you shortly
                      to confirm your table.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setIsBookingModalOpen(false)}
                        className="px-6 py-3 bg-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-colors text-xs"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => router.push("/my-requests")}
                        className="px-6 py-3 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors text-xs"
                      >
                        View My Requests
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar for steps 1 & 2 */}
              {bookingStep < 3 && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-luxury-gold transition-all duration-300"
                  style={{ width: bookingStep === 1 ? "50%" : "100%" }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-10 h-10" />
            </button>
            <button
              className="absolute left-4 md:left-8 text-white/50 hover:text-luxury-gold transition-colors p-4 rounded-full hover:bg-white/5 z-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={allImages[selectedImageIndex]}
              alt="Enlarged view"
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-sm shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-8 text-white/50 hover:text-luxury-gold transition-colors p-4 rounded-full hover:bg-white/5 z-10"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm tracking-widest uppercase">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
