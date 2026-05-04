import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'http://localhost:3000',
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'build_time_placeholder_secret_32_characters_long',
  },
});
