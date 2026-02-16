import { apiClient } from '../../../core/api/apiClient';
import { type Category, type CategoryFormData, type CategoriesResponse } from '../../../shared/schemas/category.schema';

export const categoryService = {
  getAll: async (): Promise<CategoriesResponse> => {
    return apiClient.get<CategoriesResponse>('/business/categories');
  },

  getById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/business/categories/${id}`);
  },

  create: async (data: CategoryFormData): Promise<Category> => {
    return apiClient.post<Category>('/business/categories', data);
  },

  update: async (id: string, data: Partial<CategoryFormData>): Promise<Category> => {
    return apiClient.put<Category>(`/business/categories/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/categories/${id}`);
  },
};
