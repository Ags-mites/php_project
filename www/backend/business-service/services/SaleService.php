<?php
include_once __DIR__ . '/../repositories/SaleRepository.php';

class SaleService {
    private $saleRepository;

    public function __construct($db) {
        $this->saleRepository = new SaleRepository($db);
    }

    public function getAllSales() {
        $stmt = $this->saleRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $sales_arr = array();
            $sales_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $saleId = $row['VENTA_ID'];
                
                $detailStmt = $this->saleRepository->findDetailsBySaleId($saleId);
                $details = array();
                
                while ($detailRow = $detailStmt->fetch(PDO::FETCH_ASSOC)) {
                    $details[] = array(
                        "id" => $detailRow['DETALLE_ID'],
                        "cantidad" => $detailRow['CANTIDAD'],
                        "precio" => $detailRow['PRECIO'],
                        "producto" => array(
                            "id" => $detailRow['PRODUCTO_ID'],
                            "codigo" => $detailRow['codigo_producto'],
                            "descripcion" => $detailRow['nombre_producto']
                        )
                    );
                }

                $sale_item = array(
                    "id" => $row['VENTA_ID'],
                    "fecha" => $row['FECHA'],
                    "total" => (float) $row['TOTAL'],
                    "estado" => $row['ESTADO'],
                    "metodo_pago" => $row['METODO_PAGO'],
                    "cliente" => array(
                        "id" => $row['CLIENTE_ID'],
                        "nombre" => $row['nombre_cliente'],
                        "apellido" => $row['apellido_cliente']
                    ),
                    "empleado" => array(
                        "id" => $row['EMPLEADO_ID'],
                        "nombre" => $row['nombre_empleado'],
                        "apellido" => $row['apellido_empleado']
                    ),
                    "detalles" => $details
                );
                array_push($sales_arr["data"], $sale_item);
            }

            return [
                "status" => 200,
                "body" => $sales_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No Sales found."]
            ];
        }
    }

    public function getSaleById($id) {
        $stmt = $this->saleRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $detailStmt = $this->saleRepository->findDetailsBySaleId($id);
            $details = array();
            
            while ($detailRow = $detailStmt->fetch(PDO::FETCH_ASSOC)) {
                $details[] = array(
                    "id" => $detailRow['DETALLE_ID'],
                    "cantidad" => $detailRow['CANTIDAD'],
                    "precio" => $detailRow['PRECIO'],
                    "producto" => array(
                        "id" => $detailRow['PRODUCTO_ID'],
                        "codigo" => $detailRow['codigo_producto'],
                        "descripcion" => $detailRow['nombre_producto']
                    )
                );
            }

            $sale_item = array(
                "id" => $row['VENTA_ID'],
                "fecha" => $row['FECHA'],
                "total" => (float) $row['TOTAL'],
                "estado" => $row['ESTADO'],
                "metodo_pago" => $row['METODO_PAGO'],
                "cliente" => array(
                    "id" => $row['CLIENTE_ID'],
                    "nombre" => $row['nombre_cliente'],
                    "apellido" => $row['apellido_cliente']
                ),
                "empleado" => array(
                    "id" => $row['EMPLEADO_ID'],
                    "nombre" => $row['nombre_empleado'],
                    "apellido" => $row['apellido_empleado']
                ),
                "detalles" => $details
            );

            return [
                "status" => 200,
                "body" => $sale_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No Sale with id $id found."]
            ];
        }
    } 

    public function getSalesByClientId($clientId) {
        $stmt = $this->saleRepository->findSalesByClientId($clientId);
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $sales_arr = array();
            $sales_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $saleId = $row['VENTA_ID'];
                $saleData = $this->saleRepository->findById($saleId)->fetch(PDO::FETCH_ASSOC);
                $detailStmt = $this->saleRepository->findDetailsBySaleId($saleId);
                $details = array();
                
                while ($detailRow = $detailStmt->fetch(PDO::FETCH_ASSOC)) {
                    $details[] = array(
                        "id" => $detailRow['DETALLE_ID'],
                        "cantidad" => $detailRow['CANTIDAD'],
                        "precio" => $detailRow['PRECIO'],
                        "producto" => array(
                            "id" => $detailRow['PRODUCTO_ID'],
                            "codigo" => $detailRow['codigo_producto'],
                            "descripcion" => $detailRow['nombre_producto']
                        )
                    );
                }

                $sale_item = array(
                    "id" => $saleId,
                    "fecha" => $saleData['FECHA'],
                    "total" => (float) $saleData['TOTAL'],
                    "estado" => $saleData['ESTADO'],
                    "metodo_pago" => $saleData['METODO_PAGO'],
                    "cliente" => array(
                        "id" => $saleData['CLIENTE_ID'],
                        "nombre" => $saleData['nombre_cliente'],
                        "apellido" => $saleData['apellido_cliente']
                    ),
                    "empleado" => array(
                        "id" => $saleData['EMPLEADO_ID'],
                        "nombre" => $saleData['nombre_empleado'],
                        "apellido" => $saleData['apellido_empleado']
                    ),
                    "detalles" => $details
                );
                array_push($sales_arr["data"], $sale_item);
            }

            return [
                "status" => 200,
                "body" => $sales_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No Sales found for client $clientId."]
            ];
        }
    }

    public function createSale($saleDTO) {
        $result = $this->saleRepository->create($saleDTO);
        
        if($result) {
            return [
                "status" => 201, 
                "body" => ["message" => "Sale created.", "id" => $result]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create Sale."]
            ];
        }
    }

    public function updateSale($id, $saleDTO) {
        if($this->saleRepository->update($id, $saleDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Sale updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update Sale."]
            ];
        }
    }

    public function deleteSale($id) {
        if($this->saleRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Sale deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete Sale."]
            ];
        }
    }
}
?>
