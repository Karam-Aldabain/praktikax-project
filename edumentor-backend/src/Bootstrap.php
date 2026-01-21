<?php

declare(strict_types=1);

spl_autoload_register(function (string $class) {
    $prefix = 'PraktikaX\\';
    $baseDir = __DIR__ . '/';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relative) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

date_default_timezone_set('UTC');
