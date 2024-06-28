import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  out: './src/drizzle',
  schema: './src/drizzle.bench.ts',
  dbCredentials: {
    url: './prisma/dev.db'
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
