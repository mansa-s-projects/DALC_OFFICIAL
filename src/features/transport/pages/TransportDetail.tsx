import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Anchor,
  Plane,
  Calendar,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import SpecTable from '../../../components/transport/SpecTable';
import BookingForm from '../../../components/transport/BookingForm';
import ServiceCard from '../../../components/transport/ServiceCard';
import { useTransportService, useFeaturedTransport } from '../hooks/useTransport';
import { useCreateTransportBooking } from '../hooks/useTransportBooking';
import { useAppStore } from '../../../store/useAppStore';
import type { TransportSubcategory } from '../types';
import { SUBCATEGORY_LABELS, PRICING_MODEL_LABELS } from '../types';

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TransportDetail() {
  const { subcategory, slug } = useParams<{ subcategory: string; slug: string }>();
  const navigate = useNavigate();
  const session = useAppStore((s) => s.session);

  const { data: service, isLoading, error } = useTransportService(slug);
  const createBooking = useCreateTransportBooking();
  const { data: similarServices = [] } = useFeaturedTransport(service?.subcategory);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const sub = subcategory as TransportSubcategory;

  const handleBookingSubmit = async (data: any) => {
    if (!session?.user) {
      navigate('/login');
      return;
    }
    
    try {
      await createBooking.mutateAsync(data);
      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  // Filter out current service from similar
  const relatedServices = similarServices
    .filter((s) => s.id !== service?.id)
    .slice(0, 3);

  // Gallery images
  const galleryImages = service?.hero_image 
    ? [service.hero_image, ...(service.gallery_images || [])]
    : service?.gallery_images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-full max-w-4xl px-8">
            <div className="h-96 bg-white/5 animate-pulse" />
            <div className="h-8 bg-white/5 animate-pulse w-2/3" />
            <div className="h-4 bg-white/5 animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="min-h-screen bg-luxury-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Service not found.</p>
          <Link
            to={`/transport/${subcategory}`}
            className="text-luxury-gold text-sm underline"
          >
            Back to {SUBCATEGORY_LABELS[sub as TransportSubcategory]}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get subcategory icon
  const getSubcategoryIcon = () => {
    switch (service.subcategory) {
      case 'cars':
        return <Gauge className="w-4 h-4" />;
      case 'yachts':
        return <Anchor className="w-4 h-4" />;
      case 'jets':
        return <Plane className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Hero Gallery ───────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {galleryImages.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={galleryImages[currentImageIndex]}
              alt={service.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-luxury-black/20" />

        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 border border-white/30 text-white/70 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 border border-white/30 text-white/70 hover:text-luxury-gold hover:border-luxury-gold/50 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'bg-luxury-gold w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-24 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto z-10">
          <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
            <Link to="/transport" className="hover:text-luxury-gold transition-colors">
              Transport
            </Link>
            <span>/</span>
            <Link
              to={`/transport/${service.subcategory}`}
              className="hover:text-luxury-gold transition-colors"
            >
              {SUBCATEGORY_LABELS[service.subcategory]}
            </Link>
            <span>/</span>
            <span className="text-luxury-gold truncate max-w-[200px]">{service.name}</span>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 max-w-7xl mx-auto pb-10 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 bg-luxury-black/80 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                {getSubcategoryIcon()}
                {SUBCATEGORY_LABELS[service.subcategory]}
              </span>
              {service.sub_subcategory && (
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
                  {service.sub_subcategory.replace(/-/g, ' ')}
                </span>
              )}
              {service.is_featured && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-[10px] font-bold uppercase tracking-widest">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              {service.is_trending && (
                <span className="px-3 py-1.5 bg-white/10 border border-white/20 text-gray-300 text-[10px] uppercase tracking-widest">
                  Trending
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-display text-white mb-3 leading-tight">
              {service.name}
            </h1>
            
            {service.description_short && (
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                {service.description_short}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Left / Main Column ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          {service.description_long && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-display text-white mb-4">Overview</h2>
              <p className="text-gray-400 leading-relaxed text-base">
                {service.description_long}
              </p>
            </motion.section>
          )}

          {/* Key Info Tiles */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <Clock className="w-5 h-5 text-luxury-gold mb-3" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Min. Booking
              </p>
              <p className="text-white text-sm font-medium">
                {service.min_booking_hours} hour{service.min_booking_hours > 1 ? 's' : ''}
              </p>
            </div>
            
            {service.max_capacity && (
              <div className="border border-white/10 p-5 bg-white/[0.02]">
                <Users className="w-5 h-5 text-luxury-gold mb-3" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  Capacity
                </p>
                <p className="text-white text-sm font-medium">
                  {service.max_capacity} {service.subcategory === 'yachts' ? 'guests' : 'seats'}
                </p>
              </div>
            )}
            
            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <MapPin className="w-5 h-5 text-luxury-gold mb-3" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-white text-sm font-medium">
                {service.area || service.location}
              </p>
            </div>
            
            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <Calendar className="w-5 h-5 text-luxury-gold mb-3" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Availability
              </p>
              <p className="text-white text-sm font-medium capitalize">
                {service.availability_type.replace(/-/g, ' ')}
              </p>
            </div>
          </section>

          {/* Highlights */}
          {service.highlights && service.highlights.length > 0 && (
            <section>
              <h2 className="text-2xl font-display text-white mb-6">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Specifications */}
          <SpecTable service={service} />

          {/* Pickup Locations */}
          {service.pickup_locations && service.pickup_locations.length > 0 && (
            <section>
              <h2 className="text-2xl font-display text-white mb-6">Pickup Locations</h2>
              <div className="flex flex-wrap gap-2">
                {service.pickup_locations.map((loc) => (
                  <span
                    key={loc}
                    className="px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 inline mr-2 text-luxury-gold/70" />
                    {loc}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right / Sticky Sidebar ───────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Booking Card */}
            <div className="border border-luxury-gold/20 bg-white/[0.02] p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-white font-display text-xl mb-2">Request Received</h3>
                  <p className="text-gray-400 text-sm">
                    We\'ll confirm your booking within 2 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">
                      {PRICING_MODEL_LABELS[service.pricing_model]}
                    </p>
                    <p className="text-luxury-gold font-display text-3xl font-bold">
                      {service.price_display || `AED ${service.price_from?.toLocaleString()}`}
                    </p>
                    {service.pricing_model === 'hourly' && (
                      <p className="text-gray-500 text-xs mt-1">per hour</p>
                    )}
                  </div>

                  <BookingForm
                    service={service}
                    userId={session?.user?.id || ''}
                    onSubmit={handleBookingSubmit}
                    isSubmitting={createBooking.isPending}
                    submitSuccess={bookingSuccess}
                  />
                </>
              )}
            </div>

            {/* Quick Info */}
            <div className="border border-white/10 p-5 space-y-3 bg-white/[0.02]">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                Quick Info
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Currency</span>
                <span className="text-gray-200">{service.price_currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Advance Booking</span>
                <span className="text-gray-200">{service.advance_booking_hours} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available Days</span>
                <span className="text-gray-200">{service.available_days.length}/7</span>
              </div>
            </div>

            {/* Back Link */}
            <Link
              to={`/transport/${service.subcategory}`}
              className="flex items-center gap-2 text-gray-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {SUBCATEGORY_LABELS[service.subcategory]}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Similar Services ───────────────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
              You May Also Like
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-white">
              Similar {SUBCATEGORY_LABELS[service.subcategory]}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((related, idx) => (
              <ServiceCard key={related.id} service={related} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="border border-luxury-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2">
              Questions?
            </p>
            <h3 className="text-white font-display text-xl md:text-2xl">
              Our transport concierge is here to help
            </h3>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
