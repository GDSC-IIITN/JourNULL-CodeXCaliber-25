export const runtime = "edge";
import { NextRequest } from "next/server";
import { CloudflareR2Service } from "@/lib/s3/cloudflareR2Service";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ fileKey: string }> }
) {
    try {
        const { fileKey } = await context.params;
        const r2Service = new CloudflareR2Service();

        // First attempt with initial signed URL
        let signedUrl = await r2Service.getSignedUrlForRead(fileKey);
        let res = await fetch(signedUrl);

        // If the first attempt fails, try one more time with a fresh signed URL
        if (!res.ok) {
            signedUrl = await r2Service.getSignedUrlForRead(fileKey);
            res = await fetch(signedUrl);
        }

        if (!res.ok) {
            return new Response("Failed to fetch R2 object", { status: res.status });
        }

        const headers = new Headers(res.headers);
        headers.set("Access-Control-Allow-Origin", "*"); // Optional for CORS

        return new Response(res.body, {
            status: res.status,
            headers,
        });
    } catch (e) {
        console.error("Error proxying R2 file:", e);
        return new Response("Error fetching file", { status: 500 });
    }
}
