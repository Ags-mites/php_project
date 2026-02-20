import { apiClient } from '../../../core/api/apiClient';
import { type Product, type ProductFormData, type ProductsResponse } from '../../../shared/schemas/product.schema';
import { type CategoriesResponse } from '../../../shared/schemas/category.schema';

export const productService = {
  getAll: async (): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/business/productos');
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

  getCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>('/business/categorias');
  },
};
