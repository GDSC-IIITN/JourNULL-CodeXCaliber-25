import { Context } from "hono";
import { generateText, streamText } from "ai";
import { createGroq } from '@ai-sdk/groq';
import { ollama } from 'ollama-ai-provider';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { stream } from "hono/streaming";

export class AI {
    constructor(private ctx: Context, private provider: string) {
        this.ctx = ctx
        this.provider = provider
    }

    async generate(payload: {
        prompt: string;
    }) {
        switch (this.provider) {
            case 'groq':
                const groq = createGroq({
                    apiKey: this.ctx.env.GROQ_API_KEY
                })
                return await generateText({
                    model: groq('llama3-8b-8192'),
                    prompt: payload.prompt
                });
            case 'ollama':
                return await generateText({
                    model: ollama('llama3-8b-8192'),
                    prompt: payload.prompt
                });
            case 'google':
                const google = createGoogleGenerativeAI({
                    apiKey: this.ctx.env.GOOGLE_GENERATIVE_AI_API_KEY
                })
                return await generateText({
                    model: google('gemini-1.5-flash'),
                    prompt: payload.prompt
                });
            default:
                throw new Error('Provider not supported')
        }
    }


    async streamText(payload: {
        prompt: string;
    }) {

        this.ctx.header('Content-Type', 'text/plain; charset=utf-8');
        this.ctx.header('X-Vercel-AI-Data-Stream', 'v1');
        switch (this.provider) {
            case 'groq':
                const groq = await createGroq({
                    apiKey: this.ctx.env.GROQ_API_KEY,
                    headers: {
                        "stream": "true"
                    }
                })
                const groqResult = await streamText({
                    model: groq('llama3-8b-8192'),
                    prompt: payload.prompt
                });

                return stream(this.ctx, stream => stream.pipe(groqResult.toDataStream()))
            case 'ollama':
                const ollamaResult = await streamText({
                    model: ollama('llama3-8b-8192'),
                    prompt: payload.prompt
                });
                return stream(this.ctx, stream => stream.pipe(ollamaResult.toDataStream()))
            case 'google':
                const google = createGoogleGenerativeAI({
                    apiKey: this.ctx.env.GOOGLE_GENERATIVE_AI_API_KEY
                })
                const googleResult = await streamText({
                    model: google('gemini-1.5-flash'),
                    prompt: payload.prompt
                });
                return stream(this.ctx, stream => stream.pipe(googleResult.toDataStream()))
            default:
                throw new Error('Provider not supported')
        }
    }


}
