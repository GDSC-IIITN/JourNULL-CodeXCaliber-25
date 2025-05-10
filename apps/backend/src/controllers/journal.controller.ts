import { JournalService } from "@/services/journal.service";
import { format_response } from "@/utils/api_response";
import { Context } from "hono";

export class JournalController {
    public static async getJournals(ctx: Context) {
        try {
            const message = await JournalService.getJournals(ctx);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get journals', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async getJournal(ctx: Context, payload: {
        id: string;
    }) {
        try {
            const message = await JournalService.getJournal(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get journal', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async createJournal(ctx: Context, payload: {
        title: string;
        content: string;
        category: string;
    }) {
        try {
            const message = await JournalService.createJournalService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to create journal', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async updateJournal(ctx: Context, payload: {
        id: string;
        title: string;
        content: string;
    }) {
        try {
            const message = await JournalService.updateJournalService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to update journal', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async deleteJournal(ctx: Context, payload: {
        id: string;
    }) {
        try {
            const message = await JournalService.deleteJournalService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to delete journal', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }
}