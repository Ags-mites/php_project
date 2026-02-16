<?php
class ProductDTO {
    public $codigo;
    public $descripcion;
    public $color;
    public $marca;
    public $stock;
    public $precio;
    public $categoria_id;
    public $talla_id;
    public $proveedor_id;

    public function __construct($data) {
        $this->codigo = isset($data->codigo) ? trim($data->codigo) : null;
        $this->descripcion = isset($data->descripcion) ? trim($data->descripcion) : null;
        $this->color = isset($data->color) ? trim($data->color) : null;
        $this->marca = isset($data->marca) ? trim($data->marca) : null;
        $this->stock = isset($data->stock) ? trim($data->stock) : null;
        $this->precio = isset($data->precio) ? trim($data->precio) : null;
        $this->categoria_id = isset($data->categoria_id) ? trim($data->categoria_id) : null;
        $this->talla_id = isset($data->talla_id) ? trim($data->talla_id) : null;
        $this->proveedor_id = isset($data->proveedor_id) ? trim($data->proveedor_id) : null;
    }

    public function validate() {
        if (
            !$this->codigo || 
            !$this->descripcion || 
            !$this->color || 
            !$this->marca || 
            !$this->stock || 
            !$this->precio || 
            !$this->categoria_id || 
            !$this->talla_id || 
            !$this->proveedor_id) {
            return "Required fields: codigo, descripcion, color, marca, stock, precio, categoria_id, talla_id, proveedor_id.";
        }
        return null;
    }
}
?>
