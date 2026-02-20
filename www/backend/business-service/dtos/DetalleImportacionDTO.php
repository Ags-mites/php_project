<?php
class DetalleImportacionDTO {
    public $id_importacion;
    public $id_producto;
    public $cantidad;
    public $precio_unitario;

    public function __construct($data) {
        $this->id_importacion = isset($data->id_importacion) ? trim($data->id_importacion) : null;
        $this->id_producto = isset($data->id_producto) ? trim($data->id_producto) : null;
        $this->cantidad = isset($data->cantidad) ? trim($data->cantidad) : null;
        $this->precio_unitario = isset($data->precio_unitario) ? trim($data->precio_unitario) : null;
    }

    public function validate() {
        if (!$this->id_importacion || !$this->id_producto || !$this->cantidad || !$this->precio_unitario) {
            return "Required fields: id_importacion, id_producto, cantidad, precio_unitario.";
        }
        return null;
    }
}
?>
