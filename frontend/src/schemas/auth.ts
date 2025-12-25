import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    code: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    username: z.string().min(3),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
