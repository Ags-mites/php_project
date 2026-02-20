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
import { categorySchema, type CategoryFormData } from '@/shared/schemas';

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CategoryFormData | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function CategoryForm({ open, onOpenChange, initialData, onSubmit }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      nombre_categoria: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          nombre_categoria: '',
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: CategoryFormData) => {
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
          <DialogTitle>{initialData ? 'Editar Categoría' : 'Crear Categoría'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Actualiza los datos de la categoría' : 'Agrega una nueva categoría de productos'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre_categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Electrónica" {...field} />
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
