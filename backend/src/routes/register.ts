import { FastifyInstance } from 'fastify';

import { authRoutes } from '@/modules/auth';

export const registerRoutes = (app: FastifyInstance) => {
    app.register(authRoutes, {
        prefix: '/auth',
    });
};
