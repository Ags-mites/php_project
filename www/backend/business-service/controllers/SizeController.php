<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/SizeDTO.php';
include_once __DIR__ . '/../services/SizeService.php';

class SizeController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new SizeService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllSizes();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getSizeById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        $sizeDTO = new SizeDTO($data);
        $validationError = $sizeDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createSize($sizeDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $sizeDTO = new SizeDTO($data);
        $validationError = $sizeDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateSize($id, $sizeDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteSize($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
