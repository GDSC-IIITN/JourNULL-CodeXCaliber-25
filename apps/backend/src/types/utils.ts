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

export enum Emotion {
  happy = 'happy',
  sad = 'sad',
  angry = 'angry',
  fearful = 'fearful',
  disgusted = 'disgusted',
  surprised = 'surprised',
  content = 'content',
  anxious = 'anxious',
  depressed = 'depressed',
  exhausted = 'exhausted',
  stressed = 'stressed',
  other = 'other'
}

export const EmotionSchema = z.enum(Object.values(Emotion) as [string, ...string[]]);

export type EmotionType = z.infer<typeof EmotionSchema>;

export const EmotionScoreSchema = z.object({
  emotion: EmotionSchema,
  score: z.number()
});

export type EmotionScoreType = z.infer<typeof EmotionScoreSchema>;