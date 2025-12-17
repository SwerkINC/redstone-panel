import { PaginationMeta, UserWithGroups } from '@/types';

declare module 'fastify' {
    interface FastifyRequest {
        user: UserWithGroups;
        startTime: number;
    }
    interface FastifyReply {
        url?: string;
        success<T = unknown>(
            data?: T,
            statusCode?: number,
            message?: string,
            pagination?: PaginationMeta
        ): FastifyReply;
        created<T = unknown>(data?: T, message?: string, pagination?: PaginationMeta): FastifyReply;
        auth(accessToken: string, refreshToken: string): FastifyReply;
        noContent(): FastifyReply;
        validationError(message?: string, details?: Record<string, unknown>): FastifyReply;
        notFound(message?: string): FastifyReply;
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string;
        }
    }
}
