import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { Env } from './types/bindings';
import { routes } from './routes';
import { showRoutes } from 'hono/dev';
import { createAuth } from './lib/auth';
import { authMiddleware } from './middleware/auth.middleware';
import { cors } from 'hono/cors';

const app = new Hono<{
    Bindings: Env,

}>();

app.use(prettyJSON());
app.use(poweredBy());
app.use(logger());
app.use(
    "/api/auth/*",
    cors({
        origin: "http://localhost:3000",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);
app.use('*', authMiddleware)


app.on(["POST", "GET"], "/api/auth/*", async (c) => {
    const auth = await createAuth(c.env)
    return auth.handler(c.req.raw);
});

app.route('/', routes())

showRoutes(app);

export default app;