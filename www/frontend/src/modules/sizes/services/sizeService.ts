import { apiClient } from '../../../core/api/apiClient';
import { type Size, type SizeFormData, type SizesResponse } from '../../../shared/schemas/size.schema';

export const sizeService = {
  getAll: async (): Promise<SizesResponse> => {
    return apiClient.get<SizesResponse>('/business/size');
  },

  getById: async (id: string): Promise<Size> => {
    return apiClient.get<Size>(`/business/size/${id}`);
  },

  create: async (data: SizeFormData): Promise<Size> => {
    return apiClient.post<Size>('/business/size', data);
  },

  update: async (id: string, data: Partial<SizeFormData>): Promise<Size> => {
    return apiClient.put<Size>(`/business/size/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/size/${id}`);
  },
};
