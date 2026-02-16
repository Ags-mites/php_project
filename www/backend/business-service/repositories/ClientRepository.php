<?php
class ClientRepository {
    private $conn;
    private $table_name = "CLIENTE";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT CLIENTE_ID, 
                        NOMBRE, 
                        APELLIDO, 
                        EMAIL, 
                        TELEFONO, 
                        DIRECCION 
                    FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                CLIENTE_ID, 
                NOMBRE, 
                APELLIDO, 
                EMAIL, 
                TELEFONO, 
                DIRECCION 
          FROM " . $this->table_name . " as p
          WHERE p.CLIENTE_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                    (NOMBRE, 
                    APELLIDO, 
                    EMAIL, 
                    TELEFONO, 
                    DIRECCION) 
                  VALUES
                    (:nombre, 
                    :apellido, 
                    :email, 
                    :telefono,
                    :direccion)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nombre", $data->nombre);
        $stmt->bindParam(":apellido", $data->apellido);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":telefono", $data->telefono);
        $stmt->bindParam(":direccion", $data->direccion);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $clientDTO){
        $query = "UPDATE " . $this->table_name . " 
                    SET 
                        NOMBRE = :nombre, 
                        APELLIDO = :apellido, 
                        EMAIL = :email, 
                        TELEFONO = :telefono, 
                        DIRECCION = :direccion 
                    WHERE CLIENTE_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre", $clientDTO->nombre);
        $stmt->bindParam(":apellido", $clientDTO->apellido);
        $stmt->bindParam(":email", $clientDTO->email);
        $stmt->bindParam(":telefono", $clientDTO->telefono);
        $stmt->bindParam(":direccion", $clientDTO->direccion);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . " WHERE CLIENTE_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
