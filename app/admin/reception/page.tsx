import { sql } from "@/lib/db";
import { Booking, Room } from "@/lib/types";
import ReceptionHub from "./ReceptionHub";

export const dynamic = "force-dynamic";

async function getReceptionData() {
  if (!sql) return { arrivals: [], staying: [], allRooms: [], allBookings: [] };

  // Get arrivals with room price
  const arrivals = await sql`
    SELECT bookings.*, rooms.name as room_name, rooms.price as room_price
    FROM bookings 
    LEFT JOIN rooms ON bookings.room_id = rooms.id 
    WHERE bookings.status = 'confirmed'
    ORDER BY bookings.check_in ASC
  ` as unknown as Booking[];

  // Get staying with room price
  const staying = await sql`
    SELECT bookings.*, rooms.name as room_name, rooms.price as room_price
    FROM bookings 
    LEFT JOIN rooms ON bookings.room_id = rooms.id 
    WHERE bookings.status = 'checked_in'
    ORDER BY bookings.check_out ASC
  ` as unknown as Booking[];

  // Get all rooms with their price
  const allRooms = await sql`
    SELECT id, name, tagline, price FROM rooms ORDER BY name
  ` as unknown as Room[];

  // Get all active bookings (to check room availability/overlap)
  const allBookings = await sql`
    SELECT bookings.*, rooms.price as room_price
    FROM bookings 
    LEFT JOIN rooms ON bookings.room_id = rooms.id
    WHERE bookings.status IN ('confirmed', 'checked_in')
  ` as unknown as Booking[];

  return { arrivals, staying, allRooms, allBookings };
}

export default async function ReceptionPage() {
  const { arrivals, staying, allRooms, allBookings } = await getReceptionData();

  return (
    <ReceptionHub 
      initialArrivals={arrivals} 
      initialStaying={staying} 
      allRooms={allRooms}
      allBookings={allBookings}
    />
  );
}
