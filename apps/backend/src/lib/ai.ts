import { createWorkersAI } from 'workers-ai-provider';
import { generateText, streamText } from 'ai';

// Define response type for clarity
export type AIResponse = {
  text: string;
  stream: Response;
};

type Env = {
  AI: Ai; // Use any instead of Ai since the Ai type might not be properly defined
};

export class AIClient {
  private workersai: any = null;
  private defaultModel = '@cf/meta/llama-2-7b-chat-int8';
  private isAuthenticated = false;

  constructor(env?: Env) {
    if (env) {
      this.setEnv(env);
    }
  }

  setEnv(env: Env) {
    try {
      if (!env.AI) {
        throw new Error('AI binding not found in environment. Make sure AI is properly configured in wrangler.toml');
      }
      
      this.workersai = createWorkersAI({ binding: env.AI });
      this.isAuthenticated = true;
      
      // Verify that the AI binding is working
      if (!this.workersai || typeof this.workersai !== 'function') {
        throw new Error('Failed to initialize Workers AI client. Check your account permissions.');
      }
      
      return this;
    } catch (error) {
      console.error('AI client initialization error:', error);
      // Don't throw error here, let the methods handle missing client
      return this;
    }
  }

  verifyInitialization() {
    if (!this.workersai || !this.isAuthenticated) {
      throw new Error('AI client not initialized or not authenticated. Check your Cloudflare account permissions and AI binding configuration.');
    }
  }

  async generateText(prompt: string, model?: string, maxTokens:number = 800): Promise<string> {
    try {
      this.verifyInitialization();
      
      const result = await generateText({
        model: this.workersai(model || this.defaultModel),
        prompt,
        maxTokens: maxTokens,
        maxRetries: 5,
      });
      
      return result.text;
    } catch (error: any) {
      console.error('AI text generation error:', error);   
      // Provide more helpful error messages
      if (error.message?.includes('Authentication error')) {
        throw new Error('Authentication failed for Cloudflare Workers AI. Check your account permissions and ensure you\'re logged in with `npx wrangler login`.');
      }
      
      throw error;
    }
  }

  streamText(prompt: string, model?: string): Response {
    try {
      this.verifyInitialization();
      
      const result = streamText({
        model: this.workersai(model || this.defaultModel),
        prompt,
        maxTokens: 800
      });

      return result.toTextStreamResponse({
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Content-Type-Options': 'nosniff',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error: any) {
      console.error('AI stream error:', error);
      
      // Create an error response stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ 
            error: 'AI service unavailable',
            details: error.message || 'Unknown error'
          })}\n\n`));
          controller.close();
        }
      });
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    }
  }

  async chatCompletion(messages: Array<{ role: 'user' | 'system' | 'assistant', content: string }>, model?: string, maxTokens:number = 60): Promise<string> {
    try {
      this.verifyInitialization();

      // Format messages for the model
      const formattedPrompt = messages
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');
      
      return this.generateText(formattedPrompt, model, maxTokens);
    } catch (error) {
      console.error('AI chat completion error:', error);
      return `Sorry, I'm having trouble connecting to the AI service. Please try again later.`;
    }
  }

  async analyzeJournal(text: string): Promise<any> {
    try {
      const prompt = `
        You're an emotional analysis assistant. Please analyze the following journal entry and provide:
        1. Overall mood/sentiment (positive, negative, neutral)
        2. Key emotions identified
        3. Main concerns or thoughts
        4. Suggestions for the person

        Journal entry:
        "${text}"
        
        Format your response as JSON with the following structure:
        {
          "sentiment": "positive|negative|neutral",
          "emotions": ["emotion1", "emotion2"],
          "concerns": ["concern1", "concern2"],
          "suggestions": ["suggestion1", "suggestion2"]
        }
      `;
      
      const result = await this.generateText(prompt);
      try {
        return JSON.parse(result);
      } catch (e) {
        return { error: "Failed to parse AI response", raw: result };
      }
    } catch (error) {
      console.error('Journal analysis error:', error);
      return { 
        error: "AI service unavailable",
        sentiment: "neutral",
        emotions: ["unknown"],
        concerns: ["Could not analyze journal"],
        suggestions: ["Try again later"] 
      };
    }
  }
}

export default {
  async fetch(request: Request, env: any) {
    try {
      const client = new AIClient(env);
      const url = new URL(request.url);
      const prompt = url.searchParams.get('prompt') || 'Hello, world!';
      
      return client.streamText(prompt);
    } catch (error: any) {
      return new Response(JSON.stringify({ error: 'AI service error', message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};