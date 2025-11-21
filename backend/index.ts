import { buildApp } from '@/app';

import { logger } from '@/utils';

const start = async () => {
    try {
        const app = await buildApp();

        await app.listen({ port: 3030 });
        logger.info(`Server listening at http://localhost:3030`);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

start();
