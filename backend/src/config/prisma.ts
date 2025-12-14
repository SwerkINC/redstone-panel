import { PrismaClient } from '@/config/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}

declare global {
    var prisma: PrismaClient;
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['info', 'warn', 'error'],
        adapter,
    });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
