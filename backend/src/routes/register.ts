import { FastifyInstance } from 'fastify';

import { authRoutes } from '@/modules/auth';
import { serversRoutes } from '@/modules/servers';

export const registerRoutes = (app: FastifyInstance) => {
    app.register(authRoutes, {
        prefix: 'api/auth',
    });

    app.register(serversRoutes, {
        prefix: 'api/servers',
    });
};
