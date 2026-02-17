import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Package, Search } from 'lucide-react';
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
import { sizeService } from '../services/sizeService';
import { type Size, type SizeFormData } from '@/shared/schemas';
import { SizesForm } from '../components/SizesForm';

export function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor' || user?.role === 'Developer';

  const fetchSizes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await sizeService.getAll();
      setSizes(response.data);
    } catch {
      toast.error('Error al cargar las tallas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const filteredSizes = useMemo(() => {
    if (!searchTerm.trim()) return sizes;
    const term = searchTerm.toLowerCase();
    return sizes.filter((size) =>
      size.talla.toLowerCase().includes(term) ||
      size.descripcion?.toLowerCase().includes(term)
    );
  }, [sizes, searchTerm]);

  const handleCreate = async (data: SizeFormData) => {
    try {
      await sizeService.create(data);
      toast.success('Talla creada correctamente');
      fetchSizes();
    } catch {
      toast.error('Error al crear la talla');
    }
  };

  const handleUpdate = async (data: SizeFormData) => {
    if (!editingSize) return;
    try {
      await sizeService.update(editingSize.id.toString(), data);
      toast.success('Talla actualizada correctamente');
      fetchSizes();
    } catch {
      toast.error('Error al actualizar la talla');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta talla?')) return;
    try {
      await sizeService.delete(id.toString());
      toast.success('Talla eliminada correctamente');
      fetchSizes();
    } catch {
      toast.error('Error al eliminar la talla');
    }
  };

  const handleOpenCreate = () => {
    setEditingSize(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (size: Size) => {
    setEditingSize(size);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingSize) return null;
    return {
      talla: editingSize.talla,
      descripcion: editingSize.descripcion || '',
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tallas</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Talla
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tallas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando tallas...</div>
        </div>
      ) : filteredSizes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron tallas' : 'No hay tallas registradas'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear la primera talla
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell>{size.talla}</TableCell>
                  <TableCell>{size.descripcion || '-'}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(size)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(size.id)}
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

      <SizesForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingSize ? handleUpdate : handleCreate}
      />
    </div>
  );
}
