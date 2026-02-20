import { z } from 'zod';

export const productSchema = z.object({
  id_categoria: z.number().positive('Categoría requerida'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  valor_unitario: z.number().positive('Valor unitario debe ser positivo'),
  pais_origen: z.string().min(1, 'País de origen requerido'),
  sku: z.string().min(1, 'SKU requerido'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: number;
  id_categoria: number;
  descripcion: string;
  valor_unitario: string;
  pais_origen: string;
  sku: string;
  nombre_categoria: string;
}

export interface ProductsResponse {
  data: Product[];
}
