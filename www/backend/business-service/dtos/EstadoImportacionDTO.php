<?php
class EstadoImportacionDTO {
    public $nombre_estado;
    public $descripcion_estado;

    public function __construct($data) {
        $this->nombre_estado = isset($data->nombre_estado) ? trim($data->nombre_estado) : null;
        $this->descripcion_estado = isset($data->descripcion_estado) ? trim($data->descripcion_estado) : null;
    }

    public function validate() {
        if (!$this->nombre_estado) {
            return "Required fields: nombre_estado.";
        }
        return null;
    }
}
?>
