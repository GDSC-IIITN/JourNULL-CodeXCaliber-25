import { JournalController } from '@/controllers/journal.controller';
import { Env, Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

app.get('/', async (c) => {
    return JournalController.getJournals(c);
});

app.get('/:id', async (c) => {
    return JournalController.getJournal(c, { id: c.req.param('id') });
});

app.post('/', async (c) => {
    const body = await c.req.json();
    return JournalController.createJournal(c, body);
});

app.put('/:id', async (c) => {
    const body = await c.req.json();
    return JournalController.updateJournal(c, { ...body, id: c.req.param('id') });
});

app.delete('/:id', async (c) => {
    return JournalController.deleteJournal(c, { id: c.req.param('id') });
});

export default app;
