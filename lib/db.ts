import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.warn('AUREUM GRAND: DATABASE_URL is missing. Please check your .env.local file.');
}

export const sql = databaseUrl ? neon(databaseUrl) : null;
