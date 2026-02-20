import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { importacionSchema, type ImportacionFormData } from '@/shared/schemas';
import { supplierService } from '../../suppliers/services/supplierService';
import { estadoService } from '../services/estadoService';
import { type Supplier } from '@/shared/schemas/supplier.schema';
import { type EstadoImportacion } from '../services/estadoService';

interface ImportacionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ImportacionFormData | null;
  onSubmit: (data: ImportacionFormData) => Promise<void>;
}

export function ImportacionForm({ open, onOpenChange, initialData, onSubmit }: ImportacionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [proveedores, setProveedores] = useState<Supplier[]>([]);
  const [estados, setEstados] = useState<EstadoImportacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proveedoresRes, estadosRes] = await Promise.all([
          supplierService.getAll(),
          estadoService.getAll(),
        ]);
        setProveedores(proveedoresRes.data);
        setEstados(estadosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<ImportacionFormData>({
    resolver: zodResolver(importacionSchema),
    defaultValues: initialData || {
      id_proveedor: 0,
      id_estado: 0,
      fecha_inicio: '',
      fecha_estimada: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          id_proveedor: 0,
          id_estado: 0,
          fecha_inicio: '',
          fecha_estimada: '',
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: ImportacionFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Importación' : 'Crear Importación'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Actualiza los datos de la importación' : 'Agrega una nueva importación'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_proveedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                          {proveedor.nombre_empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.id.toString()}>
                          {estado.nombre_estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Inicio</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_estimada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Estimada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
