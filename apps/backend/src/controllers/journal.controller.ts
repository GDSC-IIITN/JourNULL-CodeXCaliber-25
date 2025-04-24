import { format_response } from '@/utils/api_response';
import { JournalService } from '@/services/journal.service';
import { ContextWithEnv, Env } from '@/types/bindings';

export class JournalController {
  public static async analyzeJournalEntry(ctx: ContextWithEnv) {
    const { env } = ctx;
    const data = await ctx.req.json();
    const { text } = data;

    if (!text) {
      return ctx.json(format_response(400, "No journal text provided", {}), 400);
    }

    try {
      const analysis = await JournalService.analyzeJournalEntry(text, env);
      return ctx.json(format_response(200, analysis, {}));
    } catch (error) {
      console.error("Error analyzing journal:", error);
      return ctx.json(format_response(500, "Failed to analyze journal", {
        is_error: true,
        meta: error
      }), 500);
    }
  }

  public static async getAIResponse(ctx: ContextWithEnv) {
    const { env } = ctx;
    const data = await ctx.req.json();
    const { prompt } = data;

    if (!prompt) {
      return ctx.json(format_response(400, "No prompt provided", {}), 400);
    }

    try {
      const response = await JournalService.getAIResponse(prompt, env);
      return ctx.json(format_response(200, response, {}));

    } catch (error) {
      console.error("Error getting AI response:", error);
      return ctx.json(format_response(500, "Failed to get AI response", {
        is_error: true,
        meta: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 500);
    }
  }

  public static streamAIResponse(ctx: ContextWithEnv) {
    const { env } = ctx;
    const prompt = ctx.req.query('prompt');

    if (!prompt) {
      return ctx.json(format_response(400, "No prompt provided", {}), 400);
    }

    try {

      // Set CORS headers manually for streaming
      ctx.header('Access-Control-Allow-Origin', '*');
      ctx.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      ctx.header('Access-Control-Allow-Headers', 'Content-Type');
      ctx.header('Content-Type', 'text/event-stream');
      ctx.header('Cache-Control', 'no-cache');
      ctx.header('Connection', 'keep-alive');
      ctx.header('X-Content-Type-Options', 'nosniff');
      ctx.header('Access-Control-Allow-Credentials', 'true');


      console.log("Streaming AI response for prompt:", prompt);

      // Return the streaming response directly
      return JournalService.streamAIResponse(prompt, env);
    } catch (error) {
      console.error("Error streaming AI response:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return ctx.json(format_response(500, "Failed to stream AI response", { meta: errorMessage }), 500);
    }
  }

  public static async getSuggestions(ctx: ContextWithEnv) {
    const { env } = ctx;
    const data = await ctx.req.json();

    const { text } = data;
    if (!text) {
      return ctx.json(format_response(400, "No journal text provided", {}), 400);
    }

    try {
      console.log("Generating AI suggestions for text:", text);
      const suggestions = await JournalService.getAIsuggestions(text, ctx);
      return ctx.json(format_response(200, suggestions, {}));
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return ctx.json(format_response(500, "Failed to generate suggestions", {
        is_error: true,
        meta: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 500);
    }
  }

  public static async streamSuggestions(ctx: ContextWithEnv) {
    const { env } = ctx;
    const data = await ctx.req.json();

    const { text } = data;
    if (!text) {
      return ctx.json(format_response(400, "No journal text provided", {}), 400);
    }

    try {
      console.log("Streaming AI suggestions for text:", text);

      // Set CORS headers manually for streaming
      ctx.header('Access-Control-Allow-Origin', '*');
      ctx.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      ctx.header('Access-Control-Allow-Headers', 'Content-Type');
      ctx.header('Content-Type', 'text/event-stream');
      ctx.header('Cache-Control', 'no-cache');
      ctx.header('Connection', 'keep-alive');
      ctx.header('X-Content-Type-Options', 'nosniff');
      ctx.header('Access-Control-Allow-Credentials', 'true');

      // Use the existing streamAIResponse method but construct a prompt based on the journal text
      const prompt = `Based on my current journal entry, please provide me with some suggestions or insights:\n\n${text}`;
      return JournalService.streamAIResponse(prompt, env);
    } catch (error) {
      console.error("Error streaming suggestions:", error);
      return ctx.json(format_response(500, "Failed to stream suggestions", {
        is_error: true,
        meta: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 500);
    }
  }
}
