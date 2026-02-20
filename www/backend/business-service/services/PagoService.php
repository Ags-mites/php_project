<?php
include_once __DIR__ . '/../repositories/PagoRepository.php';

class PagoService {
    private $repository;

    public function __construct($db) {
        $this->repository = new PagoRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_pago'],
                    "id_importacion" => $row['id_importacion'],
                    "monto" => $row['monto'],
                    "metodo_pago" => $row['metodo_pago'],
                    "moneda" => $row['moneda'],
                    "fecha_pago" => $row['fecha_pago'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No payments found."]];
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
                    "id" => $row['id_pago'],
                    "id_importacion" => $row['id_importacion'],
                    "monto" => $row['monto'],
                    "metodo_pago" => $row['metodo_pago'],
                    "moneda" => $row['moneda'],
                    "fecha_pago" => $row['fecha_pago'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No payments found for import $importacionId."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_pago'],
                    "id_importacion" => $row['id_importacion'],
                    "monto" => $row['monto'],
                    "metodo_pago" => $row['metodo_pago'],
                    "moneda" => $row['moneda'],
                    "fecha_pago" => $row['fecha_pago'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No payment with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Payment created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create payment."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Payment updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update payment."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Payment deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete payment."]];
        }
    }
}
?>
