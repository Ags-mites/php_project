<?php
class CategoriaRepository {
    private $conn;
    private $table_name = "Categoria";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_categoria, nombre_categoria FROM " . $this->table_name . " ORDER BY id_categoria ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_categoria, nombre_categoria FROM " . $this->table_name . " WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (nombre_categoria) VALUES (:nombre_categoria)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre_categoria", $dto->nombre_categoria);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET nombre_categoria = :nombre_categoria WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre_categoria", $dto->nombre_categoria);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_categoria = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
