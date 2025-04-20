import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
  throw new Error('Database credentials are missing in environment variables');
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
