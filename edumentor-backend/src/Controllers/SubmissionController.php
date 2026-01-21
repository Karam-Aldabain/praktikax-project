<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Response;
use PDO;

class SubmissionController
{
    public function __construct(private Database $db, private Config $config)
    {
    }

    public function store(string $slug): void
    {
        $page = $this->resolvePage($slug);
        if (!$page) {
            Response::json(['error' => 'Page not found'], 404);
            return;
        }

        $payload = $this->payload();
        $captcha = trim($payload['captcha_token'] ?? '');
        if ($captcha === '') {
            Response::json(['error' => 'Captcha required'], 422);
            return;
        }
        if (!$this->verifyCaptcha($captcha)) {
            Response::json(['error' => 'Captcha verification failed'], 422);
            return;
        }
        if (!$this->verifyCsrf()) {
            Response::json(['error' => 'CSRF verification failed'], 419);
            return;
        }

        $requiredErrors = $this->validateRequired($page, $payload);
        if (!empty($requiredErrors)) {
            Response::json(['error' => $requiredErrors], 422);
            return;
        }

        $filePath = null;
        if (!empty($_FILES)) {
            $file = reset($_FILES);
            $filePath = $this->handleUpload($file);
            if ($filePath === null) {
                return;
            }
        }

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO submissions (page_id, form_data_json, file_path, ip_address)
             VALUES (:page_id, :form_data_json, :file_path, :ip_address)'
        );
        $stmt->execute([
            'page_id' => $page['id'],
            'form_data_json' => json_encode($payload, JSON_UNESCAPED_SLASHES),
            'file_path' => $filePath,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]);

        Response::json(['status' => 'received'], 201);
    }

    private function payload(): array
    {
        if (!empty($_POST)) {
            return $_POST;
        }
        $raw = file_get_contents('php://input');
        if (!$raw) {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function resolvePage(string $slug): ?array
    {
        $stmt = $this->db->pdo()->prepare('SELECT id, sections_json FROM pages WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        return [
            'id' => (int)$row['id'],
            'sections_json' => $row['sections_json'] ?? '[]',
        ];
    }

    private function validateRequired(array $page, array $payload): array
    {
        $errors = [];
        $sections = $this->decodeSections($page['sections_json']);
        foreach ($sections as $section) {
            if (($section['type'] ?? '') !== 'form_questions') {
                continue;
            }
            $fields = $section['fields'] ?? [];
            foreach ($fields as $field) {
                if (!($field['required'] ?? false)) {
                    continue;
                }
                $name = $field['name'] ?? '';
                if ($name === '') {
                    continue;
                }
                if (($field['type'] ?? '') === 'file') {
                    if (empty($_FILES)) {
                        $errors[] = "{$name} is required.";
                    }
                    continue;
                }
                $value = $payload[$name] ?? '';
                if ($value === '' || $value === null) {
                    $errors[] = "{$name} is required.";
                }
            }
        }
        return $errors;
    }

    private function decodeSections(?string $raw): array
    {
        if (!$raw) {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function handleUpload(array $file): ?string
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::json(['error' => 'File upload failed'], 422);
            return null;
        }

        $allowed = ['pdf', 'doc', 'docx'];
        $name = $file['name'] ?? '';
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed, true)) {
            Response::json(['error' => 'Invalid file type'], 422);
            return null;
        }

        $uploadDir = $this->config->getRootPath() . '/public/storage/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $safeName = bin2hex(random_bytes(8)) . '.' . $ext;
        $target = $uploadDir . '/' . $safeName;
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            Response::json(['error' => 'Unable to save upload'], 500);
            return null;
        }

        return '/storage/uploads/' . $safeName;
    }

    private function verifyCaptcha(string $token): bool
    {
        $secret = $this->config->get('RECAPTCHA_SECRET');
        if (!$secret) {
            return false;
        }

        $payload = http_build_query([
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]);

        $response = null;
        if (function_exists('curl_init')) {
            $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            $response = curl_exec($ch);
            curl_close($ch);
        } else {
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                    'content' => $payload,
                    'timeout' => 5,
                ],
            ]);
            $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
        }

        if (!$response) {
            return false;
        }

        $data = json_decode($response, true);
        return (bool)($data['success'] ?? false);
    }

    private function verifyCsrf(): bool
    {
        $headerToken = \PraktikaX\Request::header('X-CSRF-Token');
        $cookieToken = \PraktikaX\Request::cookie('csrf_token');
        if (!$headerToken || !$cookieToken) {
            return false;
        }
        return hash_equals($cookieToken, $headerToken);
    }
}
