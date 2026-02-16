<?php
class ClientDTO {
    public $nombre;
    public $apellido;
    public $email;
    public $telefono;
    public $direccion;
    

    public function __construct($data) {
        $this->nombre = isset($data->nombre) ? trim($data->nombre) : null;
        $this->apellido = isset($data->apellido) ? trim($data->apellido) : null;
        $this->email = isset($data->email) ? trim($data->email) : null;
        $this->telefono = isset($data->telefono) ? trim($data->telefono) : null;
        $this->direccion = isset($data->direccion) ? trim($data->direccion) : null;
    }

    public function validate() {
        if (
            !$this->nombre || 
            !$this->apellido || 
            !$this->email || 
            !$this->telefono || 
            !$this->direccion) {
            return "Required fields: nombre, apellido, email, telefono, direccion.";
        }
        return null;
    }
}
?>
