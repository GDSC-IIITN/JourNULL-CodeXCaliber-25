import { z } from "zod";

export const isFirstTimeLoginTodaySchema = z.object({
    message: z.string(),
    isFirstLoginToday: z.boolean(),
})

export type IsFirstTimeLoginTodayResponse = z.infer<typeof isFirstTimeLoginTodaySchema>