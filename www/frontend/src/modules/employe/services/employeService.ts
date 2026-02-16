import { apiClient } from '../../../core/api/apiClient';
import {
  type Employe,
  type EmployeFormData,
  type EmployesResponse
} from '../../../shared/schemas';

export const employeService = {
  getAll: async (): Promise<EmployesResponse> => {
    return apiClient.get<EmployesResponse>('/business/employes');
  },

  getById: async (id: string): Promise<Employe> => {
    return apiClient.get<Employe>(`/business/employes/${id}`);
  },

  create: async (data: EmployeFormData): Promise<Employe> => {
    return apiClient.post<Employe>('/business/employes', data);
  },

  update: async (id: string, data: Partial<EmployeFormData>): Promise<Employe> => {
    return apiClient.put<Employe>(`/business/employes/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/employes/${id}`);
  },
};
