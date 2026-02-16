<?php
class EmployeeRepository {
    private $conn;
    private $table_name = "EMPLEADO";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                EMPLEADO_ID, NOMBRE, APELLIDO, CARGO, TELEFONO, DIRECCION, FECHA_INGRESO
          FROM " . $this->table_name . "
          ORDER BY EMPLEADO_ID ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                EMPLEADO_ID, NOMBRE, APELLIDO, CARGO, TELEFONO, DIRECCION, FECHA_INGRESO
          FROM " . $this->table_name . "
          WHERE EMPLEADO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($employeeDTO) {
        $query = "INSERT INTO " . $this->table_name . "
                    (NOMBRE, APELLIDO, CARGO, TELEFONO, DIRECCION, FECHA_INGRESO) 
                  VALUES 
                    (:nombre, 
                    :apellido, 
                    :cargo, 
                    :telefono, 
                    :direccion, 
                    :fecha_ingreso)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nombre", $employeeDTO->nombre);
        $stmt->bindParam(":apellido", $employeeDTO->apellido);
        $stmt->bindParam(":cargo", $employeeDTO->cargo);
        $stmt->bindParam(":telefono", $employeeDTO->telefono);
        $stmt->bindParam(":direccion", $employeeDTO->direccion);
        $stmt->bindParam(":fecha_ingreso", $employeeDTO->fecha_ingreso);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $employeeDTO){
        $query = "UPDATE EMPLEADO 
                    SET 
                        NOMBRE = :nombre, 
                        APELLIDO = :apellido, 
                        CARGO = :cargo, 
                        TELEFONO = :telefono, 
                        DIRECCION = :direccion, 
                        FECHA_INGRESO = :fecha_ingreso 
                    WHERE EMPLEADO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":nombre", $employeeDTO->nombre);
        $stmt->bindParam(":apellido", $employeeDTO->apellido);
        $stmt->bindParam(":cargo", $employeeDTO->cargo);
        $stmt->bindParam(":telefono", $employeeDTO->telefono);
        $stmt->bindParam(":direccion", $employeeDTO->direccion);
        $stmt->bindParam(":fecha_ingreso", $employeeDTO->fecha_ingreso);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE EMPLEADO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
