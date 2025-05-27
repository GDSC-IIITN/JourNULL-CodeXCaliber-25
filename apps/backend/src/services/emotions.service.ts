import { CustomDrizzleClient } from "@/lib/db";
import { Context } from "hono";
import { emotions, journals } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

type EmotionType = "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";

export class EmotionsService {
    public static async getEmotions(ctx: Context) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()
        const result = await dbClient.select()
            .from(emotions)
            .leftJoin(journals, eq(emotions.journalId, journals.id))
            .where(eq(journals.userId, user.id))

        return result.map(r => r.emotions)
    }

    public static async getEmotion(ctx: Context, {
        id,
    }: {
        id: string;
    }) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()
        const result = await dbClient.select()
            .from(emotions)
            .leftJoin(journals, eq(emotions.journalId, journals.id))
            .where(and(eq(emotions.id, id), eq(journals.userId, user.id)))
            .then(result => result[0]?.emotions)

        return result
    }

    public static async createEmotionService(ctx: Context, {
        journalId,
        emotion,
        score,
    }: {
        journalId: string;
        emotion: "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";
        score: number;
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const dbClient = await db.client()
            const user = ctx.get('user')

            // Verify that the journal belongs to the user
            const journal = await dbClient.select()
                .from(journals)
                .where(and(eq(journals.id, journalId), eq(journals.userId, user.id)))
                .then(result => result[0])

            if (!journal) {
                throw new Error('Journal not found or unauthorized')
            }

            const emotionData = {
                id: randomUUID(),
                journalId,
                emotion,
                score,
            };

            const result = await dbClient.insert(emotions).values(emotionData).returning()

            return result[0]
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public static async updateEmotionService(ctx: Context, {
        id,
        journalId,
        emotion,
        score,
    }: {
        id: string;
        journalId: string;
        emotion: "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";
        score: number;
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const dbClient = await db.client()
            const user = ctx.get('user')

            // Verify that the journal belongs to the user
            const journal = await dbClient.select()
                .from(journals)
                .where(and(eq(journals.id, journalId), eq(journals.userId, user.id)))
                .then(result => result[0])

            if (!journal) {
                throw new Error('Journal not found or unauthorized')
            }

            const result = await dbClient.update(emotions)
                .set({
                    journalId,
                    emotion,
                    score,
                })
                .where(eq(emotions.id, id))
                .returning()

            return result[0]
        } catch (error: any) {
            console.error(error)
            return {
                error: 'Failed to update emotion',
                message: error.message,
            }
        }
    }

    public static async deleteEmotionService(ctx: Context, {
        id,
    }: {
        id: string;
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const dbClient = await db.client()
            const user = ctx.get('user')

            // Verify that the emotion belongs to a journal owned by the user
            const emotion = await dbClient.select()
                .from(emotions)
                .leftJoin(journals, eq(emotions.journalId, journals.id))
                .where(and(eq(emotions.id, id), eq(journals.userId, user.id)))
                .then(result => result[0]?.emotions)

            if (!emotion) {
                throw new Error('Emotion not found or unauthorized')
            }

            const result = await dbClient.delete(emotions)
                .where(eq(emotions.id, id))
                .returning()

            return result[0]
        } catch (error: any) {
            console.error(error)
            return {
                error: 'Failed to delete emotion',
                message: error.message,
            }
        }
    }

    public static async getEmotionsByJournal(ctx: Context, {
        journalId,
    }: {
        journalId: string;
    }) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()

        // Verify that the journal belongs to the user
        const journal = await dbClient.select()
            .from(journals)
            .where(and(eq(journals.id, journalId), eq(journals.userId, user.id)))
            .then(result => result[0])

        if (!journal) {
            throw new Error('Journal not found or unauthorized')
        }

        const result = await dbClient.select()
            .from(emotions)
            .where(eq(emotions.journalId, journalId))
            .orderBy(emotions.score)

        return result
    }

    public static async getJournalsByEmotion(ctx: Context, {
        emotion,
    }: {
        emotion: EmotionType;
    }) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()
        const result = await dbClient.select({
            journal: journals,
            emotion: emotions
        })
            .from(journals)
            .leftJoin(emotions, eq(journals.id, emotions.journalId))
            .where(and(
                eq(journals.userId, user.id),
                eq(emotions.emotion, emotion)
            ))
            .orderBy(emotions.score)

        return result.map(r => ({
            ...r.journal,
            emotion: r.emotion
        }))
    }
} 