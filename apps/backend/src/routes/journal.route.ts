import { Hono } from 'hono';
import { JournalController } from '@/controllers/journal.controller';
import { Env } from '@/types/bindings';

const app = new Hono<{ Bindings: Env }>();

// Analyze a journal entry
app.post('/analyze', JournalController.analyzeJournalEntry);

// Get AI response to a prompt (JSON response)
app.post('/ai-response', JournalController.getAIResponse);

// Stream AI response to a prompt
app.get('/ai-stream', JournalController.streamAIResponse);

// Get AI suggestions for journal entry
app.post('/suggestions', JournalController.getSuggestions);

// Stream AI suggestions for journal entry
app.post('/suggestions/stream', JournalController.streamSuggestions);

// Test endpoint to verify streaming works
app.get('/test-stream', (c) => {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      // Send a new message every second for 5 seconds
      let counter = 0;
      const interval = setInterval(() => {
        const message = `data: This is streaming test message ${counter}\n\n`;
        controller.enqueue(encoder.encode(message));
        counter++;
        
        if (counter >= 5) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
});

export default app;
