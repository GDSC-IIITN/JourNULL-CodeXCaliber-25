import { EmotionsService } from "@/services/emotions.service";
import { format_response } from "@/utils/api_response";
import { Context } from "hono";

type EmotionType = "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";

export class EmotionsController {
    public static async getEmotions(ctx: Context) {
        try {
            const message = await EmotionsService.getEmotions(ctx);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get emotions', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async getEmotion(ctx: Context, payload: {
        id: string;
    }) {
        try {
            const message = await EmotionsService.getEmotion(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get emotion', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async createEmotion(ctx: Context, payload: {
        journalId: string;
        emotion: "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";
        score: number;
    }) {
        try {
            const message = await EmotionsService.createEmotionService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to create emotion', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async updateEmotion(ctx: Context, payload: {
        id: string;
        journalId: string;
        emotion: "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "content" | "anxious" | "depressed" | "exhausted" | "stressed" | "other";
        score: number;
    }) {
        try {
            const message = await EmotionsService.updateEmotionService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to update emotion', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async deleteEmotion(ctx: Context, payload: {
        id: string;
    }) {
        try {
            const message = await EmotionsService.deleteEmotionService(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to delete emotion', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async getEmotionsByJournal(ctx: Context, payload: {
        journalId: string;
    }) {
        try {
            const message = await EmotionsService.getEmotionsByJournal(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get emotions for journal', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }

    public static async getJournalsByEmotion(ctx: Context, payload: {
        emotion: EmotionType;
    }) {
        try {
            const message = await EmotionsService.getJournalsByEmotion(ctx, payload);
            return ctx.json(format_response(200, message, {}));
        } catch (error: any) {
            console.error(error)
            return ctx.json(format_response(500, 'Failed to get journals by emotion', {
                meta: { message: error.message },
                is_error: true
            }));
        }
    }
} 