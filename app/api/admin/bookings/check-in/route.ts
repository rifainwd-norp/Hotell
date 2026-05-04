import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL || "");
    
    // 1. Get the booking and its room
    const bookingRes = await sql`SELECT room_id FROM bookings WHERE id = ${id}::uuid`;
    if (!bookingRes || bookingRes.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    const roomId = bookingRes[0].room_id;

    // 2. Check if the room is currently occupied by ANYONE ELSE with 'checked_in' status
    const occupancyCheck = await sql`
      SELECT id FROM bookings 
      WHERE room_id = ${roomId} 
      AND status = 'checked_in' 
      AND id != ${id}::uuid
    `;

    if (occupancyCheck && occupancyCheck.length > 0) {
      return NextResponse.json({ 
        error: "Room is still occupied. Please check out the previous guest first.", 
        success: false 
      }, { status: 400 });
    }

    // 3. Proceed with check-in
    await sql`
      UPDATE bookings 
      SET status = 'checked_in' 
      WHERE id = ${id}::uuid 
      RETURNING id, status
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-In API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
