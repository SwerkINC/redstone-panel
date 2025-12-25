import prisma from '@/config/prisma';

import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { groups } from './groups';
import { offers } from './offers';
import { users } from './users';

async function main() {
    await Promise.all([
        prisma.serverConnections.deleteMany(),
        prisma.dockerContainer.deleteMany(),
        prisma.server.deleteMany(),
        prisma.offer.deleteMany(),
        prisma.permissions.deleteMany(),
        prisma.group.deleteMany(),
        prisma.user.deleteMany(),
    ]);

    await Promise.all(
        offers.map(async (offer) => {
            await prisma.offer.create({
                data: {
                    id: randomUUID(),
                    ...offer,
                },
            });
        })
    );

    await Promise.all(
        groups.map(async (group) => {
            await prisma.group.create({
                data: {
                    id: randomUUID(),
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
                    id: randomUUID(),
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
