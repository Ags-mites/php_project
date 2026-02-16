import { apiClient } from '../../../core/api/apiClient';
import { type Employee, type EmployeeFormData, type EmployeesResponse } from '../../../shared/schemas/employee.schema';

export const employeeService = {
  getAll: async (): Promise<EmployeesResponse> => {
    return apiClient.get<EmployeesResponse>('/business/employees');
  },

  getById: async (id: string): Promise<Employee> => {
    return apiClient.get<Employee>(`/business/employees/${id}`);
  },

  create: async (data: EmployeeFormData): Promise<Employee> => {
    return apiClient.post<Employee>('/business/employees', data);
  },

  update: async (id: string, data: Partial<EmployeeFormData>): Promise<Employee> => {
    return apiClient.put<Employee>(`/business/employees/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/business/employees/${id}`);
  },
};
