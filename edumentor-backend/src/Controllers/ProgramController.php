<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Auth;
use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Request;
use PraktikaX\Response;
use PDO;

class ProgramController
{
    private Auth $auth;

    public function __construct(private Database $db, private Config $config)
    {
        $this->auth = new Auth($db);
    }

    public function index(): void
    {
        $stmt = $this->db->pdo()->query(
            'SELECT id, title, description, category, stipend, partner, start_date, published
             FROM programs WHERE published = 1 ORDER BY start_date DESC, id DESC'
        );
        Response::json(['programs' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function show(string $id): void
    {
        $stmt = $this->db->pdo()->prepare(
            'SELECT id, title, description, category, stipend, partner, start_date, published
             FROM programs WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            Response::json(['error' => 'Not found'], 404);
            return;
        }
        Response::json(['program' => $row]);
    }

    public function adminIndex(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->query(
            'SELECT id, title, description, category, stipend, partner, start_date, published
             FROM programs ORDER BY id DESC'
        );
        Response::json(['programs' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function create(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $title = trim($data['title'] ?? '');
        $category = trim($data['category'] ?? '');
        if ($title === '' || $category === '') {
            Response::json(['error' => 'Title and category required'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO programs (title, description, category, stipend, partner, start_date, published)
             VALUES (:title, :description, :category, :stipend, :partner, :start_date, :published)'
        );
        $stmt->execute([
            'title' => $title,
            'description' => $data['description'] ?? '',
            'category' => $category,
            'stipend' => (float)($data['stipend'] ?? 0),
            'partner' => $data['partner'] ?? '',
            'start_date' => $data['start_date'] ?? null,
            'published' => (int)($data['published'] ?? 1),
        ]);

        Response::json(['status' => 'created'], 201);
    }

    public function update(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $stmt = $this->db->pdo()->prepare(
            'UPDATE programs SET
                title = :title,
                description = :description,
                category = :category,
                stipend = :stipend,
                partner = :partner,
                start_date = :start_date,
                published = :published
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'title' => $data['title'] ?? '',
            'description' => $data['description'] ?? '',
            'category' => $data['category'] ?? '',
            'stipend' => (float)($data['stipend'] ?? 0),
            'partner' => $data['partner'] ?? '',
            'start_date' => $data['start_date'] ?? null,
            'published' => (int)($data['published'] ?? 1),
        ]);

        Response::json(['status' => 'updated']);
    }

    public function delete(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->prepare('DELETE FROM programs WHERE id = :id');
        $stmt->execute(['id' => $id]);
        Response::json(['status' => 'deleted']);
    }
}
