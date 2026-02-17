import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productService } from '@/modules/inventory/services/productService';
import { type Product } from '@/shared/schemas/product.schema';

interface ProductScannerProps {
    onAdd: (item: any) => void;
    fields: any[];
    onUpdate: (index: number, item: any) => void;
}

export function ProductScanner({ onAdd, fields, onUpdate }: ProductScannerProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchProduct, setSearchProduct] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await productService.getAll();
            setProducts(response.data);
        } catch {
            toast.error('Error al cargar productos');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (searchProduct.trim()) {
            const term = searchProduct.toLowerCase();
            setFilteredProducts(
                products.filter(
                    (p) =>
                        p.codigo.toLowerCase().includes(term) ||
                        p.descripcion.toLowerCase().includes(term) ||
                        p.marca.toLowerCase().includes(term)
                )
            );
        } else {
            setFilteredProducts(products.slice(0, 10));
        }
    }, [searchProduct, products]);

    const addToCart = (product: Product) => {
        const existingIndex = fields.findIndex((item) => item.producto_id === product.id);

        if (existingIndex >= 0) {
            const currentItem = fields[existingIndex];
            onUpdate(existingIndex, { ...currentItem, cantidad: currentItem.cantidad + 1 });
            toast.success('Cantidad actualizada');
        } else {
            onAdd({
                producto_id: product.id,
                cantidad: 1,
                precio: Number(product.precio),
                producto_nombre: `${product.codigo} - ${product.descripcion}`,
            });
            toast.success('Producto agregado');
        }

        setSearchProduct('');
        setFilteredProducts(products.slice(0, 10));
    };

    return (
        <div className="space-y-2">
            <Label>Buscar Producto</Label>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por código, descripción o marca..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="pl-8"
                    autoComplete="off"
                />
                {searchProduct && filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-accent cursor-pointer border-b last:border-0"
                                onClick={() => addToCart(product)}
                            >
                                <div className="font-medium">{product.codigo}</div>
                                <div className="text-sm text-muted-foreground">
                                    {product.descripcion} - ${product.precio}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
