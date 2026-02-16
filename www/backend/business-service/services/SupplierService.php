<?php
include_once __DIR__ . '/../repositories/SupplierRepository.php';

class SupplierService {
    private $supplierRepository;

    public function __construct($db) {
        $this->supplierRepository = new SupplierRepository($db);
    }

    public function getAllSuppliers() {
        $stmt = $this->supplierRepository->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $suppliers_arr = array();
            $suppliers_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $supplier_item = array(
                    "id" => $row['PROVEEDOR_ID'],
                    "nombre_empresa" => $row['NOMBRE_EMPRESA'],
                    "telefono" => $row['TELEFONO'],
                    "email" => $row['EMAIL'],
                    "direccion" => $row['DIRECCION'],
                    "ciudad" => $row['CIUDAD'],
                );
                array_push($suppliers_arr["data"], $supplier_item);
            }

            return [
                "status" => 200,
                "body" => $suppliers_arr
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No suppliers found."]
            ];
        }
    }

    public function getSupplierById($id){
        $stmt = $this->supplierRepository->findById($id);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $supplier_item = array(
                    "id" => $row['PROVEEDOR_ID'],
                    "nombre_empresa" => $row['NOMBRE_EMPRESA'],
                    "telefono" => $row['TELEFONO'],
                    "email" => $row['EMAIL'],
                    "direccion" => $row['DIRECCION'],
                    "ciudad" => $row['CIUDAD'],
                );

            return [
                "status" => 200,
                "body" => $supplier_item,
            ];
        } else {
            return [
                "status" => 404,
                "body" => ["message" => "No supplier with id $id found."]
            ];
        }
    } 

    public function createSupplier($supplierDTO) {
        if($this->supplierRepository->create($supplierDTO)){
            return [
                "status" => 201, 
                "body" => ["message" => "Supplier created."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to create supplier."]
            ];
        }
    }

    public function updateSupplier($id, $supplierDTO) {
        if($this->supplierRepository->update($id, $supplierDTO)){
            return [
                "status" => 200, 
                "body" => ["message" => "Supplier updated."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to update supplier."]
            ];
        }
    }

    public function deleteSupplier($id) {
        if($this->supplierRepository->delete($id)){
            return [
                "status" => 200, 
                "body" => ["message" => "Supplier deleted."]
            ];
        } else {
            return [
                "status" => 503, 
                "body" => ["message" => "Unable to delete supplier."]
            ];
        }
    }
}
?>
