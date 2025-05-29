import { z } from 'zod';
import { id } from './base.schema';

export const mutateEntitySchema = z
  .object({
    id: id,
  }).array()
  .transform((data) => data[0].id);

export type MutateEntity = z.infer<typeof mutateEntitySchema>;
