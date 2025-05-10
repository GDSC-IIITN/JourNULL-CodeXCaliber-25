import { CustomDrizzleClient } from "@/lib/db";
import { Context } from "hono";
import { journals } from "@/lib/db/schema";
import { journals as journalsTable } from "@/lib/db/schema/journal.schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getPookie } from "@/utils";

export class JournalService {
    public static async getJournals(ctx: Context) {
        const user = ctx.get('user')
        const db = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL as string,
            authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
        })

        const dbClient = await db.client()
        const result = await dbClient.select().from(journals).where(eq(journals.userId, user.id))

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
        const result = await dbClient.select().from(journals).where(and(eq(journals.id, id), eq(journals.userId, user.id)))

        return result
    }

    public static async createJournalService(ctx: Context, {
        title,
        content,
        category,
    }: {
        title: string;
        content: string;
        category: string;
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const pookie = await getPookie(ctx)
            const dbClient = await db.client()
            const user = ctx.get('user')

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

            return result
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public static async updateJournalService(ctx: Context, {
        id,
        title,
        content,
    }: {
        id: string;
        title: string;
        content: string;
    }) {
        try {
            const db = new CustomDrizzleClient({
                url: ctx.env.DATABASE_URL as string,
                authToken: ctx.env.DATABASE_AUTH_TOKEN as string,
            })

            const dbClient = await db.client()
            const user = ctx.get('user')

            const result = await dbClient.update(journals).set({
                title,
                content,
            }).where(and(eq(journals.id, id), eq(journals.userId, user.id)))

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