import { buildApp } from '@/app';

import { logger } from '@/utils';

const start = async () => {
    try {
        const app = await buildApp();

        await app.listen({ port: 3030, host: '0.0.0.0' });
        logger.info(`Server listening at http://0.0.0.0:3030`);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

start();
