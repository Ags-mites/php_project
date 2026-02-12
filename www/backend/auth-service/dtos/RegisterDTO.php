<?php
class RegisterDTO {
    public $username;
    public $password;
    public $name;
    public $role_id;

    public function __construct($data) {
        $this->username = isset($data->username) ? trim($data->username) : null;
        $this->password = isset($data->password) ? trim($data->password) : null;
        $this->name = isset($data->name) ? trim($data->name) : null;
        $this->role_id = isset($data->role) ? intval($data->role) : 2; 
    }

    public function validate() {
        if (!$this->username || !$this->password || !$this->name) {
            return "All fields are required: username, password, name.";
        }
        return null;
    }
}
?>
