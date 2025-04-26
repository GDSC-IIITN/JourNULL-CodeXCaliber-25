import { drizzle } from 'drizzle-orm/libsql';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema'

export class CustomDrizzleClient {
  private drizzleInstance: LibSQLDatabase<typeof schema> | null = null;

  constructor(private connection: { url: string; authToken: string }) {}

  async client() {
    // Return cached instance if available
    if (this.drizzleInstance) {
      return this.drizzleInstance;
    }
    // Create and cache the drizzle instance
    const client = createClient({
      url: this.connection.url,
      authToken: this.connection.authToken,
    });
    this.drizzleInstance = drizzle(client, { schema });

    return this.drizzleInstance;
  }
}