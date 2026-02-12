<?php
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../services/StudentService.php';
include_once __DIR__ . '/../dtos/StudentDTO.php';
include_once __DIR__ . '/../utils/TokenHelper.php';

class StudentController {
    private $service;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->service = new StudentService($this->db);
    }

    public function getAll() {
        if (!TokenHelper::validateTokenPresence()) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized: Token missing."]);
            return;
        }

        $response = $this->service->getAllStudents();
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }

    public function create($data) {
        if (!TokenHelper::validateTokenPresence()) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized: Token missing."]);
            return;
        }

        $studentDTO = new StudentDTO($data);
        $validationError = $studentDTO->validate();

        if ($validationError) {
             http_response_code(400); 
             echo json_encode(["message" => $validationError]);
             return;
        }

        $response = $this->service->createStudent($studentDTO);
        http_response_code($response['status']);
        echo json_encode($response['body']);
    }
}
?>
