import type { FastifyInstance } from 'fastify';

import prisma from '@/config/prisma';

import { logger } from '@/utils';

import underPressure from '@fastify/under-pressure';

/**
 * Plugin de surveillance de la charge système
 * Surveille automatiquement la mémoire, le délai de la boucle d'événements
 * et renvoie "Service Unavailable" (503) si les seuils sont dépassés
 */
export async function pressurePlugin(fastify: FastifyInstance) {
    const loggerToUse = logger.child({
        module: `[${process.env.APP_NAME}][Pressure]`,
    });
    await fastify.register(underPressure, {
        maxEventLoopDelay: 1000,
        maxHeapUsedBytes:
            process.env.NODE_ENV === 'production' ? 300 * 1024 * 1024 : 200 * 1024 * 1024,
        maxRssBytes: process.env.NODE_ENV === 'production' ? 800 * 1024 * 1024 : 500 * 1024 * 1024,
        maxEventLoopUtilization: 0.98,
        pressureHandler: (request, reply, type, value) => {
            const errorMessages: Record<string, string> = {
                eventLoopDelay: `Event loop delay too high: ${value || 0}ms`,
                heapUsedBytes: `Heap used bytes too high: ${Math.round((value || 0) / 1024 / 1024)}MB`,
                rssBytes: `RSS bytes too high: ${Math.round((value || 0) / 1024 / 1024)}MB`,
                eventLoopUtilization: `Event loop utilization too high: ${Math.round((value || 0) * 100)}%`,
            };

            const message =
                errorMessages[type as string] || `System under pressure: ${type} = ${value}`;

            loggerToUse.fatal(
                {
                    type,
                    value,
                    url: request.url,
                    method: request.method,
                },
                message
            );

            reply.code(503).send({
                error: 'Service Unavailable',
                message: 'The server is temporarily overloaded. Please try again later.',
                statusCode: 503,
                timestamp: new Date().toISOString(),
            });
        },

        healthCheck: async () => {
            try {
                await prisma.$queryRaw`SELECT 1`;
                loggerToUse.info(`Health check successful`);
                return {
                    database: 'healthy',
                    timestamp: new Date().toISOString(),
                };
            } catch (error) {
                loggerToUse.fatal(error, `Health check failed`);
                return false;
            }
        },

        healthCheckInterval: 60000,
        exposeStatusRoute: {
            url: '/health',
            routeOpts: {
                logLevel: 'info',
                config: {
                    description: 'Health check endpoint',
                },
            },
            routeSchemaOpts: {
                tags: ['health'],
                summary: 'Health check',
                description: 'Returns the health status of the server and system metrics',
            },
            routeResponseSchemaOpts: {
                database: { type: 'string' },
                timestamp: { type: 'string' },
                metrics: {
                    type: 'object',
                    properties: {
                        eventLoopDelay: { type: 'number' },
                        rssBytes: { type: 'number' },
                        heapUsed: { type: 'number' },
                        eventLoopUtilized: { type: 'number' },
                    },
                },
            },
        },
        sampleInterval: 1000,
    });

    fastify.decorate('getSystemMetrics', function (this: FastifyInstance) {
        const usage = this.memoryUsage();
        return {
            ...usage,
            isUnderPressure: this.isUnderPressure(),
            timestamp: new Date().toISOString(),
        };
    });

    loggerToUse.info(`Under-pressure initialized successfully`);
}
