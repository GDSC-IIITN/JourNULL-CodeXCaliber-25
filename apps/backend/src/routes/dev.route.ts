import { Hono } from 'hono';

import { DevController } from '@/controllers/dev.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const app = new Hono();

app.all('/', DevController.getDevController);
app.get('/health', DevController.getHealthController);
app.get('/search', DevController.globalSearchController);

export default app;
