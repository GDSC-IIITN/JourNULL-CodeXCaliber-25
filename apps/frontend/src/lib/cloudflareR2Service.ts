import { cloudflareR2ConfigSchema } from "@/types/lib";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import https from "https";

export class CloudflareR2Service {
  private accountId: string;
  private bucketName: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private s3Client: S3Client;
  private httpsAgent = new https.Agent({
    keepAlive: true,
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  });

  constructor() {
    const input = cloudflareR2ConfigSchema.safeParse({
      accountId: process.env.R2_ACCESS_KEY_ID,
      accessKeyId: process.env.R2_SECRECT_ACCESS_KEY,
      secretAccessKey: process.env.R2_BUCKET_NAME,
      bucketName: process.env.R2_ACCOUNT_ID,
      region: process.env.R2_REGION || "auto",
    });

    if (!input.success) {
      const errorMessage = input.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(
        `R2 credentials are not properly configured: ${errorMessage}`
      );
    }

    this.accountId = input.data.accountId;
    this.bucketName = input.data.bucketName;
    this.accessKeyId = input.data.accessKeyId;
    this.secretAccessKey = input.data.secretAccessKey;
    this.region = input.data.region;

    this.s3Client = new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: this.region,
      forcePathStyle: true,
      requestHandler: {
        httpOptions: {
          agent: this.httpsAgent,
        },
      },
    });
  }

  public async uploadFile(
    key: string,
    contentType: string,
    file: File | Buffer | Blob
  ): Promise<void> {
    try {
      let fileBuffer: Buffer;
      if (file instanceof File || file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      } else {
        fileBuffer = file as Buffer;
      }
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: "public-read",
        Body: fileBuffer,
      });
      console.log(`Successfully uploaded file: ${key}`);
      await this.s3Client.send(command);
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  public async getSignedUrlForUpload(file: File): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.name,
      ContentType: file.type,
      ACL: "public-read",
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return url;
    } catch (error) {
      throw new Error(`Failed to get signed URL: ${error}`);
    }
  }

  public getUrl(fileName: string): string {
    return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}/${fileName}`;
  }
}
