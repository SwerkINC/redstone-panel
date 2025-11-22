import { FastifyInstance } from 'fastify';

import { authRoutes } from '@/modules/auth';
import { serversRoutes } from '@/modules/servers';

export const registerRoutes = (app: FastifyInstance) => {
    app.register(authRoutes, {
        prefix: '/auth',
    });
    app.register(serversRoutes, {
        prefix: '/servers',
    });
};
