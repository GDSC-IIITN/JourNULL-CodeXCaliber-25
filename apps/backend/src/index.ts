import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { Env } from './types/bindings';
import { routes } from './routes';
import { showRoutes } from 'hono/dev';

const app = new Hono<{Bindings: Env}>();

app.use(prettyJSON());
app.use(poweredBy());
app.use(logger());

app.route('/', routes())

showRoutes(app);


export default app;