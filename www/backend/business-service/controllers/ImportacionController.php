<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/ImportacionDTO.php';
include_once __DIR__ . '/../dtos/DetalleImportacionDTO.php';
include_once __DIR__ . '/../services/ImportacionService.php';

class ImportacionController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new ImportacionService($this->db);
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

    public function getByProveedorId($proveedorId) {
        $response = $this->service->getByProveedorId($proveedorId);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $dto = new ImportacionDTO($data);
        $validationError = $dto->validate();

        if ($validationError) {
            http_response_code(400);
            echo json_encode(["message" => $validationError]);
            return;
        }

        $detalles = isset($data->detalles) ? $data->detalles : null;
        $response = $this->service->create($dto, $detalles);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $dto = new ImportacionDTO($data);
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
