export interface LoginRequest {
    email: string;
    password: string;
    code?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    requires2FA?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
}
