<?php

declare(strict_types=1);

namespace PraktikaX\Controllers;

use PraktikaX\Auth;
use PraktikaX\Config;
use PraktikaX\Database;
use PraktikaX\Request;
use PraktikaX\Response;
use PDO;

class AdminController
{
    private Auth $auth;

    public function __construct(private Database $db, private Config $config)
    {
        $this->auth = new Auth($db);
    }

    public function stats(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager', 'form_manager']);

        $stats = [
            'users' => (int)$this->scalar('SELECT COUNT(*) FROM users'),
            'pages' => (int)$this->scalar('SELECT COUNT(*) FROM pages'),
            'submissions' => (int)$this->scalar('SELECT COUNT(*) FROM submissions'),
        ];
        Response::json(['stats' => $stats]);
    }

    public function pages(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->query(
            'SELECT id, slug, title, hero_title, hero_subtitle, hero_background, sections_json, meta_title, meta_description, schema_type, is_active
             FROM pages ORDER BY id DESC'
        );
        Response::json(['pages' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function createPage(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $slug = trim($data['slug'] ?? '');
        $title = trim($data['title'] ?? '');
        if ($slug === '' || $title === '') {
            Response::json(['error' => 'Slug and title required.'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO pages (slug, title, hero_title, hero_subtitle, hero_background, sections_json, meta_title, meta_description, schema_type, is_active)
             VALUES (:slug, :title, :hero_title, :hero_subtitle, :hero_background, :sections_json, :meta_title, :meta_description, :schema_type, :is_active)'
        );
        $stmt->execute([
            'slug' => $slug,
            'title' => $title,
            'hero_title' => $data['hero_title'] ?? $title,
            'hero_subtitle' => $data['hero_subtitle'] ?? '',
            'hero_background' => $data['hero_background'] ?? '',
            'sections_json' => json_encode($data['sections'] ?? [], JSON_UNESCAPED_SLASHES),
            'meta_title' => $data['meta_title'] ?? $title,
            'meta_description' => $data['meta_description'] ?? '',
            'schema_type' => $data['schema_type'] ?? 'Organization',
            'is_active' => (int)($data['is_active'] ?? 1),
        ]);

        Response::json(['status' => 'created'], 201);
    }

    public function updatePage(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $stmt = $this->db->pdo()->prepare(
            'UPDATE pages SET
                slug = :slug,
                title = :title,
                hero_title = :hero_title,
                hero_subtitle = :hero_subtitle,
                hero_background = :hero_background,
                sections_json = :sections_json,
                meta_title = :meta_title,
                meta_description = :meta_description,
                schema_type = :schema_type,
                is_active = :is_active
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'slug' => $data['slug'] ?? '',
            'title' => $data['title'] ?? '',
            'hero_title' => $data['hero_title'] ?? '',
            'hero_subtitle' => $data['hero_subtitle'] ?? '',
            'hero_background' => $data['hero_background'] ?? '',
            'sections_json' => json_encode($data['sections'] ?? [], JSON_UNESCAPED_SLASHES),
            'meta_title' => $data['meta_title'] ?? '',
            'meta_description' => $data['meta_description'] ?? '',
            'schema_type' => $data['schema_type'] ?? 'Organization',
            'is_active' => (int)($data['is_active'] ?? 1),
        ]);

        Response::json(['status' => 'updated']);
    }

    public function deletePage(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->prepare('DELETE FROM pages WHERE id = :id');
        $stmt->execute(['id' => $id]);
        Response::json(['status' => 'deleted']);
    }

    public function submissions(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'form_manager']);

        $stmt = $this->db->pdo()->query(
            'SELECT s.id, s.page_id, p.slug, s.form_data_json, s.file_path, s.ip_address, s.created_at
             FROM submissions s JOIN pages p ON p.id = s.page_id ORDER BY s.created_at DESC'
        );
        Response::json(['submissions' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function exportSubmissions(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'form_manager']);

        $stmt = $this->db->pdo()->query(
            'SELECT s.id, p.slug, s.form_data_json, s.file_path, s.ip_address, s.created_at
             FROM submissions s JOIN pages p ON p.id = s.page_id ORDER BY s.created_at DESC'
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $csvRows = [['id', 'slug', 'form_data', 'file_path', 'ip', 'created_at']];
        foreach ($rows as $row) {
            $csvRows[] = [
                $row['id'],
                $row['slug'],
                $row['form_data_json'],
                $row['file_path'],
                $row['ip_address'],
                $row['created_at'],
            ];
        }
        Response::csv($csvRows);
    }

    public function users(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin']);

        $stmt = $this->db->pdo()->query('SELECT id, email, full_name, role, created_at FROM users ORDER BY id DESC');
        Response::json(['users' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function updateRole(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin']);

        $data = Request::json();
        $role = $data['role'] ?? '';
        $allowed = ['super_admin', 'content_manager', 'form_manager', 'partner_view', 'public_user'];
        if (!in_array($role, $allowed, true)) {
            Response::json(['error' => 'Invalid role'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare('UPDATE users SET role = :role WHERE id = :id');
        $stmt->execute(['role' => $role, 'id' => $id]);
        Response::json(['status' => 'updated']);
    }

    public function tracks(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->query(
            'SELECT id, name, category, description, is_active, created_at FROM program_tracks ORDER BY id DESC'
        );
        Response::json(['tracks' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public function createTrack(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $name = trim($data['name'] ?? '');
        $category = trim($data['category'] ?? '');
        if ($name === '' || $category === '') {
            Response::json(['error' => 'Name and category required'], 422);
            return;
        }

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO program_tracks (name, category, description, is_active)
             VALUES (:name, :category, :description, :is_active)'
        );
        $stmt->execute([
            'name' => $name,
            'category' => $category,
            'description' => $data['description'] ?? '',
            'is_active' => (int)($data['is_active'] ?? 1),
        ]);

        Response::json(['status' => 'created'], 201);
    }

    public function updateTrack(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $stmt = $this->db->pdo()->prepare(
            'UPDATE program_tracks SET
                name = :name,
                category = :category,
                description = :description,
                is_active = :is_active
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'] ?? '',
            'category' => $data['category'] ?? '',
            'description' => $data['description'] ?? '',
            'is_active' => (int)($data['is_active'] ?? 1),
        ]);

        Response::json(['status' => 'updated']);
    }

    public function deleteTrack(string $id): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $stmt = $this->db->pdo()->prepare('DELETE FROM program_tracks WHERE id = :id');
        $stmt->execute(['id' => $id]);
        Response::json(['status' => 'deleted']);
    }

    public function partnerAssignments(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $partners = $this->db->pdo()->query(
            "SELECT id, email, full_name FROM users WHERE role = 'partner_view' ORDER BY id DESC"
        )->fetchAll(PDO::FETCH_ASSOC);
        $pages = $this->db->pdo()->query('SELECT id, title, slug FROM pages ORDER BY id DESC')
            ->fetchAll(PDO::FETCH_ASSOC);
        $assignments = $this->db->pdo()->query(
            'SELECT user_id, page_id FROM partner_page_access'
        )->fetchAll(PDO::FETCH_ASSOC);

        Response::json([
            'partners' => $partners,
            'pages' => $pages,
            'assignments' => $assignments,
        ]);
    }

    public function savePartnerAssignments(): void
    {
        $user = $this->auth->requireUser(Request::bearerToken());
        $this->auth->requireRole($user, ['super_admin', 'content_manager']);

        $data = Request::json();
        $userId = (int)($data['user_id'] ?? 0);
        $pageIds = $data['page_ids'] ?? [];
        if ($userId === 0 || !is_array($pageIds)) {
            Response::json(['error' => 'Invalid assignment payload'], 422);
            return;
        }

        $this->db->pdo()->prepare('DELETE FROM partner_page_access WHERE user_id = :user_id')
            ->execute(['user_id' => $userId]);

        $stmt = $this->db->pdo()->prepare(
            'INSERT INTO partner_page_access (user_id, page_id) VALUES (:user_id, :page_id)'
        );
        foreach ($pageIds as $pageId) {
            $stmt->execute(['user_id' => $userId, 'page_id' => (int)$pageId]);
        }

        Response::json(['status' => 'updated']);
    }

    private function scalar(string $query): string
    {
        $stmt = $this->db->pdo()->query($query);
        return (string)$stmt->fetchColumn();
    }
}
