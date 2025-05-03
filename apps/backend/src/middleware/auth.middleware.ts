import { createAuth } from "@/lib/auth";
import { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
    const auth = await createAuth(c.env)
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
}