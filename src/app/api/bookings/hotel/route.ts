import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enforceRateLimit, readJsonBody } from '@/lib/api-security';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import hotelsData from '@/data/travel/hotels/hotels.json';
import type { Hotel } from '@/features/travel/types';

const hotels = hotelsData as Hotel[];

const roomTypes = {
  deluxe: { name: 'Deluxe Room', nightlyPremium: 0 },
  suite: { name: 'Suite', nightlyPremium: 800 },
  presidential: { name: 'Presidential Suite', nightlyPremium: 2_500 },
} as const;

const bookingSchema = z.object({
  hotel_id: z.string().min(1).max(100),
  room_type: z.enum(['deluxe', 'suite', 'presidential']),
  check_in: z.string().date(),
  check_out: z.string().date(),
  guests: z.number().int().min(1).max(20),
  guest: z.object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(5).max(40),
    specialRequests: z.string().trim().max(2_000).optional().default(''),
  }),
});

function differenceInNights(checkIn: string, checkOut: string) {
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.ceil((end - start) / 86_400_000);
}

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, 'hotel-booking', 8, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const parsed = bookingSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking details.' },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const hotel = hotels.find((candidate) => candidate.id === input.hotel_id);
    if (!hotel) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found.' },
        { status: 404 },
      );
    }

    const nights = differenceInNights(input.check_in, input.check_out);
    if (nights < 1 || nights > 60) {
      return NextResponse.json(
        {
          success: false,
          error: 'Check-out must be after check-in and the stay cannot exceed 60 nights.',
        },
        { status: 400 },
      );
    }

    const room = roomTypes[input.room_type];
    const subtotal = (hotel.price_from + room.nightlyPremium) * nights;
    const totalPrice = subtotal + Math.round(subtotal * 0.1);
    const bookingId = `HTL-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const authClient = await createSupabaseServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        booking_type: 'hotel',
        user_id: user?.id ?? null,
        status: 'pending',
        hotel_id: hotel.id,
        hotel_name: hotel.name,
        room_type: room.name,
        check_in: input.check_in,
        check_out: input.check_out,
        guests: input.guests,
        total_price: totalPrice,
        currency: hotel.currency,
        guest_first_name: input.guest.firstName,
        guest_last_name: input.guest.lastName,
        guest_email: input.guest.email,
        guest_phone: input.guest.phone,
        special_requests: input.guest.specialRequests || null,
        created_at: new Date().toISOString(),
      })
      .select('booking_id, status, total_price, currency')
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      return NextResponse.json(
        { success: false, error: 'Booking request could not be saved.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking_id: data.booking_id || bookingId,
        status: data.status,
        total_price: Number(data.total_price ?? totalPrice),
        currency: data.currency ?? hotel.currency,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE') {
      return NextResponse.json(
        { success: false, error: 'Booking payload is too large.' },
        { status: 413 },
      );
    }

    if (error instanceof Error && error.message === 'INVALID_JSON') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload.' },
        { status: 400 },
      );
    }

    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking request.' },
      { status: 500 },
    );
  }
}
