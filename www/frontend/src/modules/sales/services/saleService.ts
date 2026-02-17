import { apiClient } from '../../../core/api/apiClient';
import { type Sale, type SaleFormData, type SalesResponse } from '../../../shared/schemas/sale.schema';

export const saleService = {
  getAll: async (): Promise<SalesResponse> => {
    return apiClient.get<SalesResponse>('/business/sales');
  },

  getById: async (id: string): Promise<Sale> => {
    return apiClient.get<Sale>(`/business/sales/${id}`);
  },

  create: async (data: SaleFormData): Promise<Sale> => {
    return apiClient.post<Sale>('/business/sales', data);
  },

  update: async (id: string, data: SaleFormData): Promise<Sale> => {
    return apiClient.put<Sale>(`/business/sales/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/sales/${id}`);
  },
};
