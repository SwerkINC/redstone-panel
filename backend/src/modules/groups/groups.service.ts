import prisma from '@/config/prisma';
import { Group, Prisma } from '@/config/prisma/client';

export class GroupsService {
    public findBy = (where: Partial<Prisma.GroupWhereInput>): Promise<Group | null> => {
        return prisma.group.findFirst({ where });
    };
}
