
export type Env = {
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
  CHROMA_SERVER_URL: string;
  CHROMA_USERNAME: string;
  CHROMA_PASSWORD: string;
  CF_EMBEDDING_API_KEY: string;
  CF_EMBEDDING_MODEL: string;
  FRONTEND_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MICROSOFT_CLIENT_ID: string;
  MICROSOFT_CLIENT_SECRET: string;
  MICROSOFT_TENANT_ID: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GROQ_API_KEY: string;
}

// export type Variables = {
//   user: typeof auth.$Infer.Session.user | null;
//   session: typeof auth.$Infer.Session.session | null
// }