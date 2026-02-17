import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type SaleFormData } from '@/shared/schemas/sale.schema';

export function useSaleCalculations() {
    const { setValue, control } = useFormContext<SaleFormData>();

    const detalles = useWatch({
        control,
        name: 'detalles',
    });

    useEffect(() => {
        if (!detalles) return;

        const total = detalles.reduce((sum, item) => {
            return sum + (item.cantidad * item.precio);
        }, 0);

        setValue('total', total);
    }, [detalles, setValue]);

    return {
        detalles
    };
}
