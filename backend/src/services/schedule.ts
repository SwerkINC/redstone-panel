import { FastifyInstance } from 'fastify';

import { logger } from '@/utils/logger';

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';

class ScheduleService {
    private logger = logger.child({
        module: `[${process.env.APP_NAME}][ScheduleService]`,
    });
    private scheduler: ToadScheduler | null = null;

    constructor() {
        this.logger.info(`ScheduleService initialized successfully`);
    }

    initializeScheduler(fastify: FastifyInstance) {
        if (!fastify.scheduler) {
            this.logger.error(
                'Fastify scheduler not available. Make sure @fastify/schedule plugin is registered.'
            );
            return;
        }

        this.scheduler = fastify.scheduler;
        this.logger.info('Scheduler initialized successfully');
        this.start('log', () => this.log(), 86400);
    }

    /**
     * Démarre une fonction avec un intervalle spécifié
     * @param name - Nom du job
     * @param func - Fonction à exécuter
     * @param intervalSeconds - Intervalle en secondes
     */
    private start(name: string, func: () => Promise<void> | void, intervalSeconds: number): void {
        if (!this.scheduler) {
            this.logger.error('Scheduler not initialized. Call initializeScheduler first.');
            return;
        }

        const task = new AsyncTask(
            name,
            async () => {
                try {
                    this.logger.info(`Executing job: ${name}`);
                    await func();
                    this.logger.info(`Job ${name} completed successfully`);
                } catch (error) {
                    this.logger.error(error, `Error executing job ${name}`);
                    throw error;
                }
            },
            (err) => {
                this.logger.error(err, `Job ${name} failed`);
            }
        );

        const job = new SimpleIntervalJob({ seconds: intervalSeconds }, task);

        this.scheduler.addSimpleIntervalJob(job);
        this.logger.info(`Job ${name} scheduled to run every ${intervalSeconds} seconds`);
    }

    /**
     * ======== COMMANDES ========
     */

    private async log(): Promise<void> {
        console.log('log');
    }
}

export const scheduleService = new ScheduleService();
