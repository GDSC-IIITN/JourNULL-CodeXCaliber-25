import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "./src/constant";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "turso",
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
});
