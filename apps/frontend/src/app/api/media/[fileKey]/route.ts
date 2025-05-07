// app/api/media/[fileKey]/route.ts
import { CloudflareR2Service } from "@/lib/s3/cloudflareR2Service";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { fileKey: string } }
) {
    const fileKey = await params?.fileKey;

    const r2Service = new CloudflareR2Service();
    try {
        const signedUrl = await r2Service.getSignedUrlForRead(fileKey);

        const res = await fetch(signedUrl);

        if (!res.ok) {
            return new Response("Failed to fetch R2 object", { status: res.status });
        }

        const headers = new Headers(res.headers);
        headers.set("Access-Control-Allow-Origin", "*"); // Optional if serving to browser

        return new Response(res.body, {
            status: res.status,
            headers,
        });
    } catch (e) {
        console.error("Error proxying R2 file:", e);
        return new Response("Error fetching file", { status: 500 });
    }
}
