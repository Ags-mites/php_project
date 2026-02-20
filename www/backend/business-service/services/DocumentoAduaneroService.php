<?php
include_once __DIR__ . '/../repositories/DocumentoAduaneroRepository.php';

class DocumentoAduaneroService {
    private $repository;

    public function __construct($db) {
        $this->repository = new DocumentoAduaneroRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_documento'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_documento" => $row['tipo_documento'],
                    "numero_documento" => $row['numero_documento'],
                    "fecha_emision" => $row['fecha_emision'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No documents found."]];
        }
    }

    public function getByImportacionId($importacionId) {
        $stmt = $this->repository->findByImportacionId($importacionId);
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_documento'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_documento" => $row['tipo_documento'],
                    "numero_documento" => $row['numero_documento'],
                    "fecha_emision" => $row['fecha_emision'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No documents found for import $importacionId."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_documento'],
                    "id_importacion" => $row['id_importacion'],
                    "tipo_documento" => $row['tipo_documento'],
                    "numero_documento" => $row['numero_documento'],
                    "fecha_emision" => $row['fecha_emision'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No document with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Document created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create document."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Document updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update document."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Document deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete document."]];
        }
    }
}
?>
