<?php
class UserRepository {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByUsername($username) {
        $query = "SELECT u.id, u.username, u.password, r.name as role 
                  FROM " . $this->table_name . " u 
                  JOIN roles r ON u.role_id = r.id 
                  WHERE u.username = :username LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function create($username, $password, $name, $role_id = 2) {
        $query = "INSERT INTO " . $this->table_name . " (username, password, name, role_id) VALUES (:username, :password, :name, :role_id)";
        
        $stmt = $this->conn->prepare($query);

        $username = htmlspecialchars(strip_tags($username));
        $password = htmlspecialchars(strip_tags($password));
        $name = htmlspecialchars(strip_tags($name));
        
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':role_id', $role_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
