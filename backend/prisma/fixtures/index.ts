import prisma from '@/config/prisma';

import bcrypt from 'bcrypt';

import { groups } from './groups';
import { users } from './users';
import { generateId } from './utils';

async function main() {
    await Promise.all(
        groups.map(async (group) => {
            await prisma.group.create({
                data: {
                    id: await generateId(),
                    ...group,
                },
            });
        })
    );

    const adminGroup = await prisma.group.findFirst({
        where: {
            name: 'Admin',
        },
    });

    await Promise.all(
        users.map(async (user) => {
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
        })
    );
}

main();
