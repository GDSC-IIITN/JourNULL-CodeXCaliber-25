import { z } from "zod";

export const emotionsSchema = z.object({
    emotion: z.string(),
    score: z.number(),
});

export type Emotions = z.infer<typeof emotionsSchema>;

export enum Emotion {
    happy = "happy",
    sad = "sad",
    angry = "angry",
    fearful = "fearful",
    disgusted = "disgusted",
    surprised = "surprised",
    content = "content",
    anxious = "anxious",
    depressed = "depressed",
    exhausted = "exhausted",
    stressed = "stressed",
    other = "other",
}