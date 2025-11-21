import z from 'zod';

export const registerSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,64}$/),
    username: z.string().regex(/^[a-zA-Z0-9_]{3,32}$/),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,64}$/),
    code: z.string().length(6).optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const tokenSchema = z.object({
    token: z.string(),
});

export const verify2faSchema = z.object({
    code: z.string().length(6),
});

export type Verify2faSchemaType = z.infer<typeof verify2faSchema>;

export type TokenSchemaType = z.infer<typeof tokenSchema>;
