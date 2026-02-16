import { apiClient } from '../../../core/api/apiClient';
import { type Product, type ProductFormData } from '../../../shared/schemas/product.schema';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/business/productos');
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/business/productos/${id}`);
  },

  create: async (data: ProductFormData): Promise<Product> => {
    return apiClient.post<Product>('/business/productos', data);
  },

  update: async (id: string, data: Partial<ProductFormData>): Promise<Product> => {
    return apiClient.put<Product>(`/business/productos/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/productos/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/business/productos?search=${query}`);
  },
};
