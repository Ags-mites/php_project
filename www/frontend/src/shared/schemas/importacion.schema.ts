import { z } from 'zod';

export const importacionSchema = z.object({
  id_proveedor: z.number().positive('Proveedor requerido'),
  id_estado: z.number().positive('Estado requerido'),
  fecha_inicio: z.string().optional(),
  fecha_estimada: z.string().optional(),
});

export type ImportacionFormData = z.infer<typeof importacionSchema>;

export interface Importacion {
  id: number;
  id_proveedor: number;
  nombre_proveedor: string;
  id_estado: number;
  nombre_estado: string;
  fecha_inicio: string;
  fecha_estimada: string;
  detalles?: ImportacionDetalle[];
}

export interface ImportacionDetalle {
  id: number;
  id_producto: number;
  sku: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: string;
}

export interface ImportacionesResponse {
  data: Importacion[];
}
