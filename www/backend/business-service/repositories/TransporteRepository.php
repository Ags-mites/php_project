<?php
class TransporteRepository {
    private $conn;
    private $table_name = "Transporte";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_transporte, id_importacion, tipo_transporte, empresa_transportista, numero_guia FROM " . $this->table_name . " ORDER BY id_transporte ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findByImportacionId($importacionId) {
        $query = "SELECT id_transporte, id_importacion, tipo_transporte, empresa_transportista, numero_guia FROM " . $this->table_name . " WHERE id_importacion = :importacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":importacion_id", $importacionId);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_transporte, id_importacion, tipo_transporte, empresa_transportista, numero_guia FROM " . $this->table_name . " WHERE id_transporte = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_importacion, tipo_transporte, empresa_transportista, numero_guia) VALUES (:id_importacion, :tipo_transporte, :empresa_transportista, :numero_guia)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":tipo_transporte", $dto->tipo_transporte);
        $stmt->bindParam(":empresa_transportista", $dto->empresa_transportista);
        $stmt->bindParam(":numero_guia", $dto->numero_guia);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_importacion = :id_importacion, tipo_transporte = :tipo_transporte, empresa_transportista = :empresa_transportista, numero_guia = :numero_guia WHERE id_transporte = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":tipo_transporte", $dto->tipo_transporte);
        $stmt->bindParam(":empresa_transportista", $dto->empresa_transportista);
        $stmt->bindParam(":numero_guia", $dto->numero_guia);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_transporte = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
