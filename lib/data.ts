import { sql } from './db'
import { Room, Testimonial, GalleryItem } from './types'

export type { Room, Testimonial, GalleryItem }

export interface ExperienceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image_url: string;
}

export interface OfferItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  image_url: string;
  link_url: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sql) return [];
  try {
    const data = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
    return data as unknown as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  if (!sql) return [];
  try {
    const data = await sql`SELECT * FROM experiences ORDER BY created_at DESC`;
    return data as unknown as ExperienceItem[];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}

export async function getOffers(): Promise<OfferItem[]> {
  if (!sql) return [];
  try {
    const data = await sql`SELECT * FROM offers ORDER BY created_at DESC`;
    return data as unknown as OfferItem[];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

export async function getRooms(): Promise<Room[]> {
  if (!sql) return [];
  try {
    const data = await sql`SELECT * FROM rooms ORDER BY created_at DESC`;
    return data as unknown as Room[];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (!sql) return null;
  try {
    const data = await sql`SELECT * FROM rooms WHERE slug = ${slug} LIMIT 1`;
    return (data[0] as unknown as Room) || null;
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function getLifestyleGallery(): Promise<GalleryItem[]> {
  if (!sql) return [];
  try {
    const data = await sql`SELECT * FROM lifestyle_gallery ORDER BY created_at DESC`;
    return data as unknown as GalleryItem[];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export async function createBooking(bookingData: {
  room_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
}) {
  if (!sql) throw new Error('Database client not initialized');
  try {
    const data = await sql`
      INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out)
      VALUES (${bookingData.room_id}, ${bookingData.guest_name}, ${bookingData.guest_email}, ${bookingData.check_in}, ${bookingData.check_out})
      RETURNING *
    `;
    return data[0];
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}
