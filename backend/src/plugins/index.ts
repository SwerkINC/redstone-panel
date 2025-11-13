import { FastifyInstance } from 'fastify';

import {
    corsPlugin,
    helmetPlugin,
    multipartPlugin,
    pressurePlugin,
    rateLimiterPlugin,
    schedulePlugin,
    sensiblePlugin,
} from '@/plugins';

export * from './cors';
export * from './helmet';
export * from './multipart';
export * from './pressure';
export * from './rateLimiter';
export * from './schedule';
export * from './sensible';

export default async function configurePlugins(app: FastifyInstance): Promise<void> {
    await helmetPlugin(app);
    await corsPlugin(app);
    await multipartPlugin(app);
    await pressurePlugin(app);
    await rateLimiterPlugin(app);
    await sensiblePlugin(app);
    await schedulePlugin(app);
}
