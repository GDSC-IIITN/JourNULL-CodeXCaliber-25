import type { Context } from 'hono';

import { DevService } from '@/services/dev.service';
import { format_response } from '@/utils/api_response';
import { Env } from '@/types/bindings';

export class DevController {
	public static getDevController(ctx: Context<{Bindings: Env}>) {
		const message = DevService.getDevService();
		return ctx.json(format_response(200, message, {}));
	}

	public static getHealthController(ctx: Context<{Bindings: Env}>) {
		return ctx.text('OK!');
	}
}
