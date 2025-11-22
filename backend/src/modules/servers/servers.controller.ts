import { dockerService } from '@/services';

import { reqValidate } from '@/utils';

import { createServerSchema } from './servers.schema';

class ServerController {
    constructor() {}

    createServer = reqValidate(
        {
            body: createServerSchema,
        },
        async (req, reply) => {
            const { name, description } = req.body;
            const server = await dockerService.createServer({
                name,
                description,
            });
            return reply.success(server);
        }
    );
}

export const serverController = new ServerController();
