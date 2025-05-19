import { CustomChromaClient } from "@/lib/chromaDB";
import axios from "axios";

import { Context } from "hono";
import { CloudflareEmbeddingResponse } from "@/types/utils";
import { account, journals } from "@/lib/db/schema";
import { CustomDrizzleClient } from "@/lib/db";
import { inArray } from "drizzle-orm";
import { createAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export class CloudFlareEmbeddingFunction {
    private api_key: string;
    private model_name: string;
    private account_id: string;

    constructor(
        api_key: string,
        account_id?: string, // Cloudflare account ID; defaults to CF_ACCOUNT_ID environment variable if not provided
        model_name?: string // Embedding model name; defaults to CF_EMBEDDING_MODEL environment variable or '@cf/baai/bge-m3'
    ) {
        if (!api_key || api_key.trim() === '') {
            throw new Error('Cloudflare API key is required');
        }

        this.api_key = api_key;
        // Use the provided account ID or default to environment variable
        this.account_id = account_id || process.env.CF_ACCOUNT_ID || '';
        // Use the provided model name or default to @cf/baai/bge-m3
        this.model_name = model_name || process.env.CF_EMBEDDING_MODEL || '@cf/baai/bge-m3';

        if (!this.account_id) {
            throw new Error('Cloudflare account ID is required');
        }
    }

    public async generate(texts: string[]): Promise<number[][]> {
        try {
            const response = await axios.post(
                `https://api.cloudflare.com/client/v4/accounts/${this.account_id}/ai/run/${this.model_name}`,
                {
                    text: texts
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.api_key}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status !== 200) {
                console.error(`Error fetching embeddings: ${response.status} ${response.statusText}`);
                throw new Error(`Error fetching embeddings: ${response.statusText}`);
            }

            const parsed = CloudflareEmbeddingResponse.safeParse(response.data);
            if (!parsed.success) {
                console.error("Error parsing response:", parsed.error);
                throw new Error("Error parsing response");
            }

            return parsed.data.result.data;
        } catch (error) {
            console.error("Cloudflare AI embeddings error:", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error("Authentication error: Invalid Cloudflare API key");
                } else if (error.response) {
                    throw new Error(`Cloudflare API error: ${error.response.status} - ${error.response.statusText}`);
                }
            }
            throw error;
        }
    }
}

// util to get the primary collection (pookie-collection 🎀)
export const getPookie = async (c: Context) => {
    const embeddingFunction = new CloudFlareEmbeddingFunction(
        c.env.CF_EMBEDDING_API_KEY,
        c.env.CF_ACCOUNT_ID,
        c.env.CF_EMBEDDING_MODEL
    );

    const client = await new CustomChromaClient(c).client();

    let collection;
    try {
        collection = await client.getCollection({
            name: 'pookie-collection',
            embeddingFunction,
        });
    } catch (error) {
        // Create collection if pookie 🎀 doesn't exist 
        collection = await client.createCollection({
            name: 'pookie-collection',
            embeddingFunction,
        });
    }

    return collection;
}

export const getRelevantEntries = async (current_entry: string, ctx: Context) => {
    try {
        const collection = await getPookie(ctx);
        const embeddingFunction = new CloudFlareEmbeddingFunction(
            ctx.env.CF_EMBEDDING_API_KEY,
            ctx.env.CF_ACCOUNT_ID,
            ctx.env.CF_EMBEDDING_MODEL
        );
        const embedding = await embeddingFunction.generate([current_entry]);

        const queryResult = await collection.query({
            queryEmbeddings: embedding,
            nResults: 5,
        });

        const drizzelClient = new CustomDrizzleClient({
            url: ctx.env.DATABASE_URL,
            authToken: ctx.env.DATABASE_AUTH_TOKEN
        })
        const db = await drizzelClient.client()
        const previousEntries = await db.select().from(journals).where(inArray(journals.id, queryResult.ids[0].map(id => id.toString())))

        return previousEntries
    } catch (error) {
        console.error('Error getting relevant entries:', error);
        throw new Error('Failed to get relevant entries');
    }
}

export const getProviderAccessToken = async (ctx: Context, provider: string) => {
    const auth = await createAuth(ctx.env)
    const headers = ctx.req.header()


    const ac = await auth.api.getAccessToken({
        body: {
            providerId: provider,
            userId: ctx.get('user')?.id
        },
        headers
    })




    const drizzleClient = new CustomDrizzleClient({
        url: ctx.env.DATABASE_URL,
        authToken: ctx.env.DATABASE_AUTH_TOKEN
    })
    const db = await drizzleClient.client()
    const accounts = await auth.api.listUserAccounts({
        headers
    })
    const providerAccount = accounts.find(acc => acc.provider === provider)
    if (!providerAccount) {
        throw new Error('Provider account not found')
    }
    const account_id = await db.query.account.findFirst({
        where: eq(account.accountId, providerAccount?.accountId || ''),
    })
    if (!account_id) {
        throw new Error('Account not found')
    }
    return account_id?.accessToken
}