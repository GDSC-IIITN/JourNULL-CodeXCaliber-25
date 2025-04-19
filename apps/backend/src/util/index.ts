import axios from "axios";
import { IEmbeddingFunction } from "chromadb";
import { Context } from "hono";

import { z } from 'zod';

export const CloudflareEmbeddingResponse = z.object({
  result: z.object({
    data: z.array(z.array(z.number())),
    response: z.null(),
    shape: z.array(z.number()),
    pooling: z.string(),
    usage: z.object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number()
    })
  }),
  success: z.boolean(),
  errors: z.array(z.any()),
  messages: z.array(z.any())
});

type CloudflareEmbeddingResponseType = z.infer<typeof CloudflareEmbeddingResponse>;



export class CloudFlareEmbeddingFunction {
    private api_key: string;
    private model_name: string;

    constructor(api_key: string) {
        this.api_key = api_key;
        this.model_name = "@cf/baai/bge-m3";
    }

    public async generate(texts: string[]): Promise<number[][]> {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/de78d66e79f088b038213c70f0bff2a1/ai/run/${this.model_name}`,
            {
                text: texts
            },
            {
                headers: {
                    Authorization: `Bearer ${this.api_key}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response.status !== 200) {
            throw new Error(`Error fetching embeddings: ${response.statusText}`);
        }
        const parsed = CloudflareEmbeddingResponse.safeParse(response.data);
        if (!parsed.success) {
            console.error("Error parsing response:", parsed.error);
            throw new Error("Error parsing response");
        }
        return parsed.data.result.data;
   
    }
}