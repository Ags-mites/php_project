<?php
class SupplierDTO {
    public $nombre_empresa;
    public $telefono;
    public $email;
    public $direccion;
    public $ciudad;

    public function __construct($data) {
        $this->nombre_empresa = isset($data->nombre_empresa) ? trim($data->nombre_empresa) : null;
        $this->telefono = isset($data->telefono) ? trim($data->telefono) : null;
        $this->email = isset($data->email) ? trim($data->email) : null;
        $this->direccion = isset($data->direccion) ? trim($data->direccion) : null;
        $this->ciudad = isset($data->ciudad) ? trim($data->ciudad) : null;
    }

    public function validate() {
        if (
            !$this->nombre_empresa || 
            !$this->telefono ||
            !$this->email ||
            !$this->direccion ||
            !$this->ciudad) {
            return "Required fields: nombre_empresa, telefono, email, direccion, ciudad.";
        }
        return null;
    }
}
?>
