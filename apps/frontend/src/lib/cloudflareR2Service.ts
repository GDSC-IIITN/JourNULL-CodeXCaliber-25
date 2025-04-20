import { cloudflareR2ConfigSchema } from "@/types/lib";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class CloudflareR2Service {
  private input = cloudflareR2ConfigSchema.safeParse({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
  });
  accountId = this.input.success ? this.input.data.accountId : "";
  bucketName = this.input.success ? this.input.data.bucketName : "";
  private accessKeyId = this.input.success ? this.input.data.accessKeyId : "";
  private secretAccessKey = this.input.success
    ? this.input.data.secretAccessKey
    : "";
  private region = "auto";

  private S3 = () => {
    if (!this.input.success) {
      throw new Error("R2 credentials are not properly configured");
    }

    return new S3Client({
      endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: this.region,
    });
  };

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
