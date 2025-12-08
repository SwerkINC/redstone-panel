import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";
import api from "./api";

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<void> {
    await api.post("/auth/register", data);
  },

  /**
   * Get current user info
   */
  async me(): Promise<ApiResponse<User>> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await api.get("/auth/verify-email", { params: { token } });
  },

  /**
   * Generate 2FA secret and QR code
   */
  async generate2FA(): Promise<
    ApiResponse<{ secret: string; qrCodeUrl: string }>
  > {
    const response = await api.post("/auth/2fa/generate");
    return response.data;
  },

  /**
   * Enable 2FA with code verification
   */
  async enable2FA(code: string, secret: string): Promise<void> {
    await api.post("/auth/2fa/enable", { code, secret });
  },

  /**
   * Disable 2FA
   */
  async disable2FA(): Promise<void> {
    await api.post("/auth/2fa/disable");
  },
};
