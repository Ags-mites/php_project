import { z } from 'zod';

export const documentoSchema = z.object({
  id_importacion: z.number().positive('Importación requerida'),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().min(1, 'Número de documento requerido'),
  fecha_emision: z.string().optional(),
});

export type DocumentoFormData = z.infer<typeof documentoSchema>;

export interface Documento {
  id: number;
  id_importacion: number;
  tipo_documento: string;
  numero_documento: string;
  fecha_emision: string;
}

export interface DocumentosResponse {
  data: Documento[];
}
