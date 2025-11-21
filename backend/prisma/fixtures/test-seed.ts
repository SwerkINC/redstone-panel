import prisma from '@/config/prisma';

import bcrypt from 'bcrypt';

import { groups } from './groups';
import { generateId } from './utils';

async function main() {
    // Clean up existing data
    await prisma.permissions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.group.deleteMany();

    // Create Groups
    for (const group of groups) {
        await prisma.group.create({
            data: {
                id: await generateId(),
                ...group,
            },
        });
    }

    // Create Admin User
    const adminGroup = await prisma.group.findUnique({
        where: { name: 'Admin' },
    });

    if (!adminGroup) {
        throw new Error('Admin group not found');
    }

    const hashedPassword = await bcrypt.hash('Motdepasse123!+', 10);

    await prisma.user.create({
        data: {
            id: await generateId(),
            email: 'admin@app.com',
            password: hashedPassword,
            username: 'Admin User',
            isVerified: true,
            groups: {
                connect: {
                    id: adminGroup.id,
                },
            },
        },
    });

    console.log('Test database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
