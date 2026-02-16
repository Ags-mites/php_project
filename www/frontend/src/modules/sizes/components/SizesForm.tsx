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
import { sizeSchema, type SizeFormData } from '@/shared/schemas';

interface SizeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: SizeFormData | null;
    onSubmit: (data: SizeFormData) => Promise<void>;
}

export function SizesForm({ open, onOpenChange, initialData, onSubmit }: SizeFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SizeFormData>({
        resolver: zodResolver(sizeSchema),
        defaultValues: initialData || {
            talla: '',
            descripcion: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset(initialData);
            } else {
                form.reset({
                    talla: '',
                    descripcion: '',
                });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async (data: SizeFormData) => {
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
                    <DialogTitle>{initialData ? 'Editar Empleado' : 'Crear Empleado'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Actualiza los datos del empleado' : 'Agrega un nuevo empleado'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="talla"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Talla</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Talla" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripcion</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Descripcion" {...field} />
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
