<?php
include_once __DIR__ . '/../repositories/SizeRepository.php';

class SizeService {
    private $sizeRepository;

    public function __construct($db) {
        $this->sizeRepository = new SizeRepository($db);
    }

    public function getAllSizes() {
        $stmt = $this->sizeRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $sizes_arr = array();
            $sizes_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $size_item = array(
                    "id" => $row['TALLA_ID'],
                    "talla" => $row['TALLA'],
                    "descripcion" => $row['DESCRIPCION'],
                );
                array_push($sizes_arr["data"], $size_item);
            }

            return [
                "status" => 200,
                "body" => $sizes_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No sizes found."]
            ];
        }
    }

    public function getSizeById($id){
        $stmt = $this->sizeRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $size_item = array(
                    "id" => $row['TALLA_ID'],
                    "talla" => $row['TALLA'],
                    "descripcion" => $row['DESCRIPCION'],
                );

            return [
                "status" => 200,
                "body" => $size_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No size with id $id found."]
            ];
        }
    } 

    public function createSize($sizeDTO) {
        if($this->sizeRepository->create($sizeDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Size created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create size."]
            ];
        }
    }

    public function updateSize($id, $sizeDTO) {
        if($this->sizeRepository->update($id, $sizeDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Size updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update size."]
            ];
        }
    }

    public function deleteSize($id) {
        if($this->sizeRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Size deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete size."]
            ];
        }
    }
}
?>
