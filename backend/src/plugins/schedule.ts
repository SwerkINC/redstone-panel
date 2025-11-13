import { FastifyInstance } from 'fastify';

import { scheduleService } from '@/services';

import { fastifySchedule } from '@fastify/schedule';

export async function schedulePlugin(fastify: FastifyInstance) {
    await fastify.register(fastifySchedule);

    fastify.ready().then(() => {
        scheduleService.initializeScheduler(fastify);
    });
}
