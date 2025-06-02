import { CustomDrizzleClient } from "@/lib/db";
import { Context } from "hono";
import { journals, emotions, journalTags, Emotion } from "@/lib/db/schema";
import { journals as journalsTable } from "@/lib/db/schema/journal.schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { DetermineEmotionScore, getPookie } from "@/utils";
import { EmotionScoreType } from "@/types/utils";

export class JournalService {
    public static async getJournals(ctx: Context) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()
        const result = await dbClient.select().from(journals).where(eq(journals.userId, user.id)).orderBy(desc(journals.createdAt))

        return result
    }

    public static async getJournal(ctx: Context, {
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
        const result = await dbClient.select({
            id: journals.id,
            title: journals.title,
            content: journals.content,
            category: journals.category,
            userId: journals.userId,
            emotions: emotions,
            journal_tags: journalTags
        })
            .from(journals)
            .where(and(eq(journals.id, id), eq(journals.userId, user.id)))
            .leftJoin(emotions, eq(journals.id, emotions.journalId))
            .leftJoin(journalTags, eq(journals.id, journalTags.journalId))
            .then(result => {
                const emotions = result.map(r => r.emotions).filter(Boolean).filter((emotion: any) => emotion.score > 0)
                const tags = result.map(r => r.journal_tags).filter(Boolean);
                return {
                    ...result[0],
                    emotions,
                    tags
                }
            })
        console.log(result)

        return result
    }

    public static async createJournalService(ctx: Context, {
        title,
        content,
        category,
        tags,
    }: {
        title: string;
        content: string;
        category: string;
        tags: string[];
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const pookie = await getPookie(ctx)
            const dbClient = await db.client()
            const user = ctx.get('user')
            const emotion = await DetermineEmotionScore(ctx, content)

            const journalData = {
                id: randomUUID(),
                title,
                content,
                category: category as "journal" | "dreamJournal",
                userId: user.id,
            };

            await pookie.add({
                ids: [journalData.id],
                metadatas: [{
                    title: journalData.title,
                    content: journalData.content,
                    category: journalData.category,
                    userId: journalData.userId,
                }],
                documents: [journalData.content]
            })

            const result = await dbClient.insert(journals).values(journalData).returning({ id: journalsTable.id })

            // add emotions to the journal
            await dbClient.insert(emotions).values(emotion.map((emotion: EmotionScoreType) => ({
                id: randomUUID(),
                journalId: result[0].id,
                emotion: emotion.emotion as "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other",
                score: emotion.score,
            })))

            // add tags to the journal
            if (tags && tags.length > 0) {
                await dbClient.insert(journalTags).values(tags.map((tag: string) => ({
                    id: randomUUID(),
                    journalId: result[0].id,
                    tagName: tag,
                })))
            }

            return result
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public static async updateJournalService(ctx: Context, {
        id,
        title,
        content,
        tags,
    }: {
        id: string;
        title: string;
        content: string;
        tags: string[];
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const dbClient = await db.client()
            const user = ctx.get('user')

            const pookie = await getPookie(ctx)


            const result = await dbClient.update(journals).set({
                title,
                content,
            }).where(and(eq(journals.id, id), eq(journals.userId, user.id))).returning({ id: journalsTable.id })

            // update pookie
            await pookie.update({
                ids: [id],
                metadatas: [{
                    title: title,
                    content: content,
                    userId: user.id,
                }],
                documents: [content]
            })

            // update emotions
            await dbClient.delete(emotions).where(eq(emotions.journalId, id))
            const emotion = await DetermineEmotionScore(ctx, content)
            await dbClient.insert(emotions).values(emotion.map((emotion: EmotionScoreType) => ({
                id: randomUUID(),
                journalId: id,
                emotion: emotion.emotion as "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other",
                score: emotion.score,
            })))

            // update tags
            await dbClient.delete(journalTags).where(eq(journalTags.journalId, id))
            // await dbClient.insert(journalTags).values(tags.map((tag: string) => ({
            //     id: randomUUID(),
            //     journalId: id,
            //     tagName: tag,
            // })))

            return result
        } catch (error: any) {
            console.error(error)
            return {
                error: 'Failed to update journal',
                message: error.message,
            }
        }
    }

    public static async deleteJournalService(ctx: Context, {
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

            const result = await dbClient.delete(journals).where(and(eq(journals.id, id), eq(journals.userId, user.id)))

            return result
        } catch (error: any) {
            console.error(error)
            return {
                error: 'Failed to delete journal',
                message: error.message,
            }
        }
    }
}