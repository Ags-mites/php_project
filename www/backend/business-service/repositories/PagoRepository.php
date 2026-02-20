<?php
class PagoRepository {
    private $conn;
    private $table_name = "Pago";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT id_pago, id_importacion, monto, metodo_pago, moneda, fecha_pago FROM " . $this->table_name . " ORDER BY id_pago ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findByImportacionId($importacionId) {
        $query = "SELECT id_pago, id_importacion, monto, metodo_pago, moneda, fecha_pago FROM " . $this->table_name . " WHERE id_importacion = :importacion_id ORDER BY id_pago ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":importacion_id", $importacionId);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT id_pago, id_importacion, monto, metodo_pago, moneda, fecha_pago FROM " . $this->table_name . " WHERE id_pago = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($dto) {
        $query = "INSERT INTO " . $this->table_name . " (id_importacion, monto, metodo_pago, moneda, fecha_pago) VALUES (:id_importacion, :monto, :metodo_pago, :moneda, :fecha_pago)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":monto", $dto->monto);
        $stmt->bindParam(":metodo_pago", $dto->metodo_pago);
        $stmt->bindParam(":moneda", $dto->moneda);
        $stmt->bindParam(":fecha_pago", $dto->fecha_pago);
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $dto) {
        $query = "UPDATE " . $this->table_name . " SET id_importacion = :id_importacion, monto = :monto, metodo_pago = :metodo_pago, moneda = :moneda, fecha_pago = :fecha_pago WHERE id_pago = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_importacion", $dto->id_importacion);
        $stmt->bindParam(":monto", $dto->monto);
        $stmt->bindParam(":metodo_pago", $dto->metodo_pago);
        $stmt->bindParam(":moneda", $dto->moneda);
        $stmt->bindParam(":fecha_pago", $dto->fecha_pago);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_pago = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
