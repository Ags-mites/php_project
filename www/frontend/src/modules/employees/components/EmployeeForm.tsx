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
import { employeeSchema, type EmployeeFormData } from '@/shared/schemas';

interface EmployeeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: EmployeeFormData | null;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
}

export function EmployeeForm({ open, onOpenChange, initialData, onSubmit }: EmployeeFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData || {
            nombre: '',
            apellido: '',
            cargo: '',
            telefono: '',
            direccion: '',
            fecha_ingreso: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset(initialData);
            } else {
                form.reset({
                    nombre: '',
                    apellido: '',
                    cargo: '',
                    telefono: '',
                    direccion: '',
                    fecha_ingreso: '',
                });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = async (data: EmployeeFormData) => {
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
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del empleado" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="apellido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apellido del empleado" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cargo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cargo del empleado" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="telefono"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Telefono del empleado" {...field} />
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
                                    <FormLabel>Direccion</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Direccion del empleado" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fecha_ingreso"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Ingreso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Fecha de ingreso del empleado" {...field} />
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
