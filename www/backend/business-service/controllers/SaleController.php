<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../services/SaleService.php';
include_once __DIR__ . '/../dtos/SaleDTO.php';

class SaleController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new SaleService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllSales();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getSaleById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
    
    public function create($data) {
        $saleDTO = new SaleDTO($data);
        $validationError = $saleDTO->validate();

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
            return;
        }
        
        $response = $this->service->createSale($saleDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $saleDTO = new SaleDTO($data);
        $validationError = $saleDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateSale($id, $saleDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteSale($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
