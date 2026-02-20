<?php
include_once __DIR__ . '/../repositories/TransporteRepository.php';

class TransporteService {
    private $repository;

    public function __construct($db) {
        $this->repository = new TransporteRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_transporte'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_transporte" => $row['tipo_transporte'],
                    "empresa_transportista" => $row['empresa_transportista'],
                    "numero_guia" => $row['numero_guia'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No transport found."]];
        }
    }

    public function getByImportacionId($importacionId) {
        $stmt = $this->repository->findByImportacionId($importacionId);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_transporte'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_transporte" => $row['tipo_transporte'],
                    "empresa_transportista" => $row['empresa_transportista'],
                    "numero_guia" => $row['numero_guia'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No transport found for import $importacionId."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_transporte'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_transporte" => $row['tipo_transporte'],
                    "empresa_transportista" => $row['empresa_transportista'],
                    "numero_guia" => $row['numero_guia'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No transport with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Transport created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create transport."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Transport updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update transport."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Transport deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete transport."]];
        }
    }
}
?>
