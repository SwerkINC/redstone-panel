import prisma from '@/config/prisma';

import { dockerService } from '@/services';

import { idStringSchema, logger, reqValidate } from '@/utils';

import { randomUUID } from 'crypto';

import { createServerSchema, getAllServersSchema } from './servers.schema';

class ServerController {
    constructor() {}

    /** Create a new Server */
    public createServer = reqValidate(
        {
            body: createServerSchema,
        },
        async (req, reply) => {
            const { name, description, type, version } = req.body;
            const user = req.user;

            if (!user) {
                return reply.unauthorized('Unauthorized');
            }

            const serverName = `${user.username.replace(' ', '-').toLowerCase()}-${randomUUID()}`;
            logger.info({ serverName }, 'Creating server');
            await prisma
                .$transaction(async (tx) => {
                    logger.info({ serverName }, 'Creating server');
                    await dockerService.createServer({
                        name: serverName,
                        description,
                        type,
                        version,
                    });
                    logger.info({ serverName }, 'Server created');
                    const server = await tx.server.create({
                        data: {
                            name,
                            description,
                            port: 30000,
                            ip: '127.0.0.1',
                            version,
                            type,
                            dataPath: `${name}-data`,
                            memoryLimit: 1024,
                            cpuLimit: 1,
                            storageLimit: 1024,
                            user: {
                                connect: {
                                    id: user.id,
                                },
                            },
                        },
                    });
                    logger.info({ serverName }, 'Server created');
                    const containerInfo = await dockerService.getContainerInfo(serverName);
                    if (!containerInfo) {
                        logger.error({ serverName }, 'Failed to get container info');
                        return reply.internalServerError('Failed to create server');
                    }
                    await tx.dockerContainer.create({
                        data: {
                            containerId: containerInfo.Id,
                            name: serverName,
                            serverId: server.id,
                        },
                    });
                    logger.info({ serverName }, 'Docker container created');
                    return true;
                })
                .catch(async (error) => {
                    await dockerService.transactionDeleteServer(serverName);
                    logger.error({ error }, 'Failed to create server');
                    return reply.internalServerError('Failed to create server');
                });

            return reply.created(null, 'Server created successfully');
        }
    );

    /** Get all servers */
    public getAllServers = reqValidate(
        {
            query: getAllServersSchema,
        },
        async (req, reply) => {
            const { type, version, search, page, limit, sort, order } = req.query;
            const user = req.user;

            if (!user || !user.groups) {
                return reply.unauthorized('Unauthorized');
            }

            const servers = await prisma.server.findMany({
                orderBy: {
                    [sort || 'createdAt']: order || 'desc',
                },
                include: {
                    dockerContainer: true,
                    connections: true,
                },
                where: {
                    userId: user.groups.find((group) => group.name === 'Admin')
                        ? undefined
                        : user.id,
                    type: type ?? undefined,
                    version: version ?? undefined,
                    name: {
                        contains: search ?? undefined,
                        mode: 'insensitive',
                    },
                    description: {
                        contains: search ?? undefined,
                        mode: 'insensitive',
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            const containerIds = servers
                .map((server) => server.dockerContainer?.containerId)
                .filter((id) => id !== undefined);
            const containersStatus = await dockerService.getContainersStatus(containerIds);

            const serversWithStatus = servers.map((server) => ({
                ...server,
                isRunning: containersStatus[server.dockerContainer?.containerId ?? ''] ?? false,
            }));

            return reply.success(serversWithStatus);
        }
    );

    /** Get a server by id */
    public getServerById = reqValidate(
        {
            params: idStringSchema,
        },
        async (req, reply) => {
            const { id } = req.params;
            const user = req.user;

            if (!user || !user.groups) {
                return reply.unauthorized('Unauthorized');
            }

            const server = await prisma.server.findUnique({
                where: {
                    id,
                    userId: user.groups.find((group) => group.name === 'Admin')
                        ? undefined
                        : user.id,
                },
            });

            if (!server) {
                return reply.notFound('Server not found');
            }

            return reply.success(server);
        }
    );

    /** Start a server */
    public startServer = reqValidate(
        {
            params: idStringSchema,
        },
        async (req, reply) => {
            const { id } = req.params;
            const user = req.user;

            if (!user || !user.groups) {
                return reply.unauthorized('Unauthorized');
            }

            const server = await prisma.server.findUnique({
                where: { id, userId: user.id },
                include: {
                    dockerContainer: true,
                },
            });

            if (!server) {
                return reply.notFound('Server not found');
            }

            await dockerService.startContainer(server.dockerContainer?.containerId ?? '');

            return reply.success(server);
        }
    );

    /** Stop a server */
    public stopServer = reqValidate(
        {
            params: idStringSchema,
        },
        async (req, reply) => {
            const { id } = req.params;
            const user = req.user;

            if (!user || !user.groups) {
                return reply.unauthorized('Unauthorized');
            }

            const server = await prisma.server.findUnique({
                where: { id, userId: user.id },
                include: {
                    dockerContainer: true,
                },
            });

            if (!server) {
                return reply.notFound('Server not found');
            }

            await dockerService.stopContainer(server.dockerContainer?.containerId ?? '');

            return reply.success(server);
        }
    );
}

export const serverController = new ServerController();
