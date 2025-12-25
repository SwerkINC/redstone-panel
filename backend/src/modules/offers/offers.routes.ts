import { isAuthenticated } from '@/middleware';

import { FastifyInstance } from 'fastify';

import { offersController } from './offers.controller';

export const offersRoutes = async (app: FastifyInstance) => {
    app.route({
        method: 'GET',
        url: '/',
        preHandler: [isAuthenticated],
        handler: offersController.getAllOffers,
    });
};
