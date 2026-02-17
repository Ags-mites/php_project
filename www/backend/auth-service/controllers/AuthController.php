<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../services/AuthService.php';
include_once __DIR__ . '/../dtos/RegisterDTO.php';
include_once __DIR__ . '/../data/seed.php';

class AuthController {
    private $authService;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->authService = new AuthService($this->db);
    }

    public function login($data) {
        $username = isset($data->username) ? $data->username : '';
        $password = isset($data->password) ? $data->password : '';

        if (!$username || !$password) {
             http_response_code(400); 
             echo json_encode(["message" => "Username and password required"]);
             return;
        }

        $result = $this->authService->login($username, $password);

        http_response_code($result['status']);
        echo json_encode($result['body']);
    }

    public function register($data) {
        $registerDTO = new RegisterDTO($data);
        $validationError = $registerDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $result = $this->authService->register($registerDTO);

        http_response_code($result['status']);
        echo json_encode($result['body']);
    }

    public function logout($data) {
        $result = $this->authService->logout(null);

        http_response_code($result['status']);
        echo json_encode($result['body']);
    }

    public function validateToken() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        $result = $this->authService->validateToken($authHeader);

        http_response_code($result['status']);
        echo json_encode($result['body']);
    }

    public function seed() {
        $usersData = include __DIR__ . '/../data/seed.php';
        
        $created = 0;
        $failed = 0;
        $errors = [];

        foreach ($usersData as $user) {
            $registerDTO = new RegisterDTO((object)$user); 
            $validationError = $registerDTO->validate();
            if ($validationError) {
                $failed++;
                $errors[] = "{$user['username']}: {$validationError}";
                continue;
            }
            $result = $this->authService->register($registerDTO);
            if ($result['status'] === 201) {
                $created++;
            } else {
                $failed++;
                $errors[] = "{$user['username']}: {$result['body']['message']}";
            }
        }

        $response = [
            "message" => "Seed completed",
            "created" => $created,
            "failed" => $failed
        ];

        if (!empty($errors)) {
            $response["errors"] = $errors;
        }

        http_response_code(200);
        echo json_encode($response);
    }
}
?>
