<?php
class SizeRepository {
    private $conn;
    private $table_name = "TALLA";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                TALLA_ID, TALLA, DESCRIPCION
          FROM " . $this->table_name . "
          ORDER BY TALLA_ID ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                TALLA_ID, TALLA, DESCRIPCION
          FROM " . $this->table_name . "
          WHERE TALLA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($sizeDTO) {
        $query = "INSERT INTO " . $this->table_name . "
                    (TALLA, DESCRIPCION) 
                  VALUES 
                    (:talla, 
                    :descripcion)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":talla", $sizeDTO->talla);
        $stmt->bindParam(":descripcion", $sizeDTO->descripcion);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $sizeDTO){
        $query = "UPDATE TALLA 
                    SET 
                        TALLA = :talla, 
                        DESCRIPCION = :descripcion 
                    WHERE TALLA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":talla", $sizeDTO->talla);
        $stmt->bindParam(":descripcion", $sizeDTO->descripcion);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE TALLA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
