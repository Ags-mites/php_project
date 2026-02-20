<?php
class ProveedorInternacionalRepository {
    private $conn;
    private $table_name = "ProveedorInternacional";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_proveedor, nombre_empresa, pais_origen, direccion, email_contacto FROM " . $this->table_name . " ORDER BY id_proveedor ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_proveedor, nombre_empresa, pais_origen, direccion, email_contacto FROM " . $this->table_name . " WHERE id_proveedor = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (nombre_empresa, pais_origen, direccion, email_contacto) VALUES (:nombre_empresa, :pais_origen, :direccion, :email_contacto)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre_empresa", $dto->nombre_empresa);
        $stmt->bindParam(":pais_origen", $dto->pais_origen);
        $stmt->bindParam(":direccion", $dto->direccion);
        $stmt->bindParam(":email_contacto", $dto->email_contacto);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET nombre_empresa = :nombre_empresa, pais_origen = :pais_origen, direccion = :direccion, email_contacto = :email_contacto WHERE id_proveedor = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre_empresa", $dto->nombre_empresa);
        $stmt->bindParam(":pais_origen", $dto->pais_origen);
        $stmt->bindParam(":direccion", $dto->direccion);
        $stmt->bindParam(":email_contacto", $dto->email_contacto);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_proveedor = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
