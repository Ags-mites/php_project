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
import { employeService } from '../services/employeService';
import { type Employe, type EmployeFormData } from '@/shared/schemas';
import { EmployeForm } from '../components/EmployeForm';

export function EmployePage() {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor';

  const fetchEmployes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await employeService.getAll();
      setEmployes(response.data);
    } catch {
      toast.error('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployes();
  }, [fetchEmployes]);

  const filteredEmployes = useMemo(() => {
    if (!searchTerm.trim()) return employes;
    const term = searchTerm.toLowerCase();
    return employes.filter((employe) =>
      employe.nombre.toLowerCase().includes(term) ||
      employe.apellido.toLowerCase().includes(term) ||
      employe.telefono.toLowerCase().includes(term) ||
      employe.cargo.toLowerCase().includes(term) ||
      employe.direccion.toLowerCase().includes(term)
    );
  }, [employes, searchTerm]);

  const handleCreate = async (data: EmployeFormData) => {
    try {
      await employeService.create(data);
      toast.success('Empleado creado correctamente');
      fetchEmployes();
    } catch {
      toast.error('Error al crear el empleado');
    }
  };

  const handleUpdate = async (data: EmployeFormData) => {
    if (!editingEmploye) return;
    try {
      await employeService.update(editingEmploye.id.toString(), data);
      toast.success('Empleado actualizado correctamente');
      fetchEmployes();
    } catch {
      toast.error('Error al actualizar el empleado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
    try {
      await employeService.delete(id.toString());
      toast.success('Empleado eliminado correctamente');
      fetchEmployes();
    } catch {
      toast.error('Error al eliminar el empleado');
    }
  };

  const handleOpenCreate = () => {
    setEditingEmploye(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (employe: Employe) => {
    setEditingEmploye(employe);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingEmploye) return null;
    return {
      nombre: editingEmploye.nombre,
      apellido: editingEmploye.apellido,
      cargo: editingEmploye.cargo,
      telefono: editingEmploye.telefono,
      direccion: editingEmploye.direccion,
      fecha_ingreso: editingEmploye.fecha_ingreso,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando empleados...</div>
        </div>
      ) : filteredEmployes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron empleados' : 'No hay empleados registrados'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear el primer empleado
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployes.map((employe) => (
                <TableRow key={employe.id}>
                  <TableCell>{employe.nombre}</TableCell>
                  <TableCell>{employe.apellido}</TableCell>
                  <TableCell>{employe.telefono}</TableCell>
                  <TableCell>{employe.cargo}</TableCell>
                  <TableCell>{employe.direccion}</TableCell>
                  <TableCell>{employe.fecha_ingreso}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(employe)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employe.id)}
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

      <EmployeForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingEmploye ? handleUpdate : handleCreate}
      />
    </div>
  );
}
