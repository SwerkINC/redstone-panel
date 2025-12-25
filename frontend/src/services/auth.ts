import type { LoginSchemaType, RegisterSchemaType } from '@/schemas/auth';
import type { ApiResponse, LoginResponse, User } from '@/types';

import api from './api';

/** Auth service */
export const authService = {
    /**
     * Login user
     * @param credentials {LoginRequest} - Login request
     * @returns {Promise<LoginResponse>} - Login response
     */
    async login(credentials: LoginSchemaType): Promise<LoginResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     * @param data {RegisterRequest} - Register request
     * @returns {Promise<void>} - Register response
     */
    async register(data: RegisterSchemaType): Promise<void> {
        await api.post('/auth/register', data);
    },

    /**
     * Get current user info
     * @returns {Promise<ApiResponse<User>>} - User info
     */
    async me(): Promise<ApiResponse<User>> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Verify email with token
     * @param token {string} - Verification token
     * @returns {Promise<void>} - Verification response
     */
    async verifyEmail(token: string): Promise<void> {
        await api.get('/auth/verify-email', { params: { token } });
    },

    /**
     * Generate 2FA secret and QR code
     * @returns {Promise<ApiResponse<{ secret: string; qrCodeUrl: string }>>} - 2FA secret and QR code
     */
    async generate2FA(): Promise<ApiResponse<{ secret: string; qrCodeUrl: string }>> {
        const response = await api.post('/auth/2fa/generate');
        return response.data;
    },

    /**
     * Enable 2FA with code verification
     * @param code {string} - Verification code
     * @param secret {string} - 2FA secret
     * @returns {Promise<void>} - 2FA enable response
     */
    async enable2FA(code: string, secret: string): Promise<void> {
        await api.post('/auth/2fa/enable', { code, secret });
    },

    /**
     * Disable 2FA
     * @returns {Promise<void>} - 2FA disable response
     */
    async disable2FA(): Promise<void> {
        await api.post('/auth/2fa/disable');
    },
};
