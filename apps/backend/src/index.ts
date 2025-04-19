import { Hono } from 'hono';
import { CustomChromaClient } from './lib/chromaDB';
import { CloudFlareEmbeddingFunction } from './util';

type Env = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  CHROMA_SERVER_URL: string;
  CHROMA_USERNAME: string;
  CHROMA_PASSWORD: string;
  CF_EMBEDDING_API_KEY: string;
  CF_EMBEDDING_MODEL: string;
}

const app = new Hono<
  {
    Bindings: Env;
  }
>();


app.get('/', async (c) => {
  return c.text('Hello World!');
})

export default app;