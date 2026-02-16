<?php
class SizeDTO {
    public $talla;
    public $descripcion;

    public function __construct($data) {
        $this->talla = isset($data->talla) ? trim($data->talla) : null;
        $this->descripcion = isset($data->descripcion) ? trim($data->descripcion) : null;
    }

    public function validate() {
        if (
            !$this->talla || 
            !$this->descripcion) {
            return "Required fields: talla, descripcion.";
        }
        return null;
    }
}
?>
