import { ServerType } from '@/config/prisma/enums';

import { DockerContainerInfo } from '@/types';

import { logger } from '@/utils';

import { exec, spawn } from 'child_process';
import { createServer as createNetServer } from 'net';
import { promisify } from 'util';

const execAsync = promisify(exec);

/** Docker service */
export class DockerService {
    constructor() {}

    /**
     * Create a new server
     * @param name {string} - Server name
     * @param description {string} - Server description
     * @param type {ServerType} - Server type
     * @param version {string} - Server version
     * @returns {Promise<string>} - Server output
     */
    async createServer({
        name,
        description,
        type,
        version,
    }: {
        name: string;
        description: string;
        type: ServerType;
        version: string;
    }): Promise<string> {
        let port = 30000;

        port = await new Promise<number>((resolve) => {
            let checkPort = port;
            const checkNextPort = async () => {
                const isAvailable = await this.isPortAvailable(checkPort);
                if (isAvailable) {
                    resolve(checkPort);
                } else {
                    checkPort += 1;
                    checkNextPort();
                }
            };
            checkNextPort();
        });

        return new Promise((resolve, reject) => {
            const args = [
                'run',
                '-d',
                '--name',
                name,
                '--env',
                `TYPE=${type}`,
                '--env',
                `VERSION=${version}`,
                '-p',
                `${port}:25565`,
                '-e',
                `EULA=TRUE`,
                '-e',
                `MOTD=${description}`,
                '-v',
                `${name}-data:/data`,
                'itzg/minecraft-server',
            ];

            const docker = spawn('docker', args);

            let output = '';
            let errorOutput = '';

            docker.stdout.on('data', (data) => (output += data.toString()));
            docker.stderr.on('data', (data) => (errorOutput += data.toString()));

            docker.on('close', (code) => {
                if (code === 0) resolve(output.trim());
                else reject(new Error(errorOutput || `Docker exited with code ${code}`));
            });
        });
    }

    async transactionDeleteServer(serverName: string): Promise<void> {
        await execAsync(`docker stop ${serverName}`);
        await execAsync(`docker rm ${serverName}`);
    }

    /**
     * Check if a port is available
     * @param port {number} - Port number
     * @returns {Promise<boolean>} - True if port is available
     */
    private isPortAvailable(port: number): Promise<boolean> {
        return new Promise((resolve) => {
            const server = createNetServer();
            server.once('error', () => resolve(false));
            server.once('listening', () => {
                server.close(() => resolve(true));
            });
            server.listen(port);
        });
    }

    /**
     * Check if a Docker container is running
     * @param containerName {string} - Container name
     * @returns {Promise<boolean>} - True if container is running
     */
    async isContainerRunning(containerName: string): Promise<boolean> {
        try {
            const { stdout } = await execAsync(
                `docker ps --filter "name=${containerName}" --format "{{.Names}}"`
            );
            return stdout.trim() === containerName;
        } catch {
            return false;
        }
    }

    /**
     * Get status of multiple containers
     * @param containerNames {string[]} - Array of container names
     * @returns {Promise<Record<string, boolean>>} - Map of container names to their running status
     */
    async getContainersStatus(containerIds: string[]): Promise<Record<string, boolean>> {
        if (containerIds.length === 0) {
            return {};
        }

        try {
            const statusResults = await Promise.all(
                containerIds.map(async (containerId) => {
                    try {
                        const { stdout } = await execAsync(
                            `docker ps --filter "id=${containerId}" --format "{{.Status}}"`
                        );
                        const isRunning = stdout.trim().startsWith('Up');
                        return { containerId, isRunning };
                    } catch {
                        return { containerId, isRunning: false };
                    }
                })
            );

            const containersStatus: Record<string, boolean> = {};
            statusResults.forEach(({ containerId, isRunning }) => {
                containersStatus[containerId] = isRunning;
            });

            logger.info({ containersStatus }, 'Fetched containers running status.');
            return containersStatus;
        } catch (err) {
            logger.error({ err }, 'Failed to check containers status');
            return {};
        }
    }

    /**
     * Get information about a Docker container
     * @param containerName {string} - Container name
     * @returns {Promise<JSON | null>} - Docker container information
     */
    async getContainerInfo(containerName: string): Promise<DockerContainerInfo | null> {
        try {
            const { stdout } = await execAsync(
                `docker inspect ${containerName} --format "{{json .}}"`
            );
            return JSON.parse(stdout);
        } catch {
            return null;
        }
    }

    /**
     * Start a Docker container
     * @param containerId {string} - Container ID
     * @returns {Promise<void>} - Start container
     */
    async startContainer(containerId: string): Promise<void> {
        await execAsync(`docker start ${containerId}`);
    }

    /**
     * Stop a Docker container
     * @param containerId {string} - Container ID
     * @returns {Promise<void>} - Stop container
     */
    async stopContainer(containerId: string): Promise<void> {
        await execAsync(`docker stop ${containerId}`);
    }
}

export const dockerService = new DockerService();
