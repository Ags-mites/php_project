<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../dtos/ClientDTO.php';
include_once __DIR__ . '/../services/ClientService.php';

class ClientController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new ClientService($this->db);
    }

    public function getAll() {
        $response = $this->service->getAllClients();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function getById($id) {
        $response = $this->service->getClientById($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
    
    public function create($data) {
        $ClientDTO = new ClientDTO($data);
        $validationError = $ClientDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createClient($ClientDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function update($id, $data) {
        $ClientDTO = new ClientDTO($data);
        $validationError = $ClientDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->updateClient($id, $ClientDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function delete($id) {
        $response = $this->service->deleteClient($id);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
