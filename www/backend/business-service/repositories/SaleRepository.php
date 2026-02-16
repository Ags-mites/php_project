<?php
class SaleRepository {
    private $conn;
    private $table_name = "VENTAS";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findAll() {
        $query = "SELECT 
                v.VENTA_ID, v.FECHA, v.TOTAL, v.ESTADO, v.METODO_PAGO,
                v.CLIENTE_ID,
                v.EMPLEADO_ID,
                c.NOMBRE as nombre_cliente,
                c.APELLIDO as apellido_cliente,
                e.NOMBRE as nombre_empleado,
                e.APELLIDO as apellido_empleado
          FROM " . $this->table_name . " as v
          LEFT JOIN CLIENTE c ON v.CLIENTE_ID = c.CLIENTE_ID
          LEFT JOIN EMPLEADO e ON v.EMPLEADO_ID = e.EMPLEADO_ID
          ORDER BY v.VENTA_ID ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function findById($id) {
        $query = "SELECT 
                v.VENTA_ID, v.FECHA, v.TOTAL, v.ESTADO, v.METODO_PAGO,
                v.CLIENTE_ID,
                v.EMPLEADO_ID,
                c.NOMBRE as nombre_cliente,
                c.APELLIDO as apellido_cliente,
                e.NOMBRE as nombre_empleado,
                e.APELLIDO as apellido_empleado
          FROM " . $this->table_name . " as v
          LEFT JOIN CLIENTE c ON v.CLIENTE_ID = c.CLIENTE_ID
          LEFT JOIN EMPLEADO e ON v.EMPLEADO_ID = e.EMPLEADO_ID
          WHERE v.VENTA_ID = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt;
    }

    public function findByClientId($clientId) {
        $query = "SELECT 
                v.VENTA_ID, v.FECHA, v.TOTAL, v.ESTADO, v.METODO_PAGO,
                v.CLIENTE_ID,
                v.EMPLEADO_ID,
                c.NOMBRE as nombre_cliente,
                c.APELLIDO as apellido_cliente,
                e.NOMBRE as nombre_empleado,
                e.APELLIDO as apellido_empleado
          FROM " . $this->table_name . " as v
          LEFT JOIN CLIENTE c ON v.CLIENTE_ID = c.CLIENTE_ID
          LEFT JOIN EMPLEADO e ON v.EMPLEADO_ID = e.EMPLEADO_ID
          WHERE v.CLIENTE_ID = :client_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":client_id", $clientId);
        $stmt->execute();
        return $stmt;
    }

    public function findDetailsBySaleId($saleId) {
        $query = "SELECT 
                dv.DETALLE_ID,
                dv.CANTIDAD,
                dv.PRECIO,
                p.PRODUCTO_ID,
                p.CODIGO as codigo_producto,
                p.DESCRIPCION as nombre_producto
          FROM DETALLE_VENTA dv
          LEFT JOIN PRODUCTO p ON dv.PRODUCTO_ID = p.PRODUCTO_ID
          WHERE dv.VENTA_ID = :venta_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":venta_id", $saleId);
        $stmt->execute();
        return $stmt;
    }

    public function findSalesByClientId($clientId) {
        $query = "SELECT VENTA_ID FROM " . $this->table_name . " WHERE CLIENTE_ID = :client_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":client_id", $clientId);
        $stmt->execute();
        return $stmt;
    }

    public function findSalesByEmployeeId($employeeId) {
        $query = "SELECT VENTA_ID FROM " . $this->table_name . " WHERE EMPLEADO_ID = :empleado_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":empleado_id", $employeeId);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $this->conn->beginTransaction();
        
        try {
            $queryVenta = "INSERT INTO " . $this->table_name . "
                        (CLIENTE_ID, EMPLEADO_ID, FECHA, TOTAL, ESTADO, METODO_PAGO) 
                        VALUES (:cliente_id, :empleado_id, NOW(), :total, :estado, :metodo_pago)";
            
            $stmt = $this->conn->prepare($queryVenta);
            $stmt->bindParam(":cliente_id", $data->cliente_id);
            $stmt->bindParam(":empleado_id", $data->empleado_id);
            $stmt->bindParam(":total", $data->total);
            $stmt->bindParam(":estado", $data->estado);
            $stmt->bindParam(":metodo_pago", $data->metodo_pago);
            $stmt->execute();
            
            $ventaId = $this->conn->lastInsertId();
            
            foreach ($data->detalles as $detalle) {
                $queryDetalle = "INSERT INTO DETALLE_VENTA (VENTA_ID, PRODUCTO_ID, CANTIDAD, PRECIO) 
                                VALUES (:venta_id, :producto_id, :cantidad, :precio)";
                
                $stmtDetalle = $this->conn->prepare($queryDetalle);
                $stmtDetalle->bindParam(":venta_id", $ventaId);
                $stmtDetalle->bindParam(":producto_id", $detalle->producto_id);
                $stmtDetalle->bindParam(":cantidad", $detalle->cantidad);
                $stmtDetalle->bindParam(":precio", $detalle->precio);
                $stmtDetalle->execute();
            }
            
            $this->conn->commit();
            return $ventaId;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function delete($id) {
        $this->conn->beginTransaction();
        try {
            $queryDetalle = "DELETE FROM DETALLE_VENTA WHERE VENTA_ID = :id";
            $stmtDetalle = $this->conn->prepare($queryDetalle);
            $stmtDetalle->bindParam(":id", $id);
            $stmtDetalle->execute();
            
            $query = "DELETE FROM " . $this->table_name . " WHERE VENTA_ID = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
?>
