import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdminClient();

    const body = await request.json();
    const {
      hotel_id,
      hotel_name,
      room_type,
      check_in,
      check_out,
      guests,
      total_price,
      currency,
      guest,
    } = body;

    const booking_id = `HTL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        booking_id,
        booking_type: "hotel",
        status: "confirmed",
        hotel_id,
        hotel_name,
        room_type,
        check_in,
        check_out,
        guests,
        total_price,
        currency,
        guest_first_name: guest.firstName,
        guest_last_name: guest.lastName,
        guest_email: guest.email,
        guest_phone: guest.phone,
        special_requests: guest.specialRequests,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      booking_id: data.booking_id || booking_id,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
