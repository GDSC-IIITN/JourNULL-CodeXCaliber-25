import { ChromaClient } from 'chromadb';
import { Context } from 'hono';

export class CustomChromaClient {
  private chromaClientInstance: ChromaClient | null = null;
  
  constructor(private context: Context) {}
  
  async client(): Promise<ChromaClient> {
    // Return cached instance if available
    if (this.chromaClientInstance) {
      return this.chromaClientInstance;
    }
    
    // Validate environment variables
    const username = this.context.env.CHROMA_USERNAME;
    const password = this.context.env.CHROMA_PASSWORD;
    const serverUrl = this.context.env.CHROMA_SERVER_URL;
    
    if (!username || !password || !serverUrl) {
      throw new Error('Missing required ChromaDB environment variables');
    }
    
    try {
      // Create basic auth token (fixing the 'Basic' duplication issue)
      const token = btoa(`${username}:${password}`);
      
      // Create and cache the client
      this.chromaClientInstance = new ChromaClient({
        path: serverUrl,
        fetchOptions: {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          }
        }
      });
      
      return this.chromaClientInstance;
    } catch (error) {
      console.error('Failed to initialize ChromaDB client:', error);
      throw new Error('ChromaDB client initialization failed');
    }
  }
}