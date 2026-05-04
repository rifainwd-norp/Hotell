export interface Room {
  id: string;
  slug: string;
  name: string;
  price: number;
  tagline?: string;
  description?: string;
  long_description?: string;
  capacity?: string;
  size?: string;
  view?: string;
  service?: string;
  images?: string; // JSON string
  amenities?: string; // JSON string
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  created_at: string;
  penalty_fee?: number;
  actual_check_out?: string;
  room_name?: string; // From join
  room_price?: number; // From join
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  tag?: string;
  image_url: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author: string;
  date: string;
  quote: string;
  rating: number;
  created_at: string;
}
