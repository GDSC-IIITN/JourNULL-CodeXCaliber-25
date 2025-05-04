import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";

export class CloudflareR2Service {
  private region = "auto";
  public accountId = env.R2_ACCOUNT_ID;
  public bucketName = env.R2_BUCKET_NAME;

  private S3 = () =>
    new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      region: this.region,
    });

  public async getSignedUrlForUpload(
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    try {
      const url = await getSignedUrl(this.S3(), command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      throw new Error(`Failed to get signed URL: ${error}`);
    }
  }
}
