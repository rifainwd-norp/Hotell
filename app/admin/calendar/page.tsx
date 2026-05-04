import { sql } from "@/lib/db";
import { Room, Booking } from "@/lib/types";
import CalendarClient from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function CalendarAdminPage() {
  const allRooms = sql ? await sql`SELECT id, name, tagline FROM rooms ORDER BY name` as unknown as Room[] : [];
  const bookings = sql ? await sql`
    SELECT * FROM bookings 
    WHERE status IN ('confirmed', 'checked_in')
    ORDER BY check_in ASC
  ` as unknown as Booking[] : [];


  return (
    <CalendarClient allRooms={allRooms} bookings={bookings} />
  );
}
