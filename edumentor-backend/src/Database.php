<?php

declare(strict_types=1);

namespace PraktikaX;

use PDO;

class Database
{
    private PDO $pdo;

    public function __construct(Config $config)
    {
        $explicitHost = $config->get('DB_HOST');
        $host = $explicitHost ?? '127.0.0.1';
        $db = $config->get('DB_NAME', 'praktikax');
        $user = $config->get('DB_USER', 'root');
        $pass = $config->get('DB_PASSWORD', '');
        $charset = $config->get('DB_CHARSET', 'utf8mb4');
        $driver = strtolower((string)$config->get('DB_DRIVER', 'mysql'));
        $port = (string)$config->get('DB_PORT', '');
        $sslmode = (string)$config->get('DB_SSLMODE', '');

        $databaseUrl = $config->get('DATABASE_URL') ?? $config->get('DATABASE_PUBLIC_URL');
        $urlToParse = null;
        if ($explicitHost && str_contains($explicitHost, '://')) {
            $urlToParse = $explicitHost;
        } elseif ($databaseUrl) {
            $urlToParse = $databaseUrl;
        }

        if ($urlToParse) {
            $parts = parse_url($urlToParse);
            if ($parts !== false && isset($parts['host'])) {
                $scheme = strtolower((string)($parts['scheme'] ?? ''));
                if ($scheme === 'postgres' || $scheme === 'postgresql') {
                    $driver = 'pgsql';
                } elseif ($scheme !== '') {
                    $driver = $scheme;
                }
                $host = $parts['host'];
                if (isset($parts['port'])) {
                    $port = (string)$parts['port'];
                }
                if (isset($parts['user'])) {
                    $user = $parts['user'];
                }
                if (isset($parts['pass'])) {
                    $pass = $parts['pass'];
                }
                if (isset($parts['path'])) {
                    $db = ltrim($parts['path'], '/');
                }
                if ($sslmode === '' && isset($parts['query'])) {
                    parse_str($parts['query'], $query);
                    if (isset($query['sslmode'])) {
                        $sslmode = (string)$query['sslmode'];
                    }
                }
            }
        }

        if ($driver === 'pgsql' || $driver === 'postgres') {
            $dsn = "pgsql:host={$host};dbname={$db}";
            if ($port !== '') {
                $dsn .= ";port={$port}";
            }
            if ($sslmode !== '') {
                $dsn .= ";sslmode={$sslmode}";
            }
        } else {
            $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
            if ($port !== '') {
                $dsn .= ";port={$port}";
            }
        }
        $this->pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    }

    public function pdo(): PDO
    {
        return $this->pdo;
    }
}
