<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/EmployeeDTO.php';
include_once __DIR__ . '/../services/EmployeeService.php';

class EmployeeController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new EmployeeService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllEmployees();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getEmployeeById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $employeeDTO = new EmployeeDTO($data);
        $validationError = $employeeDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createEmployee($employeeDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $employeeDTO = new EmployeeDTO($data);
        $validationError = $employeeDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateEmployee($id, $employeeDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteEmployee($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
