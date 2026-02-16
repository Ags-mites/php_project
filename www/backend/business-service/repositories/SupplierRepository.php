<?php
class SupplierRepository {
    private $conn;
    private $table_name = "PROVEEDOR";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                PROVEEDOR_ID, NOMBRE_EMPRESA, TELEFONO, EMAIL, DIRECCION, CIUDAD
          FROM " . $this->table_name . "
          ORDER BY PROVEEDOR_ID DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                PROVEEDOR_ID, NOMBRE_EMPRESA, TELEFONO, EMAIL, DIRECCION, CIUDAD
          FROM " . $this->table_name . "
          WHERE PROVEEDOR_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($supplierDTO) {
        $query = "INSERT INTO " . $this->table_name . "
                    (NOMBRE_EMPRESA, TELEFONO, EMAIL, DIRECCION, CIUDAD) 
                  VALUES 
                    (:nombre_empresa, 
                    :telefono, 
                    :email, 
                    :direccion, 
                    :ciudad)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nombre_empresa", $supplierDTO->nombre_empresa);
        $stmt->bindParam(":telefono", $supplierDTO->telefono);
        $stmt->bindParam(":email", $supplierDTO->email);
        $stmt->bindParam(":direccion", $supplierDTO->direccion);
        $stmt->bindParam(":ciudad", $supplierDTO->ciudad);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $supplierDTO){
        $query = "UPDATE " . $this->table_name . " 
                    SET 
                        NOMBRE_EMPRESA = :nombre_empresa, 
                        TELEFONO = :telefono, 
                        EMAIL = :email, 
                        DIRECCION = :direccion, 
                        CIUDAD = :ciudad
                    WHERE PROVEEDOR_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre_empresa", $supplierDTO->nombre_empresa);
        $stmt->bindParam(":telefono", $supplierDTO->telefono);
        $stmt->bindParam(":email", $supplierDTO->email);
        $stmt->bindParam(":direccion", $supplierDTO->direccion);
        $stmt->bindParam(":ciudad", $supplierDTO->ciudad);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE PROVEEDOR_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
