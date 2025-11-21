import { FastifyReply, FastifyRequest } from 'fastify';

import { ZodSchema, z } from 'zod';

import { logger } from './logger';

type InferSchema<T> = T extends ZodSchema ? z.infer<T> : unknown;

type SchemaConfig = {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
};

type InferRequestType<T extends SchemaConfig> = {
    Body: InferSchema<T['body']>;
    Querystring: InferSchema<T['query']>;
    Params: InferSchema<T['params']>;
};

type ControllerHandler<T extends SchemaConfig> = (
    req: FastifyRequest<InferRequestType<T>>,
    reply: FastifyReply
) => Promise<unknown>;

export function reqValidate<T extends SchemaConfig>(schemas: T, handler: ControllerHandler<T>) {
    return async (req: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
        try {
            const validated: {
                body?: unknown;
                query?: unknown;
                params?: unknown;
            } = {};

            if (schemas.body) {
                const result = schemas.body.safeParse(req.body);
                if (!result.success) {
                    return reply.validationError('Validation error', result.error.format());
                }
                validated.body = result.data;
            }

            if (schemas.query) {
                const result = schemas.query.safeParse(req.query);
                if (!result.success) {
                    return reply.validationError('Validation error', result.error.format());
                }
                validated.query = result.data;
            }

            if (schemas.params) {
                const result = schemas.params.safeParse(req.params);
                if (!result.success) {
                    return reply.validationError('Validation error', result.error.format());
                }
                validated.params = result.data;
            }

            const validatedReq = {
                ...req,
                body: validated.body ?? req.body,
                query: validated.query ?? req.query,
                params: validated.params ?? req.params,
            } as FastifyRequest<InferRequestType<T>>;

            return await handler(validatedReq, reply);
        } catch (error) {
            console.log(error);
            logger.error({ error }, 'Internal server error ');
            return reply.internalServerError('Internal server error');
        }
    };
}
