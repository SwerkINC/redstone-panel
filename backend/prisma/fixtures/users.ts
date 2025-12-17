import { User } from '@/config/prisma/client';

export const users: Pick<
    User,
    'email' | 'password' | 'isVerified' | 'isTwoFactorEnabled' | 'username'
>[] = [
    {
        email: 'admin@app.com',
        username: 'Admin User',
        password: 'Motdepasse123!+',
        isVerified: true,
        isTwoFactorEnabled: false,
    },
];
