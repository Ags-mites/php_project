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
import { type Product, type ProductFormData, type Category, type Size, type Supplier } from '@/shared/schemas/product.schema';
import { ProductForm } from '../components/ProductForm';

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const fetchOptions = useCallback(async () => {
    try {
      const [catRes, sizeRes, supRes] = await Promise.all([
        productService.getCategories(),
        productService.getSizes(),
        productService.getSuppliers(),
      ]);
      setCategories(catRes.data);
      setSizes(sizeRes.data);
      setSuppliers(supRes.data);
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
      product.codigo.toLowerCase().includes(term) ||
      product.descripcion.toLowerCase().includes(term) ||
      product.marca.toLowerCase().includes(term) ||
      product.color.toLowerCase().includes(term) ||
      product.nombre_categoria.toLowerCase().includes(term) ||
      product.talla.toLowerCase().includes(term) ||
      product.nombre_proveedor.toLowerCase().includes(term)
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

    const category = categories.find(c => c.nombre === editingProduct.nombre_categoria);
    const size = sizes.find(s => s.talla === editingProduct.talla);
    const supplier = suppliers.find(s => s.nombre_empresa === editingProduct.nombre_proveedor);

    return {
      codigo: editingProduct.codigo,
      descripcion: editingProduct.descripcion,
      color: editingProduct.color,
      marca: editingProduct.marca,
      stock: editingProduct.stock,
      precio: parseFloat(editingProduct.precio),
      categoria_id: category?.id || 0,
      talla_id: size?.id || 0,
      proveedor_id: supplier?.id || 0,
    };
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
              {filteredProducts.map((product) => (
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
                  <TableCell>${parseFloat(product.precio).toFixed(2)}</TableCell>
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
        initialData={getInitialData()}
        categories={categories}
        sizes={sizes}
        suppliers={suppliers}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />
    </div>
  );
}
