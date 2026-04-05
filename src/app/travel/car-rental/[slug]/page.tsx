'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Users, Fuel, Calendar, MessageCircle } from 'lucide-react';
import Navbar from '../../../../components/navigation/Navbar';
import Footer from '../../../../components/navigation/Footer';
import {
  getAllCars,
  getCarImage,
  getCarWhatsAppUrl,
} from '../../../../data/transport/carsData';

// ─── Component ────────────────────────────────────────────────────────────────

export default function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const car = getAllCars().find((c) => c.id === slug);

  if (!car) {
    notFound();
  }

  const image = getCarImage(car.id, car.categoryId);
  const whatsappUrl = getCarWhatsAppUrl(car.brand, car.model, car.year);

  const specs = [
    { icon: <Calendar className="w-4 h-4" />, label: 'Year', value: String(car.year) },
    { icon: <Fuel className="w-4 h-4" />, label: 'Fuel', value: car.fuel },
    ...(car.seats ? [{ icon: <Users className="w-4 h-4" />, label: 'Seats', value: `${car.seats} passengers` }] : []),
    ...(car.fuel === 'Electric' ? [{ icon: <Zap className="w-4 h-4" />, label: 'Type', value: 'Electric Vehicle' }] : []),
  ];

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-24">
        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-10">
          <Link href="/travel" className="hover:text-luxury-gold transition-colors">Travel</Link>
          <span>/</span>
          <Link href="/travel/car-rental" className="hover:text-luxury-gold transition-colors">Car Rental</Link>
          <span>/</span>
          <span className="text-luxury-gold">{car.brand} {car.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ── Image ───────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden border border-white/10"
          >
            <img
              src={image}
              alt={`${car.brand} ${car.model} ${car.year}`}
              className="w-full h-80 lg:h-96 object-cover"
            />
            {car.popular && (
              <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                Popular
              </span>
            )}
            {car.isNew && (
              <span className="absolute top-4 left-4 bg-white text-luxury-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                New
              </span>
            )}
          </motion.div>

          {/* ── Details ─────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.4em] mb-3">
              Car Rental
            </p>
            <h1 className="text-3xl md:text-4xl font-display text-white mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-gray-500 text-sm mb-8">{car.year} Model</p>

            {/* Price */}
            <div className="border border-luxury-gold/20 bg-luxury-gold/5 p-5 mb-8">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Daily Rate</p>
              <p className="text-luxury-gold font-display text-4xl font-bold">
                {car.dailyPrice} <span className="text-xl font-normal">AED</span>
              </p>
              <p className="text-gray-600 text-xs mt-1">Per day · Insurance included</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {specs.map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 border border-white/10 px-4 py-3 bg-white/[0.02]">
                  <span className="text-luxury-gold">{icon}</span>
                  <div>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                Book via WhatsApp
              </a>
              <Link
                href="/request"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-luxury-gold/40 text-luxury-gold text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/10 transition-all duration-300"
              >
                Request via Concierge
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/travel/car-rental"
            className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-luxury-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Car Rental
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
