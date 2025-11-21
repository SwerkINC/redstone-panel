import prisma from '@/config/prisma';
import { Prisma, User } from '@/config/prisma/client';

import { GroupsService } from '@/modules/groups';

import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
    private groupsService: GroupsService;

    constructor() {
        this.groupsService = new GroupsService();
    }

    public register = async (
        data: Prisma.UserCreateInput,
        tx: Prisma.TransactionClient
    ): Promise<User> => {
        const group = await this.groupsService.findBy({ name: 'User' });

        if (!group) {
            throw new Error('Group not found');
        }

        return tx.user.create({
            data: {
                ...data,
                verificationToken: uuidv4(),
                isVerified: false,
                groups: {
                    connect: {
                        id: group.id,
                    },
                },
            },
        });
    };

    public findBy = (
        where: Partial<Prisma.UserGetPayload<{}>>,
        include?: Prisma.UserInclude
    ): Promise<User | null> => {
        return prisma.user.findFirst({
            where,
            include,
        });
    };

    public verifyEmail = async (token: string): Promise<User> => {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new Error('Invalid verification token');
        }

        return prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
    };

    public generateTwoFactorSecret = async (email: string) => {
        const secret = speakeasy.generateSecret({
            name: `Redstone Panel (${email})`,
        });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        return {
            secret: secret.base32,
            qrCodeUrl,
        };
    };

    public verifyTwoFactorToken = (secret: string, token: string): boolean => {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
        });
    };

    public enableTwoFactor = async (userId: string, secret: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: {
                isTwoFactorEnabled: true,
                twoFactorSecret: secret,
            },
        });
    };

    public disableTwoFactor = async (userId: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: {
                isTwoFactorEnabled: false,
                twoFactorSecret: null,
            },
        });
    };
}
