import { z } from 'zod';

export const idStringSchema = z.object({
    id: z.string(),
});
export const idNumberSchema = z.object({
    id: z.number(),
});

export const queryParamsSchema = z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    sort: z.string().default('createdAt'),
    order: z.string().default('desc'),
});
