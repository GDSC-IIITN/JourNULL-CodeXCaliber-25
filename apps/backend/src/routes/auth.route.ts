import { Hono } from 'hono';
import { AuthController } from '@/controllers/auth.controller';

const app = new Hono();

app.get('/is-first-time-login-today', async (c) => {
  return AuthController.isFirstTimeLoginToday(c)
})



export default app;