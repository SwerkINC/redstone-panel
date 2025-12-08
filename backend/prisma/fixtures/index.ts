import prisma from '@/config/prisma';

import bcrypt from 'bcrypt';

import { groups } from './groups';
import { users } from './users';
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

    const adminGroup = await prisma.group.findFirst({
        where: {
            name: 'Admin',
        },
    });
    for (const user of users) {
        await prisma.user.create({
            data: {
                id: await generateId(),
                ...user,
                password: await bcrypt.hash(user.password, 10),
                groups: {
                    connect: {
                        id: adminGroup?.id,
                    },
                },
            },
        });
    }
}

main();
