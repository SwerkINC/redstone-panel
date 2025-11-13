import { FastifyInstance, FastifyRequest } from 'fastify';

import { logger } from '@/utils/logger';

import fastifyRateLimit from '@fastify/rate-limit';

/**
 * Configure the rate limiter middleware
 * @param app - Fastify instance
 */
export const rateLimiterPlugin = (app: FastifyInstance) => {
    app.register(fastifyRateLimit, {
        max: 100,
        timeWindow: '1 minute',
        ban: 10,
        cache: 10000,
        whitelist: ['127.0.0.1'],
        skipOnError: true,
        keyGenerator: (req: FastifyRequest) => req.ip,
        errorResponseBuilder: (req, context) => {
            logger.warn(
                { error: 'Rate limit exceeded', ip: req.ip },
                `[${process.env.APP_NAME}][RateLimiter] Error in rateLimiterPlugin middleware`
            );
            return {
                statusCode: 429,
                error: 'Too Many Requests',
                message: `You have exceeded the limit of ${context.max} requests in ${context.after}`,
            };
        },
    });
};
