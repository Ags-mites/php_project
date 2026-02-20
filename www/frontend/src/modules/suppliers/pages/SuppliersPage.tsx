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
import { supplierService } from '../services/supplierService';
import { type Supplier, type SupplierFormData } from '@/shared/schemas';
import { SupplierForm } from '../components/SupplierForm';

export function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador' || user?.role === 'Supervisor' || user?.role === 'Desarrollador';

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await supplierService.getAll();
      setSuppliers(response.data);
    } catch {
      toast.error('Error al cargar los proveedores');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm.trim()) return suppliers;
    const term = searchTerm.toLowerCase();
    return suppliers.filter((supplier) =>
      supplier.nombre_empresa.toLowerCase().includes(term) ||
      supplier.pais_origen?.toLowerCase().includes(term) ||
      supplier.direccion?.toLowerCase().includes(term) ||
      supplier.email_contacto?.toLowerCase().includes(term)
    );
  }, [suppliers, searchTerm]);

  const handleCreate = async (data: SupplierFormData) => {
    try {
      await supplierService.create(data);
      toast.success('Proveedor creado correctamente');
      fetchSuppliers();
    } catch {
      toast.error('Error al crear el proveedor');
    }
  };

  const handleUpdate = async (data: SupplierFormData) => {
    if (!editingSupplier) return;
    try {
      await supplierService.update(editingSupplier.id.toString(), data);
      toast.success('Proveedor actualizado correctamente');
      fetchSuppliers();
    } catch {
      toast.error('Error al actualizar el proveedor');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return;
    try {
      await supplierService.delete(id.toString());
      toast.success('Proveedor eliminado correctamente');
      fetchSuppliers();
    } catch {
      toast.error('Error al eliminar el proveedor');
    }
  };

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingSupplier) return null;
    return {
      nombre_empresa: editingSupplier.nombre_empresa,
      pais_origen: editingSupplier.pais_origen,
      direccion: editingSupplier.direccion,
      email_contacto: editingSupplier.email_contacto,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proveedores Internacionales</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando proveedores...</div>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Truck className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear el primer proveedor
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>País de Origen</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Email</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.nombre_empresa}</TableCell>
                  <TableCell>{supplier.pais_origen}</TableCell>
                  <TableCell>{supplier.direccion}</TableCell>
                  <TableCell>{supplier.email_contacto}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(supplier)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(supplier.id)}
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

      <SupplierForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingSupplier ? handleUpdate : handleCreate}
      />
    </div>
  );
}
