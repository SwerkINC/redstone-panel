import Fastify from 'fastify';

import configurePlugins from '@/plugins';

import { logger } from '@/utils';

const app = Fastify();

const start = async () => {
    try {
        await configurePlugins(app);

        await app.listen({ port: 3001 });
        logger.info(`Server listening at http://localhost:3001`);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

start();
