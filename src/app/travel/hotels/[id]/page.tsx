"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import hotelsData from "@/data/travel/hotels/hotels.json";
import type { Hotel } from "@/features/travel/types";

const HOTELS = hotelsData as Hotel[];

const ROOM_TYPES = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    base_price: 0,
    beds: "King/Twin",
    max_guests: 2,
    size: "45m²",
  },
  {
    id: "suite",
    name: "Suite",
    base_price: 800,
    beds: "King",
    max_guests: 3,
    size: "75m²",
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    base_price: 2500,
    beds: "King",
    max_guests: 4,
    size: "200m²",
  },
];

const AMENITY_ICONS: Record<string, string> = {
  "Private Beach": "🏖️",
  "Infinity Pool": "🏊",
  Helipad: "🚁",
  "Butler Service": "👔",
  Spa: "💆",
  "9 Restaurants": "🍽️",
  "Aquaventure Waterpark": "🎢",
  "Multiple Pools": "🏊",
  "23 Restaurants & Bars": "🍸",
  Aquarium: "🐠",
  "1km Private Beach": "🏖️",
  "6 Pools": "🏊",
  "Tennis Courts": "🎾",
  "Water Sports": "🏄",
  "Burj Khalifa Views": "🏙️",
  "Signature Restaurant": "⭐",
  Concierge: "🛎️",
  "Shopping Access": "🛍️",
};

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const hotel = useMemo(() => HOTELS.find((h) => h.id === hotelId), [hotelId]);

  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0].id);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const selectedRoomData = ROOM_TYPES.find((r) => r.id === selectedRoom)!;
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
  const totalPrice =
    (hotel?.price_from || 0) + selectedRoomData.base_price * nights;

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

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh]"
      >
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />

        <div className="absolute top-24 left-4 md:left-8">
          <Link
            href="/travel/hotels"
            className="inline-flex items-center gap-2 text-white/70 hover:text-luxury-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hotels
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest mb-2">
              {hotel.city}, {hotel.country}
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-3">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-4">
              <StarRating rating={hotel.stars} />
              <span className="text-white/60">|</span>
              <span className="text-luxury-gold font-bold">
                {hotel.rating}/10
              </span>
              <span className="text-white/60">
                ({hotel.reviews.toLocaleString()} reviews)
              </span>
              {hotel.badge && (
                <>
                  <span className="text-white/60">|</span>
                  <span className="bg-luxury-gold/20 text-luxury-gold px-3 py-1 text-xs uppercase tracking-wider">
                    {hotel.badge}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-display text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {hotel.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-white mb-4">
                Location
              </h2>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-1" />
                <span>{hotel.location}</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display text-white mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <span>{AMENITY_ICONS[amenity] || "✓"}</span>
                    <span className="text-gray-300 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display text-white mb-4">
                Select Room
              </h2>
              <div className="space-y-4">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full text-left p-5 border transition-all ${
                      selectedRoom === room.id
                        ? "border-luxury-gold bg-luxury-gold/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-display text-lg">
                          {room.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {room.beds} · {room.max_guests} guests · {room.size}
                        </p>
                      </div>
                      <div className="text-right">
                        {room.base_price > 0 && (
                          <p className="text-luxury-gold text-sm">
                            +AED {room.base_price.toLocaleString()}/night
                          </p>
                        )}
                        {selectedRoom === room.id && (
                          <span className="text-luxury-gold text-xs uppercase tracking-wider">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#0f0d0a] border border-white/15 p-6">
              <h3 className="text-white font-display text-xl mb-6">
                Book Your Stay
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                    Check-in
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-4 py-3">
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent text-white w-full outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                    Check-out
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-4 py-3">
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent text-white w-full outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">
                    Guests
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-4 py-3">
                    <Users className="w-4 h-4 text-luxury-gold" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="bg-transparent text-white w-full outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">
                    Room ({selectedRoomData.name})
                  </span>
                  <span className="text-white">
                    AED {hotel.price_from.toLocaleString()}
                  </span>
                </div>
                {selectedRoomData.base_price > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Upgrade</span>
                    <span className="text-white">
                      +AED{" "}
                      {(selectedRoomData.base_price * nights).toLocaleString()}
                    </span>
                  </div>
                )}
                {nights > 1 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">{nights} nights</span>
                    <span className="text-white">×{nights}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-luxury-gold">
                    AED {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/travel/hotels/${hotelId}/book?room=${selectedRoom}&guests=${guests}&checkIn=${checkIn}&checkOut=${checkOut}`,
                  )
                }
                className="w-full mt-6 flex items-center justify-center gap-2 bg-luxury-gold text-luxury-black py-4 font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all"
              >
                Continue to Booking <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>Secure booking with instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-luxury-gold fill-luxury-gold" : "text-gray-700"}`}
        />
      ))}
    </div>
  );
}
