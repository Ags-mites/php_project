<?php
include_once __DIR__ . '/../repositories/StudentRepository.php';

class StudentService {
    private $repo;

    public function __construct($db) {
        $this->repo = new StudentRepository($db);
    }

    public function getAllStudents() {
        $stmt = $this->repo->findAll();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $students_arr = array();
            $students_arr["data"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row);
                $student_item = array(
                    "id" => $id,
                    "first_name" => $first_name,
                    "last_name" => $last_name,
                    "email" => $email,
                    "created_at" => $created_at
                );
                array_push($students_arr["data"], $student_item);
            }
            return ["status" => 200, "body" => $students_arr];
        } else {
            return ["status" => 404, "body" => ["message" => "No students found."]];
        }
    }

    public function createStudent($studentDTO) {
        if($this->repo->create($studentDTO->first_name, $studentDTO->last_name, $studentDTO->email)){
            return ["status" => 201, "body" => ["message" => "Student created."]];
        } else {
            return ["status" => 503, "body" => ["message" => "Unable to create student."]];
        }
    }
}
?>
