import { FastifyReply, FastifyRequest } from 'fastify';

import prisma from '@/config/prisma';

import { logger } from '@/utils';

import jwt, { JwtPayload } from 'jsonwebtoken';

export async function isAuthenticated(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.unauthorized('No valid token provided');
        }

        const token = authHeader.split(' ')[1].trim();

        if (!process.env.JWT_KEY) {
            logger.error('JWT_KEY is not defined');
            return reply.internalServerError('Internal server error');
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY) as JwtPayload & { id: string };

        if (!decoded?.id) {
            return reply.unauthorized('Invalid token format');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                isTwoFactorEnabled: true,
                isVerified: true,
                groups: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            return reply.notFound('User not found');
        }

        req.user = user;
    } catch (error) {
        logger.error({ error }, 'Authentication error');
        if (error instanceof jwt.JsonWebTokenError) {
            return reply.unauthorized('Invalid token');
        }
        if (error instanceof jwt.TokenExpiredError) {
            return reply.unauthorized('Token expired');
        }
        return reply.internalServerError('Authentication failed');
    }
}
