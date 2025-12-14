import { FastifyInstance } from 'fastify';

import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import speakeasy from 'speakeasy';

import { buildApp } from '../src/app';
import prisma from '../src/config/prisma';
import { emailService } from '../src/services/email.service';

describe('AuthController', () => {
    let app: FastifyInstance;

    before(async () => {
        emailService.sendVerificationEmail = async () => {};
        app = await buildApp();
    });

    after(async () => {
        await app.close();
    });

    it('login should return 400 if email is in incorrect format', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'admin@app',
                password: 'Motdepasse123!',
            },
        });

        assert.strictEqual(response.statusCode, 400);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, 'Validation error');
    });

    it('login should return 400 if password is in incorrect format', async () => {
        let response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'admin@app.com',
                password: 'motdepasse',
            },
        });

        assert.strictEqual(response.statusCode, 400);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, 'Validation error');

        response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'admin@app.com',
                password: 'motdepasse123!',
            },
        });

        assert.strictEqual(response.statusCode, 400);
        const body2 = JSON.parse(response.payload);
        assert.strictEqual(body2.message, 'Validation error');
    });

    it('login should return 404 if user does not exist', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'nonexistent@app.com',
                password: 'Password123!',
            },
        });

        assert.strictEqual(response.statusCode, 404);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, "Account doesn't exist.");
    });

    it('login should return auth tokens if credentials are valid', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'admin@app.com',
                password: 'Motdepasse123!+',
            },
        });

        assert.strictEqual(response.statusCode, 200);
        const body = JSON.parse(response.payload);
        assert.ok(body.accessToken);
        assert.ok(body.refreshToken);
    });

    it('register should create user with verification token and return instruction', async () => {
        const email = 'newuser@app.com';
        const response = await app.inject({
            method: 'POST',
            url: '/auth/register',
            payload: {
                email,
                password: 'Password123!',
                username: 'newuser',
            },
        });

        assert.strictEqual(response.statusCode, 201);
        const body = JSON.parse(response.payload);
        assert.strictEqual(
            body.message,
            'User created. Please check your email to verify your account.'
        );

        const user = await prisma.user.findUnique({ where: { email } });
        assert.ok(user);
        assert.strictEqual(user.isVerified, false);
        assert.ok(user.verificationToken);
    });

    it('login should fail if user is not verified', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'newuser@app.com',
                password: 'Password123!',
            },
        });

        assert.strictEqual(response.statusCode, 403);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, 'Please verify your email address.');
    });

    it('verify-email should verify user with valid token', async () => {
        const email = 'newuser@app.com';
        const userBefore = await prisma.user.findUnique({ where: { email } });
        assert.ok(userBefore?.verificationToken);

        const response = await app.inject({
            method: 'GET',
            url: `/auth/verify-email?token=${userBefore.verificationToken}`,
        });

        assert.strictEqual(response.statusCode, 200);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, 'Email verified successfully.');

        const userAfter = await prisma.user.findUnique({ where: { email } });
        assert.strictEqual(userAfter?.isVerified, true);
        assert.strictEqual(userAfter?.verificationToken, null);
    });

    it('verify-email should fail with invalid token', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/auth/verify-email?token=invalid-token',
        });

        assert.strictEqual(response.statusCode, 400);
        const body = JSON.parse(response.payload);
        assert.strictEqual(body.message, 'Invalid or expired verification token.');
    });

    it('login should return auth tokens if user is verified', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: {
                email: 'newuser@app.com',
                password: 'Password123!',
            },
        });

        assert.strictEqual(response.statusCode, 200);
        const body = JSON.parse(response.payload);
        assert.ok(body.accessToken);
        assert.ok(body.refreshToken);
    });

    describe('2FA', () => {
        let secret: string;
        let userToken: string;

        before(async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'newuser@app.com',
                    password: 'Password123!',
                },
            });
            const body = JSON.parse(response.payload);
            userToken = body.accessToken;
        });

        it('should generate 2FA secret', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/2fa/generate',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            assert.strictEqual(response.statusCode, 200);
            const body = JSON.parse(response.payload);
            assert.ok(body.data.secret);
            assert.ok(body.data.qrCodeUrl);
            secret = body.data.secret;
        });

        it('should enable 2FA with valid code', async () => {
            const code = speakeasy.totp({
                secret,
                encoding: 'base32',
            });

            const response = await app.inject({
                method: 'POST',
                url: '/auth/2fa/enable',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
                payload: {
                    secret,
                    code,
                },
            });

            assert.strictEqual(response.statusCode, 200);

            const user = await prisma.user.findUnique({ where: { email: 'newuser@app.com' } });
            assert.strictEqual(user?.isTwoFactorEnabled, true);
        });

        it('should require 2FA code for login', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'newuser@app.com',
                    password: 'Password123!',
                },
            });

            assert.strictEqual(response.statusCode, 403);
            const body = JSON.parse(response.payload);
            assert.strictEqual(body.requires2FA, true);
        });

        it('should fail login with invalid 2FA code', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'newuser@app.com',
                    password: 'Password123!',
                    code: '123456',
                },
            });

            assert.strictEqual(response.statusCode, 400);
        });

        it('should login with valid 2FA code', async () => {
            const code = speakeasy.totp({
                secret,
                encoding: 'base32',
            });

            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'newuser@app.com',
                    password: 'Password123!',
                    code,
                },
            });

            assert.strictEqual(response.statusCode, 200);
            const body = JSON.parse(response.payload);
            assert.ok(body.accessToken);
        });

        it('should disable 2FA', async () => {
            // Need to login first to get token (or reuse existing if valid, but let's use the one we just got? No, userToken is from before 2FA was enabled?
            // Wait, the token I have in `userToken` was issued BEFORE 2FA was enabled.
            // Does enabling 2FA invalidate existing tokens? No, usually not.
            // But let's see if I can still use it.

            const response = await app.inject({
                method: 'POST',
                url: '/auth/2fa/disable',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            assert.strictEqual(response.statusCode, 200);

            const user = await prisma.user.findUnique({ where: { email: 'newuser@app.com' } });
            assert.strictEqual(user?.isTwoFactorEnabled, false);
        });
    });
});
