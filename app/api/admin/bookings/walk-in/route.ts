import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { room_type, guest_name, guest_email, check_in, check_out, status } = body;
    
    if (!room_type || !guest_name || !check_in || !check_out) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const sql = neon(process.env.DATABASE_URL || "");

    // 1. Find an available room of this type
    const availableRooms = await sql`
      SELECT id FROM rooms 
      WHERE tagline = ${room_type} 
      AND id NOT IN (
        SELECT room_id FROM bookings 
        WHERE room_id IS NOT NULL 
        AND status IN ('confirmed', 'checked_in')
        AND NOT (check_out <= ${check_in} OR check_in >= ${check_out})
      )
      LIMIT 1
    `;

    if (!availableRooms || availableRooms.length === 0) {
      return NextResponse.json({ error: `No available rooms of type "${room_type}" for these dates.` }, { status: 404 });
    }

    const room_id = availableRooms[0].id;
    
    const result = await sql`
      INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out, status)
      VALUES (${room_id}::uuid, ${guest_name}, ${guest_email}, ${check_in}, ${check_out}, ${status || 'checked_in'})
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error("Walk-in API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

