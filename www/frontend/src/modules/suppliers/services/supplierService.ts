import { apiClient } from '../../../core/api/apiClient';
import { type Supplier, type SupplierFormData, type SuppliersResponse } from '../../../shared/schemas/supplier.schema';

export const supplierService = {
  getAll: async (): Promise<SuppliersResponse> => {
    return apiClient.get<SuppliersResponse>('/business/proveedores');
  },

  getById: async (id: string): Promise<Supplier> => {
    return apiClient.get<Supplier>(`/business/proveedores/${id}`);
  },

  create: async (data: SupplierFormData): Promise<Supplier> => {
    return apiClient.post<Supplier>('/business/proveedores', data);
  },

  update: async (id: string, data: Partial<SupplierFormData>): Promise<Supplier> => {
    return apiClient.put<Supplier>(`/business/proveedores/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/proveedores/${id}`);
  },
};
