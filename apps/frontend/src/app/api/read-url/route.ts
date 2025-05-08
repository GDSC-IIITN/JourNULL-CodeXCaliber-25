// app/api/read-url/route.ts
import { CloudflareR2Service } from "@/lib/s3/cloudflareR2Service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");

    if (!key) {
        return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    try {
        const r2Service = new CloudflareR2Service();
        const signedUrl = await r2Service.getSignedUrlForRead(key);
        return NextResponse.json({ signedUrl });
    } catch (err) {
        return NextResponse.json({ error: "Failed to generate read URL" }, {
            status: 500,
            statusText: err instanceof Error ? err.message : "Unknown error"
        });
    }
}
