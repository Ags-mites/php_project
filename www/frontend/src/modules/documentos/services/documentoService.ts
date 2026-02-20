import { apiClient } from '../../../core/api/apiClient';
import { type Documento, type DocumentoFormData, type DocumentosResponse } from '../../../shared/schemas/documento.schema';

export const documentoService = {
  getAll: async (): Promise<DocumentosResponse> => {
    return apiClient.get<DocumentosResponse>('/business/documentos');
  },

  getById: async (id: string): Promise<Documento> => {
    return apiClient.get<Documento>(`/business/documentos/${id}`);
  },

  getByImportacion: async (importacionId: string): Promise<DocumentosResponse> => {
    return apiClient.get<DocumentosResponse>(`/business/documentos?importacion=${importacionId}`);
  },

  create: async (data: DocumentoFormData): Promise<Documento> => {
    return apiClient.post<Documento>('/business/documentos', data);
  },

  update: async (id: string, data: Partial<DocumentoFormData>): Promise<Documento> => {
    return apiClient.put<Documento>(`/business/documentos/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/documentos/${id}`);
  },
};
