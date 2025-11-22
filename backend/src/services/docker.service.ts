import { spawn } from 'child_process';

class DockerService {
    constructor() {}

    async createServer({ name, description }: { name: string; description: string }) {
        return new Promise((resolve, reject) => {
            const args = [
                'run',
                '-d',
                '--name',
                name,
                '-p',
                '30000:25565',
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
}

export const dockerService = new DockerService();
