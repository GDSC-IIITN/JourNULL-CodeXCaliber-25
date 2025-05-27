import { CustomDrizzleClient } from "@/lib/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Env } from "@/types/bindings";
import { account, session, user, verification } from "@/lib/db/schema/auth.schema";

// Create a dummy DB client for the CLI to work with
// This will only be used when running the CLI, not in production
const dummyDrizzleClient = new CustomDrizzleClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string
});

const dummyDb = await dummyDrizzleClient.client()

export const auth = betterAuth({
    database: drizzleAdapter(dummyDb, {
        provider: "sqlite", // or "mysql", "sqlite"
        schema: {
            user,
            session,
            account,
            verification
        }
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
            }
        }),

        trustedOrigins: [env.FRONTEND_URL],

        emailAndPassword: {
            enabled: true
        },

        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID as string,
                clientSecret: env.GOOGLE_CLIENT_SECRET as string,
                scope: [
                    'https://www.googleapis.com/auth/calendar.events.readonly',
                    'https://www.googleapis.com/auth/calendar.readonly',
                    'https://www.googleapis.com/auth/photoslibrary.readonly'
                ],
                accessType: 'offline',
                prompt: 'consent'
            },
            github: {
                clientId: env.GITHUB_CLIENT_ID as string,
                clientSecret: env.GITHUB_CLIENT_SECRET as string,
            },
            microsoft: {
                clientId: env.MICROSOFT_CLIENT_ID as string,
                clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
                tenantId: 'common', // or your tenant ID
                requireSelectAccount: true
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
        // rateLimit: {
        //     window: 10, // time window in seconds
        //     max: 100, // max requests in the window
        // },

    });
};
