import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { AuthUser } from '@/types/user';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(input: LoginInput): Promise<LoginResult> {
    try {
      const { data } = await api.post<ApiResponse<LoginResult>>(
        '/auth/login',
        input,
      );
      return data.data;
    } catch {
      // Demo fallback until a real backend is connected.
      return {
        token: `demo-token-${Date.now()}`,
        user: {
          id: '1',
          email: input.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'admin',
        },
      };
    }
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return data.data;
  },
};
