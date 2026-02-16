import { z } from 'zod';

export const employeSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  cargo: z.string().min(1, 'Cargo requerido'),
  telefono: z.string().min(1, 'Teléfono requerido'),
  direccion: z.string().min(1, 'Dirección requerida'),
  fecha_ingreso: z.string().min(1, 'Fecha de ingreso requerida'),
});

export type EmployeFormData = z.infer<typeof employeSchema>;

export interface Employe {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  direccion: string;
  fecha_ingreso: string;
}

export interface EmployesResponse {
  data: Employe[];
}
