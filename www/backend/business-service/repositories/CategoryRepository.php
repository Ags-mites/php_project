<?php
class CategoryRepository {
    private $conn;
    private $table_name = "CATEGORIA";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                c.CATEGORIA_ID, c.NOMBRE as nombre_categoria, c.DESCRIPCION as descripcion_categoria
          FROM " . $this->table_name . " as c
          ORDER BY c.CATEGORIA_ID ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                c.CATEGORIA_ID, c.NOMBRE as nombre_categoria, c.DESCRIPCION as descripcion_categoria
          FROM " . $this->table_name . " as c
          WHERE c.CATEGORIA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($categoryDTO) {
        $query = "INSERT INTO " . $this->table_name . "
                    (NOMBRE, DESCRIPCION) 
                  VALUES 
                    (:nombre, 
                    :descripcion)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nombre", $categoryDTO->nombre);
        $stmt->bindParam(":descripcion", $categoryDTO->descripcion);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $categoryDTO){
        $query = "UPDATE CATEGORIA 
                    SET 
                        NOMBRE = :nombre, 
                        DESCRIPCION = :descripcion 
                    WHERE CATEGORIA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre", $categoryDTO->nombre);
        $stmt->bindParam(":descripcion", $categoryDTO->descripcion);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE CATEGORIA_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
