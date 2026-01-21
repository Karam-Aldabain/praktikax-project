<?php

declare(strict_types=1);

namespace PraktikaX;

class Config
{
    private array $values = [];

    public function __construct(private string $rootPath)
    {
        $this->loadEnv();
    }

    private function loadEnv(): void
    {
        $path = $this->rootPath . '/.env';
        if (!file_exists($path)) {
            return;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }
            [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
            $this->values[trim($key)] = trim($value, " \t\n\r\0\x0B\"");
        }
    }

    public function get(string $key, ?string $default = null): ?string
    {
        return $this->values[$key] ?? $default;
    }

    public function getRootPath(): string
    {
        return $this->rootPath;
    }
}
