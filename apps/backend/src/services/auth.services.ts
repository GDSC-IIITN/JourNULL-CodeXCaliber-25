import { session } from "@/lib/db/schema";
import { Context } from "hono";
import { eq, and, gte, lt } from "drizzle-orm";
import { CustomDrizzleClient } from "@/lib/db";

export class AuthService {
    static async isFirstTimeLoginToday(ctx: Context) {
        const user = ctx.get("user")
        const drizzleClient = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL,
            authToken: ctx.env.DATABASE_AUTH_TOKEN
        })

        const db = await drizzleClient.client()

        // Get today's start and end timestamps
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const todaysSessions = await db.query.session.findMany({
            where: and(
                eq(session.userId, user.id),
                gte(session.createdAt, today),
                lt(session.createdAt, tomorrow)
            )
        })

        if (todaysSessions.length === 0 || todaysSessions.length === 1) {
            return {
                message: 'First time login today',
                isFirstLoginToday: true
            }
        }

        return {
            message: 'Not first time login today',
            isFirstLoginToday: false
        }
    }
}