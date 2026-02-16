<?php
class CategoryDTO {
    public $nombre;
    public $descripcion;

    public function __construct($data) {
        $this->nombre = isset($data->nombre) ? trim($data->nombre) : null;
        $this->descripcion = isset($data->descripcion) ? trim($data->descripcion) : null;
    }

    public function validate() {
        if (
            !$this->nombre || 
            !$this->descripcion) {
            return "Required fields: nombre, descripcion.";
        }
        return null;
    }
}
?>
