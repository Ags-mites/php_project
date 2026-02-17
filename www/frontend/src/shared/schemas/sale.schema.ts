import { z } from 'zod';
import type { Product, Client, Employee } from './';

export const saleDetailSchema = z.object({
  producto_id: z.number().positive('Producto requerido'),
  cantidad: z.number().int().positive('Cantidad minima 1'),
  precio: z.number().positive('Precio debe ser positivo'),
});

export const saleFormSchema = z.object({
  cliente_id: z.number().positive('Cliente requerido'),
  empleado_id: z.number().positive('Empleado requerido'),
  total: z.number().positive('Total debe ser positivo'),
  estado: z.enum(['PENDIENTE', 'COMPLETADA', 'CANCELADA']),
  metodo_pago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']),
  detalles: z.array(saleDetailSchema).min(1, 'Al menos un producto'),
});

export type SaleFormData = z.infer<typeof saleFormSchema>;

export interface Sale {
  id: number;
  cliente: Client;
  empleado: Employee;
  total: number;
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  fecha: string;
  detalles: SaleDetail[];
}

export interface SaleDetail {
  id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  producto?: Product;
}

export interface SalesResponse {
  data: Sale[];
}
