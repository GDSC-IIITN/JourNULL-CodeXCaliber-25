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

export type CloudflareEmbeddingResponseType = z.infer<typeof CloudflareEmbeddingResponse>;
