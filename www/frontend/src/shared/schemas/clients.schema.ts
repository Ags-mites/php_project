import { z } from 'zod';

export const clientSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  telefono: z.string().min(1, 'Teléfono requerido'),
  email: z.string().email('Email inválido'),
  direccion: z.string().min(1, 'Dirección requerida'),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface ClientsResponse {
  data: Client[];
}
