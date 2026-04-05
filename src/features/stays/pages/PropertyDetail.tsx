import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Users,
  Bed,
  Bath,
  Maximize,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Hotel,
  Building2,
  Calendar,
  Heart,
  Share2,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import AmenityList from '../../../components/stays/AmenityList';
import AvailabilityCalendar from '../../../components/stays/AvailabilityCalendar';
import PriceCalculator from '../../../components/stays/PriceCalculator';
import { useProperty } from '../hooks/useStays';
import { SUBCATEGORY_LABELS } from '../types';

const SUBCATEGORY_ICONS = {
  hotels: <Hotel className="w-4 h-4" />,
  villas: <Home className="w-4 h-4" />,
  residences: <Building2 className="w-4 h-4" />,
};

export default function PropertyDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: property, isLoading, error } = useProperty(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="h-96 bg-white/5 animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-white/5 animate-pulse w-2/3" />
              <div className="h-4 bg-white/5 animate-pulse w-1/2" />
              <div className="h-32 bg-white/5 animate-pulse" />
            </div>
            <div className="h-64 bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto text-center py-20">
          <h2 className="text-2xl font-display text-white mb-4">Property Not Found</h2>
          <p className="text-gray-400 mb-8">The property you're looking for doesn't exist.</p>
          <Link 
            href="/travel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Travel
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [property.hero_image, ...property.gallery_images].filter(Boolean);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Breadcrumb & Actions ────────────────────────────────────────────── */}
      <div className="pt-24 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/travel" className="text-gray-400 hover:text-luxury-gold transition-colors">
              Travel
            </Link>
            <span className="text-gray-600">/</span>
            <Link 
              href={`/travel/${property.subcategory}`}
              className="text-gray-400 hover:text-luxury-gold transition-colors"
            >
              {SUBCATEGORY_LABELS[property.subcategory]}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-luxury-gold">{property.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-luxury-gold transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-luxury-gold transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Gallery ───────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
          {/* Main Image */}
          <div className="relative h-full overflow-hidden group">
            <img
              src={allImages[selectedImage]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-luxury-gold hover:text-luxury-black transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-luxury-gold hover:text-luxury-black transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm">
              {selectedImage + 1} / {allImages.length}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 h-full">
            {allImages.slice(1, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx + 1)}
                className="relative h-full overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`${property.name} ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                {idx === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-display text-xl">+{allImages.length - 5}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Grid ────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/20 text-luxury-gold text-xs font-bold uppercase tracking-widest">
                  {SUBCATEGORY_ICONS[property.subcategory]}
                  {SUBCATEGORY_LABELS[property.subcategory]}
                </span>
                {property.star_rating && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white text-xs">
                    <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
                    {property.star_rating} Star
                  </span>
                )}
                {property.instant_booking && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs">
                    <Check className="w-3 h-3" />
                    Instant Book
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-display text-white mb-3">
                {property.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-luxury-gold" />
                <span>{property.area}, {property.location}</span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10">
                <Users className="w-5 h-5 text-luxury-gold" />
                <div>
                  <p className="text-white font-bold">{property.max_guests}</p>
                  <p className="text-gray-500 text-xs uppercase">Guests</p>
                </div>
              </div>
              {property.bedrooms !== undefined && (
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10">
                  <Bed className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="text-white font-bold">{property.bedrooms}</p>
                    <p className="text-gray-500 text-xs uppercase">Bedrooms</p>
                  </div>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10">
                  <Bath className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="text-white font-bold">{property.bathrooms}</p>
                    <p className="text-gray-500 text-xs uppercase">Bathrooms</p>
                  </div>
                </div>
              )}
              {property.square_meters && (
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10">
                  <Maximize className="w-5 h-5 text-luxury-gold" />
                  <div>
                    <p className="text-white font-bold">{property.square_meters}</p>
                    <p className="text-gray-500 text-xs uppercase">m²</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h2 className="text-xl font-display text-white mb-4">About this property</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description_long || property.description_short}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8 pb-8 border-b border-white/10">
              <h2 className="text-xl font-display text-white mb-4">Amenities</h2>
              <AmenityList amenities={property.amenities} />
            </div>

            {/* Availability Calendar */}
            <div className="mb-8">
              <h2 className="text-xl font-display text-white mb-4">Availability</h2>
              <AvailabilityCalendar 
                propertyId={property.id} 
                seasonalPricing={property.seasonal_pricing}
              />
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PriceCalculator property={property} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
