import { CustomChromaClient } from "@/lib/chromaDB";
import { CloudflareEmbeddingResponse } from "@/types/utils";
import axios from "axios";
import { Context } from "hono";

export class CloudFlareEmbeddingFunction {
    private api_key: string;
    private model_name: string;

    constructor(api_key: string) {
        this.api_key = api_key;
        this.model_name = "@cf/baai/bge-m3";
    }

    public async generate(texts: string[]): Promise<number[][]> {
        const response = await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/de78d66e79f088b038213c70f0bff2a1/ai/run/${this.model_name}`,
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
            throw new Error(`Error fetching embeddings: ${response.statusText}`);
        }
        const parsed = CloudflareEmbeddingResponse.safeParse(response.data);
        if (!parsed.success) {
            console.error("Error parsing response:", parsed.error);
            throw new Error("Error parsing response");
        }
        return parsed.data.result.data;
   
    }
}

// util to get the primary collection (pookie-collection 🎀)
export const getPookie = async (c: Context) => {
    const embeddingFunction = new CloudFlareEmbeddingFunction(c.env.CF_EMBEDDING_API_KEY);
    const client = await new CustomChromaClient(c).client();

    return client.getCollection({
        name: 'pookie-collection',
        embeddingFunction,
    });
}
