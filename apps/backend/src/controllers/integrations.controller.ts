import { IntegrationsService } from "@/services/integrations.services";
import { format_response } from "@/utils/api_response";
import { Context } from "hono";

export class IntegrationsController {
    static async getGoogleCalendarEvents(ctx: Context) {
        try {
            const events = await IntegrationsService.getGoogleCalendarEvents(ctx)
            return ctx.json(format_response(200, events, {}))
        } catch (error) {
            console.error('Error in getGoogleCalendarEvents:', error)
            return ctx.json({
                error: 'Failed to fetch calendar events',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 500)
        }
    }

    static async getGooglePhotosEvents(ctx: Context) {
        try {
            const photos = await IntegrationsService.getGooglePhotosEvents(ctx)
            return ctx.json(format_response(200, photos, {}))
        } catch (error) {
            console.error('Error in getGooglePhotosEvents:', error)
            return ctx.json({
                error: 'Failed to fetch photos',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 500)
        }
    }
}