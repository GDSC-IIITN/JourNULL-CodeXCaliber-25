import { z } from "zod";

export const cloudflareR2ConfigSchema = z.object({
  accountId: z.string().min(1, "R2_ACCOUNT_ID is required"),
  accessKeyId: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  secretAccessKey: z.string().min(1, "R2_SECRET_ACCESS_KEY is required"),
  bucketName: z.string().min(1, "R2_BUCKET_NAME is required"),
});
