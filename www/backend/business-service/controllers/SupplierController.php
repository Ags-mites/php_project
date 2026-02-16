<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/SupplierDTO.php';
include_once __DIR__ . '/../services/SupplierService.php';

class SupplierController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new SupplierService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllSuppliers();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getSupplierById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $supplierDTO = new SupplierDTO($data);
        $validationError = $supplierDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createSupplier($supplierDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $supplierDTO = new SupplierDTO($data);
        $validationError = $supplierDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateSupplier($id, $supplierDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteSupplier($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
