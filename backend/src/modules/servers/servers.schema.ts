import z from 'zod';

export const createServerSchema = z.object({
    serverId: z.string(),
    name: z.string(),
    description: z.string(),
});
