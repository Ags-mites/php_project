import { z } from 'zod';

export const supplierSchema = z.object({
  nombre_empresa: z.string().min(1, 'Nombre de empresa requerido'),
  pais_origen: z.string().min(1, 'País de origen requerido'),
  direccion: z.string().min(1, 'Dirección requerida'),
  email_contacto: z.string().email('Email inválido').min(1, 'Email requerido'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export interface Supplier {
  id: number;
  nombre_empresa: string;
  pais_origen: string;
  direccion: string;
  email_contacto: string;
}

export interface SuppliersResponse {
  data: Supplier[];
}
