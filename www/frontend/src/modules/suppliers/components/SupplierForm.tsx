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
import { supplierSchema, type SupplierFormData } from '@/shared/schemas';

interface SupplierFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: SupplierFormData | null;
    onSubmit: (data: SupplierFormData) => Promise<void>;
}

export function SupplierForm({ open, onOpenChange, initialData, onSubmit }: SupplierFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: initialData || {
            nombre_empresa: '',
            pais_origen: '',
            direccion: '',
            email_contacto: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset(initialData);
            } else {
                form.reset({
                    nombre_empresa: '',
                    pais_origen: '',
                    direccion: '',
                    email_contacto: '',
                });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async (data: SupplierFormData) => {
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
                    <DialogTitle>{initialData ? 'Editar Proveedor' : 'Crear Proveedor'}</DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Actualiza los datos del proveedor' : 'Agrega un nuevo proveedor internacional'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre_empresa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de Empresa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de la empresa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pais_origen"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País de Origen</FormLabel>
                                    <FormControl>
                                        <Input placeholder="País de origen" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dirección" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email_contacto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email de Contacto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@ejemplo.com" {...field} />
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
