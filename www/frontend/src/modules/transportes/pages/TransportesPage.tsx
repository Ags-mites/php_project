import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Truck, Search } from 'lucide-react';
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
import { transporteService } from '../services/transporteService';
import { type Transporte } from '@/shared/schemas';

export function TransportesPage() {
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador' || user?.role === 'Supervisor' || user?.role === 'Desarrollador';

  const fetchTransportes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await transporteService.getAll();
      setTransportes(response.data);
    } catch {
      toast.error('Error al cargar los transportes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransportes();
  }, [fetchTransportes]);

  const filteredTransportes = useMemo(() => {
    if (!searchTerm.trim()) return transportes;
    const term = searchTerm.toLowerCase();
    return transportes.filter((trans) =>
      trans.tipo_transporte?.toLowerCase().includes(term) ||
      trans.empresa_transportista?.toLowerCase().includes(term) ||
      trans.numero_guia.toLowerCase().includes(term)
    );
  }, [transportes, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este transporte?')) return;
    try {
      await transporteService.delete(id.toString());
      toast.success('Transporte eliminado correctamente');
      fetchTransportes();
    } catch {
      toast.error('Error al eliminar el transporte');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transportes</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transportes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando transportes...</div>
        </div>
      ) : filteredTransportes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Truck className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron transportes' : 'No hay transportes registrados'}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID Importación</TableHead>
                <TableHead>Tipo Transporte</TableHead>
                <TableHead>Empresa Transportista</TableHead>
                <TableHead>Número de Guía</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransportes.map((trans) => (
                <TableRow key={trans.id}>
                  <TableCell className="font-medium">{trans.id}</TableCell>
                  <TableCell>{trans.id_importacion}</TableCell>
                  <TableCell>{trans.tipo_transporte || '-'}</TableCell>
                  <TableCell>{trans.empresa_transportista || '-'}</TableCell>
                  <TableCell>{trans.numero_guia}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(trans.id)}
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
