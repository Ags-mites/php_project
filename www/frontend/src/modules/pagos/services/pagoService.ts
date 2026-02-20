import { apiClient } from '../../../core/api/apiClient';
import { type Pago, type PagoFormData, type PagosResponse } from '../../../shared/schemas/pago.schema';

export const pagoService = {
  getAll: async (): Promise<PagosResponse> => {
    return apiClient.get<PagosResponse>('/business/pagos');
  },

  getById: async (id: string): Promise<Pago> => {
    return apiClient.get<Pago>(`/business/pagos/${id}`);
  },

  getByImportacion: async (importacionId: string): Promise<PagosResponse> => {
    return apiClient.get<PagosResponse>(`/business/pagos?importacion=${importacionId}`);
  },

  create: async (data: PagoFormData): Promise<Pago> => {
    return apiClient.post<Pago>('/business/pagos', data);
  },

  update: async (id: string, data: Partial<PagoFormData>): Promise<Pago> => {
    return apiClient.put<Pago>(`/business/pagos/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/pagos/${id}`);
  },
};
