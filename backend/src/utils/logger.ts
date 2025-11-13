import pino from 'pino';

/**
 * Create a unified logger that sends logs to both Loki and console
 */
const createUnifiedLogger = () => {
    const consoleTransport =
        process.env.NODE_ENV === 'development'
            ? {
                  target: 'pino-pretty',
                  options: {
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid,hostname,module',
                      colorize: true,
                  },
              }
            : undefined;

    return pino(
        {
            level: 'info',
        },
        pino.multistream([
            ...(consoleTransport ? [{ stream: pino.transport(consoleTransport) }] : []),
        ])
    );
};

// Export the unified logger
export const logger = createUnifiedLogger();
