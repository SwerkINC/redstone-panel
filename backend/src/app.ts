import Fastify, { FastifyInstance } from 'fastify';

import { registerRoutes } from '@/routes';

import configurePlugins from '@/plugins';

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify();

    await configurePlugins(app);

    await registerRoutes(app);

    await app.get('/', async (req, reply) => {
        return reply.send('Hello World');
    });

    return app;
}
