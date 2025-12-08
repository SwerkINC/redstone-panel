import { User } from '@/config/prisma/client';

export const users: Pick<User, 'email' | 'password' | 'isVerified' | 'isTwoFactorEnabled'>[] = [
    {
        email: 'admin@app.com',
        password: 'Motdepasse123!+',
        isVerified: true,
        isTwoFactorEnabled: false,
    },
];
