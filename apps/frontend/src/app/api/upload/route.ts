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
  try {
    const presignedUrl = await r2Service.getSignedUrlForUpload(
      file.name,
      file.type
    );

    if (!presignedUrl) {
      return NextResponse.json(
        { error: "Failed to generate presigned URL" },
        { status: 500 }
      );
    }

    const uploadFile = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadFile) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const fileUrl = `https://${r2Service.accountId}.r2.cloudflarestorage.com/${r2Service.bucketName}/${file.name}`;

    return NextResponse.json(
      {
        objectUrl: fileUrl,
      },
      {
        status: 200,
        statusText: "OK",
      }
    );
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
