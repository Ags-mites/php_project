<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/ProductDTO.php';
include_once __DIR__ . '/../services/ProductService.php';

class ProductController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new ProductService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllProducts();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getProductById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $productDTO = new ProductDTO($data);
        $validationError = $productDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createProduct($productDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $productDTO = new ProductDTO($data);
        $validationError = $productDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateProduct($id, $productDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteProduct($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
