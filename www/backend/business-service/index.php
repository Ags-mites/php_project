<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'controllers/CategoriaController.php';
include_once 'controllers/EstadoImportacionController.php';
include_once 'controllers/ProveedorInternacionalController.php';
include_once 'controllers/ProductoController.php';
include_once 'controllers/ImportacionController.php';
include_once 'controllers/DetalleImportacionController.php';
include_once 'controllers/DocumentoAduaneroController.php';
include_once 'controllers/PagoController.php';
include_once 'controllers/TransporteController.php';

$uri = trim($_SERVER['REQUEST_URI'], '/');
$parts = explode('/', $uri);
$lastPart = end($parts);
$resource = is_numeric($lastPart) ? $parts[count($parts) - 2] : $lastPart;

$method = $_SERVER['REQUEST_METHOD'];

if ($resource === 'categorias') {
    $controller = new CategoriaController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'estados') {
    $controller = new EstadoImportacionController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'proveedores') {
    $controller = new ProveedorInternacionalController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'productos') {
    $controller = new ProductoController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'importaciones') {
    $controller = new ImportacionController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'detalles') {
    $controller = new DetalleImportacionController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'documentos') {
    $controller = new DocumentoAduaneroController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'pagos') {
    $controller = new PagoController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif ($resource === 'transportes') {
    $controller = new TransporteController();
    $id = isset($parts[count($parts) - 1]) && is_numeric($parts[count($parts) - 1]) ? $parts[count($parts) - 1] : null;
    
    if ($method === 'GET' && $id) {
        $controller->getById($id);
    } elseif ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $controller->create(json_decode(file_get_contents("php://input")));
    } elseif ($method === 'PUT' && $id) {
        $controller->update($id, json_decode(file_get_contents("php://input")));
    } elseif ($method === 'DELETE' && $id) {
        $controller->delete($id);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found: $resource"]);
}
?>
