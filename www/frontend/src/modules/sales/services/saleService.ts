import { apiClient } from '../../../core/api/apiClient';
import { type Client, type ClientFormData } from '../../../shared/schemas/sale.schema';
import { type Sale, type SaleFormData } from '../../../shared/schemas/sale.schema';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    return apiClient.get<Client[]>('/business/clientes');
  },

  getById: async (id: string): Promise<Client> => {
    return apiClient.get<Client>(`/business/clientes/${id}`);
  },

  create: async (data: ClientFormData): Promise<Client> => {
    return apiClient.post<Client>('/business/clientes', data);
  },

  update: async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    return apiClient.put<Client>(`/business/clientes/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/clientes/${id}`);
  },
};

export const saleService = {
  getAll: async (): Promise<Sale[]> => {
    return apiClient.get<Sale[]>('/business/ventas');
  },

  getById: async (id: string): Promise<Sale> => {
    return apiClient.get<Sale>(`/business/ventas/${id}`);
  },

  create: async (data: SaleFormData): Promise<Sale> => {
    return apiClient.post<Sale>('/business/ventas', data);
  },

  cancel: async (id: string): Promise<Sale> => {
    return apiClient.patch<Sale>(`/business/ventas/${id}/cancelar`, {});
  },
};
