<?php
class ProductoRepository {
    private $conn;
    private $table_name = "Producto";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT p.id_producto, p.id_categoria, p.descripcion, p.valor_unitario, p.pais_origen, p.sku, c.nombre_categoria
                  FROM " . $this->table_name . " as p
                  LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
                  ORDER BY p.id_producto ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT p.id_producto, p.id_categoria, p.descripcion, p.valor_unitario, p.pais_origen, p.sku, c.nombre_categoria
                  FROM " . $this->table_name . " as p
                  LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
                  WHERE p.id_producto = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function findByCategoriaId($categoriaId) {
        $query = "SELECT p.id_producto, p.id_categoria, p.descripcion, p.valor_unitario, p.pais_origen, p.sku, c.nombre_categoria
                  FROM " . $this->table_name . " as p
                  LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
                  WHERE p.id_categoria = :categoria_id
                  ORDER BY p.id_producto ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":categoria_id", $categoriaId);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_categoria, descripcion, valor_unitario, pais_origen, sku) VALUES (:id_categoria, :descripcion, :valor_unitario, :pais_origen, :sku)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_categoria", $dto->id_categoria);
        $stmt->bindParam(":descripcion", $dto->descripcion);
        $stmt->bindParam(":valor_unitario", $dto->valor_unitario);
        $stmt->bindParam(":pais_origen", $dto->pais_origen);
        $stmt->bindParam(":sku", $dto->sku);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_categoria = :id_categoria, descripcion = :descripcion, valor_unitario = :valor_unitario, pais_origen = :pais_origen, sku = :sku WHERE id_producto = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_categoria", $dto->id_categoria);
        $stmt->bindParam(":descripcion", $dto->descripcion);
        $stmt->bindParam(":valor_unitario", $dto->valor_unitario);
        $stmt->bindParam(":pais_origen", $dto->pais_origen);
        $stmt->bindParam(":sku", $dto->sku);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_producto = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
