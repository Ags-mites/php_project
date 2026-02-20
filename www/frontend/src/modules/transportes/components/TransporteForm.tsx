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
import { transporteSchema, type TransporteFormData } from '@/shared/schemas';
import { importacionService } from '../../importaciones/services/importacionService';
import { type Importacion } from '@/shared/schemas/importacion.schema';

interface TransporteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TransporteFormData | null;
  onSubmit: (data: TransporteFormData) => Promise<void>;
}

export function TransporteForm({ open, onOpenChange, initialData, onSubmit }: TransporteFormProps) {
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

  const form = useForm<TransporteFormData>({
    resolver: zodResolver(transporteSchema),
    defaultValues: initialData || {
      id_importacion: 0,
      tipo_transporte: '',
      empresa_transportista: '',
      numero_guia: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          id_importacion: 0,
          tipo_transporte: '',
          empresa_transportista: '',
          numero_guia: '',
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: TransporteFormData) => {
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
          <DialogTitle>{initialData ? 'Editar Transporte' : 'Crear Transporte'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Actualiza los datos del transporte' : 'Registra un nuevo transporte'}
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
              name="tipo_transporte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transporte</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Marítimo">Marítimo</SelectItem>
                      <SelectItem value="Aéreo">Aéreo</SelectItem>
                      <SelectItem value="Terrestre">Terrestre</SelectItem>
                      <SelectItem value="Ferroviario">Ferroviario</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="empresa_transportista"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa Transportista</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Maersk Line">Maersk Line</SelectItem>
                      <SelectItem value="MSC Shipping">MSC Shipping</SelectItem>
                      <SelectItem value="FedEx Express">FedEx Express</SelectItem>
                      <SelectItem value="DHL Logistics">DHL Logistics</SelectItem>
                      <SelectItem value="UPS Freight">UPS Freight</SelectItem>
                      <SelectItem value="Lufthansa Cargo">Lufthansa Cargo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero_guia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Guía</FormLabel>
                  <FormControl>
                    <Input placeholder="MAEU1234567" {...field} />
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
