"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  if (!sql) return { error: "Database service is temporarily unavailable." };

  try {
    const guest_name = formData.get("guest_name")?.toString();
    const guest_email = formData.get("guest_email")?.toString();
    const room_type = formData.get("room_type")?.toString(); 
    const room_id = formData.get("room_id")?.toString(); // New: direct room ID
    const check_in = formData.get("check_in")?.toString();
    const check_out = formData.get("check_out")?.toString();

    if (!guest_name || !guest_email || (!room_type && !room_id) || !check_in || !check_out) {
      return { error: "Please provide all required information for the reservation." };
    }

    let finalRoomId = room_id;
    let initialStatus = room_id ? 'confirmed' : 'pending'; // Walk-ins are confirmed immediately

    if (!finalRoomId) {
      // Automatic selection logic for website bookings
      const availableRooms = await sql`
        SELECT r.id FROM rooms r
        WHERE (
          COALESCE(r.tagline, '') ILIKE ${'%' + room_type + '%'} 
          OR r.name ILIKE ${'%' + room_type + '%'}
        )
        AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.room_id = r.id
          AND b.status = 'confirmed'
          AND NOT (
            ${check_out} <= b.check_in OR ${check_in} >= b.check_out
          )
        )
        LIMIT 1
      `;

      if (!availableRooms || availableRooms.length === 0) {
        return { error: `We are sorry, but no ${room_type} rooms are available for the selected dates.` };
      }
      finalRoomId = availableRooms[0].id;
    }

    await sql`
      INSERT INTO bookings (guest_name, guest_email, room_id, check_in, check_out, status)
      VALUES (
        ${guest_name}, 
        ${guest_email}, 
        ${finalRoomId}, 
        ${check_in}, 
        ${check_out},
        ${initialStatus}
      )
    `;
    
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/calendar");
    return { success: true };
  } catch (error) {
    console.error("Booking Action Error:", error);
    return { 
      error: "Our reservation system encountered a technical issue. Please try again or contact our concierge directly." 
    };
  }
}
