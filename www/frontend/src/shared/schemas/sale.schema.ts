import { z } from 'zod';

export const clientSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().min(10, 'Teléfono inválido').optional(),
  direccion: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export interface Client {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  createdAt?: string;
}

export const saleDetailSchema = z.object({
  productoId: z.string().min(1, 'Producto requerido'),
  cantidad: z.number().int().positive('Cantidad minima 1'),
  precioUnitario: z.number().positive('Precio debe ser positivo'),
});

export const saleSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  detalles: z.array(saleDetailSchema).min(1, 'Al menos un producto'),
  metodoPago: z.enum(['efectivo', 'tarjeta', 'transferencia']),
  observaciones: z.string().optional(),
});

export type SaleFormData = z.infer<typeof saleSchema>;

export interface Sale {
  id: string;
  clienteId: string;
  cliente?: Client;
  detalles: SaleDetail[];
  total: number;
  metodoPago: string;
  observaciones?: string;
  fecha: string;
  estado: 'completada' | 'cancelada' | 'pendiente';
}

export interface SaleDetail {
  productoId: string;
  producto?: Product;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Product {
  id: string;
  nombre: string;
  codigo: string;
}
