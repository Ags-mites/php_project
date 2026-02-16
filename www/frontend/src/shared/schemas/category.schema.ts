import { z } from 'zod';

export const categorySchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CategoriesResponse {
  data: Category[];
}
