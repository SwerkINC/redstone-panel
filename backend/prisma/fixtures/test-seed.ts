import prisma from '@/config/prisma';

import bcrypt from 'bcrypt';

import { groups } from './groups';
import { generateId } from './utils';

/**
 * Seed the test database with initial data for groups and an admin user.
 */
async function main(): Promise<void> {
    // Clean up existing data
    await Promise.all([
        prisma.permissions.deleteMany(),
        prisma.user.deleteMany(),
        prisma.group.deleteMany(),
    ]);

    // Create Groups concurrently
    await Promise.all(
        groups.map(async (group) =>
            prisma.group.create({
                data: {
                    id: await generateId(),
                    ...group,
                },
            })
        )
    );

    // Find Admin group by name
    const adminGroup = await prisma.group.findUnique({
        where: { name: 'Admin' },
    });

    if (!adminGroup) {
        throw new Error('Admin group not found');
    }

    const hashedPassword: string = await bcrypt.hash('Motdepasse123!+', 10);

    // Create Admin User
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
    .catch((err: unknown) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
