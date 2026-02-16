<?php
class EmployeeDTO {
    public $nombre;
    public $apellido;
    public $cargo;
    public $telefono;
    public $direccion;
    public $fecha_ingreso;

    public function __construct($data) {
        $this->nombre = isset($data->nombre) ? trim($data->nombre) : null;
        $this->apellido = isset($data->apellido) ? trim($data->apellido) : null;
        $this->cargo = isset($data->cargo) ? trim($data->cargo) : null;
        $this->telefono = isset($data->telefono) ? trim($data->telefono) : null;
        $this->direccion = isset($data->direccion) ? trim($data->direccion) : null;
        $this->fecha_ingreso = isset($data->fecha_ingreso) ? trim($data->fecha_ingreso) : null;
    }

    public function validate() {
        if (
            !$this->nombre || 
            !$this->apellido ||
            !$this->cargo ||
            !$this->telefono ||
            !$this->direccion ||
            !$this->fecha_ingreso) {
            return "Required fields: nombre, apellido, cargo, telefono, direccion, fecha_ingreso.";
        }
        return null;
    }
}
?>
