import { z } from 'zod';

export const supplierSchema = z.object({
  nombre_empresa: z.string().min(1, 'Nombre requerido'),
  telefono: z.string().min(1, 'Telefono requerido'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  direccion: z.string().min(1, 'Direccion requerida'),
  ciudad: z.string().min(1, 'Ciudad requerida'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export interface Supplier {
  id: number;
  nombre_empresa: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
}

export interface SuppliersResponse {
  data: Supplier[];
}
