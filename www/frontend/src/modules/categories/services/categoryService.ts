import { apiClient } from '../../../core/api/apiClient';
import { type Category, type CategoryFormData, type CategoriesResponse } from '../../../shared/schemas/category.schema';

export const categoryService = {
  getAll: async (): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>('/business/categorias');
  },

  getById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/business/categorias/${id}`);
  },

  create: async (data: CategoryFormData): Promise<Category> => {
    return apiClient.post<Category>('/business/categorias', data);
  },

  update: async (id: string, data: Partial<CategoryFormData>): Promise<Category> => {
    return apiClient.put<Category>(`/business/categorias/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/categorias/${id}`);
  },
};
