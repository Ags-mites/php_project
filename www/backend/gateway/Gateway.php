<?php

require_once 'AuthMiddleware.php';

class Gateway {
    private $config;

    public function __construct($config) {
        $this->config = $config;
    }

    public function handle($requestMethod, $requestUri, $requestBody, $requestHeaders) {

        list($service, $path) = $this->resolveRoute($requestUri);
        
        if ($service && isset($this->config['services'][$service])) {
            $routeConfig = $this->config['routes'][$service] ?? null;
            
            if ($routeConfig && isset($routeConfig['auth']) && $routeConfig['auth'] === true) {
                if ($requestMethod !== 'OPTIONS') {
                     AuthMiddleware::handle(
                         $requestHeaders, 
                         $this->config['services']['auth'], 
                         $routeConfig['roles'] ?? []
                     );
                }
            }

            $targetUrl = $this->config['services'][$service] . '/' . $path;
            
            echo $this->forwardRequest($targetUrl, $requestMethod, $requestBody, $requestHeaders);

        } else {
            http_response_code(404);
            echo json_encode(["message" => "Service not found or Gateway path invalid"]);
        }
    }

    private function resolveRoute($requestUri) {
        $parts = explode('/', trim($requestUri, '/'));
        
        $gatewayIndex = array_search('gateway', $parts);

        if ($gatewayIndex !== false && isset($parts[$gatewayIndex + 1])) {
            $serviceName = $parts[$gatewayIndex + 1];
            
            if (isset($this->config['services'][$serviceName])) {
                $targetPathParts = array_slice($parts, $gatewayIndex + 2);
                $targetPath = implode('/', $targetPathParts);
                return [$serviceName, $targetPath];
            }
        }
        return [null, null];
    }

    private function forwardRequest($url, $method, $data, $headers) {
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        
        $forwardHeaders = [];
        foreach ($headers as $key => $value) {
            if (strcasecmp($key, 'host') !== 0 && strcasecmp($key, 'content-length') !== 0) {
                 $forwardHeaders[] = "$key: $value";
            }
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        http_response_code($httpCode);
        return $response;
    }
}
?>
