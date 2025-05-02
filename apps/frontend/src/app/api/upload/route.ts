import { CloudflareR2Service } from "@/lib/cloudflareR2Service";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import https from "https";

const agent = new https.Agent({
  secureProtocol: "TLS_method",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    // const arrayBuffer = await file.arrayBuffer();

    const fileName = file.name;

    const r2Service = new CloudflareR2Service();

    const url = await r2Service.getSignedUrlForUpload(file);

    console.log("Uploading file to R2:", url);

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
      },
      httpsAgent: agent,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    // Upload the file to R2
    // await r2Service.uploadFile(fileName, file.type, Buffer.from(arrayBuffer));

    console.log("File uploaded successfully:", fileName);

    const fileUrl = r2Service.getUrl(fileName);

    return NextResponse.json(
      {
        objectUrl: fileUrl,
        success: true,
        message: "File uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
