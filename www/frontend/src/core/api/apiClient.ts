type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export type TokenGetter = () => string | null;

let tokenGetter: TokenGetter = () => null;
let onUnauthorized: () => void = () => window.location.href = '/login';

export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      onUnauthorized();
      const error: ApiError = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    if (response.status === 403) {
      const error: ApiError = new Error('Forbidden - No tienes permisos');
      error.status = 403;
      alert('No tienes permisos para realizar esta acción');
      throw error;
    }

    if (!response.ok) {
      const error: ApiError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      try {
        error.data = await response.json();
      } catch {
        error.data = await response.text();
      }
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }
    return response.json();
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, requiresAuth = true } = config;

    const authHeader: Record<string, string> = {};
    if (requiresAuth) {
      const token = tokenGetter();
      if (token) {
        authHeader['Authorization'] = `Bearer ${token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, options);
    return this.handleResponse<T>(response);
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  put<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  patch<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_SERVER || '');
export { ApiClient };
