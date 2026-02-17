import { useFormContext, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SaleFormData } from '@/shared/schemas/sale.schema';

interface SaleSummaryProps {
    isLoading: boolean;
}

export function SaleSummary({ isLoading }: SaleSummaryProps) {
    const navigate = useNavigate();
    const { control, watch, formState: { errors } } = useFormContext<SaleFormData>();
    const total = watch('total');

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Venta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="metodo_pago">Método de Pago</Label>
                        <Controller
                            name="metodo_pago"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                                        <SelectItem value="TARJETA">Tarjeta</SelectItem>
                                        <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.metodo_pago && (
                            <p className="text-sm text-destructive">{errors.metodo_pago.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Controller
                            name="estado"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                        <SelectItem value="COMPLETADA">Completada</SelectItem>
                                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.estado && (
                            <p className="text-sm text-destructive">{errors.estado.message as string}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg font-medium">
                        <span>Total a Pagar:</span>
                        <span className="text-2xl font-bold text-primary">
                            ${Number(total || 0).toFixed(2)}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? 'Procesando...' : 'Completar Venta'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/sales')}
                    >
                        Cancelar
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
