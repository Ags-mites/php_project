<?php
class StudentDTO {
    public $first_name;
    public $last_name;
    public $email;

    public function __construct($data) {
        $this->first_name = isset($data->first_name) ? trim($data->first_name) : null;
        $this->last_name = isset($data->last_name) ? trim($data->last_name) : null;
        $this->email = isset($data->email) ? trim($data->email) : null;
    }

    public function validate() {
        if (!$this->first_name || !$this->last_name || !$this->email) {
            return "Required fields: first_name, last_name, email.";
        }
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            return "Invalid email format.";
        }
        return null;
    }
}
?>
