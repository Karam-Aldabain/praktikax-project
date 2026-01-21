<?php

declare(strict_types=1);

namespace PraktikaX;

class Response
{
    public static function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_SLASHES);
    }

    public static function text(string $data, int $status = 200, string $contentType = 'text/plain'): void
    {
        http_response_code($status);
        header("Content-Type: {$contentType}");
        echo $data;
    }

    public static function csv(array $rows, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="submissions.csv"');
        $output = fopen('php://output', 'w');
        foreach ($rows as $row) {
            fputcsv($output, $row);
        }
        fclose($output);
    }
}
