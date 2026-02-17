import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/core/store/hooks';
import { Plus, Package, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { saleService } from '../services/saleService';
import { type Sale } from '@/shared/schemas/sale.schema';

export function SalesPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAppSelector((state) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor' || user?.role === 'Developer';

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await saleService.getAll();
      setSales(response.data);
    } catch {
      toast.error('Error al cargar las ventas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = !searchTerm.trim()
    ? sales
    : sales.filter((sale) => {
      const term = searchTerm.toLowerCase();
      return (
        sale.cliente.nombre.toLowerCase().includes(term) ||
        sale.cliente.apellido.toLowerCase().includes(term) ||
        sale.estado.toString().toLowerCase().includes(term) ||
        sale.metodo_pago.toString().toLowerCase().includes(term)
      );
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (estado: string) => {
    const styles = {
      COMPLETADA: 'bg-green-100 text-green-800',
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      CANCELADA: 'bg-red-100 text-red-800',
    };
    const style = styles[estado as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {estado}
      </span>
    );
  };

  const getPaymentBadge = (metodo: string) => {
    const labels: Record<string, string> = {
      EFECTIVO: 'Efectivo',
      TARJETA: 'Tarjeta',
      TRANSFERENCIA: 'Transferencia',
    };
    return labels[metodo] || metodo;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta venta?')) return;
    try {
      await saleService.delete(id.toString());
      toast.success('Venta eliminada correctamente');
      fetchSales();
    } catch {
      toast.error('Error al eliminar la venta');
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ventas</h1>
        {canManage && (
          <Button onClick={() => navigate('/sales/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ventas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando ventas...</div>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron ventas' : 'No hay ventas registradas'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={() => navigate('/sales/new')}>
              Crear la primera venta
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.cliente.nombre + ' ' + sale.cliente.apellido}</TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(sale.estado)}</TableCell>
                  <TableCell>{getPaymentBadge(sale.metodo_pago)}</TableCell>
                  <TableCell>{formatDate(sale.fecha)}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/sales/edit/${sale.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sale.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

