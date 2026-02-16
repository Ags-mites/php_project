import { z } from 'zod';

export const productSchema = z.object({
  codigo: z.string().min(1, 'Código requerido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional(),
  precio: z.number().positive('Precio debe ser positivo'),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
  categoria: z.string().optional(),
  imagen: z.string().url().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
  createdAt?: string;
  updatedAt?: string;
}
