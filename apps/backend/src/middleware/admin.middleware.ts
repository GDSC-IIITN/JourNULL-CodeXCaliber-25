// adminMiddleware based on credential of basic auth

import { Context, Next } from "hono";

export const adminMiddleware = async (c: Context, next: Next) => {
    const auth = c.req.header('Authorization')
    if (!auth) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
}