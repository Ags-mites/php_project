import { z } from 'zod';

export const clientSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  telefono: z.string().min(1, 'Telefono requerido'),
  direccion: z.string().min(1, 'Direccion requerida'),
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
