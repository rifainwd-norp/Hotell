import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, newRoomId } = await request.json();
    
    if (!bookingId || !newRoomId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL || "");
    
    // 1. Check if the new room is available
    const occupancyCheck = await sql`
      SELECT id FROM bookings 
      WHERE room_id = ${newRoomId} 
      AND status = 'checked_in'
    `;

    if (occupancyCheck && occupancyCheck.length > 0) {
      return NextResponse.json({ 
        error: "Target room is currently occupied.", 
        success: false 
      }, { status: 400 });
    }

    // 2. Update the booking to the new room
    await sql`
      UPDATE bookings 
      SET room_id = ${newRoomId} 
      WHERE id = ${bookingId}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change Room API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
