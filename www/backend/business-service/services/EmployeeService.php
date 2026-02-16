<?php
include_once __DIR__ . '/../repositories/EmployeeRepository.php';

class EmployeeService {
    private $employeeRepository;

    public function __construct($db) {
        $this->employeeRepository = new EmployeeRepository($db);
    }

    public function getAllEmployees() {
        $stmt = $this->employeeRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $employees_arr = array();
            $employees_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $employee_item = array(
                    "id" => $row['EMPLEADO_ID'],
                    "nombre" => $row['NOMBRE'],
                    "apellido" => $row['APELLIDO'],
                    "cargo" => $row['CARGO'],
                    "telefono" => $row['TELEFONO'],
                    "direccion" => $row['DIRECCION'],
                    "fecha_ingreso" => $row['FECHA_INGRESO'],
                );
                array_push($employees_arr["data"], $employee_item);
            }

            return [
                "status" => 200,
                "body" => $employees_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No categories found."]
            ];
        }
    }

    public function getEmployeeById($id){
        $stmt = $this->employeeRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $employee_item = array(
                    "id" => $row['EMPLEADO_ID'],
                    "nombre" => $row['NOMBRE'],
                    "apellido" => $row['APELLIDO'],
                    "cargo" => $row['CARGO'],
                    "telefono" => $row['TELEFONO'],
                    "direccion" => $row['DIRECCION'],
                    "fecha_ingreso" => $row['FECHA_INGRESO'],
                );

            return [
                "status" => 200,
                "body" => $employee_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No employee with id $id found."]
            ];
        }
    } 

    public function createEmployee($employeeDTO) {
        if($this->employeeRepository->create($employeeDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Employee created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create employee."]
            ];
        }
    }

    public function updateEmployee($id, $employeeDTO) {
        if($this->employeeRepository->update($id, $employeeDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Employee updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update employee."]
            ];
        }
    }

    public function deleteEmployee($id) {
        if($this->employeeRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Employee deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete employee."]
            ];
        }
    }
}
?>
