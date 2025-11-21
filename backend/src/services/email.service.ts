import { logger } from '@/utils';

import * as Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;
    private brevoApi: Brevo.TransactionalEmailsApi;

    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.brevoApi = new Brevo.TransactionalEmailsApi();
            this.brevoApi.setApiKey(
                Brevo.TransactionalEmailsApiApiKeys.apiKey,
                process.env.BREVO_API_KEY || ''
            );
        } else {
            this.transporter = nodemailer.createTransport({
                host: process.env.NM_HOST || 'localhost',
                port: Number(process.env.NM_PORT) || 1025,
                secure: false,
                ignoreTLS: true,
            });
        }
    }

    async sendVerificationEmail(email: string, token: string) {
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
        const subject = 'Verify your email address';
        const htmlContent = `
            <h1>Verify your email</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">${verificationLink}</a>
        `;

        if (process.env.NODE_ENV === 'production') {
            const sendSmtpEmail = new Brevo.SendSmtpEmail();
            sendSmtpEmail.to = [{ email }];
            sendSmtpEmail.sender = { email: 'no-reply@redstone.com', name: 'Redstone Panel' };
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = htmlContent;

            try {
                await this.brevoApi.sendTransacEmail(sendSmtpEmail);
                logger.info({ email }, 'Verification email sent via Brevo');
            } catch (error) {
                logger.error({ error, email }, 'Failed to send verification email via Brevo');
                throw new Error('Failed to send verification email');
            }
        } else {
            try {
                await this.transporter.sendMail({
                    from: '"Redstone Panel" <no-reply@redstone.com>',
                    to: email,
                    subject,
                    html: htmlContent,
                });
                logger.info({ email }, 'Verification email sent via Nodemailer (Mailpit)');
            } catch (error) {
                logger.error({ error, email }, 'Failed to send verification email via Nodemailer');
                throw new Error('Failed to send verification email');
            }
        }
    }
}

export const emailService = new EmailService();
