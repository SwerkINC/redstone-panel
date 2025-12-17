import { isAuthenticated } from '@/middleware';

import { FastifyInstance } from 'fastify';

import { serverController } from './servers.controller';

export const serversRoutes = async (app: FastifyInstance) => {
    app.route({
        method: 'POST',
        url: '/create',
        preHandler: [isAuthenticated],
        handler: serverController.createServer,
    });

    app.route({
        method: 'GET',
        url: '/',
        preHandler: [isAuthenticated],
        handler: serverController.getAllServers,
    });
};
