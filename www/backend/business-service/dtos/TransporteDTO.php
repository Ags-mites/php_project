<?php
class TransporteDTO {
    public $id_importacion;
    public $tipo_transporte;
    public $empresa_transportista;
    public $numero_guia;

    public function __construct($data) {
        $this->id_importacion = isset($data->id_importacion) ? trim($data->id_importacion) : null;
        $this->tipo_transporte = isset($data->tipo_transporte) ? trim($data->tipo_transporte) : null;
        $this->empresa_transportista = isset($data->empresa_transportista) ? trim($data->empresa_transportista) : null;
        $this->numero_guia = isset($data->numero_guia) ? trim($data->numero_guia) : null;
    }

    public function validate() {
        if (!$this->id_importacion || !$this->numero_guia) {
            return "Required fields: id_importacion, numero_guia.";
        }
        return null;
    }
}
?>
