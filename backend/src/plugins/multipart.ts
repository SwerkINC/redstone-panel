import { FastifyInstance } from 'fastify';

import fastifyMultipart from '@fastify/multipart';

export async function multipartPlugin(fastify: FastifyInstance) {
    fastify.register(fastifyMultipart, {
        limits: {
            fieldNameSize: 100,
            fieldSize: 100 * 1024,
            fields: 10,
            fileSize: 1024 * 1024 * 1024, // 1 Go
            files: 1,
            headerPairs: 2000,
        },
        attachFieldsToBody: true,
    });
}
