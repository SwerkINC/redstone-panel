import { FastifyInstance } from 'fastify';

import { logger } from '@/utils/logger';

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';

/** Schedule service */
export class ScheduleService {
    private logger = logger.child({
        module: `[${process.env.APP_NAME}][ScheduleService]`,
    });
    private scheduler: ToadScheduler | null = null;

    constructor() {
        this.logger.info(`ScheduleService initialized successfully`);
    }

    /**
     * Initialize the scheduler
     * @param fastify {FastifyInstance} - Fastify instance
     * @returns {void} - Scheduler initialized successfully
     */
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
     * Start a function with a specified interval
     * @param name {string} - Job name
     * @param func {() => Promise<void> | void} - Function to execute
     * @param intervalSeconds {number} - Interval in seconds
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

    /**
     * Log command
     * @returns {Promise<void>} - Log command executed successfully
     */
    private async log(): Promise<void> {
        console.log('log');
    }
}

export const scheduleService = new ScheduleService();
