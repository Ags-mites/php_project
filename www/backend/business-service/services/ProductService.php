<?php
include_once __DIR__ . '/../repositories/ProductoRepository.php';
include_once __DIR__ . '/SaleService.php';

class ProductService {
    private $productRepository;
    private $saleService;

    public function __construct($db) {
        $this->productRepository = new ProductoRepository($db);
        $this->saleService = new SaleService($db);
    }

    public function getAllProducts() {
        $stmt = $this->productRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $products_arr = array();
            $products_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $product_item = array(
                    "id" => $row['PRODUCTO_ID'],
                    "codigo" => $row['CODIGO'],
                    "descripcion" => $row['DESCRIPCION'],
                    "color" => $row['COLOR'],
                    "marca" => $row['MARCA'],
                    "stock" => $row['STOCK'],
                    "precio" => $row['PRECIO'],
                    "nombre_categoria" => $row['nombre_categoria'],
                    "talla" => $row['talla'],
                    "nombre_proveedor" => $row['nombre_proveedor'],
                );
                array_push($products_arr["data"], $product_item);
            }

            return [
                "status" => 200,
                "body" => $products_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No products found."]
            ];
        }
    }

    public function getProductById($id){
        $stmt = $this->productRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $product_item = array(
                    "id" => $row['PRODUCTO_ID'],
                    "codigo" => $row['CODIGO'],
                    "descripcion" => $row['DESCRIPCION'],
                    "color" => $row['COLOR'],
                    "marca" => $row['MARCA'],
                    "stock" => $row['STOCK'],
                    "precio" => $row['PRECIO'],
                    "nombre_categoria" => $row['nombre_categoria'],
                    "talla" => $row['talla'],
                    "nombre_proveedor" => $row['nombre_proveedor'],
                );

            return [
                "status" => 200,
                "body" => $product_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No product with id $id found."]
            ];
        }
    } 

    public function createProduct($productDTO) {
        if($this->productRepository->create($productDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Product created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create product."]
            ];
        }
    }

    public function updateProduct($id, $productDTO) {
        if($this->productRepository->update($id, $productDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Product updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update product."]
            ];
        }
    }

    public function deleteProduct($id) {
        if($this->productRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Product deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete product."]
            ];
        }
    }
}
?>
