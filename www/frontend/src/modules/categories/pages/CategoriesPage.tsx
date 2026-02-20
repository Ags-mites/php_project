import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Tags, Search } from 'lucide-react';
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
import { categoryService } from '../services/categoryService';
import { type Category, type CategoryFormData } from '@/shared/schemas';
import { CategoryForm } from '../components/CategoryForm';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador' || user?.role === 'Supervisor' || user?.role === 'Desarrollador';

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch {
      toast.error('Error al cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter((category) =>
      category.nombre_categoria.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleCreate = async (data: CategoryFormData) => {
    try {
      await categoryService.create(data);
      toast.success('Categoría creada correctamente');
      fetchCategories();
    } catch {
      toast.error('Error al crear la categoría');
    }
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    try {
      await categoryService.update(editingCategory.id.toString(), data);
      toast.success('Categoría actualizada correctamente');
      fetchCategories();
    } catch {
      toast.error('Error al actualizar la categoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
    try {
      await categoryService.delete(id.toString());
      toast.success('Categoría eliminada correctamente');
      fetchCategories();
    } catch {
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingCategory) return null;
    return {
      nombre_categoria: editingCategory.nombre_categoria,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando categorías...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Tags className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron categorías' : 'No hay categorías registradas'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear la primera categoría
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.nombre_categoria}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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

      <CategoryForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
      />
    </div>
  );
}
