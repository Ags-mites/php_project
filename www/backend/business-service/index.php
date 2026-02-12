<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'controllers/StudentController.php';

$uriParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

if (in_array('students', $uriParts)) {
    $controller = new StudentController();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $controller->create($data);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "Business Endpoint not found"]);
}
?>
