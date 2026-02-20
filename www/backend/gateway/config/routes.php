<?php
return [
    'services' => [
        'auth' => 'http://php-web/backend/auth-service',
        'business' => 'http://php-web/backend/business-service'
    ],
    'routes' => [
        'business' => [
            'auth' => false,
            'roles' => ['Administrador', 'Operador']
        ]
    ]
];
?>
