import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL || '';
const sql = neon(databaseUrl);

const init_sql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  tagline TEXT,
  description TEXT,
  long_description TEXT,
  capacity TEXT,
  size TEXT,
  view TEXT,
  service TEXT,
  images JSONB,
  amenities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS lifestyle_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  tag TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  date TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tag TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
`;

const rooms = [
  {
    slug: "presidential-villa",
    name: "The Presidential Villa",
    price: 12500,
    tagline: "ARCHITECTURAL MASTERPIECE",
    description: "360-degree views of the horizon with a private terrace and infinity pool.",
    long_description: "The Presidential Villa at Aureum Grand is a testament to architectural mastery and absolute privacy.",
    capacity: "4 Guests / 2 Bedrooms",
    size: "450 SQM",
    view: "Infinity Horizon",
    service: "24/7 Private Butler",
    images: JSON.stringify(["https://lh3.googleusercontent.com/aida-public/AB6AXuCjUbDycWxRm_ifBMRD5Kelva-uzDAt-RDY3gvvhDXYfYqegpzwo9h0mGowWzryl9yoakVHzVMIsI3DRoa0SgNmS9PVtcvyLhWl-DlWw_jeedtjuT62Z4GYtmn7WhO_DanY_401TVNCFV9suK9_h_IG2m8KwSu4z8HNJ6xYbfu2lTaq0pnX2mMpRZa6iWHLmdKCkPKbGNaSzbvduNUgwm8ULyo7YRIqGiwZ7OqMpIqHW1s8B7bD9aKU5wrhsuNbHzl4FSSlu6CqyE9h"]),
    amenities: JSON.stringify([{ title: "Private Infinity Pool", desc: "Heated water with seamless horizon edge." }])
  },
  {
    slug: "executive-suite",
    name: "Executive Suite",
    price: 1450,
    tagline: "ELEVATED LIVING",
    description: "Elevated living with a dedicated lounge area.",
    long_description: "The Executive Suite at Aureum Grand offers a sophisticated blend of work and relaxation.",
    capacity: "3 Guests / 1 King Bed",
    size: "85 SQM",
    view: "Panoramic Coastline",
    service: "Daily Evening Turndown",
    images: JSON.stringify(["https://lh3.googleusercontent.com/aida-public/AB6AXuChJxEH9LQhKN30CKgxwBv_XI3KWgabUW-j5CvXJL4PPJKzAbypHycjuUmD6B7t4N3SqMuEUcWC2h8hKNeg-Vj13bkaezrPgAGLnf6eMCKUetdB_FRpGhepeFOGhVzmuPouY_HiFTWuioyftofGH0eNFhtCXSZ5T8TYVkZ359EYUUazgGiTGky6b92Wx9S1ELo43ifbQ691R_ZREKHjfE8jMflDHSr6sZ5m4Ue9RPvQzpMKCBmTLASNKdEt6BvBZ3eA1J4b5SjJFOZl"]),
    amenities: JSON.stringify([{ title: "Personalized Bar", desc: "Curated selection of premium beverages." }])
  }
];

const lifestyle_gallery = [
  {
    category: "Architecture",
    title: "Twilight Grandeur",
    tag: "Design",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAviX_AQXE_N8h5e7zEzKZsJlP3CgvlrmuRqfZ5c4ON70wO8McD3dDAMLodAWxYAIvCnPmnO8OxUo6Erd_XVzvJEKXCJ2cPOIkgCrp-BfjtxtzKoEVvHdJvdcerVD-3gKHK0xg7oV0x1KfNm2DX7bvGVFpOYjG_jBSdyTshnt91S2EkWoEOr_--Grf_wqjEJDmdafyn1qXE5mDkwmlRtr8FZDqQcD9eyzGJ3Gt-p0HB5klj-xJ1CYgKoxw29HTw1X8B8m1D8xWIKTBs"
  }
];

const testimonials = [
  {
    author: "Alexander Rothschild",
    date: "Autumn 2025",
    quote: "A level of discretion and architectural precision that is simply unattainable elsewhere.",
    rating: 5
  }
];

const experiences = [
  {
    title: "Culinary Alchemy",
    tagline: "Gastronomy",
    description: "Multi-sensory dining experiences crafted by world-renowned chefs.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzlcwdoPJS3PUFgNHdPJVJQHQBiJESB84mqLZX1foKHNYm5lnBLf9YIygV5e3e2Mnv_2ytUJDfep0xnI_ekehpXipU52bGCZj1TVQ-Z7wG2X30GRvk49VCLftgp1DoknbfOjun-dawWuwfiPETESM0sIL0xAzGzrALjB1vUY-6boO7ojCjunSDQ7NJzKtMk1sYwTYCsH4aRBy0gnpHbOYyD9s54a-bDhKXDHmZRWTr82u7eyTNwrvpS4I5QnyRSGomPXOIPZ0z6n5M"
  }
];

const offers = [
  {
    title: "The Golden Voyage",
    tag: "Exclusive",
    description: "Private jet transfer and a dedicated butler team.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1JVlH4DcWrkAs_v20EJiEU-HR_G5ToBDe8sL7Zv0xeWCNUuyI9llmkVPMJ9szRlz3uvCmeeJwaCcAEoo4Jscgv7ZgHlNOJVvFpKtz8RNZIYxp_QgEPsAhpBsjrTn8F7fk_kBp9G5EOdt6nWTCKUt3s5zBEC6kN5kfaSSkLsNL8inHU_n2gBLJebUHceHio8ukWbcKD6ou-ip0c9c-RdpvEWJKbjPZpL4fFRFAVIgl_aVj39_LDjFA5yXeWrQsk-hYsMcRHa7zHYJs",
    link_url: "/booking"
  }
];

async function seed() {
  console.log('Initializing tables and seeding data...');
  try {
    // 1. Initialize Tables using sql.query for raw statements
    console.log('Creating tables...');
    const statements = init_sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      await (sql as any).query(statement);
    }
    console.log('Tables created successfully.');

    // 2. Seed Data using tagged template
    console.log('Inserting data...');
    for (const r of rooms) await sql`INSERT INTO rooms (slug, name, price, tagline, description, long_description, capacity, size, view, service, images, amenities) VALUES (${r.slug}, ${r.name}, ${r.price}, ${r.tagline}, ${r.description}, ${r.long_description}, ${r.capacity}, ${r.size}, ${r.view}, ${r.service}, ${r.images}, ${r.amenities}) ON CONFLICT (slug) DO NOTHING`;
    for (const l of lifestyle_gallery) await sql`INSERT INTO lifestyle_gallery (category, title, tag, image_url) VALUES (${l.category}, ${l.title}, ${l.tag}, ${l.image_url})`;
    for (const t of testimonials) await sql`INSERT INTO testimonials (author, date, quote, rating) VALUES (${t.author}, ${t.date}, ${t.quote}, ${t.rating})`;
    for (const e of experiences) await sql`INSERT INTO experiences (title, tagline, description, image_url) VALUES (${e.title}, ${e.tagline}, ${e.description}, ${e.image_url})`;
    for (const o of offers) await sql`INSERT INTO offers (title, tag, description, image_url, link_url) VALUES (${o.title}, ${o.tag}, ${o.description}, ${o.image_url}, ${o.link_url})`;

    console.log('Seeding successful.');
  } catch (error) {
    console.error('Operation failed:', error);
  }
}

seed();
