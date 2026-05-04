"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRoom(formData: FormData) {
  if (!sql) return { error: "Database not connected" };

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = parseInt(formData.get("price") as string);
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const long_description = formData.get("long_description") as string;
  const capacity = formData.get("capacity") as string;
  const size = formData.get("size") as string;
  const view = formData.get("view") as string;
  const service = formData.get("service") as string;
  const imageUrl = formData.get("imageUrl") as string;

  try {
    await sql`
      INSERT INTO rooms (
        name, slug, price, tagline, description, long_description, 
        capacity, size, view, service, images
      ) VALUES (
        ${name}, ${slug}, ${price}, ${tagline}, ${description}, ${long_description}, 
        ${capacity}, ${size}, ${view}, ${service}, ${JSON.stringify([imageUrl])}
      )
    `;
    
    revalidatePath("/admin/rooms");
    revalidatePath("/room");
  } catch (error) {
    console.error("Failed to create room:", error);
    return { error: "Failed to create room. Slug might already exist." };
  }

  redirect("/admin/rooms");
}
