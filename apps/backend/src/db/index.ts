import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '../constant';

export const db = drizzle({ connection: {
  url: DATABASE_URL, 
  authToken: DATABASE_AUTH_TOKEN 
}});