<?php
include_once __DIR__ . '/../repositories/ProveedorInternacionalRepository.php';

class ProveedorInternacionalService {
    private $repository;

    public function __construct($db) {
        $this->repository = new ProveedorInternacionalRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_proveedor'],
                    "nombre_empresa" => $row['nombre_empresa'],
                    "pais_origen" => $row['pais_origen'],
                    "direccion" => $row['direccion'],
                    "email_contacto" => $row['email_contacto'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 200, "body" => ["data" => []]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_proveedor'],
                    "nombre_empresa" => $row['nombre_empresa'],
                    "pais_origen" => $row['pais_origen'],
                    "direccion" => $row['direccion'],
                    "email_contacto" => $row['email_contacto'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No provider with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Provider created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create provider."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Provider updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update provider."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Provider deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete provider."]];
        }
    }
}
?>
