import { z } from 'zod';

export const id = z.coerce.string().describe('Primary Key');

export type ID = z.infer<typeof id>;

export const ResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.any(),
});

export const defaultEmptyString = z.string().trim().min(1);

export const dateString = z.coerce
  .string()
  .refine((val) => !isNaN(Date.parse(val)));

export const defaultDateString = dateString.default(
  new Date().toISOString().split('T')[0]
);

export const attachmentUrls = z
  .string()
  .default('')
  .transform((str) => str.split(',').filter((url) => url.length > 0));

export const baseEntitySchema = z.object({
  id,
  created_at: dateString,
  updated_at: dateString,
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;