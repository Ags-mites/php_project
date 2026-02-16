<?php
include_once __DIR__ . '/../repositories/CategoryRepository.php';

class CategoryService {
    private $categoryRepository;

    public function __construct($db) {
        $this->categoryRepository = new CategoryRepository($db);
    }

    public function getAllCategories() {
        $stmt = $this->categoryRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $categories_arr = array();
            $categories_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $category_item = array(
                    "id" => $row['CATEGORIA_ID'],
                    "nombre" => $row['nombre_categoria'],
                    "descripcion" => $row['descripcion_categoria'],
                );
                array_push($categories_arr["data"], $category_item);
            }

            return [
                "status" => 200,
                "body" => $categories_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No categories found."]
            ];
        }
    }

    public function getCategoryById($id){
        $stmt = $this->categoryRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $category_item = array(
                    "id" => $row['CATEGORIA_ID'],
                    "nombre" => $row['nombre_categoria'],
                    "descripcion" => $row['descripcion_categoria'],
                );

            return [
                "status" => 200,
                "body" => $category_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No category with id $id found."]
            ];
        }
    } 

    public function createCategory($categoryDTO) {
        if($this->categoryRepository->create($categoryDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Category created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create category."]
            ];
        }
    }

    public function updateCategory($id, $categoryDTO) {
        if($this->categoryRepository->update($id, $categoryDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Category updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update category."]
            ];
        }
    }

    public function deleteCategory($id) {
        if($this->categoryRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Category deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete category."]
            ];
        }
    }
}
?>
