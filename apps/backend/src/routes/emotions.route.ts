import { EmotionsController } from '@/controllers/emotions.controller';
import { Env, Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

// Get emotions for a specific journal
app.get('/journal/:journalId', async (c) => {
    return EmotionsController.getEmotionsByJournal(c, { journalId: c.req.param('journalId') });
});

// Get journals with a specific emotion
app.get('/type/:emotion', async (c) => {
    const emotion = c.req.param('emotion') as "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";
    return EmotionsController.getJournalsByEmotion(c, { emotion });
});

export default app; 