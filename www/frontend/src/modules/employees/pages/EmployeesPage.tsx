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
import { employeeService } from '../services/employeeService';
import { type Employee, type EmployeeFormData } from '@/shared/schemas';
import { EmployeeForm } from '../components/EmployeeForm';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor' || user?.role === 'Developer';

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch {
      toast.error('Error al cargar los empleados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter((employee) =>
      employee.nombre.toLowerCase().includes(term) ||
      employee.apellido.toLowerCase().includes(term) ||
      employee.telefono.toLowerCase().includes(term) ||
      employee.cargo.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      await employeeService.create(data);
      toast.success('Empleado creado correctamente');
      fetchEmployees();
    } catch {
      toast.error('Error al crear el empleado');
    }
  };

  const handleUpdate = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      await employeeService.update(editingEmployee.id.toString(), data);
      toast.success('Empleado actualizado correctamente');
      fetchEmployees();
    } catch {
      toast.error('Error al actualizar el empleado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
    try {
      await employeeService.delete(id.toString());
      toast.success('Empleado eliminado correctamente');
      fetchEmployees();
    } catch {
      toast.error('Error al eliminar el empleado');
    }
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingEmployee) return null;
    return {
      nombre: editingEmployee.nombre,
      apellido: editingEmployee.apellido,
      telefono: editingEmployee.telefono,
      cargo: editingEmployee.cargo,
      direccion: editingEmployee.direccion,
      fecha_ingreso: editingEmployee.fecha_ingreso,
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
            placeholder="Buscar empleados..."
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
      ) : filteredEmployees.length === 0 ? (
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
                <TableHead>Telefono</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Direccion</TableHead>
                <TableHead>Fecha de Ingreso</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.nombre}</TableCell>
                  <TableCell>{employee.apellido}</TableCell>
                  <TableCell>{employee.telefono}</TableCell>
                  <TableCell>{employee.cargo}</TableCell>
                  <TableCell>{employee.direccion}</TableCell>
                  <TableCell>{employee.fecha_ingreso}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
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

      <EmployeeForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingEmployee ? handleUpdate : handleCreate}
      />
    </div>
  );
}
