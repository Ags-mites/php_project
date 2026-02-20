import { apiClient } from '../../../core/api/apiClient';

export interface LoginResponse {
  message: string;
  token: string;
  username: string;
  role: 'Administrador' | 'Operador';
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  role?: number;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    username: string;
    name: string;
    role: number;
  };
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', { username, password }, { requiresAuth: false });
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/usuarios/register', data, { requiresAuth: false });
  },
};
