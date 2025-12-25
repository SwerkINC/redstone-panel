import { z } from 'zod';

export const createServerSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['FORGE', 'PAPER', 'VANILLA', 'FABRIC']),
    version: z.string(),
});

export type CreateServerSchemaType = z.infer<typeof createServerSchema>;
