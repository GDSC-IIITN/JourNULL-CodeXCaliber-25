import { AIService } from "@/services/ai.services";
import { format_response } from "@/utils/api_response";
import { Context } from "hono";

export class AIController {

    public static async suggestions(ctx: Context) {
        try {
            const journal = ctx.req.query('journal')
            if (!journal) {
                throw new Error('Journal parameter is required')
            }
            const suggestions = await AIService.suggestions(ctx, {
                journal
            })
            return suggestions
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get suggestions', {
                meta: { message: error.message },
                is_error: true
            }))
        }
    }

    public static async analyseJournal(ctx: Context) {
        try {
            const journal = ctx.req.query('journal')
            if (!journal) {
                throw new Error('Journal parameter is required')
            }
            const analyseJournal = await AIService.analyseJournal(ctx, {
                journal
            })
            return analyseJournal
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to analyse journal', {
                meta: { message: error.message },
                is_error: true
            }))
        }
    }
}