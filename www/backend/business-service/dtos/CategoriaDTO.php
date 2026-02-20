<?php
class CategoriaDTO {
    public $nombre_categoria;

    public function __construct($data) {
        $this->nombre_categoria = isset($data->nombre_categoria) ? trim($data->nombre_categoria) : null;
    }

    public function validate() {
        if (!$this->nombre_categoria) {
            return "Required fields: nombre_categoria.";
        }
        return null;
    }
}
?>
