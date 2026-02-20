<?php
class ProductoDTO {
    public $id_categoria;
    public $descripcion;
    public $valor_unitario;
    public $pais_origen;
    public $sku;

    public function __construct($data) {
        $this->id_categoria = isset($data->id_categoria) ? trim($data->id_categoria) : null;
        $this->descripcion = isset($data->descripcion) ? trim($data->descripcion) : null;
        $this->valor_unitario = isset($data->valor_unitario) ? trim($data->valor_unitario) : null;
        $this->pais_origen = isset($data->pais_origen) ? trim($data->pais_origen) : null;
        $this->sku = isset($data->sku) ? trim($data->sku) : null;
    }

    public function validate() {
        if (!$this->id_categoria || !$this->descripcion || !$this->valor_unitario || !$this->pais_origen || !$this->sku) {
            return "Required fields: id_categoria, descripcion, valor_unitario, pais_origen, sku.";
        }
        return null;
    }
}
?>
