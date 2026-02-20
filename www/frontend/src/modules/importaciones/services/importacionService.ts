import { apiClient } from '../../../core/api/apiClient';
import { type Importacion, type ImportacionFormData, type ImportacionesResponse } from '../../../shared/schemas/importacion.schema';

export const importacionService = {
  getAll: async (): Promise<ImportacionesResponse> => {
    return apiClient.get<ImportacionesResponse>('/business/importaciones');
  },

  getById: async (id: string): Promise<Importacion> => {
    return apiClient.get<Importacion>(`/business/importaciones/${id}`);
  },

  create: async (data: ImportacionFormData): Promise<Importacion> => {
    return apiClient.post<Importacion>('/business/importaciones', data);
  },

  update: async (id: string, data: Partial<ImportacionFormData>): Promise<Importacion> => {
    return apiClient.put<Importacion>(`/business/importaciones/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/importaciones/${id}`);
  },
};
