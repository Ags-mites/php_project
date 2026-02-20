<?php
include_once __DIR__ . '/../repositories/DetalleImportacionRepository.php';

class DetalleImportacionService {
    private $repository;

    public function __construct($db) {
        $this->repository = new DetalleImportacionRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_detalle'],
                    "id_importacion" => $row['id_importacion'],
                    "id_producto" => $row['id_producto'],
                    "sku" => $row['sku'],
                    "nombre_producto" => $row['nombre_producto'],
                    "cantidad" => $row['cantidad'],
                    "precio_unitario" => $row['precio_unitario'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No details found."]];
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
                    "id" => $row['id_detalle'],
                    "id_importacion" => $row['id_importacion'],
                    "id_producto" => $row['id_producto'],
                    "sku" => $row['sku'],
                    "nombre_producto" => $row['nombre_producto'],
                    "cantidad" => $row['cantidad'],
                    "precio_unitario" => $row['precio_unitario'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No details found for import $importacionId."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_detalle'],
                    "id_importacion" => $row['id_importacion'],
                    "id_producto" => $row['id_producto'],
                    "sku" => $row['sku'],
                    "nombre_producto" => $row['nombre_producto'],
                    "cantidad" => $row['cantidad'],
                    "precio_unitario" => $row['precio_unitario'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No detail with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Detail created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create detail."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Detail updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update detail."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Detail deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete detail."]];
        }
    }
}
?>
