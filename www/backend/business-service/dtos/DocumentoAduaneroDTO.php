<?php
class DocumentoAduaneroDTO {
    public $id_importacion;
    public $tipo_documento;
    public $numero_documento;
    public $fecha_emision;

    public function __construct($data) {
        $this->id_importacion = isset($data->id_importacion) ? trim($data->id_importacion) : null;
        $this->tipo_documento = isset($data->tipo_documento) ? trim($data->tipo_documento) : null;
        $this->numero_documento = isset($data->numero_documento) ? trim($data->numero_documento) : null;
        $this->fecha_emision = isset($data->fecha_emision) ? trim($data->fecha_emision) : null;
    }

    public function validate() {
        if (!$this->id_importacion || !$this->numero_documento) {
            return "Required fields: id_importacion, numero_documento.";
        }
        return null;
    }
}
?>
