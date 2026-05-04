"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addGalleryItem(formData: FormData) {
  if (!sql) return { error: "Database not connected" };

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image_url = formData.get("image_url") as string;

  try {
    await sql`
      INSERT INTO lifestyle_gallery (title, category, image_url)
      VALUES (${title}, ${category}, ${image_url})
    `;
    
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to add gallery item:", error);
    return { error: "Failed to add item to gallery." };
  }

  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: number | string) {
  if (!sql) return { error: "Database not connected" };

  try {
    await sql`DELETE FROM lifestyle_gallery WHERE id = ${id}`;
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return { error: "Failed to delete item." };
  }
}
