import { isAuthenticated } from '@/middleware';

import { FastifyInstance } from 'fastify';

import { authController } from './auth.controller';

export const authRoutes = async (app: FastifyInstance) => {
    app.post('/register', authController.register);
    app.post('/login', authController.login);
    app.get('/verify-email', authController.verifyEmail);
    app.route({
        method: 'GET',
        url: '/me',
        preHandler: [isAuthenticated],
        handler: authController.me,
    });
    app.post('/2fa/generate', { preHandler: [isAuthenticated] }, authController.generate2FA);
    app.post('/2fa/enable', { preHandler: [isAuthenticated] }, authController.enable2FA);
    app.post('/2fa/disable', { preHandler: [isAuthenticated] }, authController.disable2FA);
};

export default authRoutes;
