import { defineConfig } from 'prisma/config';

import 'dotenv/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        seed: 'ts-node -r @swc-node/register -r tsconfig-paths/register prisma/fixtures/index.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
