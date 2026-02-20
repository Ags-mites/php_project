import { apiClient } from '../../../core/api/apiClient';
import { type Transporte, type TransporteFormData, type TransportesResponse } from '../../../shared/schemas/transporte.schema';

export const transporteService = {
  getAll: async (): Promise<TransportesResponse> => {
    return apiClient.get<TransportesResponse>('/business/transportes');
  },

  getById: async (id: string): Promise<Transporte> => {
    return apiClient.get<Transporte>(`/business/transportes/${id}`);
  },

  getByImportacion: async (importacionId: string): Promise<TransportesResponse> => {
    return apiClient.get<TransportesResponse>(`/business/transportes?importacion=${importacionId}`);
  },

  create: async (data: TransporteFormData): Promise<Transporte> => {
    return apiClient.post<Transporte>('/business/transportes', data);
  },

  update: async (id: string, data: Partial<TransporteFormData>): Promise<Transporte> => {
    return apiClient.put<Transporte>(`/business/transportes/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/transportes/${id}`);
  },
};
