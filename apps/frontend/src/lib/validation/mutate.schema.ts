import { z } from 'zod';
import { id } from './base.schema';

export const mutateEntitySchema = z
  .object({
    id: id,
  })
  .transform((data) => data.id);

export type MutateEntity = z.infer<typeof mutateEntitySchema>;
