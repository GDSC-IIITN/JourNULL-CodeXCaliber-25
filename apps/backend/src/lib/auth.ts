import { CustomDrizzleClient } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Env } from "@/types/bindings";
import { account, session, user, verification } from "@/db/schema/auth-schema";

// Create a dummy DB client for the CLI to work with
// This will only be used when running the CLI, not in production
const dummyDb = new CustomDrizzleClient({
    url: process.env.DATABASE_URL || "file:./dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN || ""
});


export const auth = betterAuth({
    database: drizzleAdapter(dummyDb, {
        provider: "sqlite", // or "mysql", "sqlite"
    })
});


// Factory function that creates an auth instance with the provided env
// Use this in your serverless routes
export const createAuth = async (env: Env) => {
    const drizzleClient = new CustomDrizzleClient({
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN
    });

    const db = await drizzleClient.client();

    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
            schema: {
                user,
                session,
                account,
                verification
            } // or "mysql", "sqlite"
        }),

        trustedOrigins: ['http://localhost:3000'],

        emailAndPassword: {
            enabled: true
        },

        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                // redirectURI: 'http://localhost:3000/dashboard',
                // // Redirect URI after authentication
            },

        },
        advanced: {
            crossSubDomainCookies: {
                enabled: true, // Enables cross-domain cookies
            },
            defaultCookieAttributes: {
                sameSite: 'none', // Required for cross-domain cookies
                secure: true, // Ensures cookies are only sent over HTTPS
            }
        },
        rateLimit: {
            window: 10, // time window in seconds
            max: 100, // max requests in the window
        },

    });
};
