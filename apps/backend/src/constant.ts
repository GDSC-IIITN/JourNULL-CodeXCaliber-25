import { config } from "dotenv";

config();

export const DATABASE_URL = process.env.DATABASE_URL as string;
export const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN as string;
