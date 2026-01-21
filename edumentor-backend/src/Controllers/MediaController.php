<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Auth;
use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Request;
use PraktikaX\Response;
use PDO;

class MediaController
{
    private Auth $auth;

    public function __construct(private Database $db, private Config $config)
    {
        $this->auth = new Auth($db);
    }

    public function index(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->query('SELECT id, file_name, file_path, file_type, created_at FROM media ORDER BY id DESC');
        Response::json(['media' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function upload(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        if (empty($_FILES['file'])) {
            Response::json(['error' => 'No file provided'], 422);
            return;
        }

        $file = $_FILES['file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::json(['error' => 'Upload failed'], 422);
            return;
        }

        $allowed = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
        $name = $file['name'] ?? '';
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed, true)) {
            Response::json(['error' => 'Invalid media type'], 422);
            return;
        }

        $mediaDir = $this->config->getRootPath() . '/public/storage/media';
        if (!is_dir($mediaDir)) {
            mkdir($mediaDir, 0755, true);
        }

        $safeName = bin2hex(random_bytes(8)) . '.' . $ext;
        $target = $mediaDir . '/' . $safeName;
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            Response::json(['error' => 'Unable to store file'], 500);
            return;
        }

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO media (file_name, file_path, file_type) VALUES (:file_name, :file_path, :file_type)'
        );
        $stmt->execute([
            'file_name' => $name,
            'file_path' => '/storage/media/' . $safeName,
            'file_type' => $ext,
        ]);

        Response::json(['status' => 'uploaded'], 201);
    }

    public function delete(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->prepare('DELETE FROM media WHERE id = :id');
        $stmt->execute(['id' => $id]);
        Response::json(['status' => 'deleted']);
    }
}
