import { IntegrationsController } from '@/controllers/integrations.controller';
import { Env, Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

app.get('/google-calendar', async (c) => {
    return IntegrationsController.getGoogleCalendarEvents(c);
});

app.get('/google-photos', async (c) => {
    return IntegrationsController.getGooglePhotosEvents(c);
});

export default app;
