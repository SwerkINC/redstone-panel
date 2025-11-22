import { FastifyInstance } from 'fastify';

import { serverController } from './servers.controller';

export const serversRoutes = async (app: FastifyInstance) => {
    app.route({
        method: 'POST',
        url: '/create',
        preHandler: [],
        handler: serverController.createServer,
    });
};
