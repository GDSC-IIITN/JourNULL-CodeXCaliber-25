import { Redis } from "@upstash/redis/cloudflare";
import { Context } from "hono";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const createRedisClient = (ctx: Context) => {
    return new Redis({
        url: ctx.env.UPSTASH_REDIS_REST_URL!,
        token: ctx.env.UPSTASH_REDIS_REST_TOKEN!,
    });
}



