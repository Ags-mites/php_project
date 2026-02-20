<?php
class PagoDTO {
    public $id_importacion;
    public $monto;
    public $metodo_pago;
    public $moneda;
    public $fecha_pago;

    public function __construct($data) {
        $this->id_importacion = isset($data->id_importacion) ? trim($data->id_importacion) : null;
        $this->monto = isset($data->monto) ? trim($data->monto) : null;
        $this->metodo_pago = isset($data->metodo_pago) ? trim($data->metodo_pago) : null;
        $this->moneda = isset($data->moneda) ? trim($data->moneda) : 'USD';
        $this->fecha_pago = isset($data->fecha_pago) ? trim($data->fecha_pago) : null;
    }

    public function validate() {
        if (!$this->id_importacion || !$this->monto) {
            return "Required fields: id_importacion, monto.";
        }
        return null;
    }
}
?>
