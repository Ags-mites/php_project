<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/ProveedorInternacionalDTO.php';
include_once __DIR__ . '/../services/ProveedorInternacionalService.php';

class ProveedorInternacionalController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new ProveedorInternacionalService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAll();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $dto = new ProveedorInternacionalDTO($data);
        $validationError = $dto->validate();

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
            return;
        }

        $response = $this->service->create($dto);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $dto = new ProveedorInternacionalDTO($data);
        $validationError = $dto->validate();

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
            return;
        }

        $response = $this->service->update($id, $dto);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->delete($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
