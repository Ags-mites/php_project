<?php
class DocumentoAduaneroRepository {
    private $conn;
    private $table_name = "DocumentoAduanero";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_documento, id_importacion, tipo_documento, numero_documento, fecha_emision FROM " . $this->table_name . " ORDER BY id_documento ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findByImportacionId($importacionId) {
        $query = "SELECT id_documento, id_importacion, tipo_documento, numero_documento, fecha_emision FROM " . $this->table_name . " WHERE id_importacion = :importacion_id ORDER BY id_documento ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":importacion_id", $importacionId);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_documento, id_importacion, tipo_documento, numero_documento, fecha_emision FROM " . $this->table_name . " WHERE id_documento = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_importacion, tipo_documento, numero_documento, fecha_emision) VALUES (:id_importacion, :tipo_documento, :numero_documento, :fecha_emision)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":tipo_documento", $dto->tipo_documento);
        $stmt->bindParam(":numero_documento", $dto->numero_documento);
        $stmt->bindParam(":fecha_emision", $dto->fecha_emision);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_importacion = :id_importacion, tipo_documento = :tipo_documento, numero_documento = :numero_documento, fecha_emision = :fecha_emision WHERE id_documento = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":tipo_documento", $dto->tipo_documento);
        $stmt->bindParam(":numero_documento", $dto->numero_documento);
        $stmt->bindParam(":fecha_emision", $dto->fecha_emision);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_documento = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
