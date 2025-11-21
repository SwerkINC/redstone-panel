import prisma from '@/config/prisma';

import { groups } from './groups';
import { generateId } from './utils';

async function main() {
    for (const group of groups) {
        await prisma.group.create({
            data: {
                id: await generateId(),
                ...group,
            },
        });
    }
}

main();
