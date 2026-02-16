import { apiClient } from '../../../core/api/apiClient';
import { type Client, type ClientFormData, type ClientsResponse } from '../../../shared/schemas/client.schema';

export const clientService = {
  getAll: async (): Promise<ClientsResponse> => {
    return apiClient.get<ClientsResponse>('/business/clients');
  },

  getById: async (id: string): Promise<Client> => {
    return apiClient.get<Client>(`/business/clients/${id}`);
  },

  create: async (data: ClientFormData): Promise<Client> => {
    return apiClient.post<Client>('/business/clients', data);
  },

  update: async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    return apiClient.put<Client>(`/business/clients/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/clients/${id}`);
  },
};
