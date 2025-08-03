// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' }); // <-- UBAH BARIS INI

export default defineConfig({
  schema: './drizzle.schema.ts',
  out: './src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Tanda seru ditambahkan untuk meyakinkan TypeScript
  },
});