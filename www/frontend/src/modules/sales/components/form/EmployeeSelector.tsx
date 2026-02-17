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
import { employeeService } from '@/modules/employees/services/employeeService';
import type { Employee } from '@/shared/schemas';

export function EmployeeSelector() {
    const { control, formState: { errors } } = useFormContext();
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchEmployees = useCallback(async () => {
        try {
            const response = await employeeService.getAll();
            setEmployees(response.data);
        } catch {
            toast.error('Error al cargar empleados');
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return (
        <div className="space-y-2">
            <Label htmlFor="empleado_id">Seleccione un empleado</Label>
            <Controller
                name="empleado_id"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ''}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar empleado" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.nombre} {employee.apellido}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.empleado_id && (
                <p className="text-sm text-destructive">{errors.empleado_id?.message as string}</p>
            )}
        </div>
    );
}
