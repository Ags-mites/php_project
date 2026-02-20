<?php
include_once __DIR__ . '/../repositories/ProductoRepository.php';

class ProductoService {
    private $repository;

    public function __construct($db) {
        $this->repository = new ProductoRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_producto'],
                    "id_categoria" => $row['id_categoria'],
                    "descripcion" => $row['descripcion'],
                    "valor_unitario" => $row['valor_unitario'],
                    "pais_origen" => $row['pais_origen'],
                    "sku" => $row['sku'],
                    "nombre_categoria" => $row['nombre_categoria'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 200, "body" => ["data" => []]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_producto'],
                    "id_categoria" => $row['id_categoria'],
                    "descripcion" => $row['descripcion'],
                    "valor_unitario" => $row['valor_unitario'],
                    "pais_origen" => $row['pais_origen'],
                    "sku" => $row['sku'],
                    "nombre_categoria" => $row['nombre_categoria'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No product with id $id found."]];
        }
    }

    public function getByCategoriaId($categoriaId) {
        $stmt = $this->repository->findByCategoriaId($categoriaId);
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_producto'],
                    "id_categoria" => $row['id_categoria'],
                    "descripcion" => $row['descripcion'],
                    "valor_unitario" => $row['valor_unitario'],
                    "pais_origen" => $row['pais_origen'],
                    "sku" => $row['sku'],
                    "nombre_categoria" => $row['nombre_categoria'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No products found for category $categoriaId."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Product created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create product."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Product updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update product."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Product deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete product."]];
        }
    }
}
?>
