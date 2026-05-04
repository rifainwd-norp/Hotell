import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL || "");
    
    const bookings = await sql`
      SELECT bookings.*, rooms.name as room_name 
      FROM bookings 
      LEFT JOIN rooms ON bookings.room_id = rooms.id 
      ORDER BY bookings.created_at DESC
    `;

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("List Bookings API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
