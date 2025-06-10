import type { Context } from 'hono';

import { DevService } from '@/services/dev.service';
import { format_response } from '@/utils/api_response';
import { createRedisClient, redis } from '@/lib/redis';
import { journals } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { CloudFlareEmbeddingFunction, getRelevantEntriesFromEmbedding } from '@/utils';
import { CustomDrizzleClient } from '@/lib/db';

export class DevController {
	public static getDevController(ctx: Context) {
		const message = DevService.getDevService();
		return ctx.json(format_response(200, message, {}));
	}

	public static getHealthController(ctx: Context) {
		return ctx.text('OK!');
	}
	public static async globalSearchController(ctx: Context) {
		try {
			const q = ctx.req.query("q");
			if (!q) return ctx.json({ results: [] });

			const redisClient = await createRedisClient(ctx);

			// 1. Try cached results
			const cached = await redisClient.get(`search:q:${q}`);
			if (cached) {
				try {
					return ctx.json(JSON.parse(cached as string));
				} catch (e) {
					console.error("❌ Failed to parse cached search result:", e);
					await redisClient.del(`search:q:${q}`);
				}
			}

			// 2. Embedding fetch or generate
			const embedKey = `embed:q:${q}`;
			let embedding: number[] | null = null;

			const cachedEmbedding = await redisClient.get(embedKey);
			if (cachedEmbedding) {
				try {
					const parsed = JSON.parse(cachedEmbedding as string);

					if (Array.isArray(parsed[0])) {
						// Handle [[...]] case
						embedding = parsed[0];
					} else {
						// Handle correct case

						embedding = parsed;
					}
				} catch (e) {
					console.error("❌ Failed to parse cached embedding:", e);
					await redisClient.del(embedKey);
				}
			}

			if (!embedding) {
				const embeddingFunction = new CloudFlareEmbeddingFunction(
					ctx.env.CF_EMBEDDING_API_KEY!,
					ctx.env.CF_ACCOUNT_ID!,
					ctx.env.CF_EMBEDDING_MODEL!
				);

				const rawEmbedding = await embeddingFunction.generate([q]); // number[][]
				embedding = rawEmbedding[0]; // Take first vector only
				await redisClient.set(embedKey, JSON.stringify(embedding));
			}

			// 3. Perform similarity search
			const results = await getRelevantEntriesFromEmbedding([embedding], ctx); // API expects [[]]

			// 4. Fetch matching journals
			const drizzelClient = new CustomDrizzleClient({
				url: ctx.env.DATABASE_URL,
				authToken: ctx.env.DATABASE_AUTH_TOKEN
			});
			const db = await drizzelClient.client();

			const journalsData = await db.select()
				.from(journals)
				.where(inArray(journals.id, results.map(String)));

			// 5. Cache the final results
			await redisClient.set(`search:q:${q}`, JSON.stringify(journalsData), { ex: 120 });

			// send the results of journalsData as per the sequence of the results in the results array
			const journalsDataWithSequence = results.map((result) => {
				const journal = journalsData.find((journal) => journal.id === result);
				return journal;
			});

			return ctx.json(journalsDataWithSequence);
		} catch (e) {
			console.error("🔥 Error in global search:", e);
			return ctx.json({ results: [] }, 500);
		}
	}
}