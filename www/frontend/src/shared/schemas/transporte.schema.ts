import { z } from 'zod';

export const transporteSchema = z.object({
  id_importacion: z.number().positive('Importación requerida'),
  tipo_transporte: z.string().optional(),
  empresa_transportista: z.string().optional(),
  numero_guia: z.string().min(1, 'Número de guía requerido'),
});

export type TransporteFormData = z.infer<typeof transporteSchema>;

export interface Transporte {
  id: number;
  id_importacion: number;
  tipo_transporte: string;
  empresa_transportista: string;
  numero_guia: string;
}

export interface TransportesResponse {
  data: Transporte[];
}
