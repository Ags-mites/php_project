<?php

class AuthMiddleware {
    public static function handle($requestHeaders, $authServiceUrl, $requiredRoles = []) {
        
        if (!isset($requestHeaders['Authorization'])) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized: No token provided"]);
            exit;
        }

        $validateUrl = $authServiceUrl . '/validate-token';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $validateUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: " . $requestHeaders['Authorization']
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $validationData = json_decode($response, true);

        if ($httpCode !== 200 || !isset($validationData['data'])) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized: Invalid token"]);
            exit;
        }

        if (!empty($requiredRoles)) {
            $role = $validationData['data']['role'];
            if (!in_array($role, $requiredRoles)) {
                http_response_code(403);
                echo json_encode(["message" => "Forbidden: Insufficient permissions"]);
                exit;
            }
        }
    }
}
?>
