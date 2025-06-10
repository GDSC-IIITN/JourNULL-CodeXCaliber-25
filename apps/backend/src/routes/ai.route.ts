
import { Env, Hono } from 'hono';
import { AIController } from '@/controllers/ai.controller';

const app = new Hono<{ Bindings: Env }>();

app.get('/analyse-journal', async (c) => {
    const result = await AIController.analyseJournal(c)
    return result
})

app.get('/suggestions', async (c) => {
    const result = await AIController.suggestions(c)
    return result
})

app.get('/octacat', async (c) => {
    const result = await AIController.octacat(c)
    return result
})

export default app;
