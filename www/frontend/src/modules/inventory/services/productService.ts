import { apiClient } from '../../../core/api/apiClient';
import { type Product, type ProductFormData, type ProductsResponse } from '../../../shared/schemas/product.schema';

export const productService = {
  getAll: async (): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/business/products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/business/products/${id}`);
  },

  create: async (data: ProductFormData): Promise<Product> => {
    return apiClient.post<Product>('/business/products', data);
  },

  update: async (id: string, data: Partial<ProductFormData>): Promise<Product> => {
    return apiClient.put<Product>(`/business/products/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/products/${id}`);
  },
};
