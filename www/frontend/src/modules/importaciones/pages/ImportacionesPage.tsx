import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Plane, Search } from 'lucide-react';
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
import { importacionService } from '../services/importacionService';
import { type Importacion, type ImportacionFormData } from '@/shared/schemas';
import { ImportacionForm } from '../components/ImportacionForm';

export function ImportacionesPage() {
  const [importaciones, setImportaciones] = useState<Importacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingImportacion, setEditingImportacion] = useState<Importacion | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador';

  const fetchImportaciones = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await importacionService.getAll();
      setImportaciones(response.data);
    } catch {
      toast.error('Error al cargar las importaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImportaciones();
  }, [fetchImportaciones]);

  const filteredImportaciones = useMemo(() => {
    if (!searchTerm.trim()) return importaciones;
    const term = searchTerm.toLowerCase();
    return importaciones.filter((imp) =>
      imp.nombre_proveedor.toLowerCase().includes(term) ||
      imp.nombre_estado.toLowerCase().includes(term)
    );
  }, [importaciones, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta importación?')) return;
    try {
      await importacionService.delete(id.toString());
      toast.success('Importación eliminada correctamente');
      fetchImportaciones();
    } catch {
      toast.error('Error al eliminar la importación');
    }
  };

  const handleCreate = async (data: ImportacionFormData) => {
    try {
      await importacionService.create(data);
      toast.success('Importación creada correctamente');
      fetchImportaciones();
    } catch {
      toast.error('Error al crear la importación');
    }
  };

  const handleUpdate = async (data: ImportacionFormData) => {
    if (!editingImportacion) return;
    try {
      await importacionService.update(editingImportacion.id.toString(), data);
      toast.success('Importación actualizada correctamente');
      fetchImportaciones();
    } catch {
      toast.error('Error al actualizar la importación');
    }
  };

  const handleOpenCreate = () => {
    setEditingImportacion(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (imp: Importacion) => {
    setEditingImportacion(imp);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingImportacion) return null;
    return {
      id_proveedor: editingImportacion.id_proveedor,
      id_estado: editingImportacion.id_estado,
      fecha_inicio: editingImportacion.fecha_inicio || '',
      fecha_estimada: editingImportacion.fecha_estimada || '',
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Importaciones</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Importación
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar importaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando importaciones...</div>
        </div>
      ) : filteredImportaciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Plane className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron importaciones' : 'No hay importaciones registradas'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear la primera importación
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Estimada</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImportaciones.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="font-medium">{imp.id}</TableCell>
                  <TableCell>{imp.nombre_proveedor}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {imp.nombre_estado}
                    </span>
                  </TableCell>
                  <TableCell>{imp.fecha_inicio ? new Date(imp.fecha_inicio).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{imp.fecha_estimada ? new Date(imp.fecha_estimada).toLocaleDateString() : '-'}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(imp)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(imp.id)}
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

      <ImportacionForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingImportacion ? handleUpdate : handleCreate}
      />
    </div>
  );
}
