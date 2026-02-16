<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/CategoryDTO.php';
include_once __DIR__ . '/../services/CategoryService.php';

class CategoryController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new CategoryService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllCategories();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getCategoryById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $categoryDTO = new CategoryDTO($data);
        $validationError = $categoryDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createCategory($categoryDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $categoryDTO = new CategoryDTO($data);
        $validationError = $categoryDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateCategory($id, $categoryDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteCategory($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
