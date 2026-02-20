import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, CreditCard, Search } from 'lucide-react';
import { toast } from 'sonner';
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
import { type RootState } from '@/core/store/store';
import { pagoService } from '../services/pagoService';
import { type Pago } from '@/shared/schemas';

export function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador' || user?.role === 'Supervisor' || user?.role === 'Desarrollador';

  const fetchPagos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pagoService.getAll();
      setPagos(response.data);
    } catch {
      toast.error('Error al cargar los pagos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  const filteredPagos = useMemo(() => {
    if (!searchTerm.trim()) return pagos;
    const term = searchTerm.toLowerCase();
    return pagos.filter((pago) =>
      pago.metodo_pago?.toLowerCase().includes(term) ||
      pago.moneda.toLowerCase().includes(term)
    );
  }, [pagos, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este pago?')) return;
    try {
      await pagoService.delete(id.toString());
      toast.success('Pago eliminado correctamente');
      fetchPagos();
    } catch {
      toast.error('Error al eliminar el pago');
    }
  };

  const totalMonto = filteredPagos.reduce((sum, pago) => sum + parseFloat(pago.monto), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <div className="text-lg font-semibold">
          Total: ${totalMonto.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pagos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando pagos...</div>
        </div>
      ) : filteredPagos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <CreditCard className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron pagos' : 'No hay pagos registrados'}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID Importación</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPagos.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell className="font-medium">{pago.id}</TableCell>
                  <TableCell>{pago.id_importacion}</TableCell>
                  <TableCell className="font-semibold">${parseFloat(pago.monto).toFixed(2)}</TableCell>
                  <TableCell>{pago.metodo_pago || '-'}</TableCell>
                  <TableCell>{pago.moneda}</TableCell>
                  <TableCell>{pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : '-'}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pago.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
