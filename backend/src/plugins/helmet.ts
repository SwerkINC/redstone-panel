import { FastifyInstance } from 'fastify';

import { fastifyHelmet } from '@fastify/helmet';

export async function helmetPlugin(app: FastifyInstance) {
    await app.register(fastifyHelmet, {
        contentSecurityPolicy:
            process.env.NODE_ENV === 'production'
                ? {
                      directives: {
                          defaultSrc: ["'self'"],
                          scriptSrc: ["'self'", 'https:'],
                          styleSrc: ["'self'", 'https:'],
                          imgSrc: ["'self'", 'data:', 'https:'],
                      },
                  }
                : false,
        hidePoweredBy: true,
        hsts:
            process.env.NODE_ENV === 'production'
                ? { maxAge: 31536000, includeSubDomains: true, preload: true }
                : undefined,
        noSniff: true,
        xssFilter: true,
        frameguard: { action: 'deny' },
    });
}
