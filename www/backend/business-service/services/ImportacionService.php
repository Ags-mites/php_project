<?php
include_once __DIR__ . '/../repositories/ImportacionRepository.php';
include_once __DIR__ . '/../repositories/DetalleImportacionRepository.php';

class ImportacionService {
    private $importacionRepo;
    private $detalleRepo;

    public function __construct($db) {
        $this->importacionRepo = new ImportacionRepository($db);
        $this->detalleRepo = new DetalleImportacionRepository($db);
    }

    public function getAll() {
        $stmt = $this->importacionRepo->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_importacion'],
                    "id_proveedor" => $row['id_proveedor'],
                    "nombre_proveedor" => $row['nombre_proveedor'],
                    "id_estado" => $row['id_estado'],
                    "nombre_estado" => $row['nombre_estado'],
                    "fecha_inicio" => $row['fecha_inicio'],
                    "fecha_estimada" => $row['fecha_estimada'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 200, "body" => ["data" => []]];
        }
    }

    public function getById($id) {
        $stmt = $this->importacionRepo->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $detalleStmt = $this->detalleRepo->findByImportacionId($id);
            $detalles = array();
            while ($detalleRow = $detalleStmt->fetch(PDO::FETCH_ASSOC)) {
                $detalles[] = array(
                    "id" => $detalleRow['id_detalle'],
                    "id_producto" => $detalleRow['id_producto'],
                    "sku" => $detalleRow['sku'],
                    "nombre_producto" => $detalleRow['nombre_producto'],
                    "cantidad" => $detalleRow['cantidad'],
                    "precio_unitario" => $detalleRow['precio_unitario'],
                );
            }

            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_importacion'],
                    "id_proveedor" => $row['id_proveedor'],
                    "nombre_proveedor" => $row['nombre_proveedor'],
                    "id_estado" => $row['id_estado'],
                    "nombre_estado" => $row['nombre_estado'],
                    "fecha_inicio" => $row['fecha_inicio'],
                    "fecha_estimada" => $row['fecha_estimada'],
                    "detalles" => $detalles,
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No import with id $id found."]];
        }
    }

    public function getByProveedorId($proveedorId) {
        $stmt = $this->importacionRepo->findByProveedorId($proveedorId);
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_importacion'],
                    "id_proveedor" => $row['id_proveedor'],
                    "nombre_proveedor" => $row['nombre_proveedor'],
                    "id_estado" => $row['id_estado'],
                    "nombre_estado" => $row['nombre_estado'],
                    "fecha_inicio" => $row['fecha_inicio'],
                    "fecha_estimada" => $row['fecha_estimada'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No imports found for provider $proveedorId."]];
        }
    }

    public function create($dto, $detalles = null) {
        $id = $this->importacionRepo->create($dto);
        
        if($id && $detalles) {
            foreach ($detalles as $detalle) {
                $detalle->id_importacion = $id;
                $this->detalleRepo->create($detalle);
            }
        }
        
        if($id) {
            return ["status" => 201, "body" => ["message" => "Import created.", "id" => $id]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create import."]];
        }
    }

    public function update($id, $dto) {
        if($this->importacionRepo->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Import updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update import."]];
        }
    }

    public function delete($id) {
        $this->detalleRepo->deleteByImportacionId($id);
        if($this->importacionRepo->delete($id)){
            return ["status" => 200, "body" => ["message" => "Import deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete import."]];
        }
    }
}
?>
