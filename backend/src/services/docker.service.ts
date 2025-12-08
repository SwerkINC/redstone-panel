import { spawn } from 'child_process';
import { createServer as createNetServer } from 'net';

class DockerService {
    constructor() {}

    async createServer({ name, description }: { name: string; description: string }) {
        let port = 30000;

        while (!(await this.isPortAvailable(port))) {
            port++;
        }

        return new Promise((resolve, reject) => {
            const args = [
                'run',
                '-d',
                '--name',
                name,
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
}

export const dockerService = new DockerService();
