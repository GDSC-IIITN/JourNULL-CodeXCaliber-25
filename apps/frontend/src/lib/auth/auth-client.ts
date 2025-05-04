import {
    createAuthClient
} from "better-auth/react";
import { env } from "../config/env";

const authBaseURL = env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:8787/api/auth";

export const authClient = createAuthClient({
    baseURL: authBaseURL,
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;