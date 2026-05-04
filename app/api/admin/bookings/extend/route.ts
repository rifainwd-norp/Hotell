import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, new_check_out } = await request.json();
    
    if (!id || !new_check_out) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL || "");
    
    // Optional: Check if the room is available for the extended period
    // But for now, we'll just update it as requested.
    
    const result = await sql`
      UPDATE bookings 
      SET check_out = ${new_check_out}
      WHERE id = ${id}::uuid 
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error("Extend Stay API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
