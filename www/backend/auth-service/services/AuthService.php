<?php
include_once __DIR__ . '/../repositories/UserRepository.php';
include_once __DIR__ . '/../utils/JWT.php';

class AuthService {
    private $userRepository;

    public function __construct($db) {
        $this->userRepository = new UserRepository($db);
    }

    public function login($username, $password) {
        $user = $this->userRepository->findByUsername($username);

        if ($user) {
            if (password_verify($password, $user['password'])) {
                $payload = [
                    "iss" => "localhost",
                    "iat" => time(),
                    "exp" => time() + (60 * 60),
                    "data" => [
                        "id" => $user['id'],
                        "username" => $user['username'],
                        "role" => $user['role']
                    ]
                ];
                
                $jwt = JWT::encode($payload);
                
                return [
                    "status" => 200,
                    "body" => [
                        "message" => "Login successful.",
                        "token" => $jwt,
                        "role" => $user['role'],
                        "username" => $user['username']
                    ]
                ];
            } else {
                return [
                    "status" => 401,
                    "body" => ["message" => "Invalid password."]
                ];
            }
        } else {
            return [
                "status" => 401,
                "body" => ["message" => "User not found."]
            ];
        }
    }

    public function register($registerDTO) {
        $user = $this->userRepository->findByUsername($registerDTO->username);

        if ($user) {
            return [
                "status" => 409,
                "body" => ["message" => "User already exists."]
            ];
        }

        $this->userRepository->create(
            $registerDTO->username, 
            $registerDTO->password,
            $registerDTO->name,
            $registerDTO->role_id
        );

        return [
            "status" => 201,
            "body" => ["message" => "User created successfully."]
        ];
    } 

    public function logout($token) {
        return [
            "status" => 200,
            "body" => ["message" => "Logout successful."]
        ];
    }

    public function validateToken($authHeader) {
        if (!$authHeader) {
            return [
                "status" => 401,
                "body" => ["message" => "No token provided."]
            ];
        }

        $arr = explode(" ", $authHeader);
        $jwt = isset($arr[1]) ? $arr[1] : '';

        if($jwt) {
            $decoded = JWT::decode($jwt);
            if ($decoded) {
                return [
                    "status" => 200,
                    "body" => [
                        "message" => "Access granted.",
                        "data" => $decoded['data']
                    ]
                ];
            } else {
                return [
                    "status" => 401,
                    "body" => ["message" => "Access denied. Invalid token."]
                ];
            }
        } else {
            return [
                "status" => 401,
                "body" => ["message" => "Access denied."]
            ];
        }
    }
}
?>
