import { FastifyInstance, FastifyReply } from 'fastify';

import { PaginationMeta } from '@/types';

import fastifySensible from '@fastify/sensible';

export async function sensiblePlugin(app: FastifyInstance) {
    await app.register(fastifySensible, {
        sharedSchemaId: 'HttpError',
    });

    app.decorateReply(
        'success',
        function (
            this: FastifyReply,
            data?: unknown,
            statusCode = 200,
            message = 'Request successful',
            pagination?: PaginationMeta
        ) {
            this.code(statusCode);
            this.header('Content-Type', 'application/json; charset=utf-8');

            let finalData = data;
            if (Array.isArray(finalData)) {
                finalData = [...finalData];
            }

            const response = {
                message,
                data: finalData ?? null,
                status: statusCode,
                timestamp: new Date().toISOString(),
                pagination: pagination ?? undefined,
            };

            const jsonString = JSON.stringify(response);
            return this.send(jsonString);
        }
    );

    // Decorate the reply to send a successful response with a 201 status code
    app.decorateReply(
        'created',
        function (this: FastifyReply, data?: unknown, message = 'Resource created successfully') {
            return this.success(data, 201, message);
        }
    );

    // Decorate the reply to send an authentication response
    app.decorateReply(
        'auth',
        function (this: FastifyReply, accessToken: string, refreshToken: string) {
            this.code(200);
            this.header('Content-Type', 'application/json; charset=utf-8');
            const response = {
                accessToken,
                refreshToken,
            };
            const jsonString = JSON.stringify(response);
            return this.send(jsonString);
        }
    );

    // Decorate the reply to send a no content response
    app.decorateReply('noContent', function (this: FastifyReply) {
        this.code(204);
        return this.send();
    });

    // Decorate the reply to send a bad request response
    app.decorateReply(
        'validationError',
        function (this: FastifyReply, message?: string, details?: Record<string, unknown>) {
            const payload = {
                statusCode: 400,
                error: 'Bad Request',
                message: message ?? 'Bad Request',
                ...(details || {}),
            };
            this.code(400);
            this.header('Content-Type', 'application/json; charset=utf-8');
            return this.send(payload);
        }
    );
}
