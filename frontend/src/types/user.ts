enum RoleEnum {
    ADMIN = 'Admin',
    USER = 'User',
}

export interface Role {
    id?: string;
    name: RoleEnum;
}

export interface User {
    id: string;
    email: string;
    username: string;
    name?: string;
    avatar?: string;
    groups: Role[];
    isVerified: boolean;
    isTwoFactorEnabled: boolean;
}
