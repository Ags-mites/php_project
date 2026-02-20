import { z } from 'zod';

export const pagoSchema = z.object({
  id_importacion: z.number().positive('Importación requerida'),
  monto: z.number().positive('Monto requerido'),
  metodo_pago: z.string().optional(),
  moneda: z.string().default('USD'),
  fecha_pago: z.string().optional(),
});

export type PagoFormData = z.infer<typeof pagoSchema>;

export interface Pago {
  id: number;
  id_importacion: number;
  monto: string;
  metodo_pago: string;
  moneda: string;
  fecha_pago: string;
}

export interface PagosResponse {
  data: Pago[];
}
