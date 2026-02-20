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
import { pagoSchema, type PagoFormData } from '@/shared/schemas';
import { importacionService } from '../../importaciones/services/importacionService';
import { type Importacion } from '@/shared/schemas/importacion.schema';

interface PagoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PagoFormData | null;
  onSubmit: (data: PagoFormData) => Promise<void>;
}

export function PagoForm({ open, onOpenChange, initialData, onSubmit }: PagoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [importaciones, setImportaciones] = useState<Importacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await importacionService.getAll();
        setImportaciones(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<PagoFormData>({
    resolver: zodResolver(pagoSchema),
    defaultValues: initialData || {
      id_importacion: 0,
      monto: 0,
      metodo_pago: '',
      moneda: 'USD',
      fecha_pago: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          id_importacion: 0,
          monto: 0,
          metodo_pago: '',
          moneda: 'USD',
          fecha_pago: '',
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: PagoFormData) => {
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
          <DialogTitle>{initialData ? 'Editar Pago' : 'Crear Pago'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Actualiza los datos del pago' : 'Registra un nuevo pago'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_importacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importación</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una importación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {importaciones.map((imp) => (
                        <SelectItem key={imp.id} value={imp.id.toString()}>
                          #{imp.id} - {imp.nombre_proveedor}
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
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metodo_pago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Carta de Crédito">Carta de Crédito</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moneda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'USD'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="CLP">CLP - Peso Chileno</SelectItem>
                      <SelectItem value="CNY">CNY - Yuan Chino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_pago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Pago</FormLabel>
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
