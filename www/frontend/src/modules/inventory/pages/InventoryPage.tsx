import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { type Product, type ProductFormData } from '@/shared/schemas/product.schema';
import { ProductForm } from '../components/ProductForm';

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor';

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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando productos...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>No hay productos registrados</p>
          {canManage && (
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
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead>Proveedor</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.codigo}</TableCell>
                  <TableCell>{product.descripcion}</TableCell>
                  <TableCell>{product.marca}</TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>${product.precio.toFixed(2)}</TableCell>
                  <TableCell>{product.nombre_categoria}</TableCell>
                  <TableCell>{product.talla}</TableCell>
                  <TableCell>{product.nombre_proveedor}</TableCell>
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
        initialData={editingProduct ? {
          codigo: editingProduct.codigo,
          descripcion: editingProduct.descripcion,
          color: editingProduct.color,
          marca: editingProduct.marca,
          stock: editingProduct.stock,
          precio: editingProduct.precio,
          categoria_id: 1,
          talla_id: 1,
          proveedor_id: 1,
        } : null}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />
    </div>
  );
}
