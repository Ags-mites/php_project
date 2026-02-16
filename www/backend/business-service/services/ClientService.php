<?php
// Repositories
include_once __DIR__ . '/../repositories/ClientRepository.php';

// Services
include_once __DIR__ . '/SaleService.php';

class ClientService {
    private $clientRepository;
    private $saleService;

    public function __construct($db) {
        $this->clientRepository = new ClientRepository($db);
        $this->saleService = new SaleService($db);
    }

    public function getAllClients() {
        $stmt = $this->clientRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $clients_arr = array();
            $clients_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $client_item = array(
                    "id" => $row['CLIENTE_ID'],
                    "nombre" => $row['NOMBRE'],
                    "apellido" => $row['APELLIDO'],
                    "telefono" => $row['TELEFONO'],
                    "email" => $row['EMAIL'],
                    "direccion" => $row['DIRECCION'],
                );
                array_push($clients_arr["data"], $client_item);
            }

            return [
                "status" => 200,
                "body" => $clients_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No Clients found."]
            ];
        }
    }

    public function getClientById($id){
        $stmt = $this->clientRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
             $client_item = array(
                    "id" => $row['CLIENTE_ID'],
                    "nombre" => $row['NOMBRE'],
                    "apellido" => $row['APELLIDO'],
                    "telefono" => $row['TELEFONO'],
                    "email" => $row['EMAIL'],
                    "direccion" => $row['DIRECCION'],
                );

            return [
                "status" => 200,
                "body" => $client_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No Client with id $id found."]
            ];
        }
    } 

    public function createClient($clientDTO) {
        if($this->clientRepository->create($clientDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Client created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create Client."]
            ];
        }
    }

    public function updateClient($id, $clientDTO) {
        if($this->clientRepository->update($id, $clientDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Client updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update Client."]
            ];
        }
    }

    public function deleteClient($id) {
        $salesResult = $this->saleService->getSalesByClientId($id);
        if ($salesResult['status'] === 200) {
            foreach ($salesResult['body']['data'] as $sale) {
                $this->saleService->deleteSale($sale['id']);
            }
        }

        if($this->clientRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Client deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete Client."]
            ];
        }
    }
}
?>
