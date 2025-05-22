import { Context } from "hono"
import { format_response } from "@/utils/api_response"
import { AuthService } from "@/services/auth.services"

export class AuthController {
    static async isFirstTimeLoginToday(ctx: Context) {
        try {
            const response = await AuthService.isFirstTimeLoginToday(ctx)

            if (!response) {
                return ctx.json(format_response(400, "Failed to get is first time login today", {}))
            }

            return ctx.json(format_response(200, response, {}))
        } catch (error: unknown) {
            console.error(error)
            return ctx.json(format_response(500, "Failed to get is first time login today", {
                meta: { message: error instanceof Error ? error.message : "Unknown error" },
                is_error: true
            }))
        }
    }
}  