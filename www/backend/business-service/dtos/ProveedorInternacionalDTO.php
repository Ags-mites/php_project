<?php
class ProveedorInternacionalDTO {
    public $nombre_empresa;
    public $pais_origen;
    public $direccion;
    public $email_contacto;

    public function __construct($data) {
        $this->nombre_empresa = isset($data->nombre_empresa) ? trim($data->nombre_empresa) : null;
        $this->pais_origen = isset($data->pais_origen) ? trim($data->pais_origen) : null;
        $this->direccion = isset($data->direccion) ? trim($data->direccion) : null;
        $this->email_contacto = isset($data->email_contacto) ? trim($data->email_contacto) : null;
    }

    public function validate() {
        if (!$this->nombre_empresa || !$this->pais_origen || !$this->direccion || !$this->email_contacto) {
            return "Required fields: nombre_empresa, pais_origen, direccion, email_contacto.";
        }
        return null;
    }
}
?>
