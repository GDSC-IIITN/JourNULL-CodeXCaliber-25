import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { Env } from './types/bindings';
import { routes } from './routes';
import { showRoutes } from 'hono/dev';
import { auth, createAuth } from './lib/auth';
import { authMiddleware } from './middleware/auth.middleware';
import { cors } from 'hono/cors';

const app = new Hono<{
    Bindings: Env,
    Variables: {
        user: typeof auth.$Infer.Session.user | null
        session: typeof auth.$Infer.Session.session | null
    }

}>({ strict: false });

app.use('*', cors({
    origin: ['http://localhost:3000', 'https://journull-frontend.pages.dev', 'https://journull-frontend.vercel.app', 'https://journull.harshduche.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
}));

app.use(prettyJSON());
app.use(poweredBy());
app.use(logger());

app.use("/api/auth/*", cors({
    origin: ['http://localhost:3000', 'https://journull-frontend.pages.dev', 'https://journull-frontend.vercel.app', 'https://journull.harshduche.com'],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
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