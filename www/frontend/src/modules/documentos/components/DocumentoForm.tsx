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
import { documentoSchema, type DocumentoFormData } from '@/shared/schemas';
import { importacionService } from '../../importaciones/services/importacionService';
import { type Importacion } from '@/shared/schemas/importacion.schema';

interface DocumentoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: DocumentoFormData | null;
  onSubmit: (data: DocumentoFormData) => Promise<void>;
}

export function DocumentoForm({ open, onOpenChange, initialData, onSubmit }: DocumentoFormProps) {
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

  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(documentoSchema),
    defaultValues: initialData || {
      id_importacion: 0,
      tipo_documento: '',
      numero_documento: '',
      fecha_emision: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          id_importacion: 0,
          tipo_documento: '',
          numero_documento: '',
          fecha_emision: '',
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: DocumentoFormData) => {
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
          <DialogTitle>{initialData ? 'Editar Documento' : 'Crear Documento'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Actualiza los datos del documento' : 'Agrega un nuevo documento aduanero'}
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
              name="tipo_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Factura Comercial">Factura Comercial</SelectItem>
                      <SelectItem value="Bill of Lading">Bill of Lading</SelectItem>
                      <SelectItem value="Certificado de Origen">Certificado de Origen</SelectItem>
                      <SelectItem value="Packing List">Packing List</SelectItem>
                      <SelectItem value="Guía Aérea">Guía Aérea</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numero_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="FAC-2026-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_emision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Emisión</FormLabel>
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
