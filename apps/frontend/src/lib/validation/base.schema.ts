import { z } from 'zod';

export const id = z.coerce.string().describe('Snowflake ID');


export type ID = z.infer<typeof id>;

export const ResponseSchema = z.object({
  status: z.number(),
  success: z.boolean(),
  message: z.any(),
});

export const defaultEmptyString = z.string().trim().min(1).default('');

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

export type ExcludeBaseProps<
  T extends Record<string, unknown>,
  E extends keyof T = keyof BaseEntity,
> = Omit<T, keyof BaseEntity | E>;

export const excludeBaseProps = <
  T extends z.ZodObject<(typeof baseEntitySchema)['shape']>,
>(
  schema: T
) => {
  return schema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }) as unknown as StripBaseProps<T>;
};

export type StripBaseProps<
  T extends z.ZodObject<(typeof baseEntitySchema)['shape'] & z.ZodRawShape>,
> = Omit<T, 'shape'> & {
  shape: Omit<
    {
      [K in keyof T['shape']]: T['shape'][K];
    },
    keyof BaseEntity
  >;
};
