"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  Check,
  Shield,
  Loader2,
} from "lucide-react";
import Footer from "@/components/navigation/Footer";
import hotelsData from "@/data/travel/hotels/hotels.json";
import type { Hotel } from "@/features/travel/types";

const HOTELS = hotelsData as Hotel[];

const ROOM_TYPES = [
  { id: "deluxe", name: "Deluxe Room", base_price: 0 },
  { id: "suite", name: "Suite", base_price: 800 },
  { id: "presidential", name: "Presidential Suite", base_price: 2500 },
];

interface GuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export default function HotelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = params.id as string;
  const roomType = searchParams.get("room") || "deluxe";
  const guests = Number(searchParams.get("guests") || 2);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const hotel = useMemo(() => HOTELS.find((h) => h.id === hotelId), [hotelId]);
  const room = ROOM_TYPES.find((r) => r.id === roomType) || ROOM_TYPES[0];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const [form, setForm] = useState<GuestForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Partial<GuestForm>>({});

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const subtotal = ((hotel?.price_from || 0) + room.base_price) * nights;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  const validateForm = () => {
    const newErrors: Partial<GuestForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setBookingError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          room_type: room.id,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          guest: form,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          booking_id?: string;
          total_price?: number;
        };
        setBookingId(data.booking_id || `HTL-${Date.now()}`);
        setSubmittedTotal(
          typeof data.total_price === "number" ? data.total_price : total,
        );
        setBookingComplete(true);
      } else {
        const errorBody = await response.json().catch(() => null);
        setBookingError(
          errorBody?.error ||
            "Booking could not be completed. Please try again.",
        );
      }
    } catch {
      setBookingError("Booking could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display text-white mb-4">
            Hotel Not Found
          </h1>
          <Link
            href="/travel/hotels"
            className="text-luxury-gold hover:underline"
          >
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <div className="pt-32 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-luxury-gold" />
            </div>
            <h1 className="text-3xl font-display text-white mb-2">
              Booking Request Received
            </h1>
            <p className="text-gray-400 mb-6">
              Our concierge team will verify availability and contact you before
              any payment is collected.
            </p>

            <div className="bg-white/5 border border-white/10 p-6 text-left mb-8">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <span className="text-gray-500 text-sm">Booking ID</span>
                <span className="text-luxury-gold font-mono text-lg">
                  {bookingId}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hotel</span>
                  <span className="text-white">{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room</span>
                  <span className="text-white">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in</span>
                  <span className="text-white">{checkIn || "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out</span>
                  <span className="text-white">{checkOut || "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="text-white">{guests}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="text-white font-bold">Estimated Total</span>
                  <span className="text-luxury-gold font-bold">
                    AED {(submittedTotal ?? total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-6">
              This request is pending. It is not a confirmed reservation and no
              payment has been taken.
            </p>

            <Link
              href="/travel/hotels"
              className="inline-flex items-center gap-2 text-luxury-gold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Browse More Hotels
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/travel/hotels/${hotelId}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-luxury-gold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hotel
          </Link>

          <h1 className="text-3xl font-display text-white mb-8">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#0f0d0a] border border-white/15 p-6">
                  <h2 className="text-xl font-display text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-luxury-gold" /> Guest Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        className={`w-full bg-white/5 border ${errors.firstName ? "border-red-500" : "border-white/15"} px-4 py-3 text-white outline-none focus:border-luxury-gold/50`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        className={`w-full bg-white/5 border ${errors.lastName ? "border-red-500" : "border-white/15"} px-4 py-3 text-white outline-none focus:border-luxury-gold/50`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={`w-full bg-white/5 border pl-12 ${errors.email ? "border-red-500" : "border-white/15"} px-4 py-3 text-white outline-none focus:border-luxury-gold/50`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className={`w-full bg-white/5 border pl-12 ${errors.phone ? "border-red-500" : "border-white/15"} px-4 py-3 text-white outline-none focus:border-luxury-gold/50`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={form.specialRequests}
                      onChange={(e) =>
                        setForm({ ...form, specialRequests: e.target.value })
                      }
                      rows={3}
                      placeholder="Any dietary requirements, early check-in, etc."
                      className="w-full bg-white/5 border border-white/15 px-4 py-3 text-white outline-none focus:border-luxury-gold/50 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-luxury-gold text-luxury-black py-4 font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Request Booking <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#0f0d0a] border border-white/15 p-6">
                <h3 className="text-white font-display text-lg mb-4">
                  Booking Summary
                </h3>

                <div className="flex gap-4 pb-4 border-b border-white/10">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={80}
                    height={64}
                    className="w-20 h-16 object-cover"
                  />
                  <div>
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {hotel.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {hotel.city}, {hotel.country}
                    </p>
                  </div>
                </div>

                <div className="py-4 border-b border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room</span>
                    <span className="text-white">{room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dates</span>
                    <span className="text-white">
                      {nights} night{nights > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="text-white">{guests}</span>
                  </div>
                </div>

                <div className="py-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base price</span>
                    <span className="text-white">
                      AED {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxes & fees (10%)</span>
                    <span className="text-white">
                      AED {taxes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-luxury-gold font-bold">
                      AED {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>No payment is taken until availability is verified</span>
                </div>
              </div>

                  {bookingError && (
                    <p className="mt-4 text-sm text-red-400">{bookingError}</p>
                  )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
