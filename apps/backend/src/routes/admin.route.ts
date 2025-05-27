import { Env, Hono } from 'hono';

import { getPookie } from '@/utils';
import { adminMiddleware } from '@/middleware/admin.middleware';

const app = new Hono<{ Bindings: Env }>();
app.use(adminMiddleware)

app.get('/clear-pookie', async (c) => {
    const poookie = await getPookie(c)
    try {
        const result = await poookie.delete()
        return c.json({ success: true, result })
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500)
    }
})

app.get('/get-pookie', async (c) => {
    const poookie = await getPookie(c)
    const result = await poookie.get()
    return c.json({ success: true, pookie: result })
})

export default app;