import type { Context } from 'hono';

import { DevService } from '@/services/dev.service';
import { format_response } from '@/utils/api_response';

export class DevController {
	public static getDevController(ctx: Context) {
		const message = DevService.getDevService();
		return ctx.json(format_response(200, message, {}));
	}

	public static getHealthController(ctx: Context) {
		return ctx.text('OK!');
	}
}
