<?php
class EstadoImportacionRepository {
    private $conn;
    private $table_name = "EstadoImportacion";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_estado, nombre_estado, descripcion_estado FROM " . $this->table_name . " ORDER BY id_estado ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_estado, nombre_estado, descripcion_estado FROM " . $this->table_name . " WHERE id_estado = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (nombre_estado, descripcion_estado) VALUES (:nombre_estado, :descripcion_estado)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre_estado", $dto->nombre_estado);
        $stmt->bindParam(":descripcion_estado", $dto->descripcion_estado);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET nombre_estado = :nombre_estado, descripcion_estado = :descripcion_estado WHERE id_estado = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre_estado", $dto->nombre_estado);
        $stmt->bindParam(":descripcion_estado", $dto->descripcion_estado);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_estado = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
