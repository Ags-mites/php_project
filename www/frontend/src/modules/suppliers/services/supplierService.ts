import { apiClient } from '../../../core/api/apiClient';
import { type Supplier, type SupplierFormData, type SuppliersResponse } from '../../../shared/schemas/supplier.schema';

export const supplierService = {
  getAll: async (): Promise<SuppliersResponse> => {
    return apiClient.get<SuppliersResponse>('/business/suppliers');
  },

  getById: async (id: string): Promise<Supplier> => {
    return apiClient.get<Supplier>(`/business/suppliers/${id}`);
  },

  create: async (data: SupplierFormData): Promise<Supplier> => {
    return apiClient.post<Supplier>('/business/suppliers', data);
  },

  update: async (id: string, data: Partial<SupplierFormData>): Promise<Supplier> => {
    return apiClient.put<Supplier>(`/business/suppliers/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/suppliers/${id}`);
  },
};
