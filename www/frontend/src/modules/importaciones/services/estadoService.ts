import { apiClient } from '../../../core/api/apiClient';

export interface EstadoImportacion {
  id: number;
  nombre_estado: string;
  descripcion_estado: string;
}

export interface EstadosResponse {
  data: EstadoImportacion[];
}

export const estadoService = {
  getAll: async (): Promise<EstadosResponse> => {
    return apiClient.get<EstadosResponse>('/business/estados');
  },

  getById: async (id: string): Promise<EstadoImportacion> => {
    return apiClient.get<EstadoImportacion>(`/business/estados/${id}`);
  },

  create: async (data: { nombre_estado: string; descripcion_estado: string }): Promise<EstadoImportacion> => {
    return apiClient.post<EstadoImportacion>('/business/estados', data);
  },

  update: async (id: string, data: Partial<{ nombre_estado: string; descripcion_estado: string }>): Promise<EstadoImportacion> => {
    return apiClient.put<EstadoImportacion>(`/business/estados/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/estados/${id}`);
  },
};
