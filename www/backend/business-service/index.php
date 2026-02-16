<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'controllers/ProductController.php';
include_once 'controllers/ClientController.php';
include_once 'controllers/SaleController.php';

$uri = trim($_SERVER['REQUEST_URI'], '/');
$parts = explode('/', $uri);
$lastPart = end($parts);
$resource = is_numeric($lastPart) ? $parts[count($parts) - 2] : $lastPart;

$method = $_SERVER['REQUEST_METHOD'];

if ($resource === 'products') {
    $controller = new ProductController();
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
} elseif ($resource === 'clients') {
    $controller = new ClientController();
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

} elseif ($resource === 'sales') {
    $controller = new SaleController();
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
