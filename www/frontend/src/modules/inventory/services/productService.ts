import { apiClient } from '../../../core/api/apiClient';
import { type Product, type ProductFormData, type ProductsResponse } from '../../../shared/schemas/product.schema';
import { type CategoriesResponse } from '../../../shared/schemas/category.schema';
import { type SizesResponse } from '../../../shared/schemas/size.schema';
import { type SuppliersResponse } from '../../../shared/schemas/supplier.schema';

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

  getCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>('/business/categories');
  },

  getSizes: async (): Promise<SizesResponse> => {
    return apiClient.get<SizesResponse>('/business/size');
  },

  getSuppliers: async (): Promise<SuppliersResponse> => {
    return apiClient.get<SuppliersResponse>('/business/suppliers');
  },
};
