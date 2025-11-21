import { Prisma } from '@/config/prisma/client';

import { emailService } from '@/services';

import { logger, reqValidate } from '@/utils';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import z from 'zod';

import { loginSchema, registerSchema, tokenSchema } from './auth.schema';
import { AuthService } from './auth.service';

class AuthController {
    private authService: AuthService;
    private logger: Logger;
    constructor() {
        this.authService = new AuthService();
        this.logger = logger.child({
            module: '[Auth]',
        });
    }

    register = reqValidate(
        {
            body: registerSchema,
        },
        async (req, reply) => {
            const { password, ...rest } = req.body;

            const userExist = await this.authService.findBy({
                email: req.body.email,
            });

            if (userExist) {
                return reply.conflict('Email is already taken.');
            }

            await prisma?.$transaction(async (tx: Prisma.TransactionClient) => {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await this.authService.register(
                    {
                        ...rest,
                        password: hashedPassword,
                    },
                    tx
                );

                if (user.verificationToken) {
                    await emailService.sendVerificationEmail(user.email, user.verificationToken);
                }

                this.logger.info({ user: user.id }, 'User registered successfully');
                return reply.created(
                    null,
                    'User created. Please check your email to verify your account.'
                );
            });
        }
    );

    login = reqValidate(
        {
            body: loginSchema,
        },
        async (req, reply) => {
            const { email, password, code } = req.body;
            const user = await this.authService.findBy({ email });

            if (!user) {
                return reply.notFound("Account doesn't exist.");
            }

            if (!user.isVerified) {
                return reply.forbidden('Please verify your email address.');
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return reply.badRequest('Invalid credentials.');
            }

            if (user.isTwoFactorEnabled) {
                if (!code) {
                    return reply.status(403).send({
                        message: 'Two-factor authentication required.',
                        requires2FA: true,
                    });
                }

                const verified = this.authService.verifyTwoFactorToken(user.twoFactorSecret!, code);

                if (!verified) {
                    return reply.badRequest('Invalid two-factor code.');
                }
            }

            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
                expiresIn: 60 * 60,
            });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
                expiresIn: 60 * 60 * 30,
            });

            this.logger.info('User logged in.');

            return reply.auth(accessToken, refreshToken);
        }
    );

    me = reqValidate({}, async (req, reply) => {
        return reply.success(req.user);
    });

    verifyEmail = reqValidate(
        {
            query: tokenSchema,
        },
        async (req, reply) => {
            const { token } = req.query;
            await this.authService.verifyEmail(token);
            return reply.success(null, 200, 'Email verified successfully.');
        }
    );

    generate2FA = reqValidate({}, async (req, reply) => {
        if (req.user.isTwoFactorEnabled) {
            return reply.badRequest('Two-factor authentication is already enabled.');
        }

        const { secret, qrCodeUrl } = await this.authService.generateTwoFactorSecret(
            req.user.email
        );

        return reply.success({
            secret,
            qrCodeUrl,
        });
    });

    enable2FA = reqValidate(
        {
            body: z.object({
                code: z.string().length(6),
                secret: z.string(),
            }),
        },
        async (req, reply) => {
            const { code, secret } = req.body;

            const verified = this.authService.verifyTwoFactorToken(secret, code);
            if (!verified) {
                return reply.badRequest('Invalid two-factor code.');
            }

            await this.authService.enableTwoFactor(req.user.id, secret);

            return reply.success(null, 200, 'Two-factor authentication enabled.');
        }
    );

    disable2FA = reqValidate({}, async (req, reply) => {
        await this.authService.disableTwoFactor(req.user.id);
        return reply.success(null, 200, 'Two-factor authentication disabled.');
    });
}

export const authController = new AuthController();
