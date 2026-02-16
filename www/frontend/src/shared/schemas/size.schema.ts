import { z } from 'zod';

export const sizeSchema = z.object({
  talla: z.string().min(1, 'Talla requerida'),
  descripcion: z.string().optional(),
});

export type SizeFormData = z.infer<typeof sizeSchema>;

export interface Size {
  id: number;
  talla: string;
  descripcion: string;
}

export interface SizesResponse {
  data: Size[];
}
