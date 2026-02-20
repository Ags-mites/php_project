<?php
class DetalleImportacionRepository {
    private $conn;
    private $table_name = "DetalleImportacion";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT di.id_detalle, di.id_importacion, di.id_producto, di.cantidad, di.precio_unitario,
                  p.sku, p.descripcion as nombre_producto, p.valor_unitario
                  FROM " . $this->table_name . " as di
                  LEFT JOIN Producto p ON di.id_producto = p.id_producto
                  ORDER BY di.id_detalle ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findByImportacionId($importacionId) {
        $query = "SELECT di.id_detalle, di.id_importacion, di.id_producto, di.cantidad, di.precio_unitario,
                  p.sku, p.descripcion as nombre_producto, p.valor_unitario
                  FROM " . $this->table_name . " as di
                  LEFT JOIN Producto p ON di.id_producto = p.id_producto
                  WHERE di.id_importacion = :importacion_id
                  ORDER BY di.id_detalle ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":importacion_id", $importacionId);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT di.id_detalle, di.id_importacion, di.id_producto, di.cantidad, di.precio_unitario,
                  p.sku, p.descripcion as nombre_producto, p.valor_unitario
                  FROM " . $this->table_name . " as di
                  LEFT JOIN Producto p ON di.id_producto = p.id_producto
                  WHERE di.id_detalle = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_importacion, id_producto, cantidad, precio_unitario) VALUES (:id_importacion, :id_producto, :cantidad, :precio_unitario)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":id_producto", $dto->id_producto);
        $stmt->bindParam(":cantidad", $dto->cantidad);
        $stmt->bindParam(":precio_unitario", $dto->precio_unitario);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_importacion = :id_importacion, id_producto = :id_producto, cantidad = :cantidad, precio_unitario = :precio_unitario WHERE id_detalle = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":id_producto", $dto->id_producto);
        $stmt->bindParam(":cantidad", $dto->cantidad);
        $stmt->bindParam(":precio_unitario", $dto->precio_unitario);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_detalle = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteByImportacionId($importacionId) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_importacion = :importacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":importacion_id", $importacionId);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
