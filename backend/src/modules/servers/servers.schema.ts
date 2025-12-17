import { queryParamsSchema } from '@/utils';

import z from 'zod';

export const ServerType = z.enum(['FORGE', 'PAPER', 'VANILLA', 'FABRIC']);
export const ServerSort = z.enum(['createdAt', 'updatedAt']);
export const ServerOrder = z.enum(['asc', 'desc']);

export const createServerSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: ServerType,
    version: z.string(),
});

export const getAllServersSchema = queryParamsSchema.extend({
    type: ServerType.optional(),
    version: z.string().optional(),
    search: z.string().optional(),
});
