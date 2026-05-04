"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { neon } from '@neondatabase/serverless';

// Helper to get DB connection
function getDb() {
  return sql || neon(process.env.DATABASE_URL || "");
}

export async function deleteRoom(id: string) {
  const db = getDb();
  try {
    // Check if room has active bookings first
    const bookings = await db`SELECT id FROM bookings WHERE room_id = ${id}::uuid AND status IN ('pending', 'confirmed', 'checked_in')`;
    if (bookings && bookings.length > 0) {
      return { error: "Cannot delete room with active bookings." };
    }

    await db`DELETE FROM rooms WHERE id = ${id}::uuid`;
    revalidatePath("/admin/rooms");
    revalidatePath("/room");
    return { success: true };
  } catch (error) {
    console.error("Delete Room Error:", error);
    return { error: "Failed to delete room. It might be referenced by other records." };
  }
}

export async function confirmBooking(id: string) {
  const db = getDb();
  try {
    console.log("SERVER: Confirming ID:", id);
    const result = await db`
      UPDATE bookings 
      SET status = 'confirmed' 
      WHERE id = ${id}::uuid 
      RETURNING id, status
    `;
    
    if (!result || result.length === 0) {
      return { error: "Booking record not found." };
    }

    return { success: true };
  } catch (error) {
    console.error("Confirm Booking Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: `Database error: ${message}` };
  }
}

export async function deleteBooking(id: string) {
  const db = getDb();
  try {
    await db`DELETE FROM bookings WHERE id = ${id}::uuid`;
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/reception");
    return { success: true };
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return { error: "Failed to delete booking." };
  }
}

export async function checkInBooking(id: string) {
  console.log("SERVER ACTION: checkInBooking called with ID:", id);
  const db = getDb();
  try {
    if (!id) {
      console.error("SERVER ACTION: No ID provided");
      return { error: "No ID provided" };
    }
    
    const result = await db`
      UPDATE bookings 
      SET status = 'checked_in' 
      WHERE id = ${id}::uuid 
      RETURNING id, status
    `;
    
    console.log("SERVER ACTION: Update result:", result);
    
    if (!result || result.length === 0) {
      return { error: "Booking record not found." };
    }

    return { success: true };
  } catch (error) {
    console.error("Check In Booking Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: `Database error: ${message}` };
  }
}

export async function checkOutBooking(id: string) {
  console.log("SERVER ACTION: checkOutBooking called with ID:", id);
  const db = getDb();
  try {
    if (!id) {
      console.error("SERVER ACTION: No ID provided");
      return { error: "No ID provided" };
    }

    const result = await db`
      UPDATE bookings 
      SET status = 'checked_out' 
      WHERE id = ${id}::uuid 
      RETURNING id, status
    `;
    
    console.log("SERVER ACTION: Update result:", result);
    
    if (!result || result.length === 0) {
      return { error: "Booking record not found." };
    }

    return { success: true };
  } catch (error) {
    console.error("Check Out Booking Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: `Database error: ${message}` };
  }
}
