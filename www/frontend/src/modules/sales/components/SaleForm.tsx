import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saleFormSchema, type SaleFormData } from '@/shared/schemas/sale.schema';
import { saleService } from '../services/saleService';
import { useSaleCalculations } from '../hooks/useSaleCalculations';
import {
  ClientSelector,
  EmployeeSelector,
  ProductScanner,
  SaleDetailsTable,
  SaleSummary
} from './form';

interface SaleFormProps {
  saleId?: string;
}

export function SaleForm({ saleId }: SaleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!saleId);

  const methods = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      cliente_id: 0,
      empleado_id: 0,
      total: 0,
      estado: 'PENDIENTE',
      metodo_pago: 'EFECTIVO',
      detalles: [],
    },
  });

  useEffect(() => {
    if (saleId) {
      const fetchSale = async () => {
        try {
          const sale = await saleService.getById(saleId);
          console.log('Fetched sale raw data:', sale);

          const formData: SaleFormData = {
            cliente_id: sale.cliente?.id || 0,
            empleado_id: sale.empleado?.id || 1,
            total: Number(sale.total),
            estado: sale.estado,
            metodo_pago: sale.metodo_pago,
            detalles: sale.detalles.map(d => ({
              producto_id: d.producto_id || d.producto?.id,
              cantidad: d.cantidad,
              precio: Number(d.precio),
              producto_nombre: d.producto?.descripcion || `Producto ${d.producto_id}`
            })) as any
          };

          methods.reset(formData);
        } catch (error) {
          console.error(error);
          toast.error('Error al cargar la venta');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchSale();
    }
  }, [saleId, methods]);

  if (initialLoading) {
    return <div>Cargando datos de la venta...</div>;
  }

  return (
    <FormProvider {...methods}>
      <SaleFormContent isLoading={isLoading} setIsLoading={setIsLoading} saleId={saleId} />
    </FormProvider>
  );
}

function SaleFormContent(
  { isLoading, setIsLoading, saleId }: {
    isLoading: boolean, setIsLoading: (v: boolean) => void, saleId?: string
  }) {

  const { handleSubmit, reset, setError, control } = useFormContext<SaleFormData>();
  const navigate = useNavigate();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'detalles',
  });

  useSaleCalculations();

  const onSubmit = async (data: SaleFormData) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error('Debe agregar al menos un producto');
      setError('detalles', { message: 'Debe agregar al menos un producto' });
      return;
    }

    setIsLoading(true);
    try {
      if (saleId) {
        await saleService.update(saleId, data);
        toast.success('Venta actualizada correctamente');
      } else {
        await saleService.create(data);
        toast.success('Venta creada correctamente');
      }
      reset();
      navigate('/sales');
    } catch (error) {
      console.log(error);
      toast.error(saleId ? 'Error al actualizar la venta' : 'Error al crear la venta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => console.log('Validation Errors:', errors))} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Selección de Productos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ProductScanner
              onAdd={(item: any) => append(item)}
              fields={fields}
              onUpdate={(index: number, item: any) => update(index, item)}
            />
            <SaleDetailsTable
              fields={fields}
              onRemove={(index: number) => remove(index)}
              onUpdate={(index: number, item: any) => update(index, item)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Responsables de la venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 grid grid-cols-2 gap-4">
            <ClientSelector />
            <EmployeeSelector />
          </CardContent>
        </Card>

        <SaleSummary isLoading={isLoading} />
      </div>
    </form>
  );
}

