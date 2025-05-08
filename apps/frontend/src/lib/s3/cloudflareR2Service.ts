// lib/s3/cloudflareR2Service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";

export class CloudflareR2Service {
  private region = "auto";
  private accountId = env.R2_ACCOUNT_ID;
  private bucketName = env.R2_BUCKET_NAME;

  private S3 = () =>
    new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      region: this.region,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

  public async getSignedUrlForUpload(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(this.S3(), command, { expiresIn: 3600 });
  }


  public async getSignedUrlForRead(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.S3(), command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      throw new Error(`Failed to get signed URL: ${error}`);
    }
  }
}
