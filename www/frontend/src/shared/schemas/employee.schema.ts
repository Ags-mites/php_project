import { z } from 'zod';

export const employeeSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  cargo: z.string().min(1, 'Cargo requerido'),
  telefono: z.string().min(1, 'Telefono requerido'),
  direccion: z.string().min(1, 'Direccion requerida'),
  fecha_ingreso: z.string().min(1, 'Fecha de ingreso requerida'),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export interface Employee {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  direccion: string;
  fecha_ingreso: string;
}

export interface EmployeesResponse {
  data: Employee[];
}
