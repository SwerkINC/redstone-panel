import { FastifyInstance } from 'fastify';

import { authRoutes } from '@/modules/auth';
import { offersRoutes } from '@/modules/offers';
import { serversRoutes } from '@/modules/servers';

export const registerRoutes = (app: FastifyInstance) => {
    app.register(authRoutes, {
        prefix: 'api/auth',
    });

    app.register(serversRoutes, {
        prefix: 'api/servers',
    });

    app.register(offersRoutes, {
        prefix: 'api/offers',
    });
};
