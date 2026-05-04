import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, penalty } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL || "");
    
    const result = await sql`
      UPDATE bookings 
      SET 
        status = 'checked_out',
        penalty_fee = ${penalty || 0},
        actual_check_out = NOW()
      WHERE id = ${id}::uuid 
      RETURNING id, status
    `;


    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-Out API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
