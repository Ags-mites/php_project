<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'controllers/AuthController.php';

$auth = new AuthController();

$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

if (in_array('login', $uri)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $auth->login($data);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif (in_array('validate-token', $uri)) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' || $_SERVER['REQUEST_METHOD'] === 'POST') {
        $auth->validateToken();
    }
} elseif (in_array('register', $uri)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $auth->register($data);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} elseif (in_array('logout', $uri)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $auth->logout($data);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found", "uri" => $_SERVER['REQUEST_URI']]);
}
?>
