<?php
include_once __DIR__ . '/../repositories/CategoriaRepository.php';

class CategoriaService {
    private $repository;

    public function __construct($db) {
        $this->repository = new CategoriaRepository($db);
    }

    public function getAll() {
        $stmt = $this->repository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $arr = array();
            $arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $item = array(
                    "id" => $row['id_categoria'],
                    "nombre_categoria" => $row['nombre_categoria'],
                );
                array_push($arr["data"], $item);
            }

            return ["status" => 200, "body" => $arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No categories found."]];
        }
    }

    public function getById($id) {
        $stmt = $this->repository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            return [
                "status" => 200,
                "body" => [
                    "id" => $row['id_categoria'],
                    "nombre_categoria" => $row['nombre_categoria'],
                ],
            ];
        } else {
            return ["status" => 404, "body" => ["message" => "No category with id $id found."]];
        }
    }

    public function create($dto) {
        if($this->repository->create($dto)){
            return ["status" => 201, "body" => ["message" => "Category created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create category."]];
        }
    }

    public function update($id, $dto) {
        if($this->repository->update($id, $dto)){
            return ["status" => 200, "body" => ["message" => "Category updated."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to update category."]];
        }
    }

    public function delete($id) {
        if($this->repository->delete($id)){
            return ["status" => 200, "body" => ["message" => "Category deleted."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to delete category."]];
        }
    }
}
?>
