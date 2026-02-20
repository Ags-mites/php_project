<?php
class ImportacionRepository {
    private $conn;
    private $table_name = "Importacion";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT i.id_importacion, i.id_proveedor, i.id_estado, i.fecha_inicio, i.fecha_estimada,
                  pi.nombre_empresa as nombre_proveedor, ei.nombre_estado as nombre_estado
                  FROM " . $this->table_name . " as i
                  LEFT JOIN ProveedorInternacional pi ON i.id_proveedor = pi.id_proveedor
                  LEFT JOIN EstadoImportacion ei ON i.id_estado = ei.id_estado
                  ORDER BY i.id_importacion ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT i.id_importacion, i.id_proveedor, i.id_estado, i.fecha_inicio, i.fecha_estimada,
                  pi.nombre_empresa as nombre_proveedor, ei.nombre_estado as nombre_estado
                  FROM " . $this->table_name . " as i
                  LEFT JOIN ProveedorInternacional pi ON i.id_proveedor = pi.id_proveedor
                  LEFT JOIN EstadoImportacion ei ON i.id_estado = ei.id_estado
                  WHERE i.id_importacion = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function findByProveedorId($proveedorId) {
        $query = "SELECT i.id_importacion, i.id_proveedor, i.id_estado, i.fecha_inicio, i.fecha_estimada,
                  pi.nombre_empresa as nombre_proveedor, ei.nombre_estado as nombre_estado
                  FROM " . $this->table_name . " as i
                  LEFT JOIN ProveedorInternacional pi ON i.id_proveedor = pi.id_proveedor
                  LEFT JOIN EstadoImportacion ei ON i.id_estado = ei.id_estado
                  WHERE i.id_proveedor = :proveedor_id
                  ORDER BY i.id_importacion ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":proveedor_id", $proveedorId);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_proveedor, id_estado, fecha_inicio, fecha_estimada) VALUES (:id_proveedor, :id_estado, :fecha_inicio, :fecha_estimada)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_proveedor", $dto->id_proveedor);
        $stmt->bindParam(":id_estado", $dto->id_estado);
        $stmt->bindParam(":fecha_inicio", $dto->fecha_inicio);
        $stmt->bindParam(":fecha_estimada", $dto->fecha_estimada);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_proveedor = :id_proveedor, id_estado = :id_estado, fecha_inicio = :fecha_inicio, fecha_estimada = :fecha_estimada WHERE id_importacion = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_proveedor", $dto->id_proveedor);
        $stmt->bindParam(":id_estado", $dto->id_estado);
        $stmt->bindParam(":fecha_inicio", $dto->fecha_inicio);
        $stmt->bindParam(":fecha_estimada", $dto->fecha_estimada);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_importacion = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
