import { z } from "zod";

export const emotionTypeSchema = z.enum([
    "happy", "sad", "angry", "fearful", "disgusted",
    "surprised", "content", "anxious", "depressed",
    "exhausted", "stressed", "other"
]);

export const journalIdSchema = z.object({
    journalId: z.string().uuid("Invalid journal ID"),
});

export const emotionSchema = z.object({
    id: z.string().uuid(),
    journalId: z.string().uuid(),
    emotion: emotionTypeSchema,
    score: z.number(),
});

export const emotionsResponseSchema = z.object({
    message: z.array(emotionSchema),
    meta: z.record(z.unknown()).optional(),
    is_error: z.boolean().optional(),
});

export const journalsByEmotionResponseSchema = z.object({
    message: z.array(z.object({
        id: z.string().uuid(),
        title: z.string(),
        content: z.string(),
        category: z.enum(["journal", "dreamJournal"]),
        userId: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        emotion: emotionSchema,
    })),
    meta: z.record(z.unknown()).optional(),
    is_error: z.boolean().optional(),
});


export type EmotionType = z.infer<typeof emotionTypeSchema>;
export type JournalIdInput = z.infer<typeof journalIdSchema>;
export type Emotion = z.infer<typeof emotionSchema>;
export type EmotionsResponse = z.infer<typeof emotionsResponseSchema>;
export type JournalsByEmotionResponse = z.infer<typeof journalsByEmotionResponseSchema>;