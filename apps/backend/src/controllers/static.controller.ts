import { Context } from 'hono';
import { format_response } from '@/utils/api_response';

export class StaticController {
    public static async getGhibliImage(ctx: Context) {
        const query = ctx.req.param('query')
        if (!query) {
            return ctx.json(format_response(400, 'Query parameter "q" is required', { is_error: true }));
        }

        try {
            const response = await fetch(`https://ghibli-api.harshduche.com/api/image?q=${query}`);
            const data = await response.json();
            return ctx.json(format_response(200, data, {}));
        } catch (error) {
            console.error('Error fetching from Ghibli API:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return ctx.json(format_response(500, 'Failed to fetch image from Ghibli API', { is_error: true, meta: { error: errorMessage } }));
        }
    }
} 