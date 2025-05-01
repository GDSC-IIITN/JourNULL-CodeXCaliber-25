import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema' 

export class CustomDrizzleClient {
  private drizzleInstance: any | null = null;

  constructor(private connection: { url: string; authToken: string }) {}

  async client() {
    // Return cached instance if available
    if (this.drizzleInstance) {
      return this.drizzleInstance;
    }

    // Create and cache the drizzle instance
    this.drizzleInstance = drizzle({
      connection: {
        url: this.connection.url,
        authToken: this.connection.authToken,
      },
      schema
    });

    return this.drizzleInstance;
  }
}