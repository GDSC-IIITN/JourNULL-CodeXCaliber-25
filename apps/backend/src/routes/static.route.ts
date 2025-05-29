import { Env, Hono } from 'hono';
import { StaticController } from '@/controllers/static.controller';

const app = new Hono<{ Bindings: Env }>();

app.get('/ghibli/:query', async (c) => {
    return StaticController.getGhibliImage(c);
});

export default app; 