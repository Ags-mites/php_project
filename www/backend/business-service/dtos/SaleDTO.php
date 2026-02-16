<?php
class SaleDTO {
    public $cliente_id;
    public $empleado_id;
    public $total;
    public $estado;
    public $metodo_pago;
    public $detalles;

    public function __construct($data) {
        $this->cliente_id = isset($data->cliente_id) ? $data->cliente_id : null;
        $this->empleado_id = isset($data->empleado_id) ? $data->empleado_id : null;
        $this->total = isset($data->total) ? $data->total : null;
        $this->estado = isset($data->estado) ? strtoupper(trim($data->estado)) : null;
        $this->metodo_pago = isset($data->metodo_pago) ? strtoupper(trim($data->metodo_pago)) : null;
        $this->detalles = isset($data->detalles) ? $data->detalles : [];
    }

    public function validate() {
        if (!$this->cliente_id) {
            return "cliente_id is required.";
        }
        if (!$this->empleado_id) {
            return "empleado_id is required.";
        }
        if (!$this->total) {
            return "total is required.";
        }
        if (!$this->estado) {
            return "estado is required.";
        }
        if (!$this->metodo_pago) {
            return "metodo_pago is required.";
        }
        if (empty($this->detalles)) {
            return "detalles is required (at least one item).";
        }

        foreach ($this->detalles as $index => $detalle) {
            if (!isset($detalle->producto_id)) {
                return "detalles[$index].producto_id is required.";
            }
            if (!isset($detalle->cantidad)) {
                return "detalles[$index].cantidad is required.";
            }
            if (!isset($detalle->precio)) {
                return "detalles[$index].precio is required.";
            }
        }

        return null;
    }
}
?>
