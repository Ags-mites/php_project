import { z } from 'zod';

export const categorySchema = z.object({
  nombre_categoria: z.string().min(1, 'Nombre requerido'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface Category {
  id: number;
  nombre_categoria: string;
}

export interface CategoriesResponse {
  data: Category[];
}
