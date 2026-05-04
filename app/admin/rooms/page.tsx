import { sql } from "@/lib/db";
import { Room } from "@/lib/types";
import RoomsAdminClient from "./RoomsAdminClient";

export default async function RoomsAdminPage() {
  const rooms = sql ? await sql`SELECT * FROM rooms ORDER BY created_at DESC` as unknown as Room[] : [];

  return <RoomsAdminClient initialRooms={rooms} />;
}
