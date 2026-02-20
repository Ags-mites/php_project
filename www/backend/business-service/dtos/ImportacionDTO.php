<?php
class ImportacionDTO {
    public $id_proveedor;
    public $id_estado;
    public $fecha_inicio;
    public $fecha_estimada;

    public function __construct($data) {
        $this->id_proveedor = isset($data->id_proveedor) ? trim($data->id_proveedor) : null;
        $this->id_estado = isset($data->id_estado) ? trim($data->id_estado) : null;
        $this->fecha_inicio = isset($data->fecha_inicio) ? trim($data->fecha_inicio) : null;
        $this->fecha_estimada = isset($data->fecha_estimada) ? trim($data->fecha_estimada) : null;
    }

    public function validate() {
        if (!$this->id_proveedor || !$this->id_estado) {
            return "Required fields: id_proveedor, id_estado.";
        }
        return null;
    }
}
?>
