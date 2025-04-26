export type Env = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  CHROMA_SERVER_URL: string;
  CHROMA_USERNAME: string;
  CHROMA_PASSWORD: string;
  CF_EMBEDDING_API_KEY: string;
  CF_EMBEDDING_MODEL: string;
  CF_ACCOUNT_ID: string;
  AI: Ai;
}

import type { Context } from 'hono';

export type ContextWithEnv = Context<{ Bindings: Env }>;