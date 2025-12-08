import { FastifyInstance } from 'fastify';

import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

export const corsPlugin = async (fastify: FastifyInstance) => {
    fastify.register(cors, {
        origin:
            process.env.NODE_ENV === 'production'
                ? process.env.ALLOW_CORS_ORIGIN
                : 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
};
