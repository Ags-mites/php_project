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
import { productService } from '../services/productService';
import { type Product, type ProductFormData, type Category } from '@/shared/schemas';
import { ProductForm } from '../components/ProductForm';

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador';

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
    } catch {
      toast.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const catRes = await productService.getCategories();
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOptions();
  }, [fetchProducts, fetchOptions]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.sku.toLowerCase().includes(term) ||
      product.descripcion.toLowerCase().includes(term) ||
      product.pais_origen.toLowerCase().includes(term) ||
      product.nombre_categoria.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const handleCreate = async (data: ProductFormData) => {
    try {
      await productService.create(data);
      toast.success('Producto creado correctamente');
      fetchProducts();
    } catch {
      toast.error('Error al crear el producto');
    }
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (!editingProduct) return;
    try {
      await productService.update(editingProduct.id.toString(), data);
      toast.success('Producto actualizado correctamente');
      fetchProducts();
    } catch {
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await productService.delete(id.toString());
      toast.success('Producto eliminado correctamente');
      fetchProducts();
    } catch {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingProduct) return null;
    return {
      id_categoria: editingProduct.id_categoria,
      descripcion: editingProduct.descripcion,
      valor_unitario: parseFloat(editingProduct.valor_unitario),
      pais_origen: editingProduct.pais_origen,
      sku: editingProduct.sku,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando productos...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear el primer producto
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Valor Unitario</TableHead>
                <TableHead>País de Origen</TableHead>
                <TableHead>Categoría</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.descripcion}</TableCell>
                  <TableCell>${parseFloat(product.valor_unitario).toFixed(2)}</TableCell>
                  <TableCell>{product.pais_origen}</TableCell>
                  <TableCell>{product.nombre_categoria}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
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

      <ProductForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        categories={categories}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />
    </div>
  );
}
