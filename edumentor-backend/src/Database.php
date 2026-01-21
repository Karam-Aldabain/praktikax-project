<?php

declare(strict_types=1);

namespace PraktikaX;

use PDO;

class Database
{
    private PDO $pdo;

    public function __construct(Config $config)
    {
        $host = $config->get('DB_HOST', '127.0.0.1');
        $db = $config->get('DB_NAME', 'praktikax');
        $user = $config->get('DB_USER', 'root');
        $pass = $config->get('DB_PASSWORD', '');
        $charset = $config->get('DB_CHARSET', 'utf8mb4');

        $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
        $this->pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    }

    public function pdo(): PDO
    {
        return $this->pdo;
    }
}
