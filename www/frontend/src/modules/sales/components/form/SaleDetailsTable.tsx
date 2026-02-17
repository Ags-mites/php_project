import { useFormContext } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type SaleFormData } from '@/shared/schemas/sale.schema';

interface SaleDetailsTableProps {
    fields: any[];
    onRemove: (index: number) => void;
    onUpdate: (index: number, item: any) => void;
}

export function SaleDetailsTable({ fields, onRemove, onUpdate }: SaleDetailsTableProps) {
    const { formState: { errors } } = useFormContext<SaleFormData>();

    const updateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        const currentItem = fields[index];
        onUpdate(index, { ...currentItem, cantidad: newQuantity });
    };

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="w-[100px]">Precio</TableHead>
                        <TableHead className="w-[120px]">Cantidad</TableHead>
                        <TableHead className="w-[100px]">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length > 0 ? (
                        fields.map((item: any, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.producto_nombre || 'Producto Desconocido'}
                                </TableCell>
                                <TableCell>${Number(item.precio).toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => updateQuantity(index, item.cantidad - 1)}
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center text-sm">{item.cantidad}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => updateQuantity(index, item.cantidad + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                                        onClick={() => onRemove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No hay productos en el carrito
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {errors.detalles && (
                <p className="text-sm text-destructive p-2 text-center">
                    {errors.detalles.message as string}
                </p>
            )}
        </div>
    );
}
