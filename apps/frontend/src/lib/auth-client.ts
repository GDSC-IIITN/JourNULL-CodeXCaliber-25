import {
    createAuthClient
} from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.BACKEND_URL || "http://localhost:8787",
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;