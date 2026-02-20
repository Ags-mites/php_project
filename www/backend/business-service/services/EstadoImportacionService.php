<?php
include_once __DIR__ . '/../repositories/EstadoImportacionRepository.php';

class EstadoImportacionService {
    private $repository;

    public function __construct($db) {
        $this->repository = new EstadoImportacionRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_estado'],
                    "nombre_estado" => $row['nombre_estado'],
                    "descripcion_estado" => $row['descripcion_estado'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No states found."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_estado'],
                    "nombre_estado" => $row['nombre_estado'],
                    "descripcion_estado" => $row['descripcion_estado'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No state with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "State created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create state."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "State updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update state."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "State deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete state."]];
        }
    }
}
?>
