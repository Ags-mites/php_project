import { z } from 'zod';

export const productSchema = z.object({
  codigo: z.string().min(1, 'Código requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  color: z.string().min(1, 'Color requerido'),
  marca: z.string().min(1, 'Marca requerida'),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
  precio: z.number().positive('Precio debe ser positivo'),
  categoria_id: z.number().positive('Categoría requerida'),
  talla_id: z.number().positive('Talla requerida'),
  proveedor_id: z.number().positive('Proveedor requerido'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: number;
  codigo: string;
  descripcion: string;
  color: string;
  marca: string;
  stock: number;
  precio: number;
  nombre_categoria: string;
  talla: string;
  nombre_proveedor: string;
}

export interface ProductsResponse {
  data: Product[];
}
