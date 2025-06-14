export const runtime = "edge";
import axios from "axios";
import { CloudflareR2Service } from "@/lib/s3/cloudflareR2Service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "File not provided" }, { status: 400 });
  }

  const r2Service = new CloudflareR2Service();
  const fileKey = `${Date.now()}_${file.name}`;

  try {
    const presignedUrl = await r2Service.getSignedUrlForUpload(fileKey, file.type);

    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return NextResponse.json({
      fileKey,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
