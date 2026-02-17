import { useState, useEffect, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { clientService } from '@/modules/clients/services/clientService';
import type { Client } from '@/shared/schemas';

export function ClientSelector() {
    const { control, formState: { errors } } = useFormContext();
    const [clients, setClients] = useState<Client[]>([]);

    const fetchClients = useCallback(async () => {
        try {
            const response = await clientService.getAll();
            setClients(response.data);
        } catch {
            toast.error('Error al cargar clientes');
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return (
        <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Controller
                name="cliente_id"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ''}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.nombre} {client.apellido}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.cliente_id && (
                <p className="text-sm text-destructive">{errors.cliente_id?.message as string}</p>
            )}
        </div>
    );
}
