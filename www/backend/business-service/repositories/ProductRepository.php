<?php
class ProductRepository {
    private $conn;
    private $table_name = "PRODUCTO";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                p.PRODUCTO_ID, p.CODIGO, p.DESCRIPCION, 
                p.COLOR, p.MARCA, p.STOCK, p.PRECIO,
                c.NOMBRE as nombre_categoria, 
                t.TALLA as talla, 
                pr.NOMBRE_EMPRESA as nombre_proveedor
          FROM " . $this->table_name . " as p
          LEFT JOIN CATEGORIA c ON p.CATEGORIA_ID = c.CATEGORIA_ID
          LEFT JOIN TALLA t ON p.TALLA_ID = t.TALLA_ID
          LEFT JOIN PROVEEDOR pr ON p.PROVEEDOR_ID = pr.PROVEEDOR_ID
          ORDER BY p.PRODUCTO_ID ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                p.PRODUCTO_ID, p.CODIGO, p.DESCRIPCION, 
                p.COLOR, p.MARCA, p.STOCK, p.PRECIO,
                c.NOMBRE as nombre_categoria, 
                t.TALLA as talla, 
                pr.NOMBRE_EMPRESA as nombre_proveedor
          FROM " . $this->table_name . " as p
          LEFT JOIN CATEGORIA c ON p.CATEGORIA_ID = c.CATEGORIA_ID
          LEFT JOIN TALLA t ON p.TALLA_ID = t.TALLA_ID
          LEFT JOIN PROVEEDOR pr ON p.PROVEEDOR_ID = pr.PROVEEDOR_ID
          WHERE p.PRODUCTO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function create($productDTO) {
        $query = "INSERT INTO " . $this->table_name . "
                    (CODIGO, 
                    DESCRIPCION, 
                    COLOR, 
                    MARCA, 
                    STOCK, 
                    PRECIO, 
                    CATEGORIA_ID, 
                    TALLA_ID, 
                    PROVEEDOR_ID) 
                  VALUES 
                    (:codigo, 
                    :descripcion, 
                    :color, 
                    :marca, 
                    :stock, 
                    :precio, 
                    :categoria_id, 
                    :talla_id, 
                    :proveedor_id)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":codigo", $productDTO->codigo);
        $stmt->bindParam(":descripcion", $productDTO->descripcion);
        $stmt->bindParam(":color", $productDTO->color);
        $stmt->bindParam(":marca", $productDTO->marca);
        $stmt->bindParam(":stock", $productDTO->stock);
        $stmt->bindParam(":precio", $productDTO->precio);
        $stmt->bindParam(":categoria_id", $productDTO->categoria_id);
        $stmt->bindParam(":talla_id", $productDTO->talla_id);
        $stmt->bindParam(":proveedor_id", $productDTO->proveedor_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $productDTO){
        $query = "UPDATE PRODUCTO 
                    SET 
                        CODIGO = :codigo, 
                        DESCRIPCION = :descripcion, 
                        COLOR = :color, 
                        MARCA = :marca, 
                        STOCK = :stock, 
                        PRECIO = :precio, 
                        CATEGORIA_ID = :categoria_id, 
                        TALLA_ID = :talla_id, 
                        PROVEEDOR_ID = :proveedor_id 
                    WHERE PRODUCTO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":codigo", $productDTO->codigo);
        $stmt->bindParam(":descripcion", $productDTO->descripcion);
        $stmt->bindParam(":color", $productDTO->color);
        $stmt->bindParam(":marca", $productDTO->marca);
        $stmt->bindParam(":stock", $productDTO->stock);
        $stmt->bindParam(":precio", $productDTO->precio);
        $stmt->bindParam(":categoria_id", $productDTO->categoria_id);
        $stmt->bindParam(":talla_id", $productDTO->talla_id);
        $stmt->bindParam(":proveedor_id", $productDTO->proveedor_id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete($id){
        $query = "DELETE FROM " . $this->table_name . "
                  WHERE PRODUCTO_ID = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
